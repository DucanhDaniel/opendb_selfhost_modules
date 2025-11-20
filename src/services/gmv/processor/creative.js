import logger from '../../../utils/logger.js';
import { GMVReporter } from './base.js'; // 1. Import lớp cha (đã dịch)
import bluebird from 'bluebird';
const { Promise: BluebirdPromise } = bluebird;
import { sleep } from '../../../utils/sleep.js'; // Import hàm sleep

/**
 * [ĐÃ DỊCH SANG JS]
 * Lấy và kết hợp dữ liệu hiệu suất GMV Max với chi tiết creative.
 * Kế thừa từ GMVReporter.
 */
export class GMVCampaignCreativeDetailReporter extends GMVReporter {
  
  constructor(config) {
    // 2. Gọi hàm constructor của lớp cha
    super(config);
  }

  /**
   * Lấy thông tin metadata của creative.
   */
  async _fetchCreativeMetadata(campaign_id, item_group_id, start_date, end_date) {
    const params = {
      "advertiser_id": this.advertiser_id,
      "store_ids": JSON.stringify([this.store_id]),
      "start_date": start_date,
      "end_date": end_date,
      "dimensions": JSON.stringify(["item_id"]),
      "metrics": JSON.stringify([
        "title", "tt_account_name", "tt_account_profile_image_url",
        "tt_account_authorization_type", "shop_content_type"
      ]),
      "filtering": JSON.stringify({
        "campaign_ids": [campaign_id],
        "item_group_ids": [item_group_id]
      }),
      "page_size": 1000,
    };
    
    // (Hàm của lớp cha)
    return this._fetchAllPages(this.PERFORMANCE_API_URL, params, 1, 0.3); // throttling_delay=0.3
  }

  /**
   * Lấy danh mục sản phẩm từ BC ID hợp lệ đầu tiên.
   */
  async _getProductCatalog() {
    const bc_ids_list = await this._getBcIds(); // (Hàm của lớp cha)
    if (!bc_ids_list || bc_ids_list.length === 0) {
      return [];
    }
    
    let products = [];
    for (const bc_id of bc_ids_list) {
      const bc_products = await this._fetchAllTiktokProducts(bc_id); // (Hàm của lớp cha)
      if (bc_products && bc_products.length > 0) {
        logger.info(`\n=> Tìm thấy BC ID hợp lệ: ${bc_id}. Đã lấy ${bc_products.length} sản phẩm.`);
        this._reportProgress(`Đã lấy ${bc_products.length} sản phẩm.`, 80);
        products.push(...bc_products);
      }
    }
    return products;
  }

