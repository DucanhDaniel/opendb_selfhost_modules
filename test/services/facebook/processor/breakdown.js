import dotenv from 'dotenv';
import fs from 'fs'; // [MỚI] Import File System
import path from 'path'; // [MỚI] Import Path
import { processFacebookJob } from '../../../../src/services/facebook/index.js';
import { writeDataToDatabase } from '../../../../src/db/dataWriter.js';
import prisma from '../../../../src/db/client.js';

// --- [BƯỚC 1] ---
dotenv.config();

// --- [BƯỚC 2] ---
let accessToken;
try {
  const authConfig = JSON.parse(process.env.FB_AUTH_CONFIG);
  if (!authConfig || !authConfig.token) {
    throw new Error('FB_AUTH_CONFIG is missing or malformed in .env');
  }
  accessToken = authConfig.token;
  console.log("Đã tải Access Token thành công.");
} catch (e) {
  console.error("Lỗi khi tải Access Token từ .env:", e.message);
  process.exit(1);
}

// --- [BƯỚC 3] ---
const sampleTaskParams = {
  endDate: '2025-10-23',
  startDate: '2025-10-23',
  accountsToProcess: [
//     { id: 'act_948290596967304', name: 'BM MẠNH SÁO 2' },
    { id : 'act_650248897235348', name: 'Cara Luna 2'}
  ],
  templateName: 'Campaign Performance by Region',
  selectedFields: [
 'campaign_id',
 'campaign_name',
 'account_id',
 'account_name',
 'region',
 'spend', 'impressions', 'clicks', 'ctr',
 'New Messaging Connections',
 'Cost per New Messaging',
 'Leads',
 'Cost Leads',
 'Purchases',
 'Cost Purchases',
 'Purchase Value',
 'Website Purchases',
 'On-Facebook Purchases',
 'date_start',
 'date_stop'
]
};

// --- [BƯỚC 4] ---
async function runTest() {
  console.log(`Bắt đầu chạy test cho template: "${sampleTaskParams.templateName}"`);
  try {
    // 1. Gọi hàm xử lý Facebook
    console.log("Đang gọi processFacebookJob...");
    const processorResult = await processFacebookJob(sampleTaskParams, accessToken);

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
