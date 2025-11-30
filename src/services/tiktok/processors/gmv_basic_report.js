import { fetchAllTiktokPages } from '../api.js';
import { TIKTOK_PERCENT_METRICS, TIKTOK_GMV_REPORT_URL } from '../constants.js';

import axios from 'axios';

/**
 * Processor xử lý các báo cáo GMV Basic (All, Product, Live Campaign Performance).
 * * @param {object} params - Tham số task (startDate, endDate, accountsToProcess, selectedFields...).
 * @param {object} templateConfig - Cấu hình của template.
 * @param {string} accessToken - TikTok Access Token.
 * @param {string} jobId - Job ID để log.
 * @returns {Promise<object>} - { status, data, newRows, message? }.
 */
export async function processGmvBasicReport(params, templateConfig, accessToken, jobId) {

  const functionName = 'processGmvBasicReport';
  task_logger.info(`Processing GMV Basic template: ${params.templateName}`);

  const { startDate, endDate, selectedFields, accountsToProcess, shopsToProcess } = params;

  // 1. Lấy thông tin Advertiser và Store
  const advertiserInfo = accountsToProcess?.[0] || {};
  const advertiserId = advertiserInfo.id;
  const advertiserName = advertiserInfo.name;

  const shopInfo = shopsToProcess?.[0] || {};
  const storeId = shopInfo.id;
  const storeName = shopInfo.name;

  if (!advertiserId) throw new Error("Missing Advertiser ID for GMV report.");
  if (!storeId) throw new Error("Missing Store ID for GMV report.");

  // 2. Xác định Dimensions và Metrics cho API
  const allAvailableMetrics = Object.values(templateConfig.selectable_metrics || {}).flat();
  const apiMetrics = selectedFields.filter(field => allAvailableMetrics.includes(field));

  const allAvailableDimensions = Object.values(templateConfig.selectable_dimensions || {}).flat();
  
  // Lọc bỏ các trường meta (không gửi lên API)
  const META_FIELDS = [
    "start_date", "end_date", 
    "advertiser_id", "advertiser_name", 
    "store_id", "store_name"
  ];
  const apiDimensions = selectedFields.filter(field =>
    allAvailableDimensions.includes(field) && !META_FIELDS.includes(field)
  );

  // Validation
  if (apiDimensions.length === 0) throw new Error("Please select at least one Dimension from API.");
  if (apiMetrics.length === 0) throw new Error("Please select at least one Metric from API.");

  // 3. Chuẩn bị Context cho API (Session & Rate Limiter)
  const context = {
    access_token: accessToken,
    advertiser_id: advertiserId,
    job_id: jobId,
    
    // URL API Chính cho module này là GMV URL
    PERFORMANCE_API_URL: TIKTOK_GMV_REPORT_URL, 
    
    // Tạo session axios
    session: axios.create({
      headers: { "Access-Token": accessToken, "Content-Type": "application/json" },
      timeout: 60000,
      validateStatus: () => true,
    }),
  };

  // 4. Chia thời gian thành các tháng (Chunks)
  const dateChunks = splitDateRangeIntoMonths(startDate, endDate);
  let allDataFromApi = [];

  task_logger.info(`Fetching GMV data in ${dateChunks.length} monthly chunks...`);

  // --- 5. Vòng lặp lấy dữ liệu (Fetch Loop) ---
  for (const chunk of dateChunks) {
    task_logger.info(`Fetching chunk: ${chunk.start} to ${chunk.end}`);
    
    const baseParams = {
      advertiser_id: advertiserId,
      store_ids: JSON.stringify([storeId]), // GMV API yêu cầu store_ids dạng JSON array
      start_date: chunk.start,
      end_date: chunk.end,
      dimensions: JSON.stringify(apiDimensions),
      metrics: JSON.stringify(apiMetrics),
      page_size: 1000, 
    };

    // Thêm filtering từ template config (để phân biệt All/Product/Live)
    // Ví dụ config: api_params: { filtering: { gmv_max_promotion_types: ["PRODUCT"] } }
    if (templateConfig.api_params) {
      for (const key in templateConfig.api_params) {
        baseParams[key] = typeof templateConfig.api_params[key] === "object"
            ? JSON.stringify(templateConfig.api_params[key])
            : templateConfig.api_params[key];
      }
    }

    try {
      // Gọi hàm fetchAllPages (sử dụng context đã tạo)
      const dataForChunk = await fetchAllTiktokPages(
        templateConfig.api_endpoint, 
        baseParams,
        accessToken,
        jobId,
        `${functionName}-${params.templateName}-Chunk`
      );

      // Gắn thông tin ngày của chunk vào từng dòng
      dataForChunk.forEach(item => {
          item._chunk_start = chunk.start;
          item._chunk_end = chunk.end;
      });
      
      allDataFromApi.push(...dataForChunk);

    } catch (e) {
      task_logger.error(`Failed chunk ${chunk.start}-${chunk.end}: ${e.message}. Skipping.`);
    }
  } 

  if (allDataFromApi.length === 0) {
      task_logger.info('No data returned from API.');
      return { status: "SUCCESS", data: [], newRows: 0, message: "No data found." };
  }

  // --- 6. Xử lý và Định dạng Dữ liệu (Process & Format) ---
  const dataToWrite = allDataFromApi.map(item => {
    let rowObject = {
      ...item.dimensions,
      ...item.metrics,
      // Thêm thông tin meta
      advertiser_id: advertiserId,   
      advertiser_name: advertiserName,
      store_id: storeId,
      store_name: storeName,
      start_date: item._chunk_start, 
      end_date: item._chunk_end,
    };

    // Định dạng số phần trăm (chia 100)
    for (const key in rowObject) {
      if (TIKTOK_PERCENT_METRICS.includes(key)) {
        const value = parseFloat(rowObject[key]);
        rowObject[key] = !isNaN(value) ? value / 100 : null; 
      }
    }

    // Xóa key tạm
    delete rowObject._chunk_start;
    delete rowObject._chunk_end;

    // Đảm bảo đủ các trường đã chọn (điền null nếu thiếu)
    const finalRow = {};
    selectedFields.forEach(field => {
        finalRow[field] = Object.prototype.hasOwnProperty.call(rowObject, field) ? rowObject[field] : null;
    });

    return finalRow; 
  });

  task_logger.info(`Processed ${dataToWrite.length} rows.`);


    return { status: "SUCCESS", data: dataToWrite, newRows: dataToWrite.length };
}