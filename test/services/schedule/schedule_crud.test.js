import request from 'supertest';
import { createApiServer } from '../../../src/api/server.js'; // Import app express của bạn
import prisma from '../../../src/db/client.js';
import { authService } from '../../../src/services/auth/auth.service.js';
import { initializeWorker, taskQueue, taskWorker } from '../../../src/core/jobQueue.js';



const app = createApiServer();
let token;
let createdScheduleId; // Biến để lưu ID dùng chung giữa các test case

// Dữ liệu mẫu để test
const mockScheduleData = {
    name: "Chạy báo cáo GMV All Campaign Test",
    cronExpression: "26 15 * * *",
    timezone: "Asia/Ho_Chi_Minh",
    taskData: {
        taskType: "TIKTOK_GMV",
        description: "TIKTOK_GMV TASK TEST",
        params: {
            endDate: "2025-12-01",
            startDate: "2025-12-01",
            templateName: "GMV All Campaign Performance",
            accountsToProcess: [{ id: "6967547145545105410", name: "Test Advertiser" }],
            shopsToProcess: [{ id: "7494600253418473607", name: "Test Store" }],
            selectedFields: ["start_date", "cost", "gmv"] // Rút gọn cho ngắn
        }
    }
};

const TEST_USER = {
  username: "tiktok_tester",
  email: "tiktok_tester@opendb.com",
  password: "password123",
  settings: {
    "TIKTOK_ACCESS_TOKEN": process.env.TIKTOK_ACCESS_TOKEN || "mock-token",
    "SAVED_LICENSE_KEY": "VALID-LICENSE" 
  }
};


describe('Schedule API E2E Flow', () => {
    
    // 1. Setup: Lấy token trước khi chạy (nếu API có Auth)
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

        if (taskWorker) {
        await taskWorker.close();
        }
    
        await prisma.$disconnect();
    });

    // --- BƯỚC 1: TẠO MỚI (POST) ---
    test('POST /api/v1/schedules - Should create a new schedule', async () => {
        const res = await request(app)
            .post('/api/v1/schedules')
            .set('Authorization', `Bearer ${token}`)
            .send(mockScheduleData);

        expect(res.statusCode).toBe(201); // Mong đợi 201 Created
        expect(res.body).toHaveProperty('id');
        expect(res.body.name).toBe(mockScheduleData.name);
        expect(res.body.cronExpression).toBe(mockScheduleData.cronExpression);

        // Lưu ID để dùng cho các bước sau
        createdScheduleId = res.body.id;
        console.log("Created Schedule ID:", createdScheduleId);
    });

    // --- BƯỚC 2: KIỂM TRA TỒN TẠI (GET) ---
    test('GET /api/v1/schedules - Should contain the created schedule', async () => {
        const res = await request(app)
            .get('/api/v1/schedules')
            .set('Authorization', `Bearer ${token}`);

        expect(res.statusCode).toBe(200);
        expect(Array.isArray(res.body)).toBe(true);

        // Tìm xem item vừa tạo có trong mảng không
        const foundItem = res.body.find(item => item.id === createdScheduleId);
        expect(foundItem).toBeDefined();
        expect(foundItem.taskData.taskType).toBe("TIKTOK_GMV");
    });

    // --- BƯỚC 3: CẬP NHẬT (PUT) ---
    test('PUT /api/v1/schedules/:id - Should update schedule status and cron', async () => {
        const updatePayload = {
            isActive: true,
            cronExpression: "46 15 * * *" // Đổi giờ chạy
        };

        const res = await request(app)
            .put(`/api/v1/schedules/${createdScheduleId}`)
            .set('Authorization', `Bearer ${token}`)
            .send(updatePayload);

        expect(res.statusCode).toBe(200);
        expect(res.body.isActive).toBe(true);
        expect(res.body.cronExpression).toBe("46 15 * * *");
    });

    // --- BƯỚC 4: XÓA (DELETE) ---
    test('DELETE /api/v1/schedules/:id - Should delete the schedule', async () => {
        const res = await request(app)
            .delete(`/api/v1/schedules/${createdScheduleId}`)
            .set('Authorization', `Bearer ${token}`);

        // Tùy API trả về 200 (kèm message) hoặc 204 (No Content)
        expect([200, 204]).toContain(res.statusCode);
    });

    // --- BƯỚC 5: VERIFY XÓA (GET) ---
    test('GET /api/v1/schedules - Should NOT contain the deleted schedule', async () => {
        const res = await request(app)
            .get('/api/v1/schedules')
            .set('Authorization', `Bearer ${token}`);

        const foundItem = res.body.find(item => item.id === createdScheduleId);
        expect(foundItem).toBeUndefined(); // Không được tìm thấy nữa
    });
});