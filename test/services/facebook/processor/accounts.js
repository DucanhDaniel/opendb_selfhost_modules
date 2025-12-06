import dotenv from 'dotenv';
import fs from 'fs'; 
import path from 'path'; 
import { processFacebookJob } from '../../../../src/services/facebook/index.js';
import { writeDataToDatabase } from '../../../../src/db/dataWriter.js';
import prisma from '../../../../src/db/client.js';

dotenv.config();

let accessToken;
try {
  accessToken = process.env.FACEBOOK_ACCESS_TOKEN;
  if (!accessToken) {
    throw new Error('FACEBOOK_ACCESS_TOKEN is missing or malformed in .env');
  }
  console.log("Đã tải Access Token thành công.");
} catch (e) {
  console.error("Lỗi khi tải Access Token từ .env:", e.message);
  process.exit(1);
}

const mockTaskLogger = {
    info: (msg) => console.log(`[INFO] ${msg}`),
    warn: (msg) => console.warn(`[WARN] ${msg}`),
    error: (msg) => console.error(`[ERROR] ${msg}`),
};

const sampleTaskParams = {
  templateName: 'BM & Ad Accounts',
  selectedFields: [
 'bm_id',
 'bm_name',
 'bm_created_time',
 'bm_verification_status',
 'bm_profile_picture_uri',
 'account_type',
 'account_id',
 'account_name',
 'account_status_text',
 'currency',
 'timezone_name',
 'amount_spent',
 'balance',
 'current_payment_method',
 'tax_and_fee'
]
};

// --- [BƯỚC 4] ---
async function runTest() {
  console.log(`Bắt đầu chạy test cho template: "${sampleTaskParams.templateName}"`);
  try {
    // 1. Gọi hàm xử lý Facebook
    console.log("Đang gọi processFacebookJob...");
    const processorResult = await processFacebookJob(sampleTaskParams, accessToken, "Test user id", mockTaskLogger);

    if (processorResult.status !== "SUCCESS") {
      throw new Error(`Lỗi từ Facebook Processor: ${processorResult.message || 'Unknown error'}`);
    }

    console.log(`Facebook Processor hoàn thành. Nhận được ${processorResult.newRows} dòng dữ liệu.`);

    // --- [MỚI] BƯỚC 1.5: Lưu dữ liệu thô ra file JSON ---
    if (processorResult.data && processorResult.data.length > 0) {
      const jsonFilePath = path.join(process.cwd(), 'debug_data.json');
      try {
        fs.writeFileSync(jsonFilePath, JSON.stringify(processorResult.data, null, 2));
        console.log(`✅ Đã lưu ${processorResult.data.length} dòng dữ liệu vào file: ${jsonFilePath}`);
      } catch (fsError) {
        console.warn(`CẢNH BÁO: Không lưu được file JSON debug: ${fsError.message}`);
      }
    }
    // --- HẾT PHẦN MỚI ---

    // 2. Gọi hàm ghi dữ liệu vào Database
    if (processorResult.data && processorResult.data.length > 0) {
      console.log("Đang gọi writeDataToDatabase...");
      const dbResult = await writeDataToDatabase(sampleTaskParams.templateName, processorResult.data);

      if (!dbResult.success) {
        throw new Error(`Lỗi khi ghi vào DB: ${dbResult.error || 'Unknown DB error'}`);
      }
      console.log(`writeDataToDatabase hoàn thành. Ghi thành công ${dbResult.count} dòng.`);
    } else {
      console.log("Không có dữ liệu mới để ghi vào database.");
    }

    console.log("✅ Hoàn tất thực thi test thành công!");

  } catch (error) {
    console.error("❌ TEST GẶP LỖI NGHIÊM TRỌNG!");
    console.error(`   Lỗi: ${error.message}`);
    console.error(`   Stack Trace: ${error.stack}`);
  } finally {
    await prisma.$disconnect();
    console.log("Đã đóng kết nối database.");
  }
}

// --- [BƯỚC 5] ---
runTest();
