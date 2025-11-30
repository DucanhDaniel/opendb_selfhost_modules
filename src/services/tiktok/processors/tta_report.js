import { fetchAllTiktokPages } from '../api.js';
import { getProvinceNameMap } from '../utils.js';
import { splitDateRangeIntoMonths } from '../helpers.js';
import { TIKTOK_PERCENT_METRICS } from '../constants.js';

/**
 * Processes standard TikTok TTA reports (Basic/Audience).
 * @param {object} params - Task parameters (startDate, endDate, accountsToProcess, selectedFields, etc.).
 * @param {object} templateConfig - Config for the specific TTA template.
 * @param {string} accessToken - TikTok Access Token.
 * @param {string} jobId - Job ID for logging.
 * @returns {Promise<object>} - { status, data, newRows, message? }.
 */
export async function processBasicReport(params, templateConfig, accessToken, jobId, task_logger) {
  const functionName = 'processBasicReport (TTA)';
  task_logger.info(`Processing template: ${params.templateName}`);
  const { startDate, endDate, selectedFields, accountsToProcess } = params;

  const advertiserInfo = accountsToProcess?.[0] || {};
  const advertiserId = advertiserInfo.id;
  const advertiserName = advertiserInfo.name;

  if (!advertiserId) {
    throw new Error("Missing Advertiser ID for TTA report.");
  }

  // --- Determine API Dimensions and Metrics ---
  const allAvailableMetrics = Object.values(templateConfig.selectable_metrics || {}).flat();
  const apiMetrics = selectedFields.filter(field => allAvailableMetrics.includes(field));

  const allAvailableDimensions = Object.values(templateConfig.selectable_dimensions || {}).flat();
  // Filter out meta-fields used only for display/selection, keep API dimensions
  const apiDimensions = selectedFields.filter(field =>
    allAvailableDimensions.includes(field) &&
    !["start_date", "end_date", "advertiser_id", "advertiser_name", "province_name"].includes(field)
  );

  // Validation
  if (apiDimensions.length === 0) throw new Error("Please select at least one Dimension from API.");
  if (apiMetrics.length === 0) throw new Error("Please select at least one Metric from API.");

  // --- Prepare for Data Fetching ---
  const dateChunks = splitDateRangeIntoMonths(startDate, endDate);
  let allDataFromApi = [];
  let provinceMap = null;

  if (selectedFields.includes("province_name")) {
      provinceMap = await getProvinceNameMap();
  }

  task_logger.info(`Fetching data in ${dateChunks.length} monthly chunks...`);

  // --- Fetch Data Month by Month ---
  for (const chunk of dateChunks) {
    task_logger.info(`Fetching chunk: ${chunk.start} to ${chunk.end}`);
    const baseParams = {
      advertiser_id: advertiserId,
      start_date: chunk.start,
      end_date: chunk.end,
      dimensions: JSON.stringify(apiDimensions),
      metrics: JSON.stringify(apiMetrics),
      page_size: 1000, 
    };

    // Add specific parameters from template config (like data_level, report_type)
    if (templateConfig.api_params) {
      for (const key in templateConfig.api_params) {
        baseParams[key] = typeof templateConfig.api_params[key] === "object"
            ? JSON.stringify(templateConfig.api_params[key])
            : templateConfig.api_params[key];
      }
    }

    try {
      const dataForChunk = await fetchAllTiktokPages(
        templateConfig.api_endpoint, 
        baseParams,
        accessToken,
        jobId,
        `${functionName}-${params.templateName}-Chunk`
      );

      // Add context info immediately
      dataForChunk.forEach(item => {
          item._chunk_start = chunk.start;
          item._chunk_end = chunk.end;
      });
      allDataFromApi.push(...dataForChunk);

    } catch (e) {
      task_logger.error(`Failed chunk ${chunk.start}-${chunk.end}: ${e.message}. Skipping.`);
    }
  } // End date chunk loop

  if (allDataFromApi.length === 0) {
      task_logger.info('No data returned from API.');
      return { status: "SUCCESS", data: [], newRows: 0, message:"No data found for the selected criteria." };
  }

  // --- Process and Format Data ---
  const dataToWrite = allDataFromApi.map(item => {
    let rowObject = {
      ...item.dimensions,
      ...item.metrics,
      advertiser_id: advertiserId,   // Add advertiser info
      advertiser_name: advertiserName,
      start_date: item._chunk_start, // Use specific chunk dates
      end_date: item._chunk_end,
    };

    // Add province name if fetched and needed
    if (provinceMap && item.dimensions?.province_id) {
        rowObject.province_name = provinceMap.get(String(item.dimensions.province_id)) || item.dimensions.province_id;
    }

    // Format percentages (store as decimal)
    for (const key in rowObject) {
      if (TIKTOK_PERCENT_METRICS.includes(key)) {
        const value = parseFloat(rowObject[key]);
        rowObject[key] = !isNaN(value) ? value / 100 : null; // Store as decimal or null
      }
    }

    // Remove temporary keys
    delete rowObject._chunk_start;
    delete rowObject._chunk_end;

    // Ensure all selected fields exist, adding null if missing
    const finalRow = {};
    selectedFields.forEach(field => {
        finalRow[field] = rowObject.hasOwnProperty(field) ? rowObject[field] : null;
    });

    return finalRow; // Return the row with only selected fields
  });

  task_logger.info(`Processed ${dataToWrite.length} rows.`);
  // Return data for the Task Processor to handle writing
  return { status: "SUCCESS", data: dataToWrite, newRows: dataToWrite.length };
}
