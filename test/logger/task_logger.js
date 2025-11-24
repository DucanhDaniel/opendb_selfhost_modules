import 'dotenv/config';
import prisma from '../../src/db/client.js';
import { TaskLogger } from '../../src/utils/task_logger.js';
import logger from '../../src/utils/logger.js';

// Hàm sleep để chờ đợi
const sleep = (ms) => new Promise(resolve => setTimeout(resolve, ms));

async function runTest() {
  logger.info("🚀 Bắt đầu test TaskLogger...");

  // 1. Tạo dữ liệu giả (User)
  const testUserId = `user-log-test-${Date.now()}`;
  const testTaskId = `task-log-test-${Date.now()}`;

  try {
    // Tạo user tạm để có chỗ lưu settings
    await prisma.user.create({
      data: {
        id: testUserId,
        username: testUserId,
        email: `${testUserId}@example.com`,
        password: "hashed_password",
        settings: {
          // Giả lập cấu trúc task đang chạy
          "TASK_MANAGER_CURRENT_TASK": {
            taskId: testTaskId,
            progress: { message: "Khởi tạo..." }
          }
        }
      }
    });
    logger.info(`✅ Đã tạo User test: ${testUserId}`);

    // 2. Khởi tạo TaskLogger
    const taskLogger = new TaskLogger(testUserId, testTaskId);

    // --- TEST 1: BUFFERING (Đệm) ---
    logger.info("\n--- TEST 1: Kiểm tra Buffering ---");
    taskLogger.info("Log số 1: Chưa vào DB ngay đâu");
    taskLogger.warn("Log số 2: Vẫn nằm trong RAM");
    
    // Kiểm tra DB ngay lập tức (kỳ vọng = 0)
    const logsBeforeFlush = await prisma.taskLog.count({ where: { taskId: testTaskId } });
    console.log(`   Số log trong DB ngay lúc này: ${logsBeforeFlush} (Mong đợi: 0)`);
    
    if (logsBeforeFlush === 0) console.log("   ✅ Buffering hoạt động tốt.");
    else console.error("   ❌ Lỗi: Log bị ghi quá sớm!");


    logger.info("... Đang chờ 2.1s để mở lại cổng update status ...");
    await sleep(2100); 
    // ==================================================================

    // --- TEST 2: THROTTLING ---
    logger.info("\n--- TEST 2: Kiểm tra Throttling Status ---");
    
    // Bây giờ đã qua 2s, dòng này SẼ ĐƯỢC ghi vào DB
    taskLogger.info("Update Status A"); 
    
    // Hai dòng này đến quá nhanh sau A (<2s), sẽ BỊ CHẶN (Đúng logic)
    taskLogger.info("Update Status B"); 
    taskLogger.info("Update Status C"); 
    
    await sleep(500); // Chờ xíu cho DB xử lý async update A

    const userAfterLog = await prisma.user.findUnique({ where: { id: testUserId } });
    const currentMsg = userAfterLog.settings.TASK_MANAGER_CURRENT_TASK.progress.message;
    console.log(`   Status Message hiện tại: "${currentMsg}"`);
    
    // Bây giờ mong đợi A là đúng
    if (currentMsg === "Update Status A") {
        console.log("   ✅ Throttling hoạt động CHUẨN (A được ghi, B và C bị chặn).");
    } else {
        console.warn(`   ❌ Vẫn lỗi: ${currentMsg}`);
    }


    // --- TEST 3: FLUSH & CLOSE ---
    logger.info("\n--- TEST 3: Flush và Close ---");
    // Gọi close() sẽ ép buộc ghi tất cả log còn lại và update status cuối cùng
    await taskLogger.close();
    console.log("   Đã gọi taskLogger.close()");

    // Kiểm tra lại DB Log (kỳ vọng = 5 dòng log đã gửi từ đầu đến giờ)
    const logsAfterClose = await prisma.taskLog.findMany({ where: { taskId: testTaskId } });
    console.log(`   Số log trong DB sau khi close: ${logsAfterClose.length} (Mong đợi: 5)`);
    
    if (logsAfterClose.length === 5) console.log("   ✅ Đã ghi đầy đủ log xuống DB.");
    else console.error("   ❌ Lỗi: Thiếu log!");

    // Kiểm tra lại User Settings (Status cuối cùng phải được cập nhật)
    const userFinal = await prisma.user.findUnique({ where: { id: testUserId } });
    const finalMsg = userFinal.settings.TASK_MANAGER_CURRENT_TASK.progress.message;
    console.log(`   Status Message cuối cùng: "${finalMsg}" (Mong đợi: "Update Status C")`);

    if (finalMsg === "Update Status C") console.log("   ✅ Status cuối cùng đã được cập nhật.");
else console.error("   ❌ Lỗi: Status cuối chưa được cập nhật.");


  } catch (error) {
    logger.error("\n❌ TEST THẤT BẠI:", error);
  } finally {
    // Dọn dẹp dữ liệu test
    logger.info("\n--- Dọn dẹp ---");
    // await prisma.taskLog.deleteMany({ where: { taskId: testTaskId } });
    // await prisma.user.delete({ where: { id: testUserId } });
    // logger.info("Đã xóa dữ liệu test.");
    
    await prisma.$disconnect();
  }
}

runTest();