import fs from 'fs';
import path from 'path';
import { writeDataToDatabase } from '../../src/db/dataWriter.js'; 
import prisma from '../../src/db/client.js'; 
import { jest } from '@jest/globals';

const TEMPLATE_NAME_TO_TEST = 'Báo cáo đơn hàng chi tiết (Full Data)';
const JSON_FILE_PATH = path.join(process.cwd(), 'output/pancake_data.json');
const MOCK_SHOP_ID = "12773123123";

describe('Integration Test: Write Data to Database', () => {
  // Tăng timeout lên 30s vì thao tác DB và đọc file lớn có thể lâu
  jest.setTimeout(30000);

  // Chạy sau khi tất cả các test trong block này hoàn thành
  afterAll(async () => {
    await prisma.$disconnect();
  });

  test('should verify JSON file existence and write to DB successfully', async () => {
    // 1. Kiểm tra File tồn tại
    const fileExists = fs.existsSync(JSON_FILE_PATH);
    if (!fileExists) {
      // Nếu file không tồn tại, ta có thể throw error để fail test ngay lập tức
      throw new Error(`❌ LỖI: Không tìm thấy file ${JSON_FILE_PATH}. Vui lòng chạy tool crawl trước.`);
    }

    // 2. Đọc và Parse dữ liệu
    const fileContent = fs.readFileSync(JSON_FILE_PATH, 'utf-8');
    const dataRows = JSON.parse(fileContent);

    // Assertion: Dữ liệu phải tồn tại và là mảng
    expect(dataRows).toBeDefined();
    expect(Array.isArray(dataRows)).toBe(true);
    
    // Nếu file rỗng, test nên fail hoặc warn
    if (dataRows.length === 0) {
      console.warn("⚠️ File JSON không có dữ liệu row nào.");
    }
    expect(dataRows.length).toBeGreaterThan(0);

    console.log(`[Jest] Đang chuẩn bị ghi ${dataRows.length} dòng vào DB...`);

    // 3. Thực hiện ghi DB
    const dbResult = await writeDataToDatabase(TEMPLATE_NAME_TO_TEST, dataRows, MOCK_SHOP_ID);

    // 4. Assertions kết quả trả về từ DB
    // Kiểm tra cờ success
    expect(dbResult).toHaveProperty('success');
    expect(dbResult.success).toBe(true);

    // Kiểm tra số lượng bản ghi (Count nên khớp hoặc lớn hơn 0)
    expect(dbResult.count).toBeGreaterThan(0);
    
    // (Optional) Kiểm tra chính xác số lượng nếu logic writeDataToDatabase trả về đúng số row input
    expect(dbResult.count).toBe(dataRows.length);

    console.log(`✅ [Jest] Ghi thành công ${dbResult.count} dòng.`);
  });
});