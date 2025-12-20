import { getTiktokTemplateConfigByName } from './helpers.js';
import { processBasicReport } from './processors/tta_report.js';
import { writeDataToDatabase } from '../../db/dataWriter.js';
import { processBcaBcInfo, processBcaAccountInfo, processBcaAssetInfo } from './processors/bca_report.js';
import { processGmvBasicReport } from './processors/gmv_basic_report.js';
import logger from '../../utils/logger.js'; 
import { processGmvReport } from './processors/gmv_detail_report.js';

/**
 * Main dispatcher for TikTok tasks.
 * @param {object} task - The full task object { taskId, params, ... }.
 * @param {string} accessToken - TikTok Access Token.
 * @returns {Promise<object>} - { status, data?, newRows, message? } or { status: 'PENDING', ... } for async jobs.
 */
export async function processTiktokJob(task, accessToken, userId, task_logger, writeData=true) {
  const { taskId, params } = task;
  const templateName = params.templateName;
  const templateConfig = getTiktokTemplateConfigByName(templateName);
  if (!templateConfig) {
    task_logger.error(`[TikTok Dispatcher] Task ${taskId}: Template not found "${templateName}"`);
    throw new Error(`TikTok template not found: ${templateName}`);
  }

  task_logger.info(`Processing template "${templateName}" (Type: ${templateConfig.type})`);

  let processorResult;
  switch (templateConfig.type) {
    case "BASIC": 
      processorResult = await processBasicReport(params, templateConfig, accessToken, taskId, task_logger);
      break;

    case "BCA_BC_INFO":
      processorResult = await processBcaBcInfo(params, templateConfig, accessToken, taskId, task_logger);
      break;

    case "BCA_ACCOUNT_INFO":
      processorResult = await processBcaAccountInfo(params, templateConfig, accessToken, taskId, task_logger);
      break;

    case "BCA_ASSET_INFO":
      processorResult = await processBcaAssetInfo(params, templateConfig, accessToken, taskId, task_logger);
      break;

    case "MULTI_STEP_GMV_PRODUCT":
    case "MULTI_STEP_GMV_CREATIVE":
       processorResult = await processGmvReport(params, templateConfig, accessToken, taskId, task_logger);
       break;

    case "GMV_BASIC":
      console.log("Ckpt!");
      processorResult = await processGmvBasicReport(params, templateConfig, accessToken, taskId, task_logger);
      break;

    default:
      throw new Error(`Unsupported TikTok template type: ${templateConfig.type}`);
  }

  if (writeData && processorResult) {
    console.log(processorResult.status);
    // 5. Kiểm tra kết quả Processor
    if (processorResult.status !== "SUCCESS") {
      throw new Error(processorResult.message || `[${taskId}] Processor thất bại`);
    }

    if (processorResult.data && processorResult.data.length > 0) {
      logger.info(`[${taskId}] Đã nhận ${processorResult.data.length} dòng. Bắt đầu ghi vào DB...`);
      
      const dbResult = await writeDataToDatabase(
        templateName, 
        processorResult.data,
        userId,
        taskId
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
