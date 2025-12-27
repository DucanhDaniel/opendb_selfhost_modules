import request from 'supertest';
import { createApiServer } from '../../../src/api/server.js';
import prisma from '../../../src/db/client.js';
import { authService } from '../../../src/services/auth/auth.service.js';
import { initializeWorker, taskQueue } from '../../../src/core/jobQueue.js';
import logger from '../../../src/utils/logger.js';

const app = createApiServer(3000);

const TEST_USER = {
  username: "admin_test",
  email: "admin_test@opendb.com",
  password: "password123", 
  settings: {
    "POSCAKE_ACCESS_TOKEN": process.env.POSCAKE_API_KEY,
    "TIKTOK_ACCESS_TOKEN": process.env.TIKTOK_ACCESS_TOKEN,
    "FACEBOOK_ACCESS_TOKEN": process.env.FACEBOOK_ACCESS_TOKEN,
  }
};

describe('E2E Flow: Setup Fixed User -> Run Task', () => {
  let token;
  let userId;
  let taskId;

  // --- BƯỚC 1: CHUẨN BỊ (Chỉ chạy 1 lần) ---
  beforeAll(async () => {
    // 1. Khởi động Worker để xử lý background job
    initializeWorker();

    // 2. Tìm hoặc Tạo User Test (Get or Create)
    let user = await prisma.user.findUnique({
      where: { email: TEST_USER.email }
    });

    if (!user) {
      logger.info("⚠️ Chưa có tài khoản Test. Đang tạo mới...");
      const hashedPassword = await authService.hashPassword(TEST_USER.password);
      user = await prisma.user.create({
        data: {
          username: TEST_USER.username,
          email: TEST_USER.email,
          password: hashedPassword,
          settings: TEST_USER.settings
        }
      });
      logger.info(`✅ Đã tạo User Test: ${user.id}`);
    } else {
      logger.info(`ℹ️ Sử dụng tài khoản Test có sẵn: ${user.id}`);
      // (Tùy chọn) Cập nhật lại settings mới nhất nếu cần
      await prisma.user.update({
        where: { id: user.id },
        data: { settings: TEST_USER.settings }
      });
    }

    userId = user.id;

    // 3. Login lấy Token (Giả lập login)
    token = authService.generateAccessToken(user);
  });

  // --- BƯỚC 2: DỌN DẸP (Sau khi test xong) ---
  afterAll(async () => {
    // [QUAN TRỌNG] Chỉ xóa dữ liệu RÁC do bài test này tạo ra (Task, Log)
    // KHÔNG XÓA USER để lần sau dùng tiếp
    if (userId) {
        logger.info("🧹 Đang dọn dẹp task rác...");
        await prisma.taskLog.deleteMany({ where: { userId } });
        await prisma.taskMetric.deleteMany({ where: { userId } });
        // Xóa các task trong settings (nếu lưu kiểu JSONB cũ)
        // Hoặc nếu bạn đã tách bảng Task, hãy xóa ở đây
    }

    await taskQueue.close();
    await prisma.$disconnect();
  });

  // --- BƯỚC 3: CÁC TEST CASE ---

  test('Step 1: Initiate Task (Create Task)', async () => {
    const res = await request(app)
      .post('/api/v1/task/initiate')
      .set('Authorization', `Bearer ${token}`)
      .send({
        taskType: 'POSCAKE_FLATTENED',
        description: 'E2E Test Run (Fixed User)',
        description: "POSCAKE_BASIC TASK",
        params: {
           shopId: "2443210",
           templateName: "Báo cáo đơn hàng chi tiết (Full Data)",
           startDate: "2023-10-01",
           endDate: "2023-10-03",
           selectedFields: [  
            "is_primary_row",
            "id",
            "display_id",
            "system_id",
            "shop_id",
            "conversation_id",
            "order_link",
            "tracking_link",
            "inserted_at",
            "updated_at",
            "status",
            "status_name",
            "sub_status",
            "is_locked",
            "received_at_shop",
            "order_sources_name",
            "order_sources",
            "ads_source",
            "ad_id",
            "page_id",
            "page.name",
            "page.username",
            "post_id",
            "marketer",
            "p_utm_source",
            "p_utm_medium",
            "p_utm_campaign",
            "p_utm_content",
            "p_utm_term",
            "creator.id",
            "creator.name",
            "assigning_seller.name",
            "assigning_seller_id",
            "time_assign_seller",
            "assigning_care.name",
            "assigning_care_id",
            "time_assign_care",
            "last_editor.name",
            "customer.id",
            "customer.customer_id",
            "bill_full_name",
            "bill_phone_number",
            "bill_email",
            "gender",
            "shipping_address.full_address",
            "shipping_address.address",
            "shipping_address.commnue_name",
            "shipping_address.district_name",
            "shipping_address.province_name",
            "shipping_address.post_code",
            "order_currency",
            "total_price",
            "total_price_after_sub_discount",
            "total_discount",
            "money_to_collect",
            "cod",
            "partner.cod",
            "tax",
            "surcharge",
            "cost_surcharge",
            "shipping_fee",
            "partner_fee",
            "fee_marketplace",
            "customer_pay_fee",
            "is_free_shipping",
            "payment_method_string",
            "cash",
            "transfer_money",
            "charged_by_card",
            "charged_by_momo",
            "charged_by_vnpay",
            "charged_by_qrpay",
            "charged_by_kredivo",
            "charged_by_fundiin",
            "prepaid",
            "prepaid_by_point.point",
            "exchange_value",
            "partner.partner_name",
            "partner.extend_code",
            "time_send_partner",
            "additional_info.service_partner",
            "warehouse_id",
            "warehouse_name",
            "warehouse_info.full_address",
            "total_quantity",
            "items_length",
            "item.id",
            "item.variation_info.product_display_id",
            "item.variation_info.display_id",
            "item.variation_info.name",
            "item.quantity",
            "item.variation_info.retail_price",
            "item.variation_info.last_imported_price",
            "item.discount_each_product",
            "item_price_after_discount",
            "item_total_value",
            "item.variation_info.weight",
            "item.note",
            "item.is_bonus_product",
            "item.is_wholesale",
            "note",
            "note_print",
            "tags_string",
            "is_livestream",
            "is_live_shopping",
            "is_smc",
            "is_exchange_order",
            "returned_reason",
            "returned_reason_name"]
        }
      });

    if (res.statusCode !== 201) {
        console.error("Error Response:", res.body);
    }
    expect(res.statusCode).toEqual(201);
    expect(res.body).toHaveProperty('taskId');
    
    taskId = res.body.taskId;
  });

  test('Step 2: Execute Task (Trigger Worker)', async () => {
    const res = await request(app)
      .post('/api/v1/task/execute')
      .set('Authorization', `Bearer ${token}`)
      .send({
          // Body rỗng vì execute tự lấy CURRENT_TASK của user
      });

    expect(res.statusCode).toEqual(202);
  });

  test('Step 3: Poll Status until DONE', async () => {
    let status = 'QUEUED';
    let attempts = 0;
    
    // Chờ tối đa 20 * 2s = 400 giây
    while (status !== 'COMPLETED' && status !== 'FAILED' && attempts < 200) {
      attempts++;
      await new Promise(r => setTimeout(r, 2000)); // Chờ 2s

      const res = await request(app)
        .get('/api/v1/task/get/status')
        .query({ taskId: taskId })
        .set('Authorization', `Bearer ${token}`);

      expect(res.statusCode).toEqual(200);
      
      status = res.body.status;
      console.log(`[Poll #${attempts}] Task Status: ${status}`);
    }

    if (status === 'FAILED') console.error("Task Failed Msg:", status);
    expect(status).toBe('COMPLETED');
  }, 600000); // Timeout 600s
});