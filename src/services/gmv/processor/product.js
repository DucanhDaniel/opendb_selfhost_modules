import logger from '../../../utils/logger.js';
import { GMVReporter } from './base.js'; 
import bluebird from 'bluebird';
const { Promise: BluebirdPromise } = bluebird;
/**
 * Lấy và kết hợp dữ liệu hiệu suất chiến dịch với thông tin chi tiết sản phẩm.
 */
export class GMVCampaignProductDetailReporter extends GMVReporter {
  
  constructor(config) {
    super(config); 
  }

  /**
   * [BƯỚC 1] Lấy toàn bộ sản phẩm và chuyển thành một Map
   */
  async _getProductMap() {
    logger.info("\n--- BƯỚC 1: LẤY VÀ CHUẨN BỊ DỮ LIỆU SẢN PHẨM ---");
    const bc_ids = await this._getBcIds(); 
    if (!bc_ids || bc_ids.length === 0) {
      return null;
    }

    let all_products = [];
    for (const bc_id of bc_ids) {
      const products_list = await this._fetchAllTiktokProducts(bc_id); 
      if (products_list && products_list.length > 0) {
        logger.info(`   => THÀNH CÔNG! Tìm thấy BC ID hợp lệ: ${bc_id}. Đã lấy ${products_list.length} sản phẩm.`);
        all_products.push(...products_list);
      }
    }

    if (all_products.length === 0) {
      logger.warn("   -> Không tìm thấy BC ID nào có thể truy cập sản phẩm của store này.");
      return null;
    }

    logger.info("\n>> Bước 1C: Tạo bản đồ sản phẩm để tra cứu nhanh...");
    const product_map = new Map(all_products.map(p => [p.item_group_id, p]));
    
    logger.info(`   -> Đã tạo bản đồ cho ${product_map.size} sản phẩm độc nhất.`);
    return product_map;
  }

  /**
   * Lấy tất cả campaign trong một khoảng thời gian.
   */
  async _getAllCampaigns(start_date, end_date) {
    const params = {
      "advertiser_id": this.advertiser_id,
      "store_ids": JSON.stringify([this.store_id]),
      "start_date": start_date, "end_date": end_date,
      "dimensions": JSON.stringify(["campaign_id"]),
      "metrics": JSON.stringify(["campaign_name", "operation_status", "bid_type"]),
      "filtering": JSON.stringify({"gmv_max_promotion_types": ["PRODUCT"]}),
      "page_size": 1000,
    };
    const items = await this._fetchAllPages(this.PERFORMANCE_API_URL, params, 1);
    
    return items.reduce((acc, item) => {
      acc.set(item.dimensions.campaign_id, item.metrics);
      return acc;
    }, new Map());
  }

  /**
   * Lấy dữ liệu hiệu suất chi tiết cho một lô campaign.
   */
  async _fetchDataForBatch(campaign_batch_map, start_date, end_date) {
    const batch_ids = Array.from(campaign_batch_map.keys());
    const params = {
      "advertiser_id": this.advertiser_id,
      "store_ids": JSON.stringify([this.store_id]),
      "start_date": start_date, "end_date": end_date,
      "dimensions": JSON.stringify(["campaign_id", "item_group_id", "stat_time_day"]),
      "metrics": JSON.stringify(["orders", "gross_revenue", "cost", "cost_per_order", "roi"]),
      "filtering": JSON.stringify({"campaign_ids": batch_ids}),
      "page_size": 1000,
    };
    const perf_list = await this._fetchAllPages(this.PERFORMANCE_API_URL, params, 5); // 5 luồng
    
    const results = new Map();
    for (const [cid, info] of campaign_batch_map.entries()) {
      results.set(cid, {
        campaign_id: cid, campaign_name: info.campaign_name,
        operation_status: info.operation_status, bid_type: info.bid_type,
        performance_data: [],
        start_date: start_date, 
        end_date: end_date
      });
    }
    
    for (const record of perf_list) {
      const cid = record.dimensions.campaign_id;
      if (results.has(cid)) {
        results.get(cid).performance_data.push(record);
      }
    }
    return Array.from(results.values());
  }

