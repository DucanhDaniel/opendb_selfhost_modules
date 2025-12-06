import { jest } from '@jest/globals';
import prisma from '../../src/db/client.js'; 
import { TaskLogger } from '../../src/utils/task_logger.js'; 

// Helper function sleep
const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

const TEST_USER_ID = `user-log-test-${Date.now()}`;
const TEST_TASK_ID = `task-log-test-${Date.now()}`;

describe('TaskLogger Integration Test', () => {
  jest.setTimeout(20000);

  let taskLogger;

  // 1. SETUP: Tạo User giả trước khi chạy test
  beforeAll(async () => {
    console.log(`[Jest] Tạo User test: ${TEST_USER_ID}`);
    await prisma.user.create({
      data: {
        id: TEST_USER_ID,
        username: TEST_USER_ID,
        email: `${TEST_USER_ID}@example.com`,
        password: "hashed_password",
        settings: {
          "TASK_MANAGER_CURRENT_TASK": {
            taskId: TEST_TASK_ID,
            progress: { message: "Khởi tạo..." }
          }
        }
      }
    });

    // Khởi tạo TaskLogger instance
    taskLogger = new TaskLogger(TEST_USER_ID, TEST_TASK_ID);
  });

  // 4. TEARDOWN: Dọn dẹp dữ liệu sau khi xong
  afterAll(async () => {
    console.log('[Jest] Đang dọn dẹp dữ liệu test...');
    // Xóa logs trước
    await prisma.taskLog.deleteMany({ where: { taskId: TEST_TASK_ID } });
    // Xóa user sau
    await prisma.user.delete({ where: { id: TEST_USER_ID } });
    
    await prisma.$disconnect();
    console.log('[Jest] Dọn dẹp hoàn tất.');
  });

  // --- TEST CASE 1: BUFFERING ---
  test('Step 1: Buffering - Should NOT write logs to DB immediately', async () => {
    taskLogger.info("Log số 1: Chưa vào DB ngay đâu");
    taskLogger.warn("Log số 2: Vẫn nằm trong RAM");

    // Kiểm tra DB ngay lập tức
    const logsCount = await prisma.taskLog.count({ where: { taskId: TEST_TASK_ID } });
    
    // Expectation: Chưa có log nào được ghi (count = 0)
    expect(logsCount).toBe(0);
    console.log('✅ Step 1: Buffering hoạt động tốt (DB count = 0).');
  });

  // --- TEST CASE 2: THROTTLING ---
  test('Step 2: Throttling - Should rate limit status updates', async () => {
    console.log('⏳ Đang chờ 2.1s để reset throttle window...');
    await sleep(2100); // Chờ throttle cũ hết hạn (nếu có)

    // Gửi log A -> Nên được cập nhật ngay
    taskLogger.info("Update Status A");

    // Gửi log B, C ngay lập tức -> Nên bị chặn update User (nhưng vẫn lưu vào buffer log)
    taskLogger.info("Update Status B");
    taskLogger.info("Update Status C");

    // Chờ 500ms để DB kịp xử lý log A (async)
    await sleep(500);

    // Lấy trạng thái hiện tại trong DB
    const user = await prisma.user.findUnique({ where: { id: TEST_USER_ID } });
    const currentMsg = user.settings.TASK_MANAGER_CURRENT_TASK.progress.message;

    console.log(`ℹ️ Status DB hiện tại: "${currentMsg}"`);

    // Expectation: Chỉ update được A, B và C bị chặn do quá nhanh
    expect(currentMsg).toBe("Update Status A"); 
    console.log('✅ Step 2: Throttling hoạt động chuẩn.');
  });

  // --- TEST CASE 3: FLUSH & CLOSE ---
  test('Step 3: Flush & Close - Should write all logs and force final status update', async () => {
    // Gọi close() -> Ép ghi buffer và ép update status cuối
    await taskLogger.close();
    console.log('Function taskLogger.close() đã được gọi.');

    // 1. Kiểm tra tổng số Log trong DB
    // Tổng cộng ta đã gọi info/warn 5 lần:
    // (Log 1, Log 2) + (Status A, Status B, Status C)
    const logs = await prisma.taskLog.findMany({ where: { taskId: TEST_TASK_ID } });
    
    expect(logs.length).toBe(5);
    console.log(`✅ Step 3a: Đã flush đủ ${logs.length}/5 log xuống DB.`);

    // 2. Kiểm tra Status cuối cùng của User
    // close() phải đảm bảo status là cái mới nhất ("Update Status C")
    const userFinal = await prisma.user.findUnique({ where: { id: TEST_USER_ID } });
    const finalMsg = userFinal.settings.TASK_MANAGER_CURRENT_TASK.progress.message;

    expect(finalMsg).toBe("Update Status C");
    console.log('✅ Step 3b: Status cuối cùng đã được cập nhật thành công.');
  });
});