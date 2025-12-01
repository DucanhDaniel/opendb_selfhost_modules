import { format } from 'date-fns';
import { POSCAKE_REPORT_TEMPLATES_STRUCTURE } from "./constants.js";

/**
 * Hàm lấy tên đối tác vận chuyển
 */
export function getPartnerName(partnerId) {
    if (partnerId === null || partnerId === undefined) return '';
    const id = parseInt(partnerId, 10);
    const partnerMap = {
        0: "Snappy", 1: "Giao hàng tiết kiệm", 2: "EMS", 3: "Viettel Post", 4: "247 Express",
        5: "Giao hàng nhanh", 17: "Vnpost(Bưu điện)", 15: "J&T", 16: "Best Inc", 9: "DHL",
        19: "Ninja Van", 36: "Nhất Tín Express", 39: "Hola Ship", 11: "Ahamove", 37: "Grab Express",
        38: "Vạn Phúc Express", 32: "SuperShip", 33: "ZTO Express", 10: "J&T Phi", 12: "LBC Express",
        13: "Lazada Express", 42: "Shopee Express", 31: "Ninja van Phi", 35: "Byaheros", 20: "Kerry express",
        21: "Flash express", 22: "Lalamove", 23: "J&T Thai", 24: "Nim express", 25: "Thailand post",
        26: "Thai parcel", 27: "DHL Thai", 28: "CJ logistics", 29: "Best Express Thai", 30: "Ninja van Thai",
        40: "LWE"
    };
    return partnerMap[id] || `ID ${id}`;
}

/**
 * Xử lý một dòng dữ liệu thô thành object phẳng, dùng label làm key.
 * @param {object} rawRow - Dữ liệu thô từ API
 * @param {object} config - Cấu hình template
 * @param {string[]} selectedFields - Danh sách các TECHNICAL ID (ví dụ: id, bill_full_name)
 * @param {object} maps - Các map phụ trợ (warehouseMap, productMap, userMap)
 * @param {number} itemIndex - Index của item con (dùng cho Flattened Report)
 */
export function processPoscakeRow(rawRow, config, selectedFields, maps, itemIndex = 0) {
  const processedRow = {};
  const levelKey = config.levelKey;
  const levelData = rawRow[levelKey] || {};
  
  const { warehouseMap, productMap, userMap } = maps;

  // Helper lấy giá trị nested (a.b.c)
  const getNestedValue = (path) => {
    try {
      if (config.type === "ANALYTICS_REPORT") {
        if (Object.prototype.hasOwnProperty.call(rawRow, path)) return rawRow[path];
        return path.split('.').reduce((o, k) => (o || {})[k], rawRow);
      }
      if (levelKey && path.startsWith(levelKey.split('_')[0] + ".")) {
         const childPath = path.substring(path.indexOf('.') + 1);
         return childPath.split('.').reduce((o, k) => (o || {})[k], levelData);
      }
      if (config.level === "product_warehouse") {
        if (["warehouse_id", "actual_remain_quantity", "remain_quantity"].includes(path)) return levelData[path];
      }
      return path.split('.').reduce((o, k) => (o || {})[k], rawRow);
    } catch (e) { return undefined; }
  };

  selectedFields.forEach(fieldKey => {
    let value;

    // Logic tính toán dựa trên TECHNICAL ID (fieldKey)
    switch (fieldKey) {
        case "is_primary_row": 
          if (itemIndex === 1) {
            value = true;
          } else value = false;
          // value = (itemIndex === 1); 
          break;
        case "item_index": value = itemIndex; break;
        
        case "total_price_calculated": 
            value = (rawRow.items || []).reduce((sum, item) => sum + (item.variation_info?.retail_price * item.quantity || 0), 0); 
            break;
        case "cod_calculated": 
            const total = (rawRow.items || []).reduce((sum, item) => sum + (item.variation_info?.retail_price * item.quantity || 0), 0);
            value = total - (rawRow.total_discount || 0) + (rawRow.shipping_fee || 0);
            break;
        case "item_count": value = (rawRow.items || []).length; break;
        case "item_names": 
            value = (rawRow.items || []).map(item => `${item.variation_info?.name || 'N/A'} (x${item.quantity})`).join('; '); 
            break;
        
        case "warehouse_name": 
             const whId = getNestedValue('warehouse_id');
             value = warehouseMap ? (warehouseMap.get(whId) || whId) : whId;
             break;
        case "Variation.name":
             const varId = getNestedValue("Variation.id");
             value = productMap ? (productMap.get(varId) || `(ID: ${varId})`) : varId;
             break;
        case "User.name":
             const userId = getNestedValue("User.id");
             value = userMap ? (userMap.get(userId) || `(ID: ${userId})`) : userId;
             break;
        case "partner.partner_name": 
             value = getPartnerName(getNestedValue('partner.partner_id')); 
             break;

        default: value = getNestedValue(fieldKey);
    }

    // Format dữ liệu
    if (typeof value === 'string' && value.match(/^\d{4}-\d{2}-\d{2}T/)) {
        // Giữ nguyên ISO string cho DB
    } else if (typeof value === 'object' && value !== null) {
        value = JSON.stringify(value);
    }

    // [QUAN TRỌNG] Tìm tên cột DB tương ứng với Technical ID
    const dbColumnName = _findLabelByTechnicalId(config, fieldKey);
    
    // Gán vào processedRow với key là Tên Cột DB (để map với Prisma/SQL)
    processedRow[dbColumnName || fieldKey] = value;
  });

  return processedRow;
}

/**
 * Hàm helper nội bộ: Tìm Label (DB Column Name) dựa trên ID (Technical Field)
 */
function _findLabelByTechnicalId(config, technicalId) {
    config = POSCAKE_REPORT_TEMPLATES_STRUCTURE[0].templates[0].config;
    // console.log(config[0].templates[0].config);
    if (!config || !config.selectable_fields) return null;
    
    for (const groupName in config.selectable_fields) {
        const fields = config.selectable_fields[groupName];
        // Tìm object có id == technicalId
        const found = fields.find(f => f.id === technicalId);
        if (found) return found.label;
    }
    return technicalId; // Fallback về ID gốc nếu không tìm thấy config
}