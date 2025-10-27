import { getTiktokTemplateConfigByName } from './helpers.js';
import { processBasicReport } from './processors/tta_report.js';
// Removed GMV Account Daily import as it's handled by 'BASIC' now based on endpoint
// import { processGmvAccountDailyReport } from './processors/gmvAccountDaily.js';
// import { startGmvAsyncJob } from './asyncHandler.js';
import { processBcaBcInfo, processBcaAccountInfo, processBcaAssetInfo } from './processors/bca_report.js';
import logger from '../../utils/logger.js'; 

/**
 * Main dispatcher for TikTok tasks.
 * @param {object} task - The full task object { taskId, params, ... }.
 * @param {string} accessToken - TikTok Access Token.
 * @returns {Promise<object>} - { status, data?, newRows, message? } or { status: 'PENDING', ... } for async jobs.
 */
export async function processTiktokJob(task, accessToken) {
  const { taskId, params } = task;
  const { templateName } = params;

  const templateConfig = getTiktokTemplateConfigByName(templateName);
  if (!templateConfig) {
    logger.error(`[TikTok Dispatcher] Task ${taskId}: Template not found "${templateName}"`);
    throw new Error(`TikTok template not found: ${templateName}`);
  }

  logger.info(`[TikTok Dispatcher] Task ${taskId}: Processing template "${templateName}" (Type: ${templateConfig.type})`);

  // Route based on template type
  switch (templateConfig.type) {
    case "BASIC": // Includes TTA Basic/Audience and GMV Basic reports now
      // Also handles "Ad Account GMV Ads Daily" since it uses TIKTOK_GMV_REPORT_URL (type: BASIC in structure)
      return await processBasicReport(params, templateConfig, accessToken, taskId);

    case "BCA_BC_INFO":
      return await processBcaBcInfo(params, templateConfig, accessToken, taskId);
    case "BCA_ACCOUNT_INFO":
      return await processBcaAccountInfo(params, templateConfig, accessToken, taskId);
    case "BCA_ASSET_INFO":
      return await processBcaAssetInfo(params, templateConfig, accessToken, taskId);

    // Keep ASYNC types separate
    // case "ASYNC_GMV_CREATIVE":
    //    return await startGmvAsyncJob(task, 'creative', accessToken);
    // case "ASYNC_GMV_PRODUCT":
    //    return await startGmvAsyncJob(task, 'product', accessToken);

    // Remove GMV_ACCOUNT_DAILY as it's handled by BASIC now

    // MULTI_STEP_GMV_PRODUCT might become ASYNC or need its own processor
    // case "MULTI_STEP_GMV_PRODUCT":
    //    logger.warn(`MULTI_STEP_GMV_PRODUCT not fully implemented yet.`);
    //    return { status: "FAILED", message: "Not implemented", data: [], newRows: 0 };


    default:
       logger.error(`[TikTok Dispatcher] Task ${taskId}: Unsupported template type "${templateConfig.type}"`);
      throw new Error(`Unsupported TikTok template type: ${templateConfig.type}`);
  }
}
