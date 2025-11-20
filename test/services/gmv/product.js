// test-gmv.js
import 'dotenv/config'; // 1. Tải file .env
import { promises as fs } from 'fs'; // 7. Thư viện Ghi file
import logger from '../../../src/utils/logger.js';

// 2. Import LỚP CON (processor) mà bạn muốn test
import { GMVCampaignProductDetailReporter } from '../../../src/services/gmv/processor/product.js';

// --- 3. Cấu hình (Giống hệt file Python) ---
// const ACCESS_TOKEN = "414ebc8a65511360f1b1166f9c9ebe1f8292ea16"; 
// const ADVERTISER_ID = "7137968211592495105";
// const STORE_ID = "7494588040522401840";
// const START_DATE = "2025-08-29";
// const END_DATE = "2025-09-03";

const ACCESS_TOKEN = "95e5d484f7daa83efe5f82a238d11a3e42ed3eba"; 
const ADVERTISER_ID = "6967547145545105410";
const STORE_ID = "7494600253418473607";
const START_DATE = "2025-09-01";
const END_DATE = "2025-09-18";

// 9. Bắt đầu tính giờ
console.time('Tổng thời gian thực thi');

/**
 * Hàm chạy test chính
 */
async function runTest() {
  // 3. Kiểm tra token
  if (!ACCESS_TOKEN) {
    logger.error("LỖI: Vui lòng thiết lập biến môi trường TIKTOK_ACCESS_TOKEN trong file .env");
    process.exit(1);
  }

  try {
    // 4. Khởi tạo Reporter (Lớp con)
    // (Bỏ qua redis_client để không bị rate limit khi test)
    const config = {
      access_token: ACCESS_TOKEN,
      advertiser_id: ADVERTISER_ID,
      store_id: STORE_ID,
      progress_callback: (jobId, status, message, progress) => {
        logger.info(`[PROGRESS] ${message} (${progress}%)`);
      },
      job_id: `test-run-${Date.now()}`
    };
    const reporter = new GMVCampaignProductDetailReporter(config);

    // 5. Gọi hàm get_data (Giống hệt Python)
    const date_chunks = [{
      'start': START_DATE,
      'end': END_DATE
    }];
    
    const enriched_results = await reporter.getData(date_chunks);

    // 6. Xử lý kết quả
    if (enriched_results && enriched_results.length > 0) {
      logger.info("\n--- BƯỚC 4: LƯU KẾT QUẢ ---");
      
      // 7. Lưu file JSON (Giống hệt Python)
      const output_filename = "GMV_Campaign_product_detail_v2.json";
      await fs.writeFile(output_filename, JSON.stringify(enriched_results, null, 4), 'utf-8');
      logger.info(` <i> Đã lưu kết quả vào file '${output_filename}'`);

      // 8. Tính tổng cost (Giống hệt Python)
      const total_cost = enriched_results.reduce((sum, campaign) => {
        // Lấy 'cost' từ 'metrics'
        return sum + (Number(campaign.metrics?.cost) || 0);
      }, 0);
      
      logger.info(`\n💰 Tổng chi phí của tất cả campaign: ${total_cost.toLocaleString('en-US', { minimumFractionDigits: 0, maximumFractionDigits: 0 })} VND`);

    } else {
      logger.info("\nKhông có dữ liệu nào để xử lý.");
    }

  } catch (e) {
    if (e.response) { // Lỗi từ axios
        logger.error(`\n❌ LỖI API: ${e.response.status} - ${JSON.stringify(e.response.data)}`);
    } else { // Lỗi logic
        logger.error(`\n❌ Đã xảy ra lỗi không mong muốn: ${e.message}`);
        console.error(e.stack);
    }
  }
}

// 9. Chạy và tính giờ
(async () => {
  await runTest();
  logger.info("\n--- HOÀN TẤT ---");
  console.timeEnd('Tổng thời gian thực thi');
})();