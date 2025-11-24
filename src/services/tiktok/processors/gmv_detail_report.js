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
export async function processGmvReport(params, templateConfig, accessToken, jobId, task_logger) {
  task_logger.info(`Processing GMV template: ${params.templateName}`);

  // 1. Lấy thông tin Account và Store
  // Giả sử 'accountsToProcess' chứa thông tin Advertiser
  const advertiserId = params.advertiser_id;
  
  // Store ID có thể nằm trong params hoặc templateConfig tùy cách bạn truyền
  const storeId = params.store_id; 

  const redis_client = new Redis({
    host: process.env.REDIS_HOST || 'localhost',
    port: parseInt(process.env.REDIS_PORT || '6379'),
    password: process.env.REDIS_PASSWORD,
    retryStrategy(times) {
      const delay = Math.min(times * 50, 2000);
      return delay;
    },
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
    progress_callback: (message) => {
      task_logger.info(`[PROGRESS] ${message}`);
    },
    task_logger:task_logger
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
      task_logger.info("[INFO]: No GMV data returned!");
      return { status: "SUCCESS", data: [], newRows: 0, message: "No data found." };
    }
    
    const dataToWrite = enriched_results;

    task_logger.info(`[INFO]: Success', GMV Processed ${dataToWrite.length} rows.`);
    return { status: "SUCCESS", data: dataToWrite, newRows: dataToWrite.length };

  } catch (error) {
    task_logger.info(`GMV Reporter failed: ${error.message}`);
    throw error; 
  }
}