// test-gmv.js
import 'dotenv/config'; // 1. Tải file .env
import { promises as fs } from 'fs'; // 7. Thư viện Ghi file
import logger from '../../../src/utils/logger.js';

// 2. Import LỚP CON (processor) mà bạn muốn test
import { GMVCampaignCreativeDetailReporter } from '../../../src/services/gmv/processor/creative.js';

// --- 3. Cấu hình (Giống hệt file Python) ---
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
    // (Bỏ qua redis_client và progress_callback cho lần test này)
    const config = {
      access_token: ACCESS_TOKEN,
      advertiser_id: ADVERTISER_ID,
      store_id: STORE_ID,
      progress_callback: (jobId, status, message, progress) => {
        logger.info(`[PROGRESS] ${message} (${progress}%)`);
      },
      job_id: `test-creative-run-${Date.now()}`
    };
    const reporter = new GMVCampaignCreativeDetailReporter(config);

    // 5. Gọi hàm get_data (Giống hệt Python)
    const date_chunks = [{
      'start': START_DATE,
      'end': END_DATE
    }];
    
    const final_data = await reporter.getData(date_chunks);

    // 6. Xử lý kết quả
    if (final_data && final_data.length > 0) {
      
      // 7. Tính tổng cost (Dịch từ 'sum' comprehension của Python)
      const total_creative_cost = final_data.reduce((sum, campaign) => {
        const campaign_sum = (campaign.performance_data || []).reduce((campaignSum, product) => {
          const product_sum = (product.creative_details || []).reduce((productSum, creative) => {
            return productSum + (Number(creative.metrics?.cost) || 0);
          }, 0);
          return campaignSum + product_sum;
        }, 0);
        return sum + campaign_sum;
      }, 0);
      
      // 8. Ghi file JSON (Giống hệt Python)
      const output_filename = "GMV_Campaign_creative_detail.json";
      await fs.writeFile(output_filename, JSON.stringify(final_data, null, 4), 'utf-8');
      
      logger.info("\n--- HOÀN THÀNH TOÀN BỘ ---");
      logger.info(`<i> Đã xử lý và lưu kết quả của ${final_data.length} campaigns vào file '${output_filename}'`);
      logger.info(`💰 Tổng chi phí (cost) của các creatives có hiệu suất: ${total_creative_cost.toLocaleString('en-US', { minimumFractionDigits: 0, maximumFractionDigits: 0 })} VND`);

    } else {
      logger.info("\n--- HOÀN THÀNH ---");
      logger.info("Không có dữ liệu nào được trả về.");
    }

  } catch (e) {
    if (e.response) { // Lỗi từ axios (ví dụ: 401, 403, 500)
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
  logger.info("\n--- KẾT THÚC TEST ---");
  console.timeEnd('Tổng thời gian thực thi');
})();