import axios from 'axios';
import logger from '../../../utils/logger.js';
import { sleep } from '../../../utils/sleep.js';
import bluebird from 'bluebird';
const { Promise: BluebirdPromise } = bluebird;

/**
 * [ĐÃ DỊCH SANG JS]
 * Lớp cơ sở cho tất cả các loại TikTok GMV Reporter.
 * Đã loại bỏ logic Redis (rate limiter, cancel) theo yêu cầu.
 */
export class GMVReporter {
  
  PERFORMANCE_API_URL = "https://business-api.tiktok.com/open_api/v1.3/gmv_max/report/get/";
  PRODUCT_API_URL = "https://business-api.tiktok.com/open_api/v1.3/store/product/get/";
  BC_API_URL = "https://business-api.tiktok.com/open_api/v1.3/bc/get/";

  /**
   * @param {object} config - Đối tượng cấu hình
   * @param {string} config.access_token
   * @param {string} config.advertiser_id
   * @param {string} config.store_id
   * @param {function} [config.progress_callback] - Hàm callback (jobId, status, message, progress)
   * @param {string} [config.job_id]
   */
  constructor({ access_token, advertiser_id, store_id, progress_callback = null, job_id = null }) {
    if (!access_token || !advertiser_id || !store_id) {
      throw new Error("access_token, advertiser_id, và store_id không được để trống.");
    }
    
    this.access_token = access_token;
    this.advertiser_id = advertiser_id;
    this.store_id = store_id;
    
    // [JS] Dùng axios.create() thay cho requests.Session()
    this.session = axios.create({
      headers: {
        "Access-Token": this.access_token,
        "Content-Type": "application/json",
      },
      timeout: 60000, // 60 giây timeout
      // [JS] Quan trọng: Tái tạo logic của Python (không ném lỗi 4xx/5xx)
      // để chúng ta có thể đọc 'data.code' và 'data.message'
      validateStatus: () => true, 
    });

    this.throttling_delay = 0.0;
    this.recovery_factor = 0.8;

    this.progress_callback = progress_callback;
    this.job_id = job_id;
  }

  // --- Các phương thức điều khiển tác vụ ---

  _reportProgress(message, progress = 0) {
    if (this.progress_callback && this.job_id) {
      // [JS] Giả sử callback của bạn có dạng fn(jobId, status, message, progress)
      this.progress_callback(this.job_id, "RUNNING", message, progress);
    }
  }
    
  static* _chunkList(data, size) {
    for (let i = 0; i < data.length; i += size) {
      yield data.slice(i, i + size);
    }
  }
    
  async _makeApiRequestWithBackoff(url, params, max_retries = 6, base_delay = 3) {
    // (Đã xóa _check_for_cancellation)
    
    if (this.throttling_delay > 0) {
      logger.warn(`  [THROTTLING] Áp dụng delay hãm tốc ${this.throttling_delay.toFixed(2)} giây.`);
      await sleep(this.throttling_delay * 1000);
    }

    for (let attempt = 0; attempt < max_retries; attempt++) {
      try {
        // (Đã xóa check_rate_limit)
        
        const response = await this.session.get(url, { params });
        const data = response.data;

        // Kiểm tra thành công (HTTP 2xx và business code 0)
        if (response.status >= 200 && response.status < 300 && data.code === 0) {
          this.throttling_delay *= this.recovery_factor;
          if (this.throttling_delay < 0.1) this.throttling_delay = 0;
          return data;
        }

        // Xử lý lỗi API (code != 0 hoặc HTTP 4xx/5xx)
        const error_message = data.message || `Lỗi HTTP ${response.status}`;
        
        if (error_message.includes("Too many requests") || error_message.includes("Request too frequent")) {
          logger.warn(`  [RATE LIMIT] Gặp lỗi (lần ${attempt + 1}/${max_retries})...`);
        } else if (error_message.includes("Internal time out")) {
          logger.warn(`  [TIME OUT] Gặp lỗi (lần ${attempt + 1}/${max_retries})...`);
        } else {
          logger.error(`  [LỖI API] ${error_message}`);
          if (!error_message.includes("permission")) {
             throw new Error(`[LỖI API KHÔNG THỂ PHỤC HỒI] ${error_message}`);
          }
          return null; 
        }
        
      } catch (error) { // Chỉ bắt lỗi mạng (ví dụ: ECONNREFUSED, DNS)
        logger.warn(`  [LỖI MẠNG] (lần ${attempt + 1}/${max_retries}): ${error.message}`);
      }
      
      // (Đã xóa log_api_counter)
        
      if (attempt < max_retries - 1) {
        const delay = (Math.pow(base_delay, attempt + 1)) + Math.random();
        this.throttling_delay = delay; // Kích hoạt throttling
        logger.warn(`  Thử lại sau ${delay.toFixed(2)} giây.`);
        await sleep(delay * 1000);
      }
    }
    
    logger.error("  [THẤT BẠI] Đã thử lại tối đa.");
    throw new Error("Hết số lần thử, vui lòng kiểm tra kết nối hoặc trạng thái API.");
  }
  
