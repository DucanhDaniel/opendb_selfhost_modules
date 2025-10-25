// /src/services/facebook/processors/billing.js
import { fetchAllPagesWithCursor } from '../api.js';
import { FACEBOOK_API_VERSION, CURRENCY_OFFSETS } from '../constants.js';
import prisma from '../../../db/client.js'; // Import Prisma client to get account info

/**
 * Fetches billing activities for a single account.
 * (Internal helper, adapted from _fetchBillingForAccount)
 */
async function fetchBillingForAccount(account, startDate, endDate, accessToken) {
  const fetchSince = Math.floor(new Date(startDate).getTime() / 1000);
  const fetchUntil = Math.floor(new Date(endDate).getTime() / 1000);
  const allRowsToAdd = [];

  const initialUrl = `https://graph.facebook.com/${FACEBOOK_API_VERSION}/${account.id}/activities`;
  const initialParams = {
    fields: "event_type,extra_data,date_time_in_timezone",
    since: fetchSince,
    until: fetchUntil,
    limit: 750, // Reduced limit for safety
  };

  const activities = await fetchAllPagesWithCursor(
    initialUrl,
    initialParams,
    `Activities for ${account.id}`,
    accessToken
  );

  const billingActivities = activities.filter((act) =>
    act.event_type?.toLowerCase().includes("billing")
  ) || [];

  for (const activity of billingActivities) {
    let parsedExtraData = {};
    try {
      parsedExtraData = JSON.parse(activity.extra_data);
      // Process currency value
      if (parsedExtraData.new_value !== undefined) {
        const currency = parsedExtraData.currency || "";
        let value = parseFloat(parsedExtraData.new_value);
        if (
          typeof value === "number" &&
          currency &&
          !CURRENCY_OFFSETS[currency.toUpperCase()] === 1 // Check if offset is NOT 1
        ) {
          // Default to 100 offset if not 1 (simplifies original logic)
          value /= 100;
        }
        parsedExtraData.new_value = value;
      }
    } catch (e) {}

    allRowsToAdd.push({
      account_id: account.id,
      account_name: account.name,
      event_type: activity.event_type,
      // Keep raw string, sanitizing is dataWriter's job
      date_time_in_timezone: activity.date_time_in_timezone, 
      fetch_timestamp: new Date(),
      extra_data_parsed: parsedExtraData,
    });
  }
  return allRowsToAdd;
}


/**
 * Processes the FB Billing Data report.
 * Replaces _processBillingReport from GAS.
 * This version reads account info (BM ID, Tax) from the database instead of a sheet.
 *
 * @param {object} options - The task options.
 * @param {string} accessToken - The Facebook Access Token.
 * @returns {Promise<object>} - An object { status, data, newRows }.
 */
export async function processBillingReport(options, accessToken) {
  const { accountsToProcess, startDate, endDate } = options;
  console.log("Starting FB Billing Report...");

  // --- 1. Get Account Info (BM ID, Tax) from Database ---
  const accountInfoMap = new Map();
  try {
    const accountsData = await prisma.fAD_BmAndAdAccounts.findMany({
      select: {
        account_id: true,
        bm_id: true,
        tax_and_fee: true, // Assumes this is a Float in your schema
      }
    });
    
    accountsData.forEach(acc => {
      accountInfoMap.set(acc.account_id, {
        bmId: acc.bm_id,
        taxFee: acc.tax_and_fee || 0,
      });
    });
    console.log(`Loaded info for ${accountInfoMap.size} accounts from DB.`);
  } catch (e) {
    console.error("Failed to load account info from DB for Billing report.", e.message);
    // Continue without BM IDs and Tax info
  }

  // --- 2. Fetch Billing Data for all accounts ---
  let allRawRows = [];
  for (const account of accountsToProcess) {
    const accountRows = await fetchBillingForAccount(account, startDate, endDate, accessToken);
    allRawRows = allRawRows.concat(accountRows);
    await new Promise(resolve => setTimeout(resolve, 300)); // Sleep
  }

  if (allRawRows.length === 0) {
    return { status: "SUCCESS", data: [], newRows: 0, message: "No billing activities found." };
  }

  // --- 3. Process and Enrich Data ---
  const processedData = allRawRows.map((row) => {
    const accountInfo = accountInfoMap.get(row.account_id) || { taxFee: 0, bmId: "" };
    const taxFeePercent = accountInfo.taxFee;
    
    const parsedData = row.extra_data_parsed;
    const valueRaw = parsedData.new_value;
    const value = typeof valueRaw === "number" ? valueRaw : null;
    const totalValue =
      value !== null ? value * (1 + taxFeePercent / 100) : null;

    const transactionId = parsedData.transaction_id || "";
    const cleanAccountId = row.account_id.replace("act_", "");
    
    // Create links
    const billingHubLink =
      transactionId && accountInfo.bmId
        ? `https://business.facebook.com/billing_hub/payment_activity/transaction_details?asset_id=${cleanAccountId}&business_id=${accountInfo.bmId}&payment_account_id=${cleanAccountId}&transaction_id=${transactionId}`
        : "";
    const downloadInvoiceLink = transactionId
      ? `https://business.facebook.com/ads/manage/billing_transaction/?act=${cleanAccountId}&pdf=true&source=billing_summary&tx_type=3&txid=${transactionId}`
      : "";

    // Return flat object with "Friendly Names"
    // This matches the KEY_MAP in dataWriter.js
    return {
      "Account ID": row.account_id,
      "Account Name": row.account_name,
      "Event Type": row.event_type,
      "Date Time In Timezone": row.date_time_in_timezone,
      "Fetch Timestamp": row.fetch_timestamp,
      "Currency": parsedData.currency || "",
      "Value": value,
      "Transaction ID": transactionId,
      "Action": parsedData.action || "",
      "Type": parsedData.type || "",
      "Tax & Fee %": taxFeePercent, // dataWriter will handle this
      "Total Value": totalValue,
      "Billing Hub Link": billingHubLink,
      "Download Invoice Link": downloadInvoiceLink,
    };
  });

  console.log(`Billing Report finished. Total rows: ${processedData.length}`);
  return { 
    status: "SUCCESS", 
    data: processedData, 
    newRows: processedData.length 
  };
}
