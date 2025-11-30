import 'dotenv/config';
import fs, { truncate } from 'fs';
import path from 'path';
import logger from '../../../src/utils/logger.js';
import { processBasicReport } from '../../../src/services/pancake/processors/basic.js';
import { getWarehouseMap, getProductMap, getUserMap } from '../../../src/services/pancake/api.js';

// --- CẤU HÌNH TEST (Điền thông tin thật của bạn vào đây) ---
const API_KEY = process.env.POSCAKE_API_KEY || "594582e1efdd4a3eaae0c7a65a01134a";
const SHOP_ID = "2443210"; // ID của Shop Poscake
const START_DATE = "2023-10-01";
const END_DATE = "2023-10-05";

// Giả lập config từ template "Đơn hàng Tóm tắt (Theo Đơn)"
const MOCK_CONFIG = {
  type: "ORDER_ITEMS_FLAT", 
  apiEndpoint: "/orders",
  level: "order",
  requires_warehouse_map: true,
  requires_product_map: true, // Test thử không cần map sản phẩm
  requires_user_map: true,
};

const allFieldIds = [
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
  "returned_reason_name"
];


// Hàm lưu dữ liệu ra file JSON
function saveToJsonFile(data, filename = "pancake_data.json") {
  try {
    const outputDir = path.join(process.cwd(), 'output');
    
    // Tạo thư mục output nếu chưa tồn tại
    if (!fs.existsSync(outputDir)) {
      fs.mkdirSync(outputDir, { recursive: true });
    }

    const filePath = path.join(outputDir, filename);
    
    // Ghi dữ liệu vào file JSON
    fs.writeFileSync(filePath, JSON.stringify(data, null, 2), 'utf-8');
    
    logger.info(`✅ Dữ liệu đã được lưu vào: ${filePath}`);
    return filePath;
  } catch (error) {
    logger.error(`❌ Lỗi khi lưu file JSON: ${error.message}`);
    throw error;
  }
}



async function runTest() {
  console.time("⏱️ Thời gian chạy");
  logger.info("🚀 Bắt đầu test Poscake Basic Processor...");

  if (!API_KEY || API_KEY.includes("DIEN_API_KEY")) {
    logger.error("❌ Thiếu API Key. Vui lòng điền vào biến const API_KEY.");
    process.exit(1);
  }

  try {
    // 1. Chuẩn bị Maps (Giống như hàm index.js làm)
    logger.info("📦 Đang tải các Map phụ trợ...");
    const warehouseMap = MOCK_CONFIG.requires_warehouse_map ? await getWarehouseMap(SHOP_ID, API_KEY) : new Map();
    const userMap = MOCK_CONFIG.requires_user_map ? await getUserMap(SHOP_ID, API_KEY) : new Map();
    const productMap = await getProductMap(SHOP_ID, API_KEY); 
    
    const maps = {
        warehouseMap,
        userMap,
        productMap
    };
    logger.info(`✅ Đã tải Maps: Warehouse(${warehouseMap.size}), User(${userMap.size})`);

    // 2. Chuẩn bị Options
    const options = {
        shopId: SHOP_ID,
        startDate: START_DATE,
        endDate: END_DATE,
        selectedFields: allFieldIds,
        apiKey: API_KEY,
    };

    // 3. Gọi Processor
    logger.info("🔄 Đang gọi processBasicReport...");
    const result = await processBasicReport(options, MOCK_CONFIG, maps, "user-test-id");

    // 4. Kiểm tra kết quả
    logger.info("\n✅ KẾT QUẢ:");
    logger.info(`Status: ${result.status}`);
    logger.info(`Total Rows: ${result.newRows}`);
    
    if (result.data && result.data.length > 0) {
        console.log("\n--- Dữ liệu mẫu (2 dòng đầu) ---");
        console.log(JSON.stringify(result.data.slice(0, 2), null, 2));
        
        // Kiểm tra xem warehouse_name có được map không
        const sampleRow = result.data[0];
        if (sampleRow.warehouse_name && isNaN(sampleRow.warehouse_name)) {
             logger.info("✨ Kiểm tra Map: Warehouse Name đã được map thành công (không phải ID).");
        }

        // 5. Lưu dữ liệu ra file JSON
        logger.info("\n💾 Đang lưu dữ liệu ra file JSON...");
        const dataFilePath = saveToJsonFile(result.data, `pancake_data.json`);
        // const resultsFilePath = saveTestResults(result, `test_results_${new Date().getTime()}.json`);
        
        logger.info(`\n📊 Tóm tắt:`);
        logger.info(`- Tổng dòng dữ liệu: ${result.data.length}`);
        logger.info(`- File dữ liệu: ${dataFilePath}`);
        // logger.info(`- File kết quả: ${resultsFilePath}`);
    } else {
        logger.warn("⚠️ Không có dữ liệu nào được trả về.");
    }

  } catch (error) {
    logger.error("\n❌ TEST THẤT BẠI:");
    logger.error(error.message);
    if (error.stack) console.error(error.stack);
  } finally {
    console.timeEnd("⏱️ Thời gian chạy");
    process.exit(0);
  }
}

runTest();