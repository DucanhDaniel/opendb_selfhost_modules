// /src/db/dataWriter.js
import prisma from './client.js';

// --- [BƯỚC 1] ---
// Xây dựng cấu hình kiểu dữ liệu dựa trên logic _formatSheetColumns của bạn.
// Chúng ta sử dụng "Tên thân thiện" (friendly names) làm key.
const TYPE_CONFIG = {
  TEXT: new Set([
    "advertiser_id", "campaign_id", "store_id", "item_group_id", "item_id", 
    "tt_user_id", "video_id", "id", "adset_id", "account_id", "name", 
    "objective", "account_name", "status", "effective_status", "buying_type", 
    "bid_strategy", "age", "gender", "publisher_platform", "platform_position", 
    "region", "adset_name", "account_currency", "creative_id", "actor_id", 
    "page_name", "creative_title", "creative_body", "creative_thumbnail_url", 
    "creative_thumbnail_raw_url", "creative_link", "bm_id", "bm_name", 
    "bm_verification_status", "bm_profile_picture_uri", "account_type", 
    "account_status_text", "currency", "timezone_name", "current_payment_method",
    "eventType", "dateTimeInTimezone", "transactionId", "action", "type",
    "billingHubLink", "downloadInvoiceLink", "platform"
  ]),
  FLOAT: new Set([
    "New Messaging Connections", // <-- Chú ý: Key này có dấu cách
    "Cost Purchases", "Website Purchases", "On-Facebook Purchases", "Leads", 
    "Purchases", "Cost Leads", "Cost per New Messaging", "Purchase Value", 
    "Purchase ROAS", "frequency", "ctr", "spend", "cpc", "cpm", 
    "cost_per_conversion", "total_onsite_shopping_value", "cost", 
    "cost_per_order", "gross_revenue", "net_cost", "roas_bid", 
    "target_roi_budget", "max_delivery_budget", "daily_budget", 
    "budget_remaining", "lifetime_budget", "roi", "tax_and_fee",
    "post_video_avg_time_watched", "post_video_view_time", "page_video_view_time",
    "engagement_rate"
    // Thêm "value", "totalValue", "tax" từ schema FbBillingData
    ,"value", "totalValue", "tax", "taxAndFeePercent"
  ]),
  INTEGER: new Set([
    "reach", "impressions", "clicks", "conversion", "video_play_actions", 
    "orders", "product_impressions", "product_clicks", 
    // Thêm các trường INT từ schema
    "page_daily_follows_unique", "page_daily_unfollows_unique", "page_post_engagements",
    "page_fan_adds", "page_fan_removes", "page_views_total", "page_impressions",
    "page_impressions_paid", "page_impressions_unique", "page_impressions_paid_unique",
    "post_impressions", "post_impressions_unique", "post_clicks", "post_impressions_paid",
    "post_impressions_paid_unique", "post_impressions_organic", "post_impressions_organic_unique",
    "post_impressions_fan", "post_impressions_fan_unique", "post_reactions_like_total",
    "post_reactions_love_total", "post_reactions_wow_total", "post_reactions_haha_total",
    "post_reactions_sorry_total", "post_reactions_anger_total", "post_video_views",
    "post_video_followers", "post_video_social_actions", "page_video_views",
    "page_video_views_paid", "page_video_views_organic", "page_video_views_unique",
    "page_video_complete_views_30s", "page_video_complete_views_30s_unique",
    "followers_total", "follows_new", "unfollows", "net_follows", "impressions_total",
    "reach_total", "impressions_paid", "reach_paid", "page_views", "post_reach",
    "engagements", "cta_clicks", "video_views", "post_video_views_unique"
  ]),
  DATE: new Set([
    "start_time", "stop_time", "created_time", "updated_time", "date_start", 
    "date_stop", "bm_created_time", "fetchTimestamp", "date"
  ]),
  JSON: new Set([
    // Các trường này bạn định nghĩa là Json trong schema
    "post_activity_by_action_type", "page_fans_country", "page_fans_city",
    "page_fan_adds_by_paid_non_paid_unique", "post_video_retention_graph",
    "post_video_likes_by_reaction_type", "post_reactions_by_type_total"
  ])
};

// --- [BƯỚC 2] ---
// Ánh xạ "Tên thân thiện" (từ selectable_fields) sang "Tên trường" (trong schema).
// Chỉ cần định nghĩa những trường có tên khác nhau.
const KEY_MAP = {
  "New Messaging Connections": "newMessagingConnections",
  "Cost per New Messaging": "costPerNewMessaging",
  "Cost Leads": "costLeads",
  "Cost Purchases": "costPurchases",
  "Purchase Value": "purchaseValue",
  "Purchase ROAS": "purchaseROAS",
  "Website Purchases": "websitePurchases",
  "On-Facebook Purchases": "onFacebookPurchases",
  // Thêm các key đặc biệt cho Billing
  "Account ID": "accountId",
  "Account Name": "accountName",
  "Event Type": "eventType",
  "Date Time In Timezone": "dateTimeInTimezone",
  "Fetch Timestamp": "fetchTimestamp",
  "Currency": "currency",
  "Value": "value",
  "Transaction ID": "transactionId",
  "Action": "action",
  "Type": "type",
  "Tax & Fee %": "taxAndFeePercent",
  "Total Value": "totalValue",
  "Billing Hub Link": "billingHubLink",
  "Download Invoice Link": "downloadInvoiceLink",
  "Leads" : "leads",
  "Purchases" : "purchases"
};