  /**
   * Xử lý một lô campaign để lấy dữ liệu.
   */
  async _processCampaignBatch(campaign_batch, start_date, end_date) {
    // [JS] Chuyển đổi từ Array sang Map và ngược lại
    const batch_ids = campaign_batch.map(c => c[0]);
    const batch_names = campaign_batch.map(c => c[1]);
    logger.info(`  [BẮT ĐẦU BATCH] Xử lý ${batch_ids.length} campaigns: ${batch_names.join(', ')}`);
    
    const batch_results = new Map(
      campaign_batch.map(([cid, cname]) => [
        cid, 
        { campaign_id: cid, campaign_name: cname, start_date, end_date, performance_data: [] }
      ])
    );

    const params_product = {
      "advertiser_id": this.advertiser_id,
      "store_ids": JSON.stringify([this.store_id]),
      "start_date": start_date, "end_date": end_date,
      "dimensions": JSON.stringify(["campaign_id", "item_group_id"]),
      "metrics": JSON.stringify(["cost", "orders", "gross_revenue"]),
      "filtering": JSON.stringify({"campaign_ids": batch_ids}),
      "page_size": 1000,
    };
    // (Hàm của lớp cha)
    const product_perf_list = await this._fetchAllPages(this.PERFORMANCE_API_URL, params_product);

    if (!product_perf_list || product_perf_list.length === 0) {
      logger.info(`  [KẾT THÚC BATCH] Lô campaigns không có dữ liệu sản phẩm.`);
      return Array.from(batch_results.values());
    }

    // Lấy ID sản phẩm duy nhất
    const product_ids = [...new Set(product_perf_list.map(p => p.dimensions.item_group_id))];
    // (Hàm static của lớp cha)
    const product_id_chunks = Array.from(GMVReporter._chunkList(product_ids, 20)); 
    let all_creative_results = [];
    
    logger.info(`  Tìm thấy ${product_ids.length} sản phẩm duy nhất, chia thành ${product_id_chunks.length} lô để lấy creative.`);
    
    for (const p_chunk of product_id_chunks) {
      const params_creative = {
        "advertiser_id": this.advertiser_id,
        "store_ids": JSON.stringify([this.store_id]),
        "start_date": start_date, "end_date": end_date,
        "dimensions": JSON.stringify(["campaign_id", "item_group_id", "item_id"]),
        "metrics": JSON.stringify(["cost","orders","cost_per_order","gross_revenue","roi","product_impressions","product_clicks","product_click_rate","ad_conversion_rate","creative_delivery_status","ad_video_view_rate_2s","ad_video_view_rate_6s","ad_video_view_rate_p25","ad_video_view_rate_p50","ad_video_view_rate_p75","ad_video_view_rate_p100"]),
        "filtering": JSON.stringify({"campaign_ids": batch_ids, "item_group_ids": p_chunk}),
        "page_size": 1000,
      };
      // (Hàm của lớp cha)
      const creative_results = await this._fetchAllPages(this.PERFORMANCE_API_URL, params_creative);
      all_creative_results.push(...creative_results);
      await sleep(1200); // [JS] Thay thế time.sleep(1.2)
    }
    
    const enriched_product_list = GMVCampaignCreativeDetailReporter._enrichWithCreativeDetails(product_perf_list, all_creative_results);
    
    for (const product_record of enriched_product_list) {
      const cid = product_record.dimensions?.campaign_id;
      if (batch_results.has(cid)) {
        batch_results.get(cid).performance_data.push(product_record);
      }
    }

    logger.info(`  [HOÀN THÀNH BATCH] Đã xử lý xong lô: ${batch_names.join(', ')}`);
    return Array.from(batch_results.values());
  }

  // --- CÁC HÀM LÀM GIÀU DỮ LIỆU (STATIC) ---
  static _createProductInfoMap(product_list) {
    const product_map = new Map();
    for (const product of product_list) {
      const product_id = product.item_group_id;
      if (product_id) {
        product_map.set(product_id, {
          "product_title": product.title,
          "product_status": product.status,
          "product_image_url": product.product_image_url
        });
      }
    }
    return product_map;
  }

  static _enrichWithProductDetails(performance_results, product_info_map) {
    logger.info("Bắt đầu làm giàu dữ liệu với thông tin chi tiết sản phẩm...");
    for (const campaign of performance_results) {
      for (const product_perf of campaign.performance_data || []) {
        const item_group_id = product_perf.dimensions?.item_group_id;
        const product_details = product_info_map.get(item_group_id) || {};
        product_perf.product_details = product_details;
      }
    }
    return performance_results;
  }
  
  static _enrichWithCreativeDetails(product_perf_list, creative_api_results) {
    const creative_details_map = new Map();
    for (const creative_result of creative_api_results) {
      const dimensions = creative_result.dimensions || {};
      const campaign_id = dimensions.campaign_id;
      const product_id = dimensions.item_group_id;
      
      if (!campaign_id || !product_id) continue;
      
      const composite_key = `${campaign_id}_${product_id}`;
      const creative_info = { "item_id": dimensions.item_id, "metrics": creative_result.metrics || {} };
      
      if (!creative_details_map.has(composite_key)) {
        creative_details_map.set(composite_key, []);
      }
      creative_details_map.get(composite_key).push(creative_info);
    }

    for (const product_perf of product_perf_list) {
      const dimensions = product_perf.dimensions || {};
      const campaign_id = dimensions.campaign_id;
      const product_id = dimensions.item_group_id;
      
      if (campaign_id && product_id) {
        const composite_key_to_find = `${campaign_id}_${product_id}`;
        product_perf.creative_details = creative_details_map.get(composite_key_to_find) || [];
      } else {
        product_perf.creative_details = [];
      }
    }
    return product_perf_list;
  }

