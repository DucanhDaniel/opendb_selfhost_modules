import { fetchPoscakeApi } from '../api.js';
import { processPoscakeRow } from '../helpers.js';
import { sleep } from '../../../utils/sleep.js';
import { writeDataToDatabase } from '../../../db/dataWriter.js';

export async function processFlattenedReport(options, config, maps, apiKey, taskId, task_logger, userId) {
  const { shopId, startDate, endDate, selectedFields, templateName } = options;
  const { levelKey, flattenKey } = config;

  let totalRowsWritten = 0;
  let currentPage = 1;
  const MAX_PAGES_SAFETY = 2000;

  task_logger.info(`[Flattened] Bắt đầu xử lý ${templateName} (Shop: ${shopId})...`);

  do {
    // 1. Kiểm tra an toàn
    if (currentPage > MAX_PAGES_SAFETY) {
      task_logger.warn(`[Stop] Đạt giới hạn an toàn ${MAX_PAGES_SAFETY} trang.`);
      break;
    }

    const endpoint = `/shops/${shopId}${config.apiEndpoint}`;
    const queryParams = { page_number: currentPage, page_size: 50 }; // Flattened nên lấy ít hơn (50) vì data sẽ nhân lên
    
    if (startDate) queryParams.startDateTime = Math.floor(new Date(startDate).getTime() / 1000);
    if (endDate) queryParams.endDateTime = Math.floor(new Date(endDate).getTime() / 1000) + 86399;

    // 2. Gọi API
    const response = await fetchPoscakeApi(endpoint, 'get', null, queryParams, apiKey);

    if (!response || !response.success || !Array.isArray(response.data) || response.data.length === 0) {
        break;
    }

    // 3. Logic Làm Phẳng (Flattening Logic)
    const flattenedRowsChunk = [];
    
    response.data.forEach((parentRow) => {
      const subArray = parentRow[flattenKey]; // Ví dụ: parentRow['items']

      if (subArray && Array.isArray(subArray) && subArray.length > 0) {
        // Trường hợp 1: Có mảng con -> Tách thành nhiều dòng
        subArray.forEach((childItem, index) => {
          const flatRow = { ...parentRow };
          delete flatRow[flattenKey];     // Xóa mảng gốc để tiết kiệm bộ nhớ
          flatRow[levelKey] = childItem;  // Gán item con vào levelKey (ví dụ: 'item')
          
          // Xử lý row
          const processed = processPoscakeRow(flatRow, config, selectedFields, maps, index + 1);
          processed.task_id = taskId;     // Gán taskId
          processed.user_id = userId;     // Gán userId
          
          flattenedRowsChunk.push(processed);
        });
      } else {
        // Trường hợp 2: Mảng con rỗng -> Giữ 1 dòng cha (item con rỗng)
        const flatRow = { ...parentRow };
        delete flatRow[flattenKey];
        flatRow[levelKey] = {};

        const processed = processPoscakeRow(flatRow, config, selectedFields, maps, 1);
        processed.task_id = taskId;
        processed.user_id = userId;
        
        flattenedRowsChunk.push(processed);
      }
    });

    // 4. Ghi ngay vào Database
    if (flattenedRowsChunk.length > 0) {
      const dbResult = await writeDataToDatabase(
        templateName,
        flattenedRowsChunk,
        userId
      );
      totalRowsWritten += dbResult.count;
    }

    // 5. Báo cáo tiến độ
    const totalPages = response.total_pages;
    if (currentPage % 5 === 0 || currentPage === 1) {
        task_logger.info(`Page ${currentPage}/${totalPages || '?'}. Processed: ${flattenedRowsChunk.length} rows. Total Written: ${totalRowsWritten}`);
    }

    // 6. Logic Phân trang
    if (totalPages && currentPage >= totalPages) break;
    if (!totalPages && response.data.length < queryParams.page_size) break;

    currentPage++;
    await sleep(300);
  } while (true);

  return { 
    status: "SUCCESS", 
    data: [], // Trả về rỗng để Worker không ghi lại
    newRows: totalRowsWritten 
  };
}