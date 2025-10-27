import dotenv from 'dotenv';
import fs from 'fs';
import path from 'path';
import { processTiktokJob } from '../../../../src/services/tiktok/index.js';

// --- [BƯỚC 1] ---
dotenv.config();

// --- [BƯỚC 2] ---
// Lấy Access Token từ biến môi trường
const tiktokAccessToken = process.env.TIKTOK_ACCESS_TOKEN;
if (!tiktokAccessToken) {
  console.error("Lỗi: TIKTOK_ACCESS_TOKEN không được tìm thấy trong file .env");
  process.exit(1);
} else {
  console.log("Đã tải TikTok Access Token thành công.");
}

// --- [BƯỚC 3] ---
// --- CHỌN 1 TRONG CÁC VÍ DỤ SAU HOẶC TỰ ĐỊNH NGHĨA ---



// --- Ví dụ 2: BCA - BC Assets Info ---
const sampleTaskParams_BCA_Assets = {
  // taskId: 'test-bca-assets-456',
  taskType: 'TIKTOK_BCA',
  params: {
    // startDate, endDate không cần thiết cho BCA Assets Info
    accountsToProcess: [ // accountsToProcess ở đây là danh sách BC IDs
      { id: 'YOUR_BC_ID_1_HERE', name: 'BC Name 1' }, // Thay BC ID và tên
      // { id: 'YOUR_BC_ID_2_HERE', name: 'BC Name 2' },
    ],
    assetTypes: ["ADVERTISER", "STORE"], // Loại asset muốn lấy (ADVERTISER, STORE, CATALOG)
    templateName: 'BC Assets Info',
    selectedFields: [
        "bc_id", // Thêm tự động trong processor
        "asset_type", // Thêm tự động trong processor
        "asset_id",
        "asset_name",
        "owner_bc_name",
        "relation_type",
        "advertiser_status", // Chỉ có giá trị nếu asset_type là ADVERTISER
        "advertiser_role",
        // Thêm các fields khác
    ]
  }
};

// --- CHỌN TASK ĐỂ CHẠY ---
const taskToRun = {
    taskId: 'test-run-' + Date.now(), // Tạo taskId giả lập
    params: sampleTaskParams_BCA_Assets.params, 
    taskType: sampleTaskParams_BCA_Assets.taskType 
};
// --- KẾT THÚC CHỌN TASK ---


// --- [BƯỚC 4] ---
async function runTest() {
  console.log(`Bắt đầu chạy test cho template: "${taskToRun.params.templateName}" (Task ID: ${taskToRun.taskId})`);
  try {
    // 1. Gọi hàm xử lý TikTok (Dispatcher)
    console.log("Đang gọi processTiktokJob...");
    // Truyền toàn bộ đối tượng task và accessToken
    const processorResult = await processTiktokJob(taskToRun, tiktokAccessToken);

    if (processorResult.status !== "SUCCESS") {
      // Xử lý cả trường hợp trả về lỗi permission
       if (processorResult.data && processorResult.data.length > 0 && processorResult.data[0]?.error === 'permission') {
           console.warn(`Lỗi quyền truy cập từ TikTok Processor: ${processorResult.data[0]?.message || 'Permission denied'}`);
       } else {
            throw new Error(`Lỗi từ TikTok Processor: ${processorResult.message || 'Unknown error'}`);
       }
    }

    console.log(`TikTok Processor hoàn thành. Nhận được ${processorResult.newRows || 0} dòng dữ liệu.`);

    // 2. Lưu dữ liệu thô ra file JSON
    if (processorResult.data && processorResult.data.length > 0) {
      const jsonFilePath = path.join(process.cwd(), 'debug_tiktok_data.json'); // Đổi tên file output
      try {
        fs.writeFileSync(jsonFilePath, JSON.stringify(processorResult.data, null, 2));
        console.log(`✅ Đã lưu ${processorResult.data.length} dòng dữ liệu vào file: ${jsonFilePath}`);
      } catch (fsError) {
        console.warn(`CẢNH BÁO: Không lưu được file JSON debug: ${fsError.message}`);
      }
    } else {
        console.log("Không có dữ liệu mới từ processor để lưu ra file JSON.");
    }

    // 3. Bỏ qua bước ghi vào Database

    console.log("✅ Hoàn tất thực thi test!");

  } catch (error) {
    console.error("❌ TEST GẶP LỖI NGHIÊM TRỌNG!");
    console.error(`   Lỗi: ${error.message}`);
    console.error(`   Stack Trace: ${error.stack}`);
  } finally {
    // Không cần ngắt kết nối DB
    console.log("Kết thúc script test.");
  }
}

// --- [BƯỚC 5] ---
runTest();
