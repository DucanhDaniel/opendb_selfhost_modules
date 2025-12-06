import request from 'supertest';
import { createApiServer } from '../../../src/api/server.js';
import prisma from '../../../src/db/client.js';
import { authService } from '../../../src/services/auth/auth.service.js';
import { initializeWorker, taskQueue } from '../../../src/core/jobQueue.js';
import logger from '../../../src/utils/logger.js';

const app = createApiServer();

// --- CẤU HÌNH DANH SÁCH CÁC BÁO CÁO CẦN TEST ---
const FACEBOOK_TEST_CASES = [
  {
    name: "BM & Ad Accounts",
    taskType: "FACEBOOK_FAD",
    params: {
      templateName: "BM & Ad Accounts",
      selectedFields: ["bm_id", "bm_name", "bm_created_time", "bm_verification_status", "bm_profile_picture_uri", "account_type",
            "account_id", "account_name", "account_status_text", "currency", "timezone_name", "amount_spent", "balance", "current_payment_method", "tax_and_fee"]
    },
  },
  {
    name: "FB Billing Data",
    taskType: "FACEBOOK_FBT",
    params: {
      templateName: 'FB Billing Data',
      startDate: "2025-10-23",
      endDate: "2025-10-28",
      accountsToProcess: [
        { id: "act_948290596967304", name: "BM MẠNH SÁO 2" }, 
        { id : 'act_650248897235348', name: 'Cara Luna 2'}
      ]
    },
  },

  {
    name: "Campaign Daily Report",
    taskType: "FACEBOOK_FAD",
    params: {
      templateName: 'Campaign Daily Report',
      startDate: "2025-10-23",
      endDate: "2025-10-28",
      accountsToProcess: [
        { id: "act_948290596967304", name: "BM MẠNH SÁO 2" }
      ],
        selectedFields: [
            "id", "name", "account_id", "account_name", "date_start", "date_stop", "status", "effective_status", "daily_budget", "lifetime_budget", 
            "budget_remaining", "created_time", "spend", "impressions", "reach", "clicks", "ctr", "cpc", "cpm", "frequency", 
            "New Messaging Connections", "Cost per New Messaging", "Leads", "Cost Leads", "Purchases", "Cost Purchases", "Purchase Value", "Purchase ROAS", "Website Purchases", "On-Facebook Purchases"
        ]
    }
  },

  {
    name: "Campaign Overview Report",
    taskType: "FACEBOOK_FAD",
    params: {
      templateName: 'Campaign Overview Report',
      startDate: "2025-10-23",
      endDate: "2025-10-28",
      accountsToProcess: [
        { id: "act_948290596967304", name: "BM MẠNH SÁO 2" }
      ],
        selectedFields: [
            "id", "name", "objective", "account_id", "account_name", "status", "effective_status", "start_time", "stop_time", "created_time", 
            "updated_time", "buying_type", "bid_strategy", "spend", "reach", "clicks", "cpc", "cpm", "ctr", "date_start", 
            "date_stop", "New Messaging Connections", "Cost per New Messaging", "Leads", "Cost Leads", "Purchases", "Cost Purchases", "Purchase Value", "Purchase ROAS", "Website Purchases", 
            "On-Facebook Purchases"
        ]
    }
  },


];

const TEST_USER = {
  username: "fb_tester",
  email: "fb_tester@opendb.com",
  password: "password123",
  settings: {
    "FACEBOOK_ACCESS_TOKEN": process.env.FACEBOOK_ACCESS_TOKEN || "mock-token",
    // Thêm license key nếu cần
    "SAVED_LICENSE_KEY": "VALID-LICENSE" 
  }
};

describe('Facebook Module E2E Test Suite', () => {
  let token;
  let userId;

  // --- SETUP (Chạy 1 lần) ---
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
        // Update settings mới nhất (token)
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
    await prisma.$disconnect();
  });

  // --- DATA DRIVEN TEST ---
  // Jest sẽ lặp qua mảng FACEBOOK_TEST_CASES và chạy test cho từng item
  test.each(FACEBOOK_TEST_CASES)('Should process report: $name', async (testCase) => {
    logger.info(`\n🧪 Đang test template: ${testCase.name}`);
    
    // 1. Initiate
    const initRes = await request(app)
      .post('/api/v1/task/initiate')
      .set('Authorization', `Bearer ${token}`)
      .send({
        taskType: testCase.taskType,
        description: `E2E Test: ${testCase.name}`,
        params: testCase.params
      });

    if (initRes.statusCode !== 201) console.error(initRes.body);
    expect(initRes.statusCode).toBe(201);
    const taskId = initRes.body.taskId;

    // 2. Execute
    const execRes = await request(app)
      .post('/api/v1/task/execute')
      .set('Authorization', `Bearer ${token}`)
      .send({});
    expect(execRes.statusCode).toBe(202);

    // 3. Poll Status
    let status = 'QUEUED';
    let attempts = 0;
    while (status !== 'COMPLETED' && status !== 'FAILED' && attempts < 30) { // Tăng max attempts lên 30
      attempts++;
      await new Promise(r => setTimeout(r, 2000));

      const statusRes = await request(app)
        .get('/api/v1/task/get/status')
        .query({ taskId })
        .set('Authorization', `Bearer ${token}`);
      
      status = statusRes.body.status;
      // logger.info(`   [${testCase.name}] Poll #${attempts}: ${status}`);
    }

    if (status === 'FAILED') {
        console.error(`❌ Task Failed: ${testCase.name}`);
        // (Tùy chọn) Gọi API lấy log chi tiết để debug
    }

    expect(status).toBe('COMPLETED');
    logger.info(`✅ Test Passed: ${testCase.name}`);

  }, 120000); // Timeout 2 phút cho mỗi test case (vì gọi API FB thật)

});