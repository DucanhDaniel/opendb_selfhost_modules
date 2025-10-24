// /src/services/facebook/index.js
import { getFacebookTemplateConfigByName } from './helpers.js';

// Import all processor functions
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
 * @returns {Promise<object>} - A promise that resolves to { status, data, newRows }.
 */
export async function processFacebookJob(options, accessToken) {
  const { templateName } = options;
  const templateConfig = getFacebookTemplateConfigByName(templateName);

  if (!templateConfig) {
    throw new Error(`Template Facebook không được hỗ trợ: "${templateName}"`);
  }

  console.log(`Dispatching Facebook job for type: ${templateConfig.type}`);

  // Use a switch on the config type to route to the correct processor
  switch (templateConfig.type) {
    // --- FAD: Performance Overview Reports ---
    case "FAD_PERFORMANCE":
    case "FAD_PERFORMANCE_ADSET":
    case "FAD_PERFORMANCE_AD":
    case "FAD_AD_CREATIVE":
      return await processGenericPerformanceReport(options, accessToken);

    // --- FAD: Daily Reports ---
    case "FAD_ACCOUNT_DAILY":
    case "FAD_CAMPAIGN_DAILY":
    case "FAD_ADSET_DAILY":
    case "FAD_AD_DAILY":
      return await processGenericDailyReport(options, accessToken);

    // --- FAD: Breakdown Reports ---
    case "FAD_CAMPAIGN_BY_AGE":
    case "FAD_CAMPAIGN_BY_GENDER":
    case "FAD_CAMPAIGN_PLATFORM":
    case "FAD_CAMPAIGN_BY_REGION":
      return await processGenericBreakdownReport(options, accessToken);

    // --- FAD: Account Management ---
    case "FAD_BM_ACCOUNTS":
      return await processBmAndAccountsReport(options, accessToken);

    // --- FBT: Billing ---
    case "FBT_BILLING":
      return await processBillingReport(options, accessToken);
    
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
}
