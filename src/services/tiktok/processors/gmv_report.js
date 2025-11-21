import { logTiktok } from '../helpers.js';
// Import các Reporter Class đã chuyển đổi (Đảm bảo đường dẫn đúng)
import { GMVCampaignProductDetailReporter } from '../../gmv/processor/product.js';
import { GMVCampaignCreativeDetailReporter } from '../../gmv/processor/creative.js'; 
import { splitDateRangeIntoMonths } from '../helpers.js';
import Redis from 'ioredis';
/**
 * Processor chuyên biệt cho báo cáo GMV (Product & Creative).
 * Sử dụng các lớp Reporter được chuyển từ Python.
 *
 * @param {object} params - Tham số task (start_date, end_date, accountsToProcess, etc.).
 * @param {object} templateConfig - Config của template (để phân biệt Product vs Creative).
 * @param {string} accessToken - TikTok Access Token.
 * @param {string} jobId - Job ID để log.
 * @returns {Promise<object>} - { status, data, newRows, message? }.
 */
export async function processGmvReport(params, templateConfig, accessToken, jobId) {
//   const functionName = 'processGmvReport (GMV)';
//   logTiktok(jobId, functionName, 'Info', `Processing GMV template: ${params.templateName}`);

  // 1. Lấy thông tin Account và Store
  // Giả sử 'accountsToProcess' chứa thông tin Advertiser
  const advertiserId = params.advertiser_id;
  
  // Store ID có thể nằm trong params hoặc templateConfig tùy cách bạn truyền
  const storeId = params.store_id; 

  const redis_client = new Redis({
    host: 'localhost', 
    port: 6379,
    // password: '...', // Thêm nếu redis của bạn có pass
  });

  if (!advertiserId) {
    throw new Error("Missing Advertiser ID for GMV report.");
  }
  if (!storeId) {
    throw new Error("Missing Store ID for GMV report.");
  }

  // 2. Cấu hình Reporter
  const config = {
    access_token: accessToken,
    advertiser_id: advertiserId,
    advertiser_name: params.advertiser_name,
    store_name: params.store_name,
    store_id: storeId,
    job_id: jobId,
    redis_client: redis_client,
    // Callback để Reporter (base class) gọi ngược lại logTiktok
    // progress_callback: (jid, status, message, progress) => {
    //    // Chuyển đổi format log của Reporter sang logTiktok
    //    logTiktok(jid, functionName, 'Info', `[Reporter ${progress}%] ${message}`);
    // }
    progress_callback: (jobId, status, message, progress) => {
        console.log(`[PROGRESS] ${message} (${progress}%)`);
    },
  };

  // 3. Chọn Reporter Class dựa trên tên Template
  let reporter;
  if (params.templateName === "GMV Campaign / Product Detail") {
    reporter = new GMVCampaignProductDetailReporter(config);
  } else if (params.templateName === "GMV Campaign / Creative Detail") {
    reporter = new GMVCampaignCreativeDetailReporter(config);
  } else {
    throw new Error(`Unknown GMV Template: ${params.templateName}`);
  }

  // 4. Chuẩn bị Date Chunks
  // GMV Reporter nhận một mảng các chunk {start, end}
  const rawChunks = splitDateRangeIntoMonths(params.startDate, params.endDate);
  const date_chunks = rawChunks.map(c => ({ start: c.start, end: c.end }));

  try {
    const enriched_results = await reporter.getData(date_chunks);

    if (!enriched_results || enriched_results.length === 0) {
    //   logTiktok(jobId, functionName, 'Info', 'No GMV data returned.');
        console.log("[INFO]: No GMV data returned!");
      return { status: "SUCCESS", data: [], newRows: 0, message: "No data found." };
    }
    
    const dataToWrite = enriched_results;

    // logTiktok(jobId, functionName, 'Success', `GMV Processed ${dataToWrite.length} rows.`);
    console.log(`[INFO]: Success', GMV Processed ${dataToWrite.length} rows.`);
    return { status: "SUCCESS", data: dataToWrite, newRows: dataToWrite.length };

  } catch (error) {
    // logTiktok(jobId, functionName, 'Error', `GMV Reporter failed: ${error.message}`);
    throw error; // Ném lỗi để TaskProcessor xử lý
  }
}