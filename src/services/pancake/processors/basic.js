import { fetchPoscakeApi } from '../api.js';
import { processPoscakeRow } from '../helpers.js';
import { sleep } from '../../../utils/sleep.js';
import { writeDataToDatabase } from '../../../db/dataWriter.js'; // [1] Import service ghi DB

// [2] Thêm tham số userId vào hàm
export async function processBasicReport(options, config, maps, apiKey, taskId, task_logger, userId) {
  const { shopId, startDate, endDate, selectedFields, templateName } = options;
  
  let totalRowsWritten = 0; // Chỉ đếm số lượng, không lưu data vào biến này
  const BATCH_SIZE = 5; // Số lượng page gọi song song

  // --- 1. Hàm Helper fetch và process (Giữ nguyên) ---
  const fetchAndProcessPage = async (pageNumber) => {
    const endpoint = `/shops/${shopId}${config.apiEndpoint}`;
    const queryParams = { page_number: pageNumber, page_size: 1000 };
    
    if (startDate) queryParams.startDateTime = Math.floor(new Date(startDate).getTime() / 1000);
    if (endDate) queryParams.endDateTime = Math.floor(new Date(endDate).getTime() / 1000) + 86399;

    try {
      const response = await fetchPoscakeApi(endpoint, 'get', null, queryParams, apiKey);
      
      if (!response || !response.success || !Array.isArray(response.data)) {
        return { data: [], totalPages: 0 };
      }

      const processedChunk = response.data.map(row => {
        const processedRow = processPoscakeRow(row, config, selectedFields, maps);
        processedRow.task_id = taskId; 
        return processedRow;
      });

      return { 
        data: processedChunk, 
        totalPages: response.total_pages || 1 
      };

    } catch (e) {
      task_logger.warn(`Lỗi khi lấy trang ${pageNumber}: ${e.message}`);
      return { data: [], totalPages: 0 };
    }
  };

  // --- 2. Hàm Helper để Ghi DB ---
  const writeBatchToDb = async (data) => {
      if (data.length === 0) return 0;
      const dbResult = await writeDataToDatabase(
          templateName,
          data,
          userId
      );
      return dbResult.count;
  };

  // --- 3. BẮT ĐẦU: Lấy Trang 1 (Tuần tự) ---
  task_logger.info(`Đang gọi page: 1 (Init)`);
  const page1Result = await fetchAndProcessPage(1);
  
  if (page1Result.data.length > 0) {
    // [3] Ghi ngay trang 1
    const count = await writeBatchToDb(page1Result.data);
    totalRowsWritten += count;
    task_logger.info(`Đã ghi trang 1: ${count} dòng.`);
  } else {
    return { status: "SUCCESS", data: [], newRows: 0 };
  }

  const totalPages = page1Result.totalPages;
  
  // --- 4. Xử lý các trang còn lại (Song song + Ghi cuốn chiếu) ---
  if (totalPages > 1) {
    const remainingPages = [];
    for (let i = 2; i <= totalPages; i++) remainingPages.push(i);

    for (let i = 0; i < remainingPages.length; i += BATCH_SIZE) {
      const batchPages = remainingPages.slice(i, i + BATCH_SIZE);
      
      task_logger.info(`Đang gọi batch pages: ${batchPages.join(', ')}`);

      // Chạy song song 5 trang
      const batchResults = await Promise.all(batchPages.map(page => fetchAndProcessPage(page)));

      // Gom dữ liệu của 5 trang lại
      const batchDataToWrite = batchResults.flatMap(res => res.data);

      // Ghi ngay lập tức vào DB
      if (batchDataToWrite.length > 0) {
          const count = await writeBatchToDb(batchDataToWrite);
          totalRowsWritten += count;
          task_logger.info(`Đã ghi batch (${batchPages[0]}-${batchPages[batchPages.length-1]}): ${count} dòng.`);
      }

      // Sau khi ghi xong, batchDataToWrite sẽ được giải phóng khỏi RAM
      await sleep(300); 
    }
  }

  // 5. Trả về kết quả rỗng (vì đã ghi hết rồi)
  return { 
    status: "SUCCESS", 
    data: [], // Trả về mảng rỗng để Worker không ghi lại
    newRows: totalRowsWritten 
  };
}