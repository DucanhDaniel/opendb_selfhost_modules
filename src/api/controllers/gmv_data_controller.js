import fs from 'fs/promises';
import path from 'path';
import logger from '../../utils/logger.js';
// import * as dataWriter from '../../db/dataWriter.js'; // BƯỚC TIẾP THEO

/**
 * Xử lý việc nhận dữ liệu JSON.
 * Tạm thời: Ghi ra file sample_data.json.
 * Tương lai: Gọi dataWriter.js để ghi vào DB.
 */
export const handleSubmitData = async (req, res, next) => {
  try {
    const { task_id, source, report_type, data } = req.body;
    
    logger.info(`Nhận ${data.length} dòng dữ liệu cho task ${task_id} (Source: ${source}, Type: ${report_type})`);

    // --- Logic tạm thời: Ghi ra file theo yêu cầu ---
    const filePath = path.resolve(process.cwd(), 'sample_data.json');
    const content = JSON.stringify(req.body, null, 2);
    await fs.writeFile(filePath, content);
    logger.info(`Đã ghi dữ liệu vào ${filePath}`);
    // --- Kết thúc logic tạm thời ---

    /*
    // --- BƯỚC TIẾP THEO (Logic chuẩn): ---
    // Bạn sẽ gọi module dataWriter của mình ở đây
    const result = await dataWriter.writeData({
      source,
      reportType: report_type,
      data,
      //... các thông tin khác
    });
    // return res.status(201).json({ success: true, message: 'Data saved to DB', result });
    */

    res.status(200).json({ success: true, message: `Data written to sample_data.json` });

  } catch (error) {
    logger.error(`Lỗi khi xử lý data cho task ${req.body.task_id}:`, error);
    next(error);
  }
};