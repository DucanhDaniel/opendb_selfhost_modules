import axios from 'axios';
import { logTiktok } from './helpers.js';
// import logger from '../../utils/logger.js';

// Delay between paginated requests (in milliseconds)
const API_DELAY_MS = 1200; // Increased from 1100 for safety

/**
 * Fetches data from a single TikTok API endpoint with GET method.
 * Handles basic error checking.
 * @param {string} url - The full URL to fetch.
 * @param {string} accessToken - The TikTok Access Token.
 * @param {string} jobId - Job ID for logging.
 * @param {string} context - Context for logging.
 * @returns {Promise<object>} The data object from the API response.
 * @throws {Error} If the API call fails or returns an error code.
 */
export async function fetchTiktokApi(url, accessToken, jobId, context) {
  logTiktok(jobId, context, "API Call", `Fetching page: ${url.split('?')[0]}...`);
  console.log(url)
  try {
    const response = await axios.get(url, {
      headers: { 'Access-Token': accessToken },
      validateStatus: () => true, // Don't throw for non-200, check 'code'
      timeout: 30000 // Add a timeout (30 seconds)
    });

    // Handle potential network errors or timeouts that axios might still throw
    if (response.status !== 200) {
        // Log detailed error if possible
        let errorDetails = `Status: ${response.status}`;
        if(response.data && response.data.message) {
            errorDetails += `, Message: ${response.data.message}`;
        } else if (typeof response.data === 'string') {
             errorDetails += `, Body: ${response.data.substring(0, 200)}`; // Log partial body
        }
         throw new Error(`TikTok API HTTP Error! ${errorDetails} URL: ${url}`);
    }


    const data = response.data;

    // Specific TikTok error code check
    if (data.code === 40105) {
      logTiktok(jobId, context, "Permission Error", `API returned permission error: ${data.message}`);
      return { _errorType: "permission", message: data.message, list: [], data: {} }; // Return structure compatible with pagination/single fetch
    }
    // Handle other common error codes if known
    if (data.code === 40004 || data.code === 40101) { // Example: Rate limit or invalid token
         logTiktok(jobId, context, "API Error", `Code ${data.code}: ${data.message}. Might need retry or token refresh.`);
         // Throw a specific error type if needed for retry logic
         throw new Error(`TikTok API Error Code ${data.code}: ${data.message} (Request ID: ${data.request_id || 'N/A'})`);
    }

    if (data.code !== 0) {
      throw new Error(`TikTok API Error Code ${data.code}: ${data.message} (Request ID: ${data.request_id || 'N/A'}) URL: ${url}`);
    }

    // Return the 'data' part if it exists, otherwise the whole response data
    // This handles endpoints that might not have a nested 'data' field (like advertiser/info)
    return data.data || data;

  } catch (error) {
     // Log axios specific errors if available
     if (axios.isAxiosError(error)) {
        logTiktok(jobId, context, "Axios Fetch Error", `Request failed: ${error.message}. Code: ${error.code}. URL: ${url}`);
     } else {
        logTiktok(jobId, context, "Generic Fetch Error", error.message);
     }
    throw error; // Re-throw the error
  }
}

/**
 * Fetches all pages from a paginated TikTok API endpoint.
 */
export async function fetchAllTiktokPages(endpoint, initialParams, accessToken, jobId, callingFunction) {
  let allResults = [];
  let page = 1;
  let hasMore = true;
  const params = { ...initialParams };
  params.page_size = params.page_size || 50; // Use a safer default page size like 50 or 100

  while (hasMore) {
    if (page > 1) {
      await new Promise(resolve => setTimeout(resolve, API_DELAY_MS)); // Wait between pages
    }
    params.page = page;

    // Build query string
     const queryString = Object.keys(params)
       .map(key => {
           let value = params[key];
           // Only stringify objects/arrays explicitly
           if (typeof value === 'object' && value !== null) {
               value = JSON.stringify(params[key]);
           }
           return `${encodeURIComponent(key)}=${encodeURIComponent(value)}`;
       })
       .join("&");


    const url = `${endpoint}?${queryString}`;

    try {
        const data = await fetchTiktokApi(url, accessToken, jobId, `${callingFunction} - Page ${page}`);

        if (data._errorType === "permission") {
            logTiktok(jobId, callingFunction, "Permission Error", `Skipping further pages: ${data.message}`);
             return allResults; // Return what was collected
        }

        // Adapt based on actual response structure
        const listData = data.list || (Array.isArray(data) ? data : []); // Handle cases where data itself is the list
        const pageInfo = data.page_info;

        if (listData.length > 0) {
          allResults = allResults.concat(listData);
        }

        if (pageInfo) {
          hasMore = pageInfo.page < pageInfo.total_page;
          page++;
        } else {
          hasMore = false; // Stop if page_info is missing (might be end or single page response)
        }
    } catch (e) {
        logTiktok(jobId, callingFunction, "Pagination Error", `Error fetching page ${page}: ${e.message}. Stopping pagination.`);
        hasMore = false; // Stop pagination on error
        // Optionally re-throw if the entire job should fail
        // throw e;
    }
  }
  logTiktok(jobId, callingFunction, "Info", `Fetched ${allResults.length} total items across ${page-1} pages.`);
  return allResults;
}
