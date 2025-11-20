import { getTiktokTemplateConfigByName } from './helpers.js';
import { processBasicReport } from './processors/tta_report.js';
import { writeDataToDatabase } from '../../db/dataWriter.js';
// Removed GMV Account Daily import as it's handled by 'BASIC' now based on endpoint
// import { processGmvAccountDailyReport } from './processors/gmvAccountDaily.js';
// import { startGmvAsyncJob } from './asyncHandler.js';
import { processBcaBcInfo, processBcaAccountInfo, processBcaAssetInfo } from './processors/bca_report.js';
import logger from '../../utils/logger.js'; 
import { processGmvReport } from './processors/gmv_report.js';

/**
 * Main dispatcher for TikTok tasks.
 * @param {object} task - The full task object { taskId, params, ... }.
 * @param {string} accessToken - TikTok Access Token.
 * @returns {Promise<object>} - { status, data?, newRows, message? } or { status: 'PENDING', ... } for async jobs.
 */
export async function processTiktokJob(task, accessToken, userId, writeData=true) {
  const { taskId, params } = task;
  console.log(task);
  const templateName = params.templateName;
  console.log(templateName);
  const templateConfig = getTiktokTemplateConfigByName(templateName);
  if (!templateConfig) {
    logger.error(`[TikTok Dispatcher] Task ${taskId}: Template not found "${templateName}"`);
    throw new Error(`TikTok template not found: ${templateName}`);
  }

  logger.info(`[TikTok Dispatcher] Task ${taskId}: Processing template "${templateName}" (Type: ${templateConfig.type})`);

  let processorResult;
  switch (templateConfig.type) {
    case "BASIC": 
      processorResult = await processBasicReport(params, templateConfig, accessToken, taskId);
      break;

    case "BCA_BC_INFO":
      processorResult = await processBcaBcInfo(params, templateConfig, accessToken, taskId);
      break;

    case "BCA_ACCOUNT_INFO":
      processorResult = await processBcaAccountInfo(params, templateConfig, accessToken, taskId);
      break;

    case "BCA_ASSET_INFO":
      processorResult = await processBcaAssetInfo(params, templateConfig, accessToken, taskId);
      break;

    case "MULTI_STEP_GMV_PRODUCT":
    case "MULTI_STEP_GMV_CREATIVE":
       processorResult = await processGmvReport(params, templateConfig, accessToken, taskId);
       break;

    // Remove GMV_ACCOUNT_DAILY as it's handled by BASIC now

    // MULTI_STEP_GMV_PRODUCT might become ASYNC or need its own processor
    // case "MULTI_STEP_GMV_PRODUCT":
    //    logger.warn(`MULTI_STEP_GMV_PRODUCT not fully implemented yet.`);
    //    return { status: "FAILED", message: "Not implemented", data: [], newRows: 0 };

    default:
      throw new Error(`Unsupported TikTok template type: ${templateConfig.type}`);
  }

  if (writeData && processorResult) {
    console.log(processorResult.status);
    // 5. Kiểm tra kết quả Processor
    if (processorResult.status !== "SUCCESS") {
      throw new Error(processorResult.message || `[${taskId}] Processor thất bại`);
    }

    // 6. [LOGIC GHI DỮ LIỆU CỦA BẠN]
    if (processorResult.data && processorResult.data.length > 0) {
      logger.info(`[${taskId}] Đã nhận ${processorResult.data.length} dòng. Bắt đầu ghi vào DB...`);
      
      const dbResult = await writeDataToDatabase(
        templateName, 
        processorResult.data,
        userId
      );

      processorResult.newRows = dbResult.count;

      if (!dbResult.success) {
        throw new Error(dbResult.error || `[${taskId}] Lỗi không xác định khi ghi DB`);
      }
    } else {
      logger.info(`[${taskId}] Không có dữ liệu mới để ghi vào database.`);
    }
  }
  
  return processorResult;
}
