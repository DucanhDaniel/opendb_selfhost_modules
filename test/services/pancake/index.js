import 'dotenv/config';
import { processPoscakeJob } from '../../../src/services/pancake/index.js';

// --- 1. CẤU HÌNH TEST ---
const API_KEY = "";
const SHOP_ID = "2443210"; // ID Shop Poscake của bạn
const USER_ID = "test-user-local"; // ID User giả định
const TASK_ID = "test-task-local";

// Chọn Template để test
// const TEMPLATE_NAME = "Đơn hàng Tóm tắt (Theo Đơn)"; // BASIC_REPORT
const TEMPLATE_NAME = "Báo cáo đơn hàng chi tiết (Full Data)"; // FLATTENED_REPORT

// Thời gian test (Nên chọn ngắn)
const START_DATE = "2023-10-01";
const END_DATE = "2023-10-03";

// Chế độ ghi DB:
// true: Ghi thật vào Postgres (Cần DB đang chạy)
// false: Chỉ chạy logic API và trả về kết quả (An toàn để debug)
const WRITE_DATA = true; 

// --- 2. GIẢ LẬP LOGGER ---
// Vì hàm processPoscakeJob cần một object logger có hàm info, warn, error
const mockTaskLogger = {
    info: (msg) => console.log(`[INFO] ${msg}`),
    warn: (msg) => console.warn(`[WARN] ${msg}`),
    error: (msg) => console.error(`[ERROR] ${msg}`),
};

async function runTest() {
  console.time("⏱️ Thời gian chạy");
  console.log("🚀 Bắt đầu test Poscake Index (Dispatcher)...");

  if (!API_KEY || API_KEY.includes("DIEN_API_KEY")) {
    console.error("❌ Thiếu API Key. Vui lòng kiểm tra biến API_KEY.");
    process.exit(1);
  }

  // 3. Giả lập Options (Task Params)
  const mockOptions = {
    taskId: TASK_ID,
    shopId: SHOP_ID,
    templateName: TEMPLATE_NAME,
    startDate: START_DATE,
    endDate: END_DATE,
    // Các trường muốn lấy (Technical IDs)
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
//   "received_at_shop",
//   "order_sources_name",
//   "order_sources",
//   "ads_source",
//   "ad_id",
//   "page_id",
//   "page.name",
//   "page.username",
//   "post_id",
//   "marketer",
//   "p_utm_source",
//   "p_utm_medium",
//   "p_utm_campaign",
//   "p_utm_content",
//   "p_utm_term",
//   "creator.id",
//   "creator.name",
//   "assigning_seller.name",
//   "assigning_seller_id",
//   "time_assign_seller",
//   "assigning_care.name",
//   "assigning_care_id",
//   "time_assign_care",
//   "last_editor.name",
//   "customer.id",
//   "customer.customer_id",
//   "bill_full_name",
//   "bill_phone_number",
//   "bill_email",
//   "gender",
//   "shipping_address.full_address",
//   "shipping_address.address",
//   "shipping_address.commnue_name",
//   "shipping_address.district_name",
//   "shipping_address.province_name",
//   "shipping_address.post_code",
//   "order_currency",
//   "total_price",
//   "total_price_after_sub_discount",
//   "total_discount",
//   "money_to_collect",
//   "cod",
//   "partner.cod",
//   "tax",
//   "surcharge",
//   "cost_surcharge",
//   "shipping_fee",
//   "partner_fee",
//   "fee_marketplace",
//   "customer_pay_fee",
//   "is_free_shipping",
//   "payment_method_string",
//   "cash",
//   "transfer_money",
//   "charged_by_card",
//   "charged_by_momo",
//   "charged_by_vnpay",
//   "charged_by_qrpay",
//   "charged_by_kredivo",
//   "charged_by_fundiin",
//   "prepaid",
//   "prepaid_by_point.point",
//   "exchange_value",
//   "partner.partner_name",
//   "partner.extend_code",
//   "time_send_partner",
//   "additional_info.service_partner",
//   "warehouse_id",
//   "warehouse_name",
//   "warehouse_info.full_address",
//   "total_quantity",
//   "items_length",
//   "item.id",
//   "item.variation_info.product_display_id",
//   "item.variation_info.display_id",
//   "item.variation_info.name",
//   "item.quantity",
//   "item.variation_info.retail_price",
//   "item.variation_info.last_imported_price",
//   "item.discount_each_product",
//   "item_price_after_discount",
//   "item_total_value",
//   "item.variation_info.weight",
//   "item.note",
//   "item.is_bonus_product",
//   "item.is_wholesale",
//   "note",
//   "note_print",
//   "tags_string",
//   "is_livestream",
//   "is_live_shopping",
//   "is_smc",
//   "is_exchange_order",
//   "returned_reason",
//   "returned_reason_name"
    ]
  };

  try {
    console.log(`📡 Đang gọi processPoscakeJob cho template: "${TEMPLATE_NAME}"`);
    console.log(`⚙️ Chế độ ghi DB: ${WRITE_DATA}`);

    // 4. GỌI HÀM CHÍNH
    const result = await processPoscakeJob(
        mockOptions,    // options
        API_KEY,        // apiKey
        USER_ID,        // userId
        mockTaskLogger, // task_logger
        TASK_ID,
        WRITE_DATA      // writeData flag
    );

    // 5. KẾT QUẢ
    console.log("\n✅ KẾT QUẢ TRẢ VỀ:");
    console.log(result);

    if (!WRITE_DATA && result.newRows === 0) {
        console.log("👉 Lưu ý: newRows = 0 là ĐÚNG vì bạn đang để WRITE_DATA = false.");
    }

  } catch (error) {
    console.error("\n❌ TEST THẤT BẠI:");
    console.error(error.message);
    if (error.stack) console.error(error.stack);
  } finally {
    console.timeEnd("⏱️ Thời gian chạy");
    process.exit(0);
  }
}

runTest();