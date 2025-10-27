import fs from 'fs';
import path from 'path';
import { writeDataToDatabase } from '../../src/db/dataWriter.js'; // Import hàm ghi DB
import prisma from '../../src/db/client.js'; // Import client để đóng kết nối

/**
 * File này dùng để test riêng biệt hàm writeDataToDatabase.
 * Nó đọc dữ liệu từ file 'debug_data.json' (được tạo bởi runFacebookTest_modified.js)
 * và cố gắng ghi vào CSDL.
 *
 * CÁCH DÙNG: node test_db_write.js
 */

// [QUAN TRỌNG] Đảm bảo biến này khớp với templateName đã tạo ra file JSON
const TEMPLATE_NAME_TO_TEST = 'Campaign Daily Report';
const JSON_FILE_PATH = path.join(process.cwd(), 'debug_data.json');

async function runDbTest() {
  console.log(`[DB Write Test] Bắt đầu test ghi dữ liệu cho template: "${TEMPLATE_NAME_TO_TEST}"`);
  console.log(`[DB Write Test] Đang đọc dữ liệu từ: ${JSON_FILE_PATH}`);

  let dataRows;

  // 1. Đọc và parse file JSON
  try {
    if (!fs.existsSync(JSON_FILE_PATH)) {
      console.error(`❌ LỖI: Không tìm thấy file ${JSON_FILE_PATH}.`);
      console.error("Vui lòng chạy file 'runFacebookTest_modified.js' trước để tạo file này.");
      return;
    }
    const fileContent = fs.readFileSync(JSON_FILE_PATH, 'utf-8');
    dataRows = JSON.parse(fileContent);
    if (!dataRows || dataRows.length === 0) {
      console.log("File 'debug_data.json' không có dữ liệu. Dừng test.");
      return;
    }
    console.log(`[DB Write Test] Đã đọc thành công ${dataRows.length} dòng từ file JSON.`);
  } catch (e) {
    console.error(`❌ LỖI khi đọc hoặc parse file JSON: ${e.message}`);
    return;
  }

  // 2. Chạy hàm ghi CSDL
  try {
    console.log("[DB Write Test] Đang gọi writeDataToDatabase...");
    const dbResult = await writeDataToDatabase(TEMPLATE_NAME_TO_TEST, dataRows);

    if (!dbResult.success) {
      throw new Error(`Lỗi khi ghi vào DB: ${dbResult.error || 'Unknown DB error'}`);
    }

    console.log(`[DB Write Test] writeDataToDatabase hoàn thành. Ghi thành công ${dbResult.count} dòng.`);
    console.log("✅ TEST GHI DB THÀNH CÔNG!");

  } catch (error) {
    console.error("❌ TEST GHI DB GẶP LỖI!");
    console.error(`   Lỗi: ${error.message}`);
    // In stack trace đầy đủ hơn cho lỗi DB
    console.error(error);
  } finally {
    // Đảm bảo đóng kết nối Prisma
    await prisma.$disconnect();
    console.log("[DB Write Test] Đã đóng kết nối database.");
  }
}

// 3. Chạy test
runDbTest();
