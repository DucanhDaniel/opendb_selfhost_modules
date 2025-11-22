import logger from '../../../src/utils/logger.js';
import { processGmvBasicReport } from '../../../src/services/tiktok/processors/gmv_basic_report.js';
import { promises as fs } from 'fs';
// --- CẤU HÌNH TEST ---
const ACCESS_TOKEN = "95e5d484f7daa83efe5f82a238d11a3e42ed3eba"; 
const ADVERTISER_ID = "6967547145545105410";
const STORE_ID = "7494600253418473607";
const START_DATE = "2025-11-01";
const END_DATE = "2025-11-22";
const TEMPLATE_NAME = "GMV Live Campaign Performance";

// [QUAN TRỌNG] Giả lập Template Config (Vì hàm processor cần cái này để validate metrics/dimensions)
const MOCK_TEMPLATE_CONFIG = {
          type: "BASIC",
          api_endpoint: "https://business-api.tiktok.com/open_api/v1.3/gmv_max/report/get/",
          api_params: { filtering: { gmv_max_promotion_types: ["LIVE"] } },
          selectable_dimensions: {
            "Thông tin định danh": [
              "start_date",
              "end_date",
              "advertiser_id",
              "advertiser_name",
              "store_id",
              "store_name",
            ],
            "Trường (Dimensions)": ["campaign_id", "stat_time_day"],
          },
          selectable_metrics: {
            "Số liệu (Metrics)": [
              "campaign_name",
              "cost",
              "orders",
              "roi",
              "cost_per_order",
              "gross_revenue",
              "net_cost",
              "roas_bid",
              "operation_status",
              "schedule_type",
              "schedule_start_time",
              "schedule_end_time",
              "target_roi_budget",
              "bid_type",
              "max_delivery_budget",
            ],
          },
        };

async function runTest() {
  console.time("⏱️ Thời gian chạy");
  logger.info("🚀 Bắt đầu test GMV Basic Report...");

  if (!ACCESS_TOKEN) {
    logger.error("❌ Thiếu TIKTOK_ACCESS_TOKEN trong .env");
    process.exit(1);
  }

  // 1. Giả lập Params (Lấy từ jobData.task.params)
  const mockParams = {
    templateName: TEMPLATE_NAME,
    startDate: START_DATE,
    endDate: END_DATE,
    selectedFields: [
              "start_date",
              "end_date",
              "advertiser_id",
              "advertiser_name",
              "store_id",
              "store_name", "campaign_id", "stat_time_day",
              "campaign_name",
              "cost",
              "orders",
              "roi",
              "cost_per_order",
              "gross_revenue",
              "net_cost",
              "roas_bid",
              "operation_status",
              "schedule_type",
              "schedule_start_time",
              "schedule_end_time",
              "target_roi_budget",
              "bid_type",
              "max_delivery_budget"

    ],
    // [QUAN TRỌNG] Cần có accountsToProcess chứa ID
    accountsToProcess: [{ id: ADVERTISER_ID, name: "Test Advertiser" }],
    shopsToProcess: [{ id: STORE_ID, name: "Test Store" }],
    
    // Tham số phụ để ghi DB (nếu cần)
    userId: "user-test-local" 
  };

  const mockJobId = `test-task-${Date.now()}`;

  try {
    logger.info(`📡 Đang gọi processGmvBasicReport...`);
    
    // 2. [SỬA LỖI] Gọi hàm với ĐÚNG 4 THAM SỐ
    const result = await processGmvBasicReport(
        mockParams,           // Tham số 1: Params
        MOCK_TEMPLATE_CONFIG, // Tham số 2: Template Config
        ACCESS_TOKEN,         // Tham số 3: Token
        mockJobId             // Tham số 4: Job ID
    );

    // 3. Kết quả
    logger.info("\n✅ KẾT QUẢ THÀNH CÔNG:");
    // console.log(result);
    const output_filename = `${TEMPLATE_NAME}.json`;
    await fs.writeFile(output_filename, JSON.stringify(result.data, null, 4), 'utf-8');

  } catch (error) {
    logger.error("\n❌ TEST THẤT BẠI:");
    logger.error(error.message);
    if (error.stack) console.error(error.stack);
  } finally {
    console.timeEnd("⏱️ Thời gian chạy");
    process.exit(0);
  }
}

runTest();