import { fetchPoscakeApi } from '../api.js';
import { processPoscakeRow } from '../helpers.js';
import { sleep } from '../../../utils/sleep.js';
import { writeDataToDatabase } from '../../../db/dataWriter.js';

export async function processFlattenedReport(options, config, maps, apiKey, taskId, task_logger, userId) {
  const { shopId, startDate, endDate, selectedFields, templateName } = options;
  const { levelKey, flattenKey } = config;

  let totalRowsWritten = 0;
  const BATCH_SIZE = 5; // Số lượng trang gọi song song

  // --- 1. Hàm Helper: Tải và Làm phẳng 1 trang ---
  const fetchAndFlattenPage = async (pageNumber) => {
    const endpoint = `/shops/${shopId}${config.apiEndpoint}`;
    const queryParams = { page_number: pageNumber, page_size: 1000 }; 
    
    if (startDate) queryParams.startDateTime = Math.floor(new Date(startDate).getTime() / 1000);
    if (endDate) queryParams.endDateTime = Math.floor(new Date(endDate).getTime() / 1000) + 86399;

    try {
      const response = await fetchPoscakeApi(endpoint, 'get', null, queryParams, apiKey);

      if (!response || !response.success || !Array.isArray(response.data)) {
        return { data: [], totalPages: 0 };
      }

      const flattenedChunk = [];
      response.data.forEach((parentRow) => {
        const subArray = parentRow[flattenKey];

        if (subArray && Array.isArray(subArray) && subArray.length > 0) {
          subArray.forEach((childItem, index) => {
            const flatRow = { ...parentRow };
            delete flatRow[flattenKey];
            flatRow[levelKey] = childItem;
            
            const processed = processPoscakeRow(flatRow, config, selectedFields, maps, index + 1);
            processed.task_id = taskId;
            processed.user_id = userId;
            flattenedChunk.push(processed);
          });
        } else {
          const flatRow = { ...parentRow };
          delete flatRow[flattenKey];
          flatRow[levelKey] = {};
          
          const processed = processPoscakeRow(flatRow, config, selectedFields, maps, 1);
          processed.task_id = taskId;
          processed.user_id = userId;
          flattenedChunk.push(processed);
        }
      });

      return { 
        data: flattenedChunk, 
        totalPages: response.total_pages || 1 
      };

    } catch (e) {
      task_logger.warn(`Lỗi khi lấy trang ${pageNumber}: ${e.message}`);
      return { data: [], totalPages: 0 };
    }
  };

  const writeBatchToDb = async (data) => {
      if (data.length === 0) return 0;
      const dbResult = await writeDataToDatabase(
          templateName,
          data,
          userId
      );
      return dbResult.count;
  };

  task_logger.info(`[Flattened] Đang gọi page: 1 (Init)`);
  const page1Result = await fetchAndFlattenPage(1);
  
  if (page1Result.data.length > 0) {
    const count = await writeBatchToDb(page1Result.data);
    totalRowsWritten += count;
    task_logger.info(`Đã ghi trang 1: ${count} dòng.`);
  } else {
    return { status: "SUCCESS", data: [], newRows: 0 };
  }

  const totalPages = page1Result.totalPages;

  // --- 4. Vòng lặp Song Song (Batch Processing) ---
  if (totalPages > 1) {
    const remainingPages = [];
    for (let i = 2; i <= totalPages; i++) remainingPages.push(i);

    for (let i = 0; i < remainingPages.length; i += BATCH_SIZE) {
      const batchPages = remainingPages.slice(i, i + BATCH_SIZE);
      
      task_logger.info(`Đang gọi batch pages: ${batchPages.join(', ')}`);

      // Gọi song song
      const batchResults = await Promise.all(batchPages.map(page => fetchAndFlattenPage(page)));

      // Gom dữ liệu
      const batchDataToWrite = batchResults.flatMap(res => res.data);

      // Ghi DB
      if (batchDataToWrite.length > 0) {
          const count = await writeBatchToDb(batchDataToWrite);
          totalRowsWritten += count;
          task_logger.info(`Đã ghi batch (${batchPages[0]}-${batchPages[batchPages.length-1]}): ${count} dòng.`);
      }

      await sleep(300);
    }
  }

  return { 
    status: "SUCCESS", 
    data: [], 
    newRows: totalRowsWritten 
  };
}