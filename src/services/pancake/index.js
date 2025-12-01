import { POSCAKE_REPORT_TEMPLATES_STRUCTURE } from './constants.js';
import { getWarehouseMap, getProductMap, getUserMap } from './api.js';
import { writeDataToDatabase } from '../../db/dataWriter.js';

// Import các processors (Công nhân xử lý từng loại báo cáo)
import { processBasicReport } from './processors/basic.js';
// import { processFlattenedReport } from './processors/flattened.js';
// import { processAnalyticsReport } from './processors/analytics.js';

/**
 * Main dispatcher for all Poscake-related tasks.
 * * @param {object} options - Task params (chứa templateName, startDate, endDate, shopId, selectedFields...).
 * @param {string} apiKey - Poscake API Key.
 * @param {string} userId - ID của user sở hữu task.
 * @param {object} task_logger - Instance của TaskLogger để ghi log.
 * @param {boolean} writeData - Cờ cho phép ghi vào DB (Mặc định true).
 * @returns {Promise<object>} - { status, newRows }.
 */
export async function processPoscakeJob(options, apiKey, userId, task_logger, taskId, writeData = true) {
  const {templateName, shopId } = options;

  if (!apiKey) {
    throw new Error("Thiếu API Key Poscake.");
  }

  // 1. Tìm Config Template dựa trên templateName
  const allTemplates = POSCAKE_REPORT_TEMPLATES_STRUCTURE.flatMap(group => group.templates);
  const templateObj = allTemplates.find(t => t.name === templateName);
  
  if (!templateObj) {
    throw new Error(`Không tìm thấy cấu hình cho template: "${templateName}"`);
  }
  const config = templateObj.config;

  task_logger.info(`[Poscake] Bắt đầu xử lý template: "${templateName}" (Type: ${config.type})`);

  // 2. Tải dữ liệu phụ trợ (Maps) nếu config yêu cầu
  // (Chỉ tải khi cần thiết để tiết kiệm tài nguyên)
  const maps = { warehouseMap: null, productMap: null, userMap: null };

  if (config.requires_warehouse_map) {
    task_logger.info("Đang tải danh sách kho...");
    maps.warehouseMap = await getWarehouseMap(shopId, apiKey);
  }
  if (config.requires_product_map) {
    task_logger.info("Đang tải danh sách sản phẩm...");
    maps.productMap = await getProductMap(shopId, apiKey);
  }
  if (config.requires_user_map) {
    task_logger.info("Đang tải danh sách nhân viên...");
    maps.userMap = await getUserMap(shopId, apiKey);
  }

  console.log("Đã qua map!");
  
  let processorResult; 

  switch (config.type) {
    case "ANALYTICS_REPORT":
      // Báo cáo thống kê
    //   processorResult = await processAnalyticsReport(options, config, maps, apiKey);
      break;

    case "FLATTENED_REPORT":
      // Báo cáo cần làm phẳng mảng con (Chi tiết đơn hàng...)
        console.log("options: ", options);
        console.log("config: ", config);
        processorResult = await processBasicReport(options, config, maps, apiKey, taskId, task_logger, userId);
        // processorResult = { status: "SUCCESS", data: [], newRows: 0 };
        console.log("Đã xong processor!");
      break;

    // case "BASIC_REPORT":
    // default:
    //   // Báo cáo dạng danh sách đơn giản
    // //   processorResult = await processBasicReport(options, config, maps, apiKey);
    //   break;
  }

  // Kiểm tra kết quả từ Processor
  if (processorResult.status !== "SUCCESS") {
    throw new Error(processorResult.message || "Poscake Processor failed");
  }

  // 4. [LOGIC GHI DỮ LIỆU]
  let rowsWritten = processorResult.newRows;

  // if (writeData) {
  //   if (processorResult.data && processorResult.data.length > 0) {
  //       task_logger.info(`Đã nhận ${processorResult.data.length} dòng từ API. Bắt đầu ghi vào DB...`);
        
  //       const dbResult = await writeDataToDatabase(
  //           templateName, 
  //           processorResult.data,
  //           userId
  //       );

  //       if (!dbResult.success) {
  //           throw new Error(dbResult.error || "Lỗi không xác định khi ghi DB");
  //       }
  //       rowsWritten = dbResult.count;
  //       task_logger.info(`Đã ghi thành công ${rowsWritten} dòng vào Database.`);
  //   } else {
  //       task_logger.info("Không có dữ liệu mới để ghi vào database.");
  //   }
  // } else {
  //     task_logger.info("Chế độ ghi dữ liệu bị TẮT (writeData=false).");
  // }

  return { 
    status: 'SUCCESS', 
    newRows: rowsWritten,
    message: `Hoàn tất. Đã xử lý ${rowsWritten} dòng.`
  };
}