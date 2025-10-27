import axios from 'axios';
import NodeCache from 'node-cache'; // Use a simple in-memory cache
import { PROVINCE_MAP_GIST_URL } from './constants.js';
import logger from '../../utils/logger.js';

// Cache for 6 hours (21600 seconds)
const provinceCache = new NodeCache({ stdTTL: 21600 });
const CACHE_KEY = "tiktok_province_map";

/**
 * Fetches and caches the TikTok province ID to name mapping from a Gist.
 * Replaces _getProvinceNameMap from GAS.
 * @returns {Promise<Map<string, string>>} A Map of ProvinceID -> ProvinceName.
 */
export async function getProvinceNameMap() {
  const cachedMapData = provinceCache.get(CACHE_KEY);
  if (cachedMapData) {
    logger.info("Using cached TikTok province map.");
    // Reconstruct Map from cached array
    return new Map(cachedMapData);
  }

  logger.info("Fetching fresh TikTok province map from Gist...");
  try {
    const response = await axios.get(PROVINCE_MAP_GIST_URL);
    const jsonData = response.data; // Axios automatically parses JSON

    const provinceMap = new Map();
    // Assuming the Gist structure is { "key": [ { id, name }, ... ] }
    for (const key in jsonData) {
      if (Array.isArray(jsonData[key])) {
        jsonData[key].forEach((location) => {
          if (location.id && location.name) {
            provinceMap.set(String(location.id), location.name);
          }
        });
      }
    }

    if (provinceMap.size > 0) {
      // Store as an array for caching
      provinceCache.set(CACHE_KEY, Array.from(provinceMap.entries()));
      logger.info(`Successfully fetched and cached ${provinceMap.size} TikTok provinces.`);
    } else {
      logger.warn("Fetched province map, but it was empty or in unexpected format.");
    }
    return provinceMap;

  } catch (error) {
    logger.error("Failed to fetch or parse TikTok province map Gist:", error.message);
    return new Map(); // Return empty map on error
  }
}
