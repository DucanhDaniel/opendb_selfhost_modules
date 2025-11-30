import { fetchAllTiktokPages, fetchTiktokApi } from '../api.js';

// Helper to format timestamp (e.g., for create_time)
function formatTimestamp(unixTimestamp) {
    if (!unixTimestamp) return null;
    try {
        // Return Date object; sanitization before DB write handles ISO conversion
        const date = new Date(unixTimestamp * 1000);
        return isNaN(date.getTime()) ? null : date;
    } catch(e) {
        return null;
    }
}

/**
 * Processes the "BCs Info" report.
 * @param {object} params - Task parameters (selectedFields).
 * @param {object} templateConfig - Config for the template.
 * @param {string} accessToken - TikTok Access Token.
 * @param {string} jobId - Job ID for logging.
 * @returns {Promise<object>} - { status, data, newRows, message? }.
 */
export async function processBcaBcInfo(params, templateConfig, accessToken, jobId, task_logger) {
    const functionName = 'processBcaBcInfo';
    task_logger.info('Starting BC Info report...');
    const { selectedFields } = params;

    // Determine metrics to fetch (use defaults if none selected, focusing on essentials)
    const allAvailableMetrics = Object.values(templateConfig.selectable_metrics || {}).flat();
    let apiMetrics = selectedFields.filter(field => allAvailableMetrics.includes(field));
    if (apiMetrics.length === 0) {
        apiMetrics = ["bc_id", "bc_name"]; // Sensible defaults
        task_logger.warn('No metrics selected, using defaults: bc_id, bc_name.');
    }

    const apiParams = { page_size: 50 }; // API uses page/page_size

    try {
        const dataFromApi = await fetchAllTiktokPages(
            templateConfig.api_endpoint,
            apiParams,
            accessToken,
            jobId,
            functionName
        );

        if (dataFromApi.length === 0 || dataFromApi[0]?._errorType) {
            const message = dataFromApi[0]?._errorType ? dataFromApi[0].message : "No BC data found.";
            task_logger.info(message);
            return { status: "SUCCESS", data: [], newRows: 0, message };
        }

        // Flatten the structure (bc_info, permissions, etc.)
        const dataToWrite = dataFromApi.map(item => {
            const flatItem = {
                ...(item.bc_info || {}),
                ...(item.permissions || {}),
                 user_role: item.user_role
            };
             // Rename 'name' to 'bc_name' if needed
             if (flatItem.name && !flatItem.bc_name) flatItem.bc_name = flatItem.name;
             // delete flatItem.name; // Keep original name if it's also a selected field

             // Map finance role
             if (item.ext_user_role?.finance_role) {
                flatItem.finance_role = item.ext_user_role.finance_role;
             }

            // Select only the fields the user requested + ensure defaults if needed
             const finalRow = {};
             // Use apiMetrics if selectedFields was empty initially
             const fieldsToInclude = selectedFields.length > 0 ? selectedFields : apiMetrics;
             fieldsToInclude.forEach(field => {
                 finalRow[field] = flatItem.hasOwnProperty(field) ? flatItem[field] : null;
             });
            return finalRow;
        });

        task_logger.info(`Processed ${dataToWrite.length} BCs.`);
        return { status: "SUCCESS", data: dataToWrite, newRows: dataToWrite.length };

    } catch (e) {
        task_logger.error(`Failed: ${e.message}`);
        throw e;
    }
}

/**
 * Processes the "BC & Accounts Info" report. Fetches info for each account.
 */