// --- [BƯỚC 3] ---
// Ánh xạ `templateName` đến `model` Prisma tương ứng.
// Đây là bộ điều phối chính.
const TEMPLATE_MAP = {
  // FAD
  "Campaign Overview Report": { model: prisma.campaignOverviewReport },
  "Campaign Performance by Age": { model: prisma.campaignPerformanceByAge },
  "Campaign Performance by Gender": { model: prisma.campaignPerformanceByGender },
  "Campaign Performance by Platform": { model: prisma.campaignPerformanceByPlatform },
  "Campaign Performance by Region": { model: prisma.campaignPerformanceByRegion },
  "Ad Set Performance Report": { model: prisma.adSetPerformanceReport },
  "Ad Performance Report": { model: prisma.adPerformanceReport },
  "Account Daily Report": { model: prisma.accountDailyReport },
  "Campaign Daily Report": { model: prisma.campaignDailyReport },
  "Ad Set Daily Report": { model: prisma.adSetDailyReport },
  "Ad Daily Report": { model: prisma.adDailyReport },
  "Ad Creative Report": { model: prisma.adCreativeReport },
  "BM & Ad Accounts": { model: prisma.bmAndAdAccounts },
  // FBT
  "FB Billing Data": { model: prisma.fbBillingData },
  // MPI
  "BC Tương tác & Tăng trưởng Cộng đồng": { model: prisma.bcTuongTacTangTruongCongDong },
  "BC Hiển thị & Tiếp cận Trang": { model: prisma.bcHienThiTiepCanTrang },
  "BC Hiệu suất Bài viết (Tổng hợp)": { model: prisma.bcHieuSuatBaiVietTongHop },
  "BC Phân tích Cảm xúc Bài viết": { model: prisma.bcPhanTichCamXucBaiViet },
  "BC Phân tích: Fan theo Vị trí": { model: prisma.bcPhanTichFanTheoViTri },
  "BC Phân tích: Nguồn Lượt thích Mới": { model: prisma.bcPhanTichNguonLuotThichMoi },
  "BC Hiệu suất Video (Từng video)": { model: prisma.bcHieuSuatVideoTungVideo },
  "BC Hiệu suất Video (Tổng hợp)": { model: prisma.bcHieuSuatVideoTongHop },
  "BC Tổng hợp Hiệu suất Trang (Nâng cao)": { model: prisma.bcTongHopHieuSuatTrangNangCao },
  "BC Hiệu suất Bài viết (Lifetime)": { model: prisma.bcHieuSuatBaiVietLifetime },
};

/**
 * Hàm nội bộ: Chuyển đổi key và chuẩn hóa kiểu dữ liệu cho một dòng.
 * @param {object} rawRow - Dòng dữ liệu thô từ processor.
 * @returns {object} - Dòng dữ liệu đã được dọn dẹp để ghi vào DB.
 */
