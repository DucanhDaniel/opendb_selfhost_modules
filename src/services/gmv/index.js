import { logger } from '../../utils/logger.js';
import { dataWriterService } from '../../db/dataWriter.js';
// import { updateTaskStatus } from '../../core/taskHelpers.js'; // (Giả sử bạn có)
import { GMVReporter } from './gmv.base.js'; // Import lớp cha
import { 
  GMVCampaignProductDetailReporter, 
  flattenProductReport 
} from './gmv.product.processor.js'; // Import lớp con

/**
 * [Hàm Dispatcher]
 * Hàm này được gọi bởi taskProcessor.js
 */
export async function processGmvJob(jobData, accessToken) {
  const { task, userId } = jobData;
  const { params } = task; // params = { templateName, advertiser_id, store_id, ... }
  const taskId = task.taskId;
  
  // 1. [JS] Hàm callback để báo cáo tiến trình
  const progressCallback = async (jobId, status, message, progress) => {
    try {
    //   await updateTaskStatus(userId, jobId, status, message, progress);
    } catch (e) {
      logger.warn(`[${jobId}] Không thể cập nhật tiến trình: ${e.message}`);
    }
  };

  // 2. Tạo đối tượng Config
  const config = {
    access_token: accessToken,
    advertiser_id: params.advertiser_id,
    store_id: params.store_id,
    progress_callback: progressCallback,
    job_id: taskId
  };

  // 3. Khởi tạo LỚP CON phù hợp
  // (Hiện tại chỉ có 1, nhưng bạn có thể 'switch' templateName ở đây)
  let reporter;
  switch (params.templateName) {
    case "GMV Campaign / Product Detail":
      reporter = new GMVCampaignProductDetailReporter(config);
      break;
    case "GMV Campaign / Creative Detail":
      reporter = new GMVCreativeDetailReporter(config);
      break;
    default:
      throw new Error(`Template GMV không được hỗ trợ: ${params.templateName}`);
  }

  // 4. Chạy hàm 'getData' của Lớp Con
  // (Tạo date_chunks. Bạn có thể dùng hàm static của GMVReporter)
  const date_chunks = GMVReporter._generateMonthlyDateChunks(params.start_date, params.end_date);
  
  const raw_results = await reporter.getData(date_chunks);

  if (!raw_results || raw_results.length === 0) {
    logger.info(`[${taskId}] Không có dữ liệu nào được trả về.`);
    return { status: "SUCCESS", newRows: 0 };
  }
  
  // 5. Làm phẳng (Flatten)
  // (Tạo context để làm phẳng)
  const flattenContext = {
     advertiser_id: params.advertiser_id,
     store_id: params.store_id,
     // ... (thêm 'advertiser_name', 'store_name' nếu bạn có)
  };
  const flattened_data = flattenProductReport(raw_results, flattenContext);

  // 6. Ghi dữ liệu
  await progressCallback(taskId, "RUNNING", "Đang ghi vào CSDL...", 98);
  const dbResult = await dataWriterService.writeDataToDatabase(
    params.templateName, 
    flattened_data,
    userId
  );

  // 7. Trả về kết quả cho Worker
  return {
    status: "SUCCESS",
    newRows: dbResult.count
  };
}