  /**
   * [BƯỚC 3] Làm phẳng và gộp dữ liệu.
   */
  _enrichCampaignData(campaign_results, product_map) {
    logger.info("\n--- BƯỚC 3: LÀM PHẲNG VÀ GỘP DỮ LIỆU ---");
    if (!product_map) {
      logger.warn("   -> Cảnh báo: Không có bản đồ sản phẩm. Dữ liệu sẽ không được làm giàu.");
      return campaign_results;
    }
        
    const flattened_records = [];

    for (const campaign_chunk of campaign_results) {
      const campaign_info = {
        campaign_id: campaign_chunk.campaign_id,
        campaign_name: campaign_chunk.campaign_name,
        operation_status: campaign_chunk.operation_status,
        bid_type: campaign_chunk.bid_type,
        start_date: campaign_chunk.start_date,
        end_date: campaign_chunk.end_date
      };

      if (!campaign_chunk.performance_data || campaign_chunk.performance_data.length === 0) {
        continue;
      }

      for (const perf_record of campaign_chunk.performance_data) {
        const item_group_id = perf_record.dimensions?.item_group_id;
        
        // Lấy thông tin sản phẩm
        let product_info = {};
        if (item_group_id) {
          product_info = product_map.get(item_group_id) || { title: `Không tìm thấy thông tin cho ID ${item_group_id}` };
        }

        const final_record = {
          ...campaign_info,
          stat_time_day: perf_record.dimensions?.stat_time_day,
          item_group_id: item_group_id,
          metrics: perf_record.metrics || {},
          product_info: product_info
        };
        flattened_records.push(final_record);
      }
    }
    
    logger.info(`   -> Đã làm phẳng và gộp thành công ${flattened_records.length} bản ghi chi tiết.`);
    return flattened_records;
  }
  
  /**
   * [HÀM CHÍNH] Chạy toàn bộ quy trình.
   */
  async getData(date_chunks) {
    // BƯỚC 1: Lấy dữ liệu sản phẩm
    this._reportProgress("Đang lấy dữ liệu sản phẩm");
    const product_map = await this._getProductMap();
    if (!product_map) {
      logger.error("Không thể lấy dữ liệu sản phẩm. Dừng thực thi.");
      return [];
    }

    // BƯỚC 2: Lấy dữ liệu campaign
    logger.info("\n--- BƯỚC 2: LẤY DỮ LIỆU CAMPAIGN ---");
    this._reportProgress("Bắt đầu lấy dữ liệu campaign");
    
    let all_campaign_results = [];

    for (const chunk of date_chunks) {
      logger.info(`\n>> Xử lý chunk: ${chunk.start} to ${chunk.end}`);
      this._reportProgress(`Xử lý chunk: ${chunk.start} to ${chunk.end}`);
      
      const campaigns = await this._getAllCampaigns(chunk.start, chunk.end); 
      if (campaigns.size === 0) {
        logger.info("   -> Không có campaign nào trong khoảng thời gian này.");
        continue;
      }
      
      logger.info(`   -> Tìm thấy ${campaigns.size} campaigns. Chia thành lô để xử lý...`);
      const campaignItems = Array.from(campaigns.entries()); 
      const batches = Array.from(GMVReporter._chunkList(campaignItems, 20)); 

      // Hàm con để chạy 1 batch
      const fetchBatch = async (batch) => {
        const campaignBatchMap = new Map(batch); 
        return this._fetchDataForBatch(campaignBatchMap, chunk.start, chunk.end);
      }

      const batchResults = await BluebirdPromise.map(batches, fetchBatch, { 
        concurrency: 1 
      });
      
      // Gộp kết quả
      all_campaign_results.push(...batchResults.flat());
    }

    // BƯỚC 3: Gộp dữ liệu
    this._reportProgress("Bắt đầu gộp dữ liệu...");
    const final_data = this._enrichCampaignData(all_campaign_results, product_map);
    return flattenProductReport(final_data, this);
  }
} 

/**
 * Làm phẳng dữ liệu thô
 */
export function flattenProductReport(campaign_data_list, context) {
  const flattened_data = [];
  for (const campaign of campaign_data_list) {
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
      "bid_type": campaign.bid_type,

      // Product info and dimensions
      "item_group_id": campaign.item_group_id,
      "stat_time_day": campaign.stat_time_day,
      "product_name": campaign.product_info?.title,
      "product_image_url": campaign.product_info?.product_image_url,
      "product_status": campaign.product_info?.status,
      "product_img": campaign.product_info?.product_image_url,
    };
    
    Object.assign(row, campaign.metrics || {});
    flattened_data.push(row);
  }
  return flattened_data;
}