function _transformAndSanitizeRow(rawRow) {
  const sanitizedRow = {};

  for (const friendlyKey in rawRow) {
    if (Object.prototype.hasOwnProperty.call(rawRow, friendlyKey)) {
      // 1. Lấy giá trị gốc
      let value = rawRow[friendlyKey];

      // 2. Tìm key mới (camelCase)
      const newKey = KEY_MAP[friendlyKey] || friendlyKey;

      // 3. Bỏ qua nếu giá trị là null hoặc undefined
      if (value === null || value === undefined) {
        sanitizedRow[newKey] = null;
        continue;
      }

      // 4. Chuẩn hóa kiểu dữ liệu dựa trên "Tên thân thiện"
      if (TYPE_CONFIG.FLOAT.has(friendlyKey)) {
        value = parseFloat(value);
        if (isNaN(value)) value = 0;
      } 
      else if (TYPE_CONFIG.INTEGER.has(friendlyKey)) {
        value = parseInt(value, 10);
        if (isNaN(value)) value = 0;
      } 
      else if (TYPE_CONFIG.DATE.has(friendlyKey)) {
        try {
          const date = new Date(value);
          if (isNaN(date.getTime())) {
            value = null; // Ngày tháng không hợp lệ
          } else {
            value = date;
          }
        } catch (e) {
          value = null;
        }
      } 
      else if (TYPE_CONFIG.JSON.has(friendlyKey)) {
        // API có thể trả về object sẵn, hoặc stringified JSON
        if (typeof value === 'string') {
          try {
            value = JSON.parse(value);
          } catch (e) {
            value = null; // Gán null nếu parse lỗi
          }
        } else if (typeof value !== 'object') {
          value = null; // Chỉ chấp nhận string hoặc object
        }
      }
      else if (TYPE_CONFIG.TEXT.has(friendlyKey)) {
         // Đảm bảo là string
        value = String(value);
      }
      // Các trường không xác định sẽ được giữ nguyên (ví dụ: boolean)

      sanitizedRow[newKey] = value;
    }
  }

  // Xử lý đặc biệt cho FbBillingData (dùng Decimal)
  // Prisma cần string cho Decimal, nhưng `parseFloat` ở trên đã đổi nó thành number.
  // Chúng ta cần giữ nó ở dạng string gốc nếu nó là Decimal.
  if (sanitizedRow.value !== undefined && typeof rawRow['Value'] === 'string') {
    sanitizedRow.value = rawRow['Value'];
  }
  if (sanitizedRow.totalValue !== undefined && typeof rawRow['Total Value'] === 'string') {
    sanitizedRow.totalValue = rawRow['Total Value'];
  }
  if (sanitizedRow.tax !== undefined && typeof rawRow['Tax'] === 'string') {
    sanitizedRow.tax = rawRow['Tax'];
  }


  return sanitizedRow;
}

/**
 * Hàm điều phối chính.
 * Nhận một mảng dữ liệu và tên template, sau đó ghi vào bảng Postgre tương ứng.
 *
 * @param {string} templateName - Tên của template (ví dụ: "Campaign Overview Report").
 * @param {Array<object>} dataRows - Mảng các đối tượng dữ liệu đã được làm phẳng.
 * @returns {Promise<{success: boolean, count: number, error?: string}>}
 */
export async function writeDataToDatabase(templateName, dataRows) {
  // 1. Kiểm tra đầu vào
  if (!dataRows || dataRows.length === 0) {
    console.log(`DB Writer: Không có dữ liệu để ghi cho "${templateName}".`);
    return { success: true, count: 0 };
  }

  // 2. Tìm model và keyMap dựa trên templateName
  const config = TEMPLATE_MAP[templateName];
  if (!config) {
    console.warn(`DB Writer: Không tìm thấy model nào cho template: "${templateName}"`);
    return { 
      success: false, 
      count: 0, 
      error: `Template không được hỗ trợ: ${templateName}` 
    };
  }

  const { model } = config;

  // 3. [QUAN TRỌNG] Chuyển đổi key và chuẩn hóa kiểu dữ liệu
  const sanitizedData = dataRows.map(row => _transformAndSanitizeRow(row));

    // --- [LOGIC LỌC MỚI] ---
  // Lọc bỏ các dòng mà 'spend' là null, undefined, hoặc 0 sau khi chuẩn hóa
  const filteredData = sanitizedData.filter(row => {
    // Kiểm tra xem trường 'spend' có tồn tại và có giá trị lớn hơn 0 không
    // Lưu ý: hàm _transformAndSanitizeRow đã chuyển spend thành number, NaN thành 0
    return row.spend !== undefined && row.spend !== null && row.spend > 0;
  });

  const originalCount = sanitizedData.length;
  const filteredCount = filteredData.length;
  if (originalCount !== filteredCount) {
    console.log(`DB Writer (${templateName}): Đã lọc bỏ ${originalCount - filteredCount} dòng do spend không hợp lệ.`);
  }

  // Nếu sau khi lọc không còn dữ liệu
  if (filteredCount === 0) {
    console.log(`DB Writer (${templateName}): Không còn dòng nào hợp lệ sau khi lọc spend.`);
    return { success: true, count: 0 };
  }
  // --- [KẾT THÚC LOGIC LỌC] ---

  // 4. Thực thi ghi vào Database
  try {
    const result = await model.createMany({
      data: filteredData,
      skipDuplicates: false, // Tạm thời tắt để debug, bật lên (true) khi bạn có @unique
    });
    
    console.log(`DB Writer: Ghi thành công ${result.count} dòng vào bảng cho "${templateName}".`);
    return { success: true, count: result.count };
    
  } catch (e) {
    console.error(`DB Writer: Lỗi nghiêm trọng khi ghi dữ liệu cho "${templateName}":`, e.message);
    // Log thêm 1 dòng dữ liệu đầu tiên (đã chuẩn hóa) để debug lỗi type
    if (sanitizedData.length > 0) {
      console.error("Dữ liệu mẫu (đã chuẩn hóa) gây lỗi:", JSON.stringify(sanitizedData[0], null, 2));
    }
    return { success: false, count: 0, error: e.message };
  }
}
