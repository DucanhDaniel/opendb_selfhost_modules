import { fetchPoscakeApi } from '../api.js';
import { processPoscakeRow } from '../helpers.js';
import { sleep } from '../../../utils/sleep.js';

export async function processBasicReport(options, config, maps, apiKey, taskId, task_logger) {
  const {shopId, startDate, endDate, selectedFields } = options;
  
  // 1. Mảng chứa toàn bộ dữ liệu (Accumulator)
  let allProcessedData = []; 
  let currentPage = 1;

  do {
    const endpoint = `/shops/${shopId}${config.apiEndpoint}`;
    const queryParams = { page_number: currentPage, page_size: 1000 };
    
    if (startDate) queryParams.startDateTime = Math.floor(new Date(startDate).getTime() / 1000);
    if (endDate) queryParams.endDateTime = Math.floor(new Date(endDate).getTime() / 1000) + 86399;

    console.log("StartDate: ", queryParams.startDateTime);
    console.log("end date: ", queryParams.endDateTime);
    console.log("queryParams: ", queryParams);
    console.log("endpoint: ", endpoint);

    const response = await fetchPoscakeApi(endpoint, 'get', null, queryParams, apiKey);

    // Điều kiện dừng vòng lặp
    if (!response || !response.success || !Array.isArray(response.data) || response.data.length === 0) break;

    const processedDataChunk = response.data.map(row => {
      // 1. Xử lý dữ liệu thô
      const processedRow = processPoscakeRow(row, config, selectedFields, maps);
      
      // 2. Gán taskId vào (key phải khớp với tên cột trong DB, thường là 'task_id')
      processedRow.task_id = taskId; 
      
      return processedRow;
    });

    allProcessedData.push(...processedDataChunk);

    // Logic phân trang
    const totalPages = response.total_pages;
    if (totalPages && currentPage >= totalPages) break;
    if (!totalPages && response.data.length < 100) break;
    task_logger.info("Đang gọi page: ", currentPage);
    currentPage++;
    await sleep(300);
  } while (true);

  return { 
    status: "SUCCESS", 
    data: allProcessedData, 
    newRows: allProcessedData.length 
  };
}