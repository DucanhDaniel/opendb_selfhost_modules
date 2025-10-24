// runFacebookTest.js

import dotenv from 'dotenv';
import { processFacebookJob } from './src/services/facebook/index.js'; // Import hàm điều phối chính
import { writeDataToDatabase } from './src/db/dataWriter.js'; // Import hàm ghi DB
import prisma from './src/db/client.js'; // Import client để đóng kết nối

// --- [BƯỚC 1] ---
// Load biến môi trường từ file .env ở thư mục gốc
dotenv.config();

// --- [BƯỚC 2] ---
// Lấy Access Token từ biến môi trường
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
  process.exit(1); // Thoát nếu không có token
}

// --- [BƯỚC 3] ---
// Định nghĩa tác vụ mẫu bạn muốn chạy
// Lấy từ ví dụ GAS của bạn, chú ý templateName
const sampleTaskParams = {
  // endDate: '2025-08-31', // Sử dụng ngày gần đây hơn nếu cần dữ liệu mới
  // startDate: '2025-07-01',
  endDate: '2025-10-23',   // Ví dụ: Lấy dữ liệu hôm qua
  startDate: '2025-10-23',
  newSheetName: '(FAD) Facebook Ads Data - Ad Creative Report', // Không còn dùng newSheetName
  isOverwrite: true,    // Không còn dùng isOverwrite cho DB (Prisma xử lý)
  isFirstChunk: true,   // Không còn dùng isFirstChunk cho DB
  accountsToProcess: [
    { id: 'act_948290596967304', name: 'BM MẠNH SÁO 2' },
    // { id: 'act_542712186951432', name: 'Cara Luna 01' },
  ],
  sheetName: 'Sheet5',      // Không còn dùng sheetName
  templateName: 'Ad Creative Report', // <-- THAY ĐỔI TEMPLATE Ở ĐÂY NẾU MUỐN TEST BÁO CÁO KHÁC
  selectedFields: [         // <-- Đảm bảo các trường này khớp với templateName
    // Danh sách các trường bạn muốn lấy (friendly names)
    // Ví dụ cho Ad Creative Report:
     'id',
     'name',
     'adset_id',
     'adset_name',
     'campaign_id',
     'campaign_name',
     'account_id',
     'account_name',
     'status',
     'effective_status',
     'creative_id',
     'actor_id',
     'page_name',
     'creative_title',
     'creative_body',
     'creative_thumbnail_url',
     'creative_thumbnail_raw_url',
     'creative_link',
     'spend',
     'impressions',
     'Leads',
     'Cost Leads',
     'reach',
     'clicks',
     'ctr',
     'cpc',
     'cpm',
     'New Messaging Connections',
     'Cost per New Messaging',
     'Purchases',
     'Purchase Value',
     'Purchase ROAS',
     'date_start',
     'date_stop'
  ]
};

// --- [BƯỚC 4] ---
// Hàm bất đồng bộ để chạy tác vụ
async function runTest() {
  console.log(`Bắt đầu chạy test cho template: "${sampleTaskParams.templateName}"`);
  console.log(`Tài khoản xử lý: ${sampleTaskParams.accountsToProcess.map(a => a.name).join(', ')}`);
  console.log(`Khoảng thời gian: ${sampleTaskParams.startDate} đến ${sampleTaskParams.endDate}`);

  try {
    // 1. Gọi hàm xử lý Facebook (lấy và xử lý dữ liệu từ API)
    console.log("Đang gọi processFacebookJob...");
    const processorResult = await processFacebookJob(sampleTaskParams, accessToken);

    if (processorResult.status !== "SUCCESS") {
      throw new Error(`Lỗi từ Facebook Processor: ${processorResult.message || 'Unknown error'}`);
    }

    console.log(`Facebook Processor hoàn thành. Nhận được ${processorResult.newRows} dòng dữ liệu.`);

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
    console.error(`   Lỗi: ${error.message}`);
    console.error(`   Stack Trace: ${error.stack}`);
  } finally {
    // Đảm bảo đóng kết nối Prisma sau khi script chạy xong
    await prisma.$disconnect();
    console.log("Đã đóng kết nối database.");
  }
}

// --- [BƯỚC 5] ---
// Chạy hàm test
runTest();
