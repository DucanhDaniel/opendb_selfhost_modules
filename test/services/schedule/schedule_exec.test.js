import request from 'supertest';
import { createApiServer } from '../../../src/api/server.js';
import prisma from '../../../src/db/client.js';
import { authService } from '../../../src/services/auth/auth.service.js';
import { initializeWorker, taskQueue } from '../../../src/core/jobQueue.js';

const app = createApiServer();

const TEST_USER = {
    username: "schedule_runner",
    email: "ducanh2002add@gmail.com",
    password: "password123",
    settings: { "TIKTOK_ACCESS_TOKEN": process.env.TIKTOK_ACCESS_TOKEN }
};

describe('Schedule Execution Flow (E2E)', () => {
    let token;
    let userId;
    let worker;
    let scheduleId;

    beforeAll(async () => {
        // 1. Khởi động Worker 
        worker = initializeWorker();

        // 2. Setup User & Token
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
        }
        userId = user.id;
        token = authService.generateAccessToken(user);
    });

    afterAll(async () => {
        if (userId) {
            await prisma.taskLog.deleteMany({ where: { userId } });
            await prisma.taskMetric.deleteMany({ where: { userId } });
            await prisma.taskSchedule.deleteMany({ where: { userId } });
            let user_id = userId;
            await prisma.gMV_AllCampaignPerformance.deleteMany({ where: { user_id } });
        }
        
        await taskQueue.close();
        if (worker) await worker.close();
        await prisma.$disconnect();
    });

    test('Should create a schedule and verify it triggers a TASK', async () => {
        const scheduleName = `Auto Test Run ${Date.now()}`;
        
        console.log(`[${new Date().toISOString()}] Creating schedule...`);
        
        const createRes = await request(app)
            .post('/api/v1/schedules')
            .set('Authorization', `Bearer ${token}`)
            .send({
                name: scheduleName,
                cronExpression: "* * * * *", // Every minute
                timezone: "Asia/Ho_Chi_Minh",
                taskData: {
                    sendEmail: true,
                    taskType: "TIKTOK_GMV", 
                    description: "TIKTOK_GMV TASK",
                    params: { 
                        "endDate": "2025-12-01",
                        "startDate": "2025-12-01",
                        "templateName": "GMV All Campaign Performance",
                        "accountsToProcess": [
                            {
                                "id": "6967547145545105410",
                                "name": "Test Advertiser"
                            }
                        ],
                        "shopsToProcess": [
                            {
                                "id": "7494600253418473607",
                                "name": "Test Store"
                            }
                        ],
                        "selectedFields": [
                            "start_date",
                            "end_date",
                            "advertiser_id",
                            "advertiser_name",
                            "store_id",
                            "store_name",
                            "campaign_id",
                            "stat_time_day",
                            "campaign_name",
                            "cost",
                            "orders",
                            "roi",
                            "cost_per_order",
                            "gross_revenue",
                            "net_cost",
                            "roas_bid",
                            "operation_status",
                            "schedule_type",
                            "schedule_start_time",
                            "schedule_end_time",
                            "target_roi_budget",
                            "bid_type",
                            "max_delivery_budget"
                        ]
                    }
                }
            });
        
        expect(createRes.statusCode).toBe(201);
        scheduleId = createRes.body.id;
        console.log("Schedule Created ID:", scheduleId);

        // Tối đa chờ 70s (đề phòng trễ mạng/redis)
        let triggeredTask = null;
        const maxRetries = 14; // 14 lần x 5s = 70s
        
        console.log("⏳ Waiting for Scheduler trigger (Max 70s)...");

        for (let i = 0; i < maxRetries; i++) {
            // Chờ 5 giây
            await new Promise(r => setTimeout(r, 5000));

            const metrics = await prisma.taskMetric.findMany({
                where: { 
                    userId: userId,
                    scheduleId: scheduleId // Tìm task được đẻ ra từ lịch này
                },
                orderBy: { createdAt: 'desc' }
            });

            if (metrics.length > 0) {
                triggeredTask = metrics[0];
                console.log(`[${new Date().toISOString()}] ✅ Found Task! ID: ${triggeredTask.taskId}`);
                break; // Thoát vòng lặp ngay lập tức
            } else {
                process.stdout.write("."); // In dấu chấm để biết test đang chạy
            }
        }

        if (!triggeredTask) {
            console.error("\n❌ Timeout: Không thấy task nào được tạo sau 70s.");
        }

        expect(triggeredTask).toBeDefined();
        expect(triggeredTask).not.toBeNull();
        expect(triggeredTask.scheduleId).toBe(scheduleId);
        
        // Kiểm tra xem trạng thái có phải là đã chạy xong (hoặc ít nhất là FAILED/COMPLETED)
        expect(['QUEUED', 'RUNNING', 'COMPLETED', 'FAILED']).toContain(triggeredTask.status);

    }, 80000); 

});