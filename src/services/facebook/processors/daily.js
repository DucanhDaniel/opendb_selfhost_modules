// /src/services/facebook/processors/daily.js
import { fetchFacebookBatchApi } from '../api.js';
import { 
  flattenActionMetrics, 
  getFacebookTemplateConfigByName,
  getRelativeUrl,
  generateMonthlyDateChunks
} from '../helpers.js';
import { CONVERSION_METRICS_MAP, EFFECTIVE_STATUS_FILTERS } from '../constants.js';

// Define execution parameters
const BATCH_SIZE = 40; // Daily reports can use a higher batch size
const SLEEP_TIME = 4000; // 4 seconds sleep

/**
 * Processes all Daily reports (Account, Campaign, Adset, Ad).
 * Replaces _processGenericDailyReport_Batch from GAS.
 * This function fetches and processes data in waves and returns all data at the end.
 *
 * @param {object} options - The task options (accountsToProcess, startDate, endDate, etc.)
 * @param {string} accessToken - The Facebook Access Token.
 * @returns {Promise<object>} - An object { status, data, newRows }.
 */
export async function processGenericDailyReport(options, accessToken) {
  const { accountsToProcess, startDate, endDate, selectedFields, templateName } = options;
  const templateConfig = getFacebookTemplateConfigByName(templateName);
  
  console.log(`Starting Daily Report (Batch): ${templateName}`);
  
  // --- 1. Prepare Initial API Requests (with Date Chunks) ---
  let allInitialRequests = [];
  const dateChunks = generateMonthlyDateChunks(startDate, endDate); 

  for (const account of accountsToProcess) {
    for (const chunk of dateChunks) {
      const level = templateConfig.api_params.level;
      let relativeUrl = "";
      
      const p = templateConfig.api_params;
      const f = new Set();
      selectedFields.forEach(field => {
        if (CONVERSION_METRICS_MAP[field]) f.add(CONVERSION_METRICS_MAP[field].parent_field);
        else if (templateConfig.insight_fields.includes(field)) f.add(field);
      });
      
      let params = {};

      if (level === "account" || level === "campaign") {
        ['account_id', 'account_name', 'campaign_id', 'campaign_name'].forEach(i => f.add(i));
        params = {
          level: level, 
          time_increment: p.time_increment, 
          action_report_time: p.action_report_time,
          fields: Array.from(f).join(","),
          time_range: JSON.stringify({ since: chunk.start, until: chunk.end }), 
          limit: 200,
        };
        relativeUrl = `${account.id}/insights?${new URLSearchParams(params).toString()}`;
      } else {
        // Level is 'adset' or 'ad'
        const apiObjectFields = (level === 'adset') ? templateConfig.adset_fields : templateConfig.ad_fields;
        const finalObjectFields = new Set(["id", "name"]);
        ['account_id', 'date_start', 'date_stop'].forEach(i => f.add(i));
        
        selectedFields.forEach(field => {
          if (field === 'campaign_name' || field === 'campaign_id') finalObjectFields.add('campaign{name,id}');
          else if (level === 'ad' && (field === 'adset_name' || field === 'adset_id')) finalObjectFields.add('adset{name,id}');
          else if (apiObjectFields.includes(field)) finalObjectFields.add(field);
        });

        const timeRangeParam = `time_range({'since':'${chunk.start}','until':'${chunk.end}'})`;
        const insightFieldsString = Array.from(f).join(",");
        let finalFieldsString = Array.from(finalObjectFields).join(",");
        
        if (f.size > 2) { // More than just account_id, date_start/stop
           finalFieldsString += `,insights.${timeRangeParam}.time_increment(1){${insightFieldsString}}`;
        }

        params = { fields: finalFieldsString, limit: 200 };
        const statusFilter = EFFECTIVE_STATUS_FILTERS[level];
        if (statusFilter) params['effective_status'] = JSON.stringify(statusFilter);
        
        relativeUrl = `${account.id}/${level}s?${new URLSearchParams(params).toString()}`;
      }

      if (relativeUrl) {
        allInitialRequests.push({ url: relativeUrl, metadata: { account, level } });
      }
    }
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
        const { level, account } = metadata;
        
        if (status_code !== 200) {
          console.warn(`Request failed (Code: ${status_code}). Error: ${JSON.stringify(error)}`);
          continue;
        }
        if (!responseBody || !responseBody.data) continue;

        // --- Logic for FLAT structure (account, campaign) ---
        if (level === 'account' || level === 'campaign') {
          const dailyInsights = responseBody.data || [];
          dailyInsights.forEach(dailyData => {
            const finalRow = { ...dailyData, account_id: account.id, account_name: account.name };
            allProcessedData.push(flattenActionMetrics(finalRow, selectedFields));
          });
          const nextUrl = responseBody.paging?.next;
          if (nextUrl) {
            requestsForNextWave.push({ url: getRelativeUrl(nextUrl), metadata });
          }
        } 
        // --- Logic for NESTED structure (adset, ad) ---
        else {
          // This is a page of insights (from `item.insights.paging.next`)
          if (metadata.parentItemInfo) {
            const parentInfo = metadata.parentItemInfo;
            const dailyInsights = responseBody.data || [];
            dailyInsights.forEach(dailyData => {
              const finalRow = { ...parentInfo, ...dailyData, account_id: account.id, account_name: account.name };
              allProcessedData.push(flattenActionMetrics(finalRow, selectedFields));
            });
            const nextUrl = responseBody.paging?.next;
            if (nextUrl) {
              requestsForNextWave.push({ url: getRelativeUrl(nextUrl), metadata });
            }
          }
          // This is a top-level page of items (adsets or ads)
          else if (responseBody.data) {
            responseBody.data.forEach(item => {
              if (!item.insights || !item.insights.data) return;
              
              const parentInfo = { ...item };
              delete parentInfo.insights;
              if (item.campaign) { parentInfo.campaign_name = item.campaign.name; parentInfo.campaign_id = item.campaign.id; }
              if (item.adset) { parentInfo.adset_name = item.adset.name; parentInfo.adset_id = item.adset.id; }
              delete parentInfo.campaign; delete parentInfo.adset;

              item.insights.data.forEach(dailyData => {
                const finalRow = { ...parentInfo, ...dailyData, account_id: account.id, account_name: account.name };
                allProcessedData.push(flattenActionMetrics(finalRow, selectedFields));
              });
              
              // Check for *nested* pagination (insights page)
              const nextInsightsUrl = item.insights.paging?.next;
              if (nextInsightsUrl) {
                requestsForNextWave.push({
                  url: getRelativeUrl(nextInsightsUrl),
                  metadata: { ...metadata, parentItemInfo: parentInfo }
                });
              }
            });
            
            // Check for *top-level* pagination (items page)
            const topLevelNextUrl = responseBody.paging?.next;
            if (topLevelNextUrl) {
              requestsForNextWave.push({ url: getRelativeUrl(topLevelNextUrl), metadata });
            }
          }
        }
      } // end for(response)
      
      // Sleep between batches
      await new Promise(resolve => setTimeout(resolve, SLEEP_TIME));
    } // end for(batchSlice)
    
    requestsForCurrentWave = requestsForNextWave;
    waveCount++;
  } // end while(requestsForCurrentWave)

  console.log(`Daily Report finished. Total rows: ${allProcessedData.length}`);
  return { 
    status: "SUCCESS", 
    data: allProcessedData, 
    newRows: allProcessedData.length 
  };
}
