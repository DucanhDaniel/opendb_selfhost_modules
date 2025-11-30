import { processPoscakeRow } from '../../../src/services/pancake/helpers.js';

const MOCK_CONFIG = {
  type: "FLATTENED_REPORT",
  levelKey: "item",
  selectable_fields: {
    "Thông tin": [
      { id: "id", label: "order_id" },
      { id: "inserted_at", label: "created_at" },
      { id: "bill_full_name", label: "customer_name" },
      { id: "total_price_calculated", label: "total_amount" },
      { id: "warehouse_name", label: "warehouse_name" },
      { id: "partner.partner_name", label: "carrier_name" },
      { id: "item.variation_info.name", label: "product_name" }
    ]
  }
};

// --- 2. Giả lập Maps ---
const mockMaps = {
  warehouseMap: new Map([["wh_123", "Kho Tổng Hà Nội"]]),
  productMap: new Map(),
  userMap: new Map()
};

// --- 3. Giả lập Dữ liệu Thô (Raw Row) ---
const mockRawRow = {
  id: 1001,
  inserted_at: "2023-10-27T10:30:00.000Z",
  bill_full_name: "Nguyen Van A",
  warehouse_id: "wh_123",
  partner: {
    partner_id: 5 // Giao hàng nhanh
  },
  items: [
    {
      variation_info: { retail_price: 100000, name: "Áo Thun" },
      quantity: 2
    }
  ],
  // Dữ liệu item con (khi đã flatten)
  item: {
    variation_info: { name: "Áo Thun Size M" }
  }
};

// --- 4. Danh sách trường cần lấy (Technical IDs) ---
const selectedFields = [
  "id",
  "inserted_at",
  "bill_full_name",
  "total_price_calculated",
  "warehouse_name",
  "partner.partner_name",
  "item.variation_info.name"
];

function runTest() {
  console.log("🚀 Bắt đầu test processPoscakeRow...");

  try {
    // Gọi hàm cần test
    const result = processPoscakeRow(
        mockRawRow, 
        MOCK_CONFIG, 
        selectedFields, 
        mockMaps, 
        1
    );

    console.log("\n✅ KẾT QUẢ XỬ LÝ:");
    console.log(JSON.stringify(result, null, 2));

    // --- Kiểm tra kết quả (Assertion đơn giản) ---
    
    // 1. Kiểm tra map tên cột (label)
    if (result.order_id === 1001) console.log("✅ Map ID -> order_id: OK");
    else console.error("❌ Lỗi Map ID");

    // 2. Kiểm tra tính toán (total_price = 100k * 2 = 200k)
    if (result.total_amount === 200000) console.log("✅ Tính toán total_price: OK");
    else console.error(`❌ Lỗi tính toán total_price (Ra: ${result.total_amount})`);

    // 3. Kiểm tra Map kho (wh_123 -> Kho Tổng Hà Nội)
    if (result.warehouse_name === "Kho Tổng Hà Nội") console.log("✅ Map Warehouse: OK");
    else console.error("❌ Lỗi Map Warehouse");

    // 4. Kiểm tra Map vận chuyển (5 -> Giao hàng nhanh)
    if (result.carrier_name === "Giao hàng nhanh") console.log("✅ Map Carrier: OK");
    else console.error("❌ Lỗi Map Carrier");

    // 5. Kiểm tra lấy dữ liệu nested (item.variation_info.name)
    if (result.product_name === "Áo Thun Size M") console.log("✅ Nested Value: OK");
    else console.error("❌ Lỗi Nested Value");

  } catch (e) {
    console.error("\n💥 TEST THẤT BẠI:", e);
  }
}

runTest();