  async _enrichWithCreativeMetadata(performance_results) {
    logger.info("Bắt đầu làm giàu dữ liệu với metadata của creative (tuần tự)...");
    this._reportProgress("Làm giàu dữ liệu với metadata của creative");
    
    const tasks = [];
    for (const campaign of performance_results) {
      const start_date = campaign.start_date;
      const end_date = campaign.end_date;
      for (const product_perf of campaign.performance_data || []) {
        const item_group_id = product_perf.dimensions?.item_group_id;
        const campaign_id = product_perf.dimensions?.campaign_id;
        if (campaign_id && item_group_id && product_perf.creative_details) {
          tasks.push([product_perf, campaign_id, item_group_id, start_date, end_date]);
        }
      }
    }

    // Xử lý tuần tự
    for (let i = 0; i < tasks.length; i++) {
      const [product_perf, cid, igid, s_date, e_date] = tasks[i];
      logger.info(`   Đang lấy metadata cho cặp (${cid}, ${igid}) - ${i + 1}/${tasks.length}...`);
      
      if ((i + 1) % 10 === 0) {
        this._reportProgress(`Lấy metadata: ${i + 1}/${tasks.length}`, 80);
      }
      
      const metadata_list = await this._fetchCreativeMetadata(cid, igid, s_date, e_date);
      
      // Tạo map
      const metadata_map = new Map(
        metadata_list.map(item => [
          item.dimensions?.item_id, 
          item.metrics || {}
        ])
      );
      
      // Gắn metadata
      for (const creative of product_perf.creative_details || []) {
        const item_id = creative.item_id;
        if (metadata_map.has(item_id)) {
          creative.metadata = metadata_map.get(item_id);
        }
      }
    }
    logger.info(`\nHoàn thành làm giàu metadata cho ${tasks.length} cặp sản phẩm.`);
    return performance_results;
  }

  static _filterEmptyCreatives(enriched_campaign_data) {
    logger.info("Bắt đầu lọc các creative không có hiệu suất...");
    const ZERO_METRICS = new Set(["cost", "orders"]);
    
    for (const campaign of enriched_campaign_data) {
      for (const product of campaign.performance_data || []) {
        if (product.creative_details) {
          product.creative_details = product.creative_details.filter(creative => {
            const metrics = creative.metrics || {};
            // Kiểm tra: KHÔNG phải mọi metrics trong ZERO_METRICS đều = 0
            return ![...ZERO_METRICS].every(m => (Number(metrics[m]) || 0) === 0);
          });
        }
      }
    }
    return enriched_campaign_data;
  }
  
