// /src/services/facebook/processors/performance.js
import { fetchFacebookBatchApi, getAccessiblePageMap } from '../api.js';
import { 
  flattenActionMetrics, 
  getFacebookTemplateConfigByName,
  getRelativeUrl
} from '../helpers.js';

import { CONVERSION_METRICS_MAP, EFFECTIVE_STATUS_FILTERS } from '../constants.js';

// Define execution parameters
const BATCH_SIZE = 20; // Lower batch size for complex performance reports
const SLEEP_TIME = 4000; // 4 seconds sleep

/**
 * Processes all Performance Overview reports (Campaign, Adset, Ad, Creative).
 * Replaces _processGenericPerformanceReport_Batch from GAS.
 * This function fetches and processes data in waves and returns all data at the end.
 *
 * @param {object} options - The task options (accountsToProcess, startDate, endDate, etc.)
 * @param {string} accessToken - The Facebook Access Token.
 * @returns {Promise<object>} - An object { status, data, newRows }.
 */
export async function processGenericPerformanceReport(options, accessToken) {
  const { accountsToProcess, startDate, endDate, selectedFields, templateName } = options;
  const templateConfig = getFacebookTemplateConfigByName(templateName);
  const level = templateConfig.api_params.level;

  console.log(`Starting Performance Report (Batch): ${templateName}`);
  
  // --- 1. Prepare Initial API Requests ---
  let allInitialRequests = [];
  let pageMap = new Map(); // For creative reports

  // Check if we need to fetch Page info for Ad Creative reports
  const needsCreativeFields = selectedFields.some(f => f.startsWith('creative_'));
  if (needsCreativeFields) {
    console.log("Creative fields selected, fetching accessible pages...");
    pageMap = await getAccessiblePageMap(accessToken);
  }

  for (const account of accountsToProcess) {
    const objectFieldsKey = `${level}_fields`;
    const apiObjectFields = templateConfig[objectFieldsKey] || [];
    const finalObjectFields = new Set(["id", "name"]);
    const finalInsightFields = new Set(["account_id"]);
    
    selectedFields.forEach(field => {
      if (field.startsWith('creative_')) {
        // Already handled by fetching pageMap
      } else if (CONVERSION_METRICS_MAP[field]) {
        finalInsightFields.add(CONVERSION_METRICS_MAP[field].parent_field);
      } else if (field === 'campaign_name' || field === 'campaign_id') {
        finalObjectFields.add('campaign{name,id}');
      } else if (level === 'ad' && (field === 'adset_name' || field === 'adset_id')) {
        finalObjectFields.add('adset{name,id}');
      } else if (apiObjectFields.includes(field)) {
        finalObjectFields.add(field);
      } else if (templateConfig.insight_fields.includes(field)) {
        finalInsightFields.add(field);
      }
    });

    // Add creative fields string if needed
    if (needsCreativeFields) {
      const creativeFieldString = apiObjectFields.find(f => f.startsWith('creative{'));
      if (creativeFieldString) {
        finalObjectFields.add(creativeFieldString);
      }
    }

    let finalFieldsString = Array.from(finalObjectFields).join(",");
    const insightFieldsString = Array.from(finalInsightFields).join(",");
    const insightParams = `.time_range({'since':'${startDate}','until':'${endDate}'})`;
    finalFieldsString += `,insights${insightParams}{${insightFieldsString}}`;

    const params = { fields: finalFieldsString, limit: 200 };
    const statusFilter = EFFECTIVE_STATUS_FILTERS[level];
    if (statusFilter) params['effective_status'] = JSON.stringify(statusFilter);
    
    const relativeUrl = `${account.id}/${level}s?${new URLSearchParams(params).toString()}`;
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

        responseBody.data.forEach(item => {
          let finalRow = { ...item };
          const insightData = item.insights?.data?.[0];
          if (insightData) {
            Object.assign(finalRow, insightData);
          }
          
          // Flatten creative data if it exists
          if (item.creative) {
            const creative = item.creative;
            finalRow.creative_id = creative.id || "";
            finalRow.actor_id = creative.actor_id ? String(creative.actor_id) : "";
            finalRow.page_name = pageMap.get(String(creative.actor_id)) || "N/A";
            finalRow.creative_title = creative.title || "";
            finalRow.creative_body = creative.body || "";
            finalRow.creative_thumbnail_url = creative.thumbnail_url || ""; // No =IMAGE()
            finalRow.creative_thumbnail_raw_url = creative.thumbnail_url || "";
            finalRow.creative_link = creative.object_story_id ? `https://facebook.com/${creative.object_story_id}` : "";
          }

          // Clean up nested objects
          delete finalRow.insights;
          delete finalRow.creative;
          if (item.campaign) { finalRow.campaign_name = item.campaign.name; finalRow.campaign_id = item.campaign.id; }
          if (item.adset) { finalRow.adset_name = item.adset.name; finalRow.adset_id = item.adset.id; }
          delete finalRow.campaign; delete finalRow.adset;

          finalRow.account_id = metadata.account.id;
          finalRow.account_name = metadata.account.name;
          finalRow.date_start = metadata.startDate;
          finalRow.date_stop = metadata.endDate;

          // Flatten action metrics and add to batch
          allProcessedData.push(flattenActionMetrics(finalRow, selectedFields));
        });

        // Check for next page (top-level pagination)
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

  console.log(`Performance Report finished. Total rows: ${allProcessedData.length}`);
  return { 
    status: "SUCCESS", 
    data: allProcessedData, 
    newRows: allProcessedData.length 
  };
}
