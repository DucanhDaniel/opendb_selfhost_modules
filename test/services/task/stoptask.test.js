import request from 'supertest';
import { createApiServer } from '../../../src/api/server.js';
import prisma from '../../../src/db/client.js';
import { authService } from '../../../src/services/auth/auth.service.js';
import { initializeWorker, taskQueue, taskWorker } from '../../../src/core/jobQueue.js';
import logger from '../../../src/utils/logger.js';

const app = createApiServer();

// Dữ liệu test: Chọn một report nặng để đảm bảo nó chạy đủ lâu cho mình kịp bấm Stop
const STOP_TEST_CASE =     {
        name: "GMV Campaign / Product Detail",
        taskType: "TIKTOK_GMV",
        params: {
            endDate: "2025-10-30",
            startDate: "2025-10-01", 
            advertiser_id: "6967547145545105410",
            advertiser_name: "Tên advertiser",
            store_name: "Tên store",
            store_id: "7494600253418473607",
            templateName: "GMV Campaign / Product Detail", 
            selectedFields: [
                "start_date", "end_date", "advertiser_id", "advertiser_name", "store_id", "store_name", "stat_time_day", "campaign_id", "item_group_id", "product_img", 
                "campaign_name", "operation_status", "bid_type", "product_name", "product_image_url", "orders", "gross_revenue", "cost", "cost_per_order", "roi"
            ]
        },
    };

const TEST_USER = {
  username: "stop_tester",
  email: "stop_tester@opendb.com",
  password: "password123",
  settings: {
    "TIKTOK_ACCESS_TOKEN": process.env.TIKTOK_ACCESS_TOKEN || "mock-token",
    "SAVED_LICENSE_KEY": "VALID-LICENSE"
  }
};

describe('Task Stop Module E2E Test Suite', () => {
  let token;
  let userId;

  // --- SETUP (Copy chuẩn từ file mẫu của bạn) ---
  beforeAll(async () => {
    initializeWorker();

    // Get or Create User
    let user = await prisma.user.findUnique({ where: { email: TEST_USER.email } });
    if (!user) {
      user = await prisma.user.create({
        data: {
          username: TEST_USER.username,
          email: TEST_USER.email,
          password: await authService.hashPassword(TEST_USER.password),
          settings: TEST_USER.settings
        }
      });
    } else {
        await prisma.user.update({
            where: { id: user.id },
            data: { settings: TEST_USER.settings }
        });
    }
    userId = user.id;
    token = authService.generateAccessToken(user);
  });

  afterAll(async () => {
    if (userId) {
        await prisma.taskLog.deleteMany({ where: { userId } });
        await prisma.taskMetric.deleteMany({ where: { userId } });
    }
    await taskQueue.close();
    if (taskWorker) {
      await taskWorker.close();
    }
    await prisma.$disconnect();
  });

  test('Should be able to STOP a running task', async () => {
    const testCase = STOP_TEST_CASE;
    logger.info(`\n🛑 Đang test quy trình STOP: ${testCase.name}`);

    // 1. Initiate Task
    const initRes = await request(app)
      .post('/api/v1/task/initiate') // Lưu ý: Check lại route server bạn dùng số ít hay nhiều (/task hay /tasks)
      .set('Authorization', `Bearer ${token}`)
      .send({
        taskType: testCase.taskType,
        description: `E2E Stop Test: ${testCase.name}`,
        params: testCase.params
      });

    expect(initRes.statusCode).toBe(201);
    const taskId = initRes.body.taskId || initRes.body.id; // Fallback tùy response của bạn
    logger.info(`   -> Task Created: ${taskId}`);

    // 2. Execute Task
    const execRes = await request(app)
      .post('/api/v1/task/execute')
      .set('Authorization', `Bearer ${token}`)
      .send({}); // Execute task hiện tại của user
    
    expect(execRes.statusCode).toBe(202);
    logger.info(`   -> Task Executing...`);

    // 3. WAIT: Chờ 2 giây để Worker kịp nhận Job và chuyển sang trạng thái ACTIVE
    // Nếu gọi Stop ngay lập tức thì Job vẫn ở trạng thái Waiting -> Stop quá dễ.
    // Ta muốn test Stop khi nó đang chạy (Active).
    await new Promise(r => setTimeout(r, 2000));

    // 4. Call STOP API
    logger.info(`   -> Sending STOP signal...`);
    const stopRes = await request(app)
      .post(`/api/v1/task/stop/${taskId}`) // Route stop mà bạn đã implement
      .set('Authorization', `Bearer ${token}`);

    // Xử lý logic assert
    if (stopRes.statusCode === 200) {
        expect(stopRes.body.success).toBe(true);
        logger.info(`   -> Stop Request Accepted.`);
    } else if (stopRes.statusCode === 400 && stopRes.body.message.includes('finished')) {
        logger.warn(`   ⚠️ Task chạy quá nhanh, đã xong trước khi kịp Stop.`);
    } else {
        console.error("Stop Failed Response:", stopRes.body);
        throw new Error(`Stop API failed with status ${stopRes.statusCode}`);
    }

    // 5. Poll Status để xác nhận Task thực sự Failed (do bị hủy)
    let status = 'UNKNOWN';
    let attempts = 0;
    
    // Poll tối đa 10 lần (20 giây)
    while (status !== 'FAILED' && status !== 'CANCELLED' && status !== 'COMPLETED' && attempts < 10) { 
      attempts++;
      await new Promise(r => setTimeout(r, 2000));

      const statusRes = await request(app)
        .get('/api/v1/task/get/status')
        .query({ taskId })
        .set('Authorization', `Bearer ${token}`);
      
      status = statusRes.body.status;
      logger.info(`   -> Poll #${attempts}: Status is ${status}`);
    }

    // 6. Assert Final State
    // Nếu stop thành công, Worker sẽ throw Error -> Status phải là FAILED
    // Trong message lỗi (nếu có lưu) sẽ là "JOB_CANCELLED_BY_USER"
    if (status === 'COMPLETED') {
        logger.warn("   ⚠️ Task completed before stop signal could kill it.");
    } else {
        expect(status).toBe('CANCELLED');
        logger.info(`✅ Test Passed: Task was successfully stopped.`);
    }

  }, 180000); 

});