  // --- HÀM CÔNG KHAI (PUBLIC) ---
  async getData(date_chunks) {
    // === GIAI ĐOẠN 1: LẤY DỮ LIỆU HIỆU SUẤT ===
    logger.info("--- GIAI ĐOẠN 1: BẮT ĐẦU LẤY DỮ LIỆU HIỆU SUẤT ---");
    this._reportProgress("Bắt đầu lấy dữ liệu hiệu suất GMV...", 5);

    let all_performance_results = [];
    
    for (const chunk of date_chunks) {
      const { start: chunk_start, end: chunk_end } = chunk;
      logger.info(`\n--- XỬ LÝ CHUNK: ${chunk_start} to ${chunk_end} ---`);
      this._reportProgress(`Xử lý chunk: ${chunk_start} to ${chunk_end}`);
      
      const params = {
        "advertiser_id": this.advertiser_id, 
        "store_ids": JSON.stringify([this.store_id]),
        "start_date": chunk_start, "end_date": chunk_end,
        "dimensions": JSON.stringify(["campaign_id"]), 
        "metrics": JSON.stringify(["campaign_name"]),
        "filtering": JSON.stringify({"gmv_max_promotion_types": ["PRODUCT"]}), 
        "page_size": 1000,
      };
      // (Hàm của lớp cha)
      const all_campaign_items = await this._fetchAllPages(this.PERFORMANCE_API_URL, params);
      
      if (!all_campaign_items || all_campaign_items.length === 0) {
        logger.info(`==> Không tìm thấy campaign nào trong chunk này.`);
        continue;
      }
      
      const campaigns_map = new Map(
        all_campaign_items.map(item => [item.dimensions.campaign_id, item.metrics.campaign_name])
      );
      logger.info(`==> Tìm thấy ${campaigns_map.size} campaigns trong chunk này.`);
      
      const campaign_list = Array.from(campaigns_map.entries()); // [ [id, name], ... ]
      // (Hàm static của lớp cha)
      const campaign_batches = Array.from(GMVReporter._chunkList(campaign_list, 10));

      // Hàm con để chạy 1 batch
      const fetchBatch = async (batch) => {
        return this._processCampaignBatch(batch, chunk_start, chunk_end);
      }

      // [JS] Dùng Bluebird.map để chạy tuần tự (concurrency: 1)
      const batchResults = await BluebirdPromise.map(campaign_batches, fetchBatch, { 
        concurrency: 1 // Giống max_workers=1
      });
      
      const valid_results = batchResults.flat().filter(res => res.performance_data);
      all_performance_results.push(...valid_results);
    }

    logger.info("\n--- HOÀN TẤT GIAI ĐOẠN 1: ĐÃ LẤY XONG DỮ LIỆU HIỆU SUẤT ---");
    
    // === GIAI ĐOẠN 2: LẤY DANH MỤC SẢN PHẨM ===
    logger.info("\n--- GIAI ĐOẠN 2: BẮT ĐẦU LẤY DANH MỤC SẢN PHẨM ---");
    this._reportProgress("Bắt đầu lấy dữ liệu sản phẩm...", 50);

    const product_catalog = await this._getProductCatalog();
    if (!product_catalog || product_catalog.length === 0) {
      logger.warn("CẢNH BÁO: Không thể lấy danh mục sản phẩm.");
    }

    // === GIAI ĐOẠN 3: LÀM GIÀU DỮ LIỆU VÀ HOÀN TẤT ===
    logger.info("\n--- GIAI ĐOẠN 3: BẮT ĐẦU LÀM GIÀU DỮ LIỆU ---");
    this._reportProgress("Bắt đầu làm giàu dữ liệu...", 90);

    // (Hàm static của class này)
    const product_info_map = GMVCampaignCreativeDetailReporter._createProductInfoMap(product_catalog);
    let final_data = GMVCampaignCreativeDetailReporter._enrichWithProductDetails(all_performance_results, product_info_map);
    final_data = GMVCampaignCreativeDetailReporter._filterEmptyCreatives(final_data);
    final_data = await this._enrichWithCreativeMetadata(final_data);
    
    return flattenCreativeReport(final_data, this);
  }
} // Kết thúc class

/**
 * [ĐÃ DỊCH SANG JS]
 * Làm phẳng dữ liệu thô (creative)
 */
export function flattenCreativeReport(campaign_data_list, context) {
  const flattened_data = [];
  for (const campaign of campaign_data_list) {
    if (!campaign.performance_data) continue;
    
    for (const perf_group of campaign.performance_data) {
      if (!perf_group.creative_details) continue;

      for (const creative of perf_group.creative_details) {
        const row = {
          // General info
          "start_date": campaign.start_date,
          "end_date": campaign.end_date,
          "advertiser_id": context.advertiser_id,
          "advertiser_name": context.advertiser_name,
          "store_id": context.store_id,
          "store_name": context.store_name,

          // Campaign info
          "campaign_id": campaign.campaign_id,
          "campaign_name": campaign.campaign_name,
          "operation_status": campaign.operation_status,

          // Product Group & Details
          "item_group_id": perf_group.dimensions?.item_group_id,
          "product_name": perf_group.product_details?.product_title,
          "product_status": perf_group.product_details?.product_status,
          "product_image_url": perf_group.product_details?.product_image_url,
          
          // Creative Info
          "item_id": creative.item_id,
          "title": creative.metadata?.title,
          "tt_account_name": creative.metadata?.tt_account_name,
          "tt_account_profile_image_url": creative.metadata?.tt_account_profile_image_url,
          "product_img": creative.metadata?.product_img || perf_group.product_details?.product_image_url,
        };
        
        // [JS] Dùng Object.assign (giống .update() của Python)
        Object.assign(row, creative.metrics || {});
        flattened_data.push(row);
      }
    }
  }
  return flattened_data;
}