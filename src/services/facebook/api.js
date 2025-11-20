// /src/services/facebook/api.js
import axios from 'axios';
import { BATCH_SERVER_URL, FACEBOOK_API_VERSION } from './constants.js';

/**
 * Fetches data from a single Facebook API endpoint.
 * This is a replacement for _fetchFacebookApi in GAS.
 * @param {string} url - The full URL to fetch.
 * @param {string} context - A description for logging.
 * @returns {Promise<object>} - The JSON response data.
 */
async function fetchFacebookApi(url, context) {
  try {
    // console.log(`Fetching API: ${context}`);
    const response = await axios.get(url, {
      headers: {
        'Accept': 'application/json',
      },
      // Do not throw an error on 4xx/5xx, return the response
      validateStatus: () => true, 
    });

    if (response.status !== 200 || response.data.error) {
      throw new Error(JSON.stringify(response.data.error || { message: `HTTP ${response.status}`, context }));
    }
    return response.data;
  } catch (error) {
    console.error(`Error in fetchFacebookApi [${context}]:`, error.message);
    // Re-throw the structured error
    throw error;
  }
}

/**
 * Fetches data from the custom batch server.
 * This is a replacement for _fetchFacebookBatchApi in GAS.
 * @param {string[]} relativeUrls - An array of relative URLs for the batch.
 * @param {string} accessToken - The Facebook Access Token.
 * @returns {Promise<object>} - The response from the batch server.
 */
export async function fetchFacebookBatchApi(relativeUrls, accessToken) {
  const batchServerUrl = `${BATCH_SERVER_URL}/batch`;
  
  const payload = {
    access_token: accessToken,
    relative_urls: relativeUrls,
  };

  const options = {
    method: 'post',
    url: batchServerUrl,
    headers: {
      'Content-Type': 'application/json',
      'ngrok-skip-browser-warning': 'true' // From original code
    },
    data: payload,
    validateStatus: () => true, // Don't throw on non-200 status
  };

  try {
    // console.log(`Sending ${relativeUrls.length} requests to Batch Server...`);
    const response = await axios(options);

    if (response.status !== 200) {
      throw new Error(`Lỗi từ Batch Server (HTTP ${response.status}): ${response.data}`);
    }
    
    // The server returns an object with a 'results' key
    return response.data;

  } catch (e) {
    console.error(`Không thể parse JSON trả về từ Batch Server: ${e.message}`);
    throw new Error(`Không thể parse JSON trả về từ Batch Server: ${e.message}`);
  }
}

/**
 * Fetches all pages from a paginated Facebook API endpoint.
 * This is a replacement for _fetchAllPagesWithCursor.
 * @param {string} initialUrl - The first URL to fetch.
 * @param {object} initialParams - Query parameters as an object.
 * @param {string} context - A description for logging.
 * @param {string} accessToken - The Facebook Access Token.
 * @returns {Promise<Array>} - A flat array of all results.
 */
export async function fetchAllPagesWithCursor(initialUrl, initialParams, context, accessToken) {
  let allResults = [];
  let params = { ...initialParams, access_token: accessToken };
  let nextUrl = `${initialUrl}?${new URLSearchParams(params).toString()}`;
  
  const MAX_RETRIES = 4; // From original code
  const initialLimit = initialParams.limit || 1000;

  for (let attempt = 0; attempt < MAX_RETRIES; attempt++) {
    let success = true;
    allResults = []; // Reset results for this attempt

    while (nextUrl) {
      try {
        const response = await fetchFacebookApi(nextUrl, `${context} (Page ${allResults.length / initialLimit + 1})`);
        
        if (response.data) {
          allResults = allResults.concat(response.data);
        }

        // Logic from original _fetchAllPagesWithCursor
        if (response.paging?.next) {
          nextUrl = response.paging.next;
        } else if (response.paging?.cursors?.after) {
          params.after = response.paging.cursors.after;
          delete params.before;
          nextUrl = `${initialUrl}?${new URLSearchParams(params).toString()}`;
        } else {
          nextUrl = null;
        }

      } catch (e) {
        let error;
        try { error = JSON.parse(e.message); } catch (p) { throw e; } // Not a FB error

        // Adaptive fetching logic from original code
        if (error && (error.code === 1 || error.code === 2 || error.code === 4)) {
          const newLimit = Math.max(5, Math.floor(params.limit / 2));
          console.warn(`[ADAPTIVE FETCH] Overload (Code: ${error.code}). Retrying with limit=${newLimit}...`);
          params.limit = newLimit;
          delete params.after;
          success = false;
          nextUrl = null; // Break inner loop to start over
          break;
        } else {
          console.error(`Unhandled API Error (Code: ${error.code}): ${error.message}`);
          throw e;
        }
      }
    } // end while(nextUrl)

    if (success) {
      // console.log(`[ADAPTIVE FETCH] Success with limit=${params.limit}.`);
      return allResults;
    }
  } // end for(attempt)

  throw new Error(`[ADAPTIVE FETCH] Failed to get data for "${context}" after ${MAX_RETRIES} attempts.`);
}


/**
 * Fetches the list of accessible Facebook Pages for the user.
 * Replaces _getAccessiblePageMap.
 * @returns {Promise<Map<string, string>>} A Map of PageID -> PageName.
 */
export async function getAccessiblePageMap(token) {
  const url = `https://graph.facebook.com/${FACEBOOK_API_VERSION}/me/accounts?fields=id,name&limit=500&access_token=${token}`;
  try {
    const response = await fetchFacebookApi(url, "Fetch Accessible Pages");
    const pageMap = new Map();
    if (response && response.data) {
      response.data.forEach(page => {
        pageMap.set(page.id, page.name);
      });
    }
    return pageMap;
  } catch (e) {
    console.error("Cannot fetch Page list. Creative Reports may lack Page Names.", e.message);
    return new Map();
  }
}
