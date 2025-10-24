// /src/services/facebook/processors/breakdown.js
import { fetchFacebookBatchApi } from '../api.js';
import { 
  flattenActionMetrics, 
  getFacebookTemplateConfigByName,
  getRelativeUrl 
} from '../helpers.js';
import { CONVERSION_METRICS_MAP } from '../constants.js';

// Define execution parameters
const BATCH_SIZE = 20; // Breakdown can be heavy, use smaller batch
const SLEEP_TIME = 4000; // 4 seconds sleep

/**
 * Processes all Breakdown reports (Age, Gender, Platform, Region).
 * Replaces _processGenericBreakdownReport_Batch from GAS.
 *
 * @param {object} options - The task options (accountsToProcess, startDate, endDate, etc.)
 * @param {string} accessToken - The Facebook Access Token.
 * @returns {Promise<object>} - An object { status, data, newRows }.
 */
export async function processGenericBreakdownReport(options, accessToken) {
  const { accountsToProcess, startDate, endDate, selectedFields, templateName } = options;
  const templateConfig = getFacebookTemplateConfigByName(templateName);
  
  console.log(`Starting Breakdown Report (Batch): ${templateName}`);

  // --- 1. Prepare Initial API Requests ---
  let allInitialRequests = [];
  const { level, breakdowns } = templateConfig.api_params;

  for (const account of accountsToProcess) {
    const fieldsForApi = new Set([`${level}_id`, `${level}_name`, "account_id", "account_name"]);
    selectedFields.forEach(field => {
      if (CONVERSION_METRICS_MAP[field]) {
        fieldsForApi.add(CONVERSION_METRICS_MAP[field].parent_field);
      } else if (templateConfig.insight_fields && templateConfig.insight_fields.includes(field)) {
        fieldsForApi.add(field);
      }
    });

    const breakdownsParam = Array.isArray(breakdowns) ? breakdowns.join(",") : breakdowns;

    const params = {
      level: level,
      breakdowns: breakdownsParam,
      fields: Array.from(fieldsForApi).join(","),
      time_range: JSON.stringify({ since: startDate, until: endDate }),
      use_account_attribution_setting: true,
      limit: 500, // Breakdown reports can have many rows
    };
    
    const relativeUrl = `${account.id}/insights?${new URLSearchParams(params).toString()}`;
    allInitialRequests.push({ 
      url: relativeUrl, 
      metadata: { account, level, startDate, endDate } 
    });
  }
  
  // --- 2. Process Requests in Waves ---
  let requestsForCurrentWave = allInitialRequests;
  let allProcessedData = [];
  let waveCount = 1;

  while (requestsForCurrentWave.length > 0) {
    console.log(`--- Processing Wave ${waveCount} (${requestsForCurrentWave.length} requests) ---`);
    let requestsForNextWave = [];
    
    for (let i = 0; i < requestsForCurrentWave.length; i += BATCH_SIZE) {
      const batchSlice = requestsForCurrentWave.slice(i, i + BATCH_SIZE);
      const urlsForBatch = batchSlice.map(req => req.url);
      
      const responseJson = await fetchFacebookBatchApi(urlsForBatch, accessToken);
      if (!responseJson || !responseJson.results) {
        console.warn(`Batch ${i/BATCH_SIZE + 1} failed or returned invalid data. Skipping.`);
        continue;
      }
      
      const responsesWithMetadata = responseJson.results.map(res => ({ 
        ...res, 
        metadata: batchSlice[res.request_index].metadata 
      }));

      // Process results from this batch
      for (const response of responsesWithMetadata) {
        const { metadata, status_code, error, data: responseBody } = response;
        if (status_code !== 200) {
          console.warn(`Request failed (Code: ${status_code}). Error: ${JSON.stringify(error)}`);
          continue;
        }
        if (!responseBody || !responseBody.data) continue;

        // Breakdown data is flat, just process and add
        const insightsData = responseBody.data;
        const processedData = insightsData.map(row => ({
          ...row,
          account_id: metadata.account.id,
          account_name: metadata.account.name,
          date_start: metadata.startDate,
          date_stop: metadata.endDate,
        }));

        allProcessedData = allProcessedData.concat(
          processedData.map(row => flattenActionMetrics(row, selectedFields))
        );
        
        // Check for next page
        const nextUrl = responseBody.paging?.next;
        if (nextUrl) {
          requestsForNextWave.push({
            url: getRelativeUrl(nextUrl),
            metadata: metadata // Pass metadata to the next page request
          });
        }
      } // end for(response)
      
      // Sleep between batches
      await new Promise(resolve => setTimeout(resolve, SLEEP_TIME));
    } // end for(batchSlice)
    
    requestsForCurrentWave = requestsForNextWave;
    waveCount++;
  } // end while(requestsForCurrentWave)

  console.log(`Breakdown Report finished. Total rows: ${allProcessedData.length}`);
  return { 
    status: "SUCCESS", 
    data: allProcessedData, 
    newRows: allProcessedData.length 
  };
}