export async function processBcaAccountInfo(params, templateConfig, accessToken, jobId, task_logger) {
    const functionName = 'processBcaAccountInfo';
    task_logger.info('Starting BC & Accounts Info report...');
    const { selectedFields, accountsToProcess } = params; // accountsToProcess contains { id, name }

    const idsToProcess = accountsToProcess?.map(a => a.id);
    if (!idsToProcess || idsToProcess.length === 0) {
        task_logger.info('No Ad Accounts selected.');
        return { status: "SUCCESS", data: [], newRows: 0, message: "No Ad Accounts selected." };
    }

    // Determine fields to fetch (API uses 'fields' param here, not 'metrics')
    const allAvailableFields = Object.values(templateConfig.selectable_metrics || {}).flat();
    let apiFields = selectedFields.filter(field => allAvailableFields.includes(field));
     if (apiFields.length === 0) {
        apiFields = ["advertiser_id", "name"]; // Sensible defaults
        task_logger.warn('No fields selected, using defaults: advertiser_id, name.');
    }
     // Always include advertiser_id for mapping results back
    if (!apiFields.includes('advertiser_id')) {
        apiFields.push('advertiser_id');
    }


    const dataToWrite = [];
    const totalAccounts = idsToProcess.length;

    for (let i = 0; i < totalAccounts; i++) {
        const currentAdvId = idsToProcess[i];
        task_logger.info(`Fetching info for account ${i+1}/${totalAccounts} (${currentAdvId})...`);

        const apiParams = {
            advertiser_ids: JSON.stringify([currentAdvId]),
            fields: JSON.stringify(apiFields) // Use 'fields' parameter
        };
        const url = `${templateConfig.api_endpoint}?${new URLSearchParams(apiParams).toString()}`;

        try {
            // Use single fetch
            const data = await fetchTiktokApi(url, accessToken, jobId, `AccountInfo-${currentAdvId}`);

            if (data._errorType) {
                 dataToWrite.push({ advertiser_id: currentAdvId, name: `Error: ${data.message}` });
            } else if (data.list && data.list.length > 0) {
                const accountInfo = data.list[0];
                accountInfo.create_time = formatTimestamp(accountInfo.create_time);

                // Select only the requested fields for the final output
                const finalRow = {};
                 // Use selectedFields if available, otherwise the defaults (apiFields)
                const fieldsToInclude = selectedFields.length > 0 ? selectedFields : apiFields;
                fieldsToInclude.forEach(field => {
                    finalRow[field] = accountInfo.hasOwnProperty(field) ? accountInfo[field] : null;
                });
                dataToWrite.push(finalRow);

            } else {
                 task_logger.warn(`No data returned for account ${currentAdvId}`);
                 // Add a row indicating no data, or skip? Add placeholder for now.
                 const placeholderRow = { advertiser_id: currentAdvId, name: 'No data returned' };
                 selectedFields.forEach(f => { if (!placeholderRow.hasOwnProperty(f)) placeholderRow[f] = null; });
                 dataToWrite.push(placeholderRow);
            }
        } catch (e) {
             task_logger.error(`Failed account ${currentAdvId}: ${e.message}`);
             // Add a row indicating the error
             const errorRow = { advertiser_id: currentAdvId, name: `Error: ${e.message}` };
             selectedFields.forEach(f => { if (!errorRow.hasOwnProperty(f)) errorRow[f] = null; });
             dataToWrite.push(errorRow);
        }
        await new Promise(resolve => setTimeout(resolve, 500)); // Delay
    }

    task_logger.info(`Processed ${dataToWrite.length} accounts.`);
    return { status: "SUCCESS", data: dataToWrite, newRows: dataToWrite.length };
}


/**
 * Processes the "BC Assets Info" report.
 */
export async function processBcaAssetInfo(params, templateConfig, accessToken, jobId, task_logger) {
    const functionName = 'processBcaAssetInfo';
    task_logger.info('Starting BC Assets Info report...');
    const { selectedFields, accountsToProcess, assetTypes } = params; // accountsToProcess are BCs

    const bcIdsToProcess = accountsToProcess?.map(a => a.id);
    if (!bcIdsToProcess || bcIdsToProcess.length === 0) {
        return { status: "SUCCESS", data: [], newRows: 0, message: "No Business Centers selected." };
    }
    if (!assetTypes || assetTypes.length === 0) {
        return { status: "SUCCESS", data: [], newRows: 0, message: "No Asset Types selected." };
    }

    let allData = [];
    const totalCalls = bcIdsToProcess.length * assetTypes.length;
    let callCounter = 0;

    for (const bcId of bcIdsToProcess) {
        for (const assetType of assetTypes) {
            callCounter++;
            task_logger.info(`Call ${callCounter}/${totalCalls}: BC ${bcId}, Asset ${assetType}...`);

            const apiParams = { bc_id: bcId, asset_type: assetType, page_size: 50 };

            try {
                const dataFromApi = await fetchAllTiktokPages(
                    templateConfig.api_endpoint,
                    apiParams,
                    accessToken,
                    jobId,
                    `AssetInfo-${bcId}-${assetType}`
                );

                 if (dataFromApi.length === 0 || dataFromApi[0]?._errorType) {
                    const message = dataFromApi[0]?._errorType ? dataFromApi[0].message : `No ${assetType} assets found for BC ${bcId}.`;
                    task_logger.info(message);
                    continue; // Skip
                 }

                // Add context and select fields
                const processedData = dataFromApi.map(item => {
                    const row = { ...item, bc_id: bcId, // Add bc_id from the loop context
                                asset_type: assetType // Add asset_type from loop context
                             };
                     const finalRow = {};
                     selectedFields.forEach(field => {
                         finalRow[field] = row.hasOwnProperty(field) ? row[field] : null;
                     });
                     return finalRow;
                });
                allData.push(...processedData);

            } catch (e) {
                task_logger.error(`Failed BC ${bcId}, Asset ${assetType}: ${e.message}`);
                 // Add error placeholder row if needed
                 // const errorRow = { bc_id: bcId, asset_type: assetType, asset_name: `Error: ${e.message}` };
                 // selectedFields.forEach(f => { if (!errorRow.hasOwnProperty(f)) errorRow[f] = null; });
                 // allData.push(errorRow);
            }
             await new Promise(resolve => setTimeout(resolve, 500)); // Delay
        }
    }

    task_logger.info(`Processed ${allData.length} assets.`);
    return { status: "SUCCESS", data: allData, newRows: allData.length };
}
