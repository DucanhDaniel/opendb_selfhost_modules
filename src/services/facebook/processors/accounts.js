// /src/services/facebook/processors/accounts.js
import { fetchAllPagesWithCursor } from '../api.js';
import { changeCurrency, parseFundingSource } from '../helpers.js';
import { FACEBOOK_API_VERSION } from '../constants.js';

/**
 * Processes the BM & Ad Accounts report.
 * Replaces _processBmAndAccountsReport and updateAndStoreFacebookAccounts from GAS.
 * This version reads BMs and their accounts, then returns the flat list.
 *
 * @param {object} options - The task options.
 * @param {string} accessToken - The Facebook Access Token.
 * @returns {Promise<object>} - An object { status, data, newRows }.
 */
export async function processBmAndAccountsReport(options, accessToken) {
  console.log("Starting BM & Ad Accounts Report...");

  // 1. Get all Business Managers
  const bmFields = "id,name,created_time,verification_status,profile_picture_uri";
  const bmInitialUrl = `https://graph.facebook.com/${FACEBOOK_API_VERSION}/me/businesses`;
  const bmInitialParams = { fields: bmFields, limit: 250 };

  const bmList = await fetchAllPagesWithCursor(
    bmInitialUrl,
    bmInitialParams,
    "Business Managers List",
    accessToken
  );

  if (!bmList || bmList.length === 0) {
    return { status: "SUCCESS", data: [], newRows: 0, message: "No Business Managers found." };
  }

  // 2. Define Ad Account fields and status map
  const fieldsForAdAccount = "id,name,account_status,currency,timezone_name,amount_spent,balance";
  const statusMap = {
    1: "Active",
    2: "Disabled",
    3: "Unsettled",
    101: "Archived",
  };

  const accountIds = new Set();
  const allRows = [];

  // 3. Iterate over each BM to get its accounts
  for (const bm of bmList) {
    try {
      // Fetch Owned Accounts
      const ownedInitialUrl = `https://graph.facebook.com/${FACEBOOK_API_VERSION}/${bm.id}/owned_ad_accounts`;
      const ownedInitialParams = { fields: fieldsForAdAccount, limit: 250 };
      const ownedAccounts = await fetchAllPagesWithCursor(
        ownedInitialUrl,
        ownedInitialParams,
        `Owned Accounts for ${bm.id}`,
        accessToken
      ) || [];

      // Fetch Client Accounts
      const clientInitialUrl = `https://graph.facebook.com/${FACEBOOK_API_VERSION}/${bm.id}/client_ad_accounts`;
      const clientInitialParams = { fields: fieldsForAdAccount, limit: 250 };
      const clientAccounts = await fetchAllPagesWithCursor(
        clientInitialUrl,
        clientInitialParams,
        `Client Accounts for ${bm.id}`,
        accessToken
      ) || [];
      
      // Helper to process and push accounts
      const pushAccounts = (list, type) => {
        for (const acc of list) {
          if (!acc || !acc.id || accountIds.has(acc.id)) continue;

          const row = {
            bm_id: bm.id,
            bm_name: bm.name,
            bm_created_time: bm.created_time,
            bm_verification_status: bm.verification_status,
            bm_profile_picture_uri: bm.profile_picture_uri, // No =IMAGE()
            account_type: type,
            account_id: acc.id,
            account_name: acc.name,
            account_status_text: statusMap[acc.account_status] || `Unknown (${acc.account_status})`,
            currency: acc.currency,
            timezone_name: acc.timezone_name,
            amount_spent: changeCurrency(acc.currency, acc.amount_spent),
            balance: changeCurrency(acc.currency, acc.balance),
            // funding_source_details is not fetched to reduce complexity
            current_payment_method: "", 
            tax_and_fee: "", // Placeholder, as tax info isn't fetched here
          };
          
          allRows.push(row);
          accountIds.add(acc.id);
        }
      };

      pushAccounts(ownedAccounts, "Owned");
      pushAccounts(clientAccounts, "Client");
      
      console.log(`Processed BM: ${bm.name} (${bm.id})`);
      // Sleep slightly between BMs
      await new Promise(resolve => setTimeout(resolve, 300));

    } catch (err) {
      console.error(`Failed to process BM ${bm.id} (${bm.name}): ${err.message}`);
    }
  }

  console.log(`BM & Ad Accounts finished. Total unique accounts: ${allRows.length}`);
  return { 
    status: "SUCCESS", 
    data: allRows, 
    newRows: allRows.length 
  };
}
