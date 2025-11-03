import { getFacebookTemplateConfigByName } from './helpers.js';

import { writeDataToDatabase } from '../../db/dataWriter.js';
import logger from '../../utils/logger.js';

import { processGenericPerformanceReport } from './processors/performance.js';
import { processGenericDailyReport } from './processors/daily.js';
import { processGenericBreakdownReport } from './processors/breakdown.js';
import { processBmAndAccountsReport } from './processors/accounts.js';
import { processBillingReport } from './processors/billing.js';
// Import MPI processors when ready
// import { processPageInsightReport } from './processors/pageInsights.js';

/**
 * Main dispatcher for all Facebook-related tasks.
 * Replaces processFacebookJob from GAS.
 *
 * @param {object} options - The complete task options object from the Task Manager.
 * @param {string} accessToken - The Facebook Access Token.
 * @param {bool} writeData - True if task need to be written in database and json for debugging
 * @returns {Promise<object>} - A promise that resolves to { status, data, newRows }.
 */
export async function processFacebookJob(options, accessToken, writeData = true) {
  const { taskId, templateName } = options;
  const templateConfig = getFacebookTemplateConfigByName(templateName);

  if (!templateConfig) {
    throw new Error(`Template Facebook không được hỗ trợ: "${templateName}"`);
  }

  console.log(`Dispatching Facebook job for type: ${templateConfig.type}`);

  // Use a switch on the config type to route to the correct processor
  let processorResult;

  switch (templateConfig.type) {
    // --- FAD: Performance Overview Reports ---
    case "FAD_PERFORMANCE":
    case "FAD_PERFORMANCE_ADSET":
    case "FAD_PERFORMANCE_AD":
    case "FAD_AD_CREATIVE":
      processorResult = await processGenericPerformanceReport(options, accessToken);
      break;
    // --- FAD: Daily Reports ---
    case "FAD_ACCOUNT_DAILY":
    case "FAD_CAMPAIGN_DAILY":
    case "FAD_ADSET_DAILY":
    case "FAD_AD_DAILY":
      processorResult = await processGenericDailyReport(options, accessToken);
      break;
    // --- FAD: Breakdown Reports ---
    case "FAD_CAMPAIGN_BY_AGE":
    case "FAD_CAMPAIGN_BY_GENDER":
    case "FAD_CAMPAIGN_PLATFORM":
    case "FAD_CAMPAIGN_BY_REGION":
      processorResult = await processGenericBreakdownReport(options, accessToken);
      break;
    // --- FAD: Account Management ---
    case "FAD_BM_ACCOUNTS":
      processorResult = await processBmAndAccountsReport(options, accessToken);
      break;
    // --- FBT: Billing ---
    case "FBT_BILLING":
      processorResult = await processBillingReport(options, accessToken);
      break;
    // --- MPI: Meta Page Insights (Future) ---
    // case "MPI_PERFORMANCE":
    // case "MPI_PERFORMANCE_LONG":
    // case "MPI_POST_PERFORMANCE":
    // case "MPI_VIDEO_PERFORMANCE":
    // case "MPI_CUSTOM_PERFORMANCE":
    // case "MPI_POST_PERFORMANCE_LIFETIME":
    //   // return await processPageInsightReport(options, accessToken);
    //   throw new Error(`Loại template MPI chưa được hỗ trợ: "${templateConfig.type}"`);

    default:
      throw new Error(`Loại template Facebook không được hỗ trợ: "${templateConfig.type}"`);
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