  // (Đã xóa log_api_counter)

  async _fetchAllTiktokProducts(bc_id) {
    logger.info(`--- Bắt đầu lấy dữ liệu sản phẩm cho BC ID: ${bc_id} ---`);
    const params = {
      'bc_id': bc_id, 
      'store_id': this.store_id, 
      'page_size': 100, 
      'advertiser_id': this.advertiser_id, 
      'filtering': '{"ad_creation_eligible":"GMV_MAX"}'
    };
    
    let all_products = [];
    try {
      all_products = await this._fetchAllPages(this.PRODUCT_API_URL, params, 5);
    } catch (e) {
      logger.error(e);
      all_products = [];
    }
    
    logger.info(`--- Hoàn tất lấy sản phẩm cho BC ID: ${bc_id}. Tổng cộng: ${all_products.length} sản phẩm. ---`);
    this._reportProgress(`Đã lấy tổng cộng: ${all_products.length} sản phẩm.`);
    return all_products;
  }
  
  // [JS] Dịch hàm fetch all pages (dùng Bluebird Promise.map)
  async _fetchAllPages(url, params, max_threads = 1, throttling_delay = null) {
    const all_results = [];

    // --- BƯỚC 1: LẤY TRANG ĐẦU TIÊN ---
    const first_page_params = { ...params, page: 1 };
    if (throttling_delay) this.throttling_delay = throttling_delay;
    
    const first_page_data = await this._makeApiRequestWithBackoff(url, first_page_params);

    if (!first_page_data || first_page_data.code !== 0) {
      return []; // Lỗi trang đầu, trả về rỗng
    }
    
    const page_data = first_page_data.data || {};
    const result_list = page_data.list || page_data.store_products || [];
    all_results.push(...result_list);
    
    const total_pages = page_data.page_info?.total_page || 1;
    logger.info(`   [PHÂN TRANG] Lấy trang 1/${total_pages}. Tổng số trang: ${total_pages}.`);

    if (total_pages <= 1) {
      return all_results;
    }

    // --- BƯỚC 2: LẤY CÁC TRANG CÒN LẠI ---
    const pages_to_fetch = [];
    for (let p = 2; p <= total_pages; p++) {
      pages_to_fetch.push(p);
    }

    // Hàm con để lấy 1 trang
    const fetch_page = async (page_num) => {
      // (Đã xóa _check_for_cancellation)
      const page_params = { ...params, page: page_num };
      if (throttling_delay) this.throttling_delay = throttling_delay;
      
      const data = await this._makeApiRequestWithBackoff(url, page_params);
      
      if (data && data.code === 0) {
        const page_data = data.data || {};
        const results = page_data.list || page_data.store_products || [];
        logger.info(`   [PHÂN TRANG] Đã lấy xong trang ${page_num}/${total_pages}.`);
        return results;
      }
      logger.warn(`   [PHÂN TRANG] Lỗi khi lấy trang ${page_num}/${total_pages}.`);
      return [];
    };

    // [JS] Dùng Promise.map (từ Bluebird) để chạy song song
    // với 'concurrency' (giống hệt ThreadPoolExecutor(max_workers))
    const results_from_promises = await BluebirdPromise.map(
      pages_to_fetch, 
      fetch_page,
      { concurrency: max_threads }
    );
    
    all_results.push(...results_from_promises.flat()); // Dùng .flat() để gộp các mảng con
    return all_results;
  }
  
  async _getBcIds() {
    logger.info("Đang lấy danh sách BC ID...");
    
    const data = await this._makeApiRequestWithBackoff(this.BC_API_URL, {});
    
    if (data && data.code === 0) {
      const bc_list = data.data?.list || [];
      const bc_ids = bc_list
        .map(bc => bc.bc_info?.bc_id)
        .filter(Boolean); // Lọc ra các giá trị null/undefined
        
      logger.info(`Đã lấy thành công ${bc_ids.length} BC ID.`);
      return bc_ids;
    }
    
    logger.error("Không thể lấy danh sách BC ID.");
    throw new Error("Không thể lấy danh sách BC ID.");
  }
  
  // (Đã xóa check_rate_limit và check_limiter)
}