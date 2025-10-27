import { TIKTOK_REPORT_TEMPLATES_STRUCTURE } from './constants.js';
import logger from '../../utils/logger.js'; // Assuming you have a logger utility

/**
 * Finds the template configuration object by its name.
 * @param {string} name - The friendly name of the template.
 * @returns {object | null} The config object or null if not found.
 */
export function getTiktokTemplateConfigByName(name) {
  if (
    !TIKTOK_REPORT_TEMPLATES_STRUCTURE ||
    !Array.isArray(TIKTOK_REPORT_TEMPLATES_STRUCTURE)
  ) {
    return null;
  }
  for (const group of TIKTOK_REPORT_TEMPLATES_STRUCTURE) {
    if (group.templates && Array.isArray(group.templates)) {
      const found = group.templates.find((t) => t.name === name);
      if (found) return found.config;
    }
  }
  return null;
}

/**
 * Logs messages with consistent formatting. Replace with your logger.
 * @param {string} jobId - The Job ID.
 * @param {string} step - The step/function name.
 * @param {string} status - e.g., "Info", "Error", "API Call".
 * @param {string} details - The log message.
 */
export function logTiktok(jobId, step, status, details) {
  const message = `[TikTok Job: ${jobId}] [Step: ${step}] [${status}] :: ${details}`;
  if (status.toLowerCase().includes('error') || status.toLowerCase().includes('lỗi')) {
    console.log(message);
  } else if (status.toLowerCase().includes('warn')) {
    console.log(message);
  } else {
    console.log(message);
  }
}

/**
 * Splits an array into chunks of a specified size.
 * @param {Array} array - The array to chunk.
 * @param {number} size - The size of each chunk.
 * @returns {Array<Array>} An array of chunks.
 */
export function chunkArray(array, size) {
  const chunks = [];
  for (let i = 0; i < array.length; i += size) {
    chunks.push(array.slice(i, i + size));
  }
  return chunks;
}

/**
 * Splits a date range into monthly chunks. Uses UTC to avoid timezone issues.
 * @param {string} startDateStr - YYYY-MM-DD.
 * @param {string} endDateStr - YYYY-MM-DD.
 * @returns {Array<{start: string, end: string}>} Array of month chunks.
 */
export function splitDateRangeIntoMonths(startDateStr, endDateStr) {
  const chunks = [];
  try {
    const startDate = new Date(startDateStr + "T00:00:00Z");
    const endDate = new Date(endDateStr + "T00:00:00Z");

    if (isNaN(startDate.getTime()) || isNaN(endDate.getTime())) {
        throw new Error(`Invalid date format: ${startDateStr} or ${endDateStr}`);
    }

    let currentYear = startDate.getUTCFullYear();
    let currentMonth = startDate.getUTCMonth(); // 0-11
    const endYear = endDate.getUTCFullYear();
    const endMonth = endDate.getUTCMonth();

    while (
      currentYear < endYear ||
      (currentYear === endYear && currentMonth <= endMonth)
    ) {
      let chunkStartDate;
      if (currentYear === startDate.getUTCFullYear() && currentMonth === startDate.getUTCMonth()) {
        chunkStartDate = startDate;
      } else {
        chunkStartDate = new Date(Date.UTC(currentYear, currentMonth, 1));
      }

      let chunkEndDate;
      if (currentYear === endYear && currentMonth === endMonth) {
        chunkEndDate = endDate;
      } else {
        // Last day of current month
        chunkEndDate = new Date(Date.UTC(currentYear, currentMonth + 1, 0));
      }

      // Ensure start date is not after end date within the chunk (can happen for single-day ranges at month start/end)
       if (chunkStartDate.getTime() <= chunkEndDate.getTime()) {
           chunks.push({
               start: chunkStartDate.toISOString().slice(0, 10),
               end: chunkEndDate.toISOString().slice(0, 10),
           });
       }


      currentMonth++;
      if (currentMonth > 11) {
        currentMonth = 0;
        currentYear++;
      }
    }
  } catch(e) {
      logger.error(`Error splitting date range: ${startDateStr} - ${endDateStr}`, e);
      throw e; // Re-throw error
  }
  return chunks;
}
