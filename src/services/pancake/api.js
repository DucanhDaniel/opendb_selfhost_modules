// src/services/pancake/api.js
import axios from 'axios';
import logger from '../../utils/logger.js';
import { sleep } from '../../utils/sleep.js';
import { POSCAKE_API_BASE_URL } from './constants.js';

/**
 * Gọi API Poscake (Hỗ trợ mảng params key[]=value)
 */
export async function fetchPoscakeApi(endpoint, method = 'get', payload = null, queryParams = {}, apiKey) {
  if (!apiKey) throw new Error("API Key không được để trống.");

  const url = new URL(POSCAKE_API_BASE_URL + endpoint);
  url.searchParams.append("api_key", apiKey);

  // Xử lý params mảng (array) thủ công để khớp với Poscake
  Object.keys(queryParams).forEach(key => {
    const value = queryParams[key];
    if (Array.isArray(value)) {
      value.forEach(item => {
         if (item !== null && item !== undefined) url.searchParams.append(`${key}[]`, item);
      });
    } else if (value !== null && value !== undefined) {
      url.searchParams.append(key, value);
    }
  });

  const options = {
    method: method,
    url: url.toString(),
    headers: { 'Content-Type': 'application/json' },
    data: payload,
    validateStatus: () => true, // Không throw lỗi nếu status != 200
  };

  try {
    const response = await axios(options);
    if (response.status >= 200 && response.status < 300) {
      return response.data;
    }
    // Xử lý lỗi Poscake trả về
    const errorMsg = response.data?.error || response.data?.message || JSON.stringify(response.data);
    throw new Error(`Poscake API Error (${response.status}): ${errorMsg} \n Option: ${method + options.url + payload}`);
  } catch (error) {
    throw error;
  }
}

// --- CÁC HÀM LẤY MAP ---

export async function getWarehouseMap(shopId, apiKey) {
    logger.info(`[Poscake] Lấy danh sách kho cho Shop ${shopId}...`);
    try {
        const res = await fetchPoscakeApi(`/shops/${shopId}/warehouses`, 'get', null, {}, apiKey);
        const map = new Map();
        if (res?.data && Array.isArray(res.data)) {
            res.data.forEach(w => map.set(w.id, w.name));
        }
        return map;
    } catch (e) {
        logger.warn(`Không thể lấy Warehouse Map: ${e.message}`);
        return new Map();
    }
}

export async function getUserMap(shopId, apiKey) {
    logger.info(`[Poscake] Lấy danh sách nhân viên cho Shop ${shopId}...`);
    try {
        const res = await fetchPoscakeApi(`/shops/${shopId}/users`, 'get', null, {}, apiKey);
        const map = new Map();
        if (res?.data && Array.isArray(res.data)) {
            res.data.forEach(entry => {
                if (entry.user) map.set(entry.user.id, entry.user.name);
            });
        }
        return map;
    } catch (e) {
        logger.warn(`Không thể lấy User Map: ${e.message}`);
        return new Map();
    }
}

export async function getProductMap(shopId, apiKey) {
    logger.info(`[Poscake] Đang tạo Product Map (có thể mất thời gian)...`);
    const map = new Map();
    let page = 1;
    try {
        while(true) {
            const res = await fetchPoscakeApi(`/shops/${shopId}/products/variations`, 'get', null, { page_number: page, page_size: 500 }, apiKey);
            if (!res || !res.success || !res.data || res.data.length === 0) break;
            
            res.data.forEach(v => {
                const pName = v.product ? v.product.name : 'N/A';
                const attrs = (v.fields || []).map(f => f.value).join(' - ');
                map.set(v.id, attrs ? `${pName} (${attrs})` : pName);
            });

            if (!res.total_pages || page >= res.total_pages) break;
            page++;
            console.log("Đã lấy xong page: ", page);
            await sleep(200); // Tránh rate limit nhẹ
        }
    } catch (e) {
        logger.warn(`Lỗi khi tạo Product Map: ${e.message}`);
    }
    logger.info(`[Poscake] Đã map được ${map.size} sản phẩm.`);
    return map;
}