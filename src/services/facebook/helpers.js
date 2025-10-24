// /src/services/facebook/helpers.js
import { 
  FACEBOOK_REPORT_TEMPLATES_STRUCTURE, 
  CONVERSION_METRICS_MAP,
  CURRENCY_OFFSETS,
  FUNDING_SOURCE_TYPE_MAP
} from './constants.js';

/**
 * Finds the template configuration object by its name.
 * (Direct port from GAS _getFacebookTemplateConfigByName)
 * @param {string} name - The friendly name of the template.
 * @returns {object | null} The config object or null if not found.
 */
export function getFacebookTemplateConfigByName(name) {
  if (
    !FACEBOOK_REPORT_TEMPLATES_STRUCTURE ||
    !Array.isArray(FACEBOOK_REPORT_TEMPLATES_STRUCTURE)
  )
    return null;
  for (const group of FACEBOOK_REPORT_TEMPLATES_STRUCTURE) {
    if (group.templates && Array.isArray(group.templates)) {
      const found = group.templates.find((t) => t.name === name);
      if (found) return found.config;
    }
  }
  return null;
}

/**
 * Flattens the nested 'actions', 'action_values', etc., from the API response
 * into top-level properties with friendly names.
 * (Direct port from GAS _flattenActionMetrics)
 * @param {object} row - A single data row from the API.
 * @param {Array<string>} selectedFields - The list of friendly field names the user selected.
 * @returns {object} The flattened data row.
 */
export function flattenActionMetrics(row, selectedFields) {
  const newRow = { ...row };

  // Iterate over the CONVERSION_METRICS_MAP to find processing logic
  for (const friendlyName in CONVERSION_METRICS_MAP) {
    // Only process if the user selected this field
    if (selectedFields.includes(friendlyName)) {
      const metricInfo = CONVERSION_METRICS_MAP[friendlyName];
      const technicalName = metricInfo.api_field;
      let value = 0; // Default value

      // Logic based on the technical name defined in the map
      if (technicalName.startsWith("actions:")) {
        const actionType = technicalName.replace("actions:", "");
        const actionData = row.actions?.find(
          (a) => a.action_type === actionType
        );
        value = actionData ? parseInt(actionData.value) : 0;
      } else if (technicalName.startsWith("action_values:")) {
        const actionType = technicalName.replace("action_values:", "");
        const actionValueData = row.action_values?.find(
          (a) => a.action_type === actionType
        );
        value = actionValueData ? parseFloat(actionValueData.value) : 0;
      } else if (technicalName.startsWith("cost_per_action_type:")) {
        const actionType = technicalName.replace("cost_per_action_type:", "");
        const costData = row.cost_per_action_type?.find(
          (a) => a.action_type === actionType
        );
        value = costData ? parseFloat(costData.value) : 0;
      } else if (technicalName === "purchase_roas") {
        const roasData = row.purchase_roas?.find(
          (a) => a.action_type === "omni_purchase"
        )?.value;
        value = roasData ? parseFloat(roasData) : 0;
      }

      // Assign the calculated value to the FRIENDLY NAME key
      newRow[friendlyName] = value;
    }
  }

  // Delete the raw fields to avoid confusion
  delete newRow.actions;
  delete newRow.action_values;
  delete newRow.cost_per_action_type;
  delete newRow.purchase_roas;

  return newRow;
}

/**
 * Extracts the relative path and query from a full Facebook Graph API URL.
 * (Ported from GAS logic)
 * @param {string} fullUrl - The full URL (e.g., "https://graph.facebook.com/v24.0/...")
 * @returns {string} The relative URL (e.g., "12345/insights?limit=25&...")
 */
export function getRelativeUrl(fullUrl) {
  try {
    const url = new URL(fullUrl);
    // Return path + search, removing the leading "/" from the path
    return `${url.pathname.substring(1)}${url.search}`;
  } catch (e) {
    console.error(`Invalid URL passed to getRelativeUrl: ${fullUrl}`);
    return null;
  }
}

/**
 * Splits a date range into monthly chunks for API requests.
 * (Ported from GAS logic)
 * @param {string} startDate - e.g., "2025-01-15"
 * @param {string} endDate - e.g., "2025-03-20"
 * @returns {Array<object>} - e.g., [{start: "2025-01-15", end: "2025-01-31"}, ...]
 */
export function generateMonthlyDateChunks(startDate, endDate) {
  const chunks = [];
  let current = new Date(startDate);
  const end = new Date(endDate);

  while (current <= end) {
    const chunkStart = current.toISOString().split('T')[0];
    
    // Find the end of the current month
    let chunkEnd = new Date(current.getFullYear(), current.getMonth() + 1, 0);

    // If end of month is after the total end date, use total end date
    if (chunkEnd > end) {
      chunkEnd = end;
    }

    chunks.push({
      start: chunkStart,
      end: chunkEnd.toISOString().split('T')[0],
    });

    // Move to the first day of the next month
    current = new Date(current.getFullYear(), current.getMonth() + 1, 1);
  }
  return chunks;
}

/**
 * Adjusts currency value based on Facebook's offset.
 * (Ported from GAS)
 */
export function changeCurrency(currency, value) {
  if (!currency) return value ? value / 100 : 0;
  if (!CURRENCY_OFFSETS[currency.toUpperCase()]) return value ? value / 100 : 0;
  else return value ? value / CURRENCY_OFFSETS[currency.toUpperCase()] : 0;
}

/**
 * Parses the funding source object into a readable string.
 * (Ported from GAS)
 */
export function parseFundingSource(details) {
  if (!details) {
    return "N/A";
  }
  const typeText =
    FUNDING_SOURCE_TYPE_MAP[details.type] || `UNKNOWN_TYPE_${details.type}`;
  const displayString = details.display_string || "";
  const id = details.id || ""; 

  let finalString = typeText;
  if (id) {
    finalString += ` (ID: ${id})`;
  }
  if (displayString) {
    finalString += ` - ${displayString}`;
  }
  return finalString.trim();
}
