import prisma from './client.js';
import { chunkArray } from '../utils/array_utils.js';

// --- TYPE_CONFIG và KEY_MAP ---
const DB_BATCH_SIZE_ROWS = 200;
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
    "billingHubLink", "downloadInvoiceLink", "platform", "user_id"
  ]),
  FLOAT: new Set([
    "purchaseROAS", "frequency", "ctr", "spend", "cpc", "cpm", "average_video_play", "total_amount", "total_after_sub_discount",
    "cost_per_conversion", "total_onsite_shopping_value", "cost", "total_discount", "amount_to_collect", "cod_amount",
    "cost_per_order", "gross_revenue", "net_cost", "roas_bid", "carrier_cod_amount", "tax_amount", "surcharge_amount",
    "surcharge_cost", "shipping_fee_customer", "shipping_fee_carrier", "marketplace_fee", "payment_cash", "payment_transfer",
    "payment_card", "payment_momo", "payment_vnpay", "payment_qrpay", "payment_kredivo", "payment_fundiin", "payment_prepaid",
    "payment_points", "exchange_value", "item_quantity", "item_retail_price", "item_cost_price", "item_discount", "item_price_final",
    "item_total_amount", "item_weight",
    "target_roi_budget", "max_delivery_budget", "daily_budget", "ad_video_view_rate_2s", "ad_video_view_rate_6s", "ad_video_view_rate_p100",
    "budget_remaining", "lifetime_budget", "roi", "tax_and_fee", "ad_video_view_rate_p25", "ad_video_view_rate_p50", "ad_video_view_rate_p75",
    "post_video_avg_time_watched", "post_video_view_time", "page_video_view_time", "product_click_rate",
    "engagement_rate", "conversion_rate", "onsite_shopping_roas", "cost_per_onsite_shopping",
    "taxAndFeePercent", "costPerNewMessaging", "costLeads", "purchaseValue", "costPurchases", "amount_spent", "balance", "ad_conversion_rate"
  ]),
  DECIMAL: new Set(["value", "totalValue", "tax"]),
  INTEGER: new Set([
    "reach", "impressions", "clicks", "conversion", "video_play_actions", "video_watched_2s", "video_watched_6s", "video_views_p25",
    "orders", "product_impressions", "product_clicks", "video_views_p50", "video_views_p75", "video_views_p100",
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
    "followers_total", "follows_new", "unfollows", "net_follows", "impressions_total", "order_total_quantity",
    "reach_total", "impressions_paid", "reach_paid", "page_views", "post_reach", 
    "engagements", "cta_clicks", "video_views", "post_video_views_unique", "profile_visits", "likes", "comments", "shares", "follows", "live_views",
    "newMessagingConnections", "leads", "websitePurchases", "onFacebookPurchases", "purchases", "purchase", "onsite_shopping", "status_code", "is_received_at_shop", "order_item_count"
  ]),
  DATE: new Set([
    "start_time", "stop_time", "created_time", "updated_time", "date_start", "schedule_start_time", "schedule_end_time", "seller_assigned_at", 
    "date_stop", "bm_created_time", "fetchTimestamp", "date", "stat_time_day", "start_date", "end_date", "created_at", "updated_at", "care_assigned_at", "sent_to_carrier_at"
  ]),
  JSON: new Set([
    "post_activity_by_action_type", "page_fans_country", "page_fans_city",
    "page_fan_adds_by_paid_non_paid_unique", "post_video_retention_graph",
    "post_video_likes_by_reaction_type", "post_reactions_by_type_total"
  ]),
  BOOLEAN: new Set([
    "is_primary_row", "is_locked", "is_received_at_shop", "is_customer_paying_shipping", "is_free_shipping", 
    "is_bonus_item", "is_wholesale_item", "is_livestream", "is_live_shopping", "is_social_commerce", "is_exchange_order"
  ])
};

const KEY_MAP = {
  "New Messaging Connections": "newMessagingConnections",
  "Cost per New Messaging": "costPerNewMessaging",
  "Leads": "leads",
  "Cost Leads": "costLeads",
  "Purchases": "purchases",
  "Cost Purchases": "costPurchases",
  "Purchase Value": "purchaseValue",
  "Purchase ROAS": "purchaseROAS",
  "Website Purchases": "websitePurchases",
  "On-Facebook Purchases": "onFacebookPurchases",
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
  "Download Invoice Link": "downloadInvoiceLink"
};

const TEMPLATE_MAP = {
  // --- FAD ---
  "Campaign Overview Report": {
    tableName: "FAD_CampaignOverviewReport",
    conflictTarget: ["account_id", "date_start", "date_stop", "id"], // Columns to delete old rows, ensure data is not duplicated
    filter_spend: true, // Specify if this template need to be filtered when spend is null
    insightDateKey: ["date_start", "date_stop"]
  },
   "Campaign Performance by Age": {
     tableName: "FAD_CampaignPerformanceByAge",
     conflictTarget: ["account_id", "date_start", "date_stop", "campaign_name", "age"],
      filter_spend: true,
      insightDateKey: ["date_start", "date_stop"]
   },
   "Campaign Performance by Gender": {
     tableName: "FAD_CampaignPerformanceByGender",
     conflictTarget: ["account_id", "date_start", "date_stop", "campaign_name", "gender"],
      filter_spend: true,
      insightDateKey: ["date_start", "date_stop"]
   },
   "Campaign Performance by Platform": {
     tableName: "FAD_CampaignPerformanceByPlatform",
     conflictTarget: ["account_id", "date_start", "date_stop", "campaign_name", "publisher_platform", "platform_position"],
      filter_spend: true,
      insightDateKey: ["date_start", "date_stop"]
   },
    "Campaign Performance by Region": {
      tableName: "FAD_CampaignPerformanceByRegion",
      conflictTarget: ["account_id", "date_start", "date_stop", "campaign_name", "region"],
      filter_spend: true,
      insightDateKey: ["date_start", "date_stop"]
  },
  "Ad Set Performance Report": {
      tableName: "FAD_AdSetPerformanceReport",
      conflictTarget: ["account_id", "date_start", "date_stop", "campaign_id", "id"],
      filter_spend: true,
      insightDateKey: ["date_start", "date_stop"]
  },
 "Ad Performance Report": {
     tableName: "FAD_AdPerformanceReport",
     conflictTarget: ["account_id", "date_start", "date_stop", "campaign_id", "adset_id", "id"], 
      filter_spend: true,
      insightDateKey: ["date_start", "date_stop"]
 },
 "Account Daily Report": {
     tableName: "FAD_AccountDailyReport",
     conflictTarget: ["account_id", "date_start", "date_stop"],
      filter_spend: true,
      insightDateKey: ["date_start", "date_stop"]
 },
 "Campaign Daily Report": {
     tableName: "FAD_CampaignDailyReport",
     conflictTarget: ["account_id", "date_start", "date_stop", "campaign_id"],
      filter_spend: true,
      insightDateKey: ["date_start", "date_stop"]
 },
 "Ad Set Daily Report": {
     tableName: "FAD_AdSetDailyReport",
     conflictTarget: ["account_id", "date_start", "date_stop", "campaign_id", "id"],
      filter_spend: true,
      insightDateKey: ["date_start", "date_stop"]
 },
 "Ad Daily Report": {
     tableName: "FAD_AdDailyReport",
     conflictTarget: ["account_id", "date_start", "date_stop", "campaign_id", "adset_id", "id"],
      filter_spend: true,
      insightDateKey: ["date_start", "date_stop"]
 },
 "Ad Creative Report": {
    tableName: "FAD_AdCreativeReport",
    conflictTarget: ["account_id", "date_start", "date_stop", "campaign_id", "adset_id", "id"],
      filter_spend: true,
      insightDateKey: ["date_start", "date_stop"]
 },
 "BM & Ad Accounts": {
     tableName: "FAD_BmAndAdAccounts",
     conflictTarget: ["bm_id", "account_id"], 
 },
 // FBT
 "FB Billing Data": {
   tableName: "FBT_FbBillingData",
   conflictTarget: ["accountId", "transactionId"], 
 },

  // TTA
  "Campaign Performance": {
    tableName: "TTA_CampaignPerformance",
    conflictTarget: ["advertiser_id", "campaign_id", "objective_type", "start_date", "end_date"],
    insightDateKey: ["start_date", "end_date"],
    filter_spend: true 
  }, 

  "AdGroup Performance": {
    tableName: "TTA_AdGroupPerformance",
    conflictTarget: ["advertiser_id", "campaign_id", "adgroup_id", "start_date", "end_date"],
    insightDateKey: ["start_date", "end_date"],
    filter_spend: true 
  },

  "Ad Performance": {
    tableName: "TTA_AdPerformance",
    conflictTarget: ["advertiser_id", "campaign_name", "adgroup_name", "ad_id", "start_date", "end_date"],
    insightDateKey: ["start_date", "end_date"],
    filter_spend: true 
  },

  "Creative Performance (Video/Image)": {
    tableName: "TTA_CreativePerformance",
    conflictTarget: ["advertiser_id", "campaign_id", "adgroup_id", "ad_id", "start_date", "end_date"],
    insightDateKey: ["start_date", "end_date"],
    filter_spend: true 
  },

  "Audience Report: Region by Campaign": {
    tableName: "TTA_AudienceRegionReport",
    conflictTarget: ["advertiser_id", "start_date", "end_date", "campaign_id", "province_id"],
    insightDateKey: ["start_date", "end_date"],
    filter_spend: true 
  },

  "Audience Report: Country by Campaign": {
    tableName: "TTA_AudienceCountryReport",
    conflictTarget: ["stat_time_day", "advertiser_id", "campaign_id", "start_date", "end_date", "country_code"],
    insightDateKey: ["start_date", "end_date"],
    filter_spend: true 
  },

  "Audience Report: Age by Campaign": {
    tableName: "TTA_AudienceAgeReport",
    conflictTarget: ["stat_time_day", "advertiser_id", "campaign_id", "start_date", "end_date", "age"],
    insightDateKey: ["start_date", "end_date"],
    filter_spend: true 
  },

  "Audience Report: Gender by Campaign": {
    tableName: "TTA_AudienceGenderReport",
    conflictTarget: ["stat_time_day", "advertiser_id", "campaign_id", "start_date", "end_date", "gender"],
    insightDateKey: ["start_date", "end_date"],
    filter_spend: true
  },

  "Audience Report: Age & Gender by Campaign": {
    tableName: "TTA_AudienceAgeGenderReport",
    conflictTarget: ["stat_time_day", "campaign_id", "gender", "age", "start_date", "end_date", "advertiser_id"],
    insightDateKey: ["start_date", "end_date"],
    filter_spend: true
  },

  "Placement Report by Campaign": {
    tableName: "TTA_PlacementReport",
    conflictTarget: ["advertiser_id", "campaign_id", "start_date", "end_date", "placement"],
    insightDateKey: ["start_date", "end_date"],
    filter_spend: true
  },

  "Platform Report by Campaign": {
    tableName: "TTA_PlatformReport",
    conflictTarget: ["advertiser_id", "campaign_id", "start_date", "end_date", "platform"],
    insightDateKey: ["start_date", "end_date"],
    filter_spend: true
  },

  "GMV Campaign / Product Detail": {
    tableName: "GMV_ProductDetailReport",
    conflictTarget: ["advertiser_id", "store_id", "campaign_id", "start_date", "end_date"],
    insightDateKey: ["start_date", "end_date"],
    filter_spend: false // Trong logic của GMV detail đã có sẵn lọc cost để tối ưu xử lý
  },

  "GMV Campaign / Creative Detail": {
    tableName: "GMV_CreativeDetailReport",
    conflictTarget: ["advertiser_id", "store_id", "campaign_id", "start_date", "end_date", "item_group_id"],
    insightDateKey: ["start_date", "end_date"],
    filter_spend: false // Trong logic của GMV detail đã có sẵn lọc cost để tối ưu xử lý
  },

  "GMV Product Campaign Performance": {
    tableName: "GMV_ProductCampaignPerformance",
    conflictTarget: ["advertiser_id", "store_id", "campaign_id", "start_date", "end_date", "start_time_day"],
    insightDateKey: ["start_date", "end_date"],
    filter_spend: false
  },

  "GMV All Campaign Performance": {
    tableName: "GMV_AllCampaignPerformance",
    conflictTarget: ["advertiser_id", "store_id", "campaign_id", "start_date", "end_date", "start_time_day"],
    insightDateKey: ["start_date", "end_date"],
    filter_spend: false
  },

  "GMV Live Campaign Performance": {
    tableName: "GMV_LiveCampaignPerformance",
    conflictTarget: ["advertiser_id", "store_id", "campaign_id", "start_date", "end_date", "start_time_day"],
    insightDateKey: ["start_date", "end_date"],
    filter_spend: false
  },

  "Báo cáo đơn hàng chi tiết (Full Data)": {
    tableName: "POS_BasicReport",
    conflictTarget: ["shop_id", "order_id", "display_id", "system_id", "conversation_id"],
    insightDateKey: [],
    filter_spend: false
  }
};

/**
 * Hàm nội bộ: Chuyển đổi key và chuẩn hóa kiểu dữ liệu cho một dòng.
 */
function _transformAndSanitizeRow(rawRow, index, userId) {
  const sanitizedRow = {user_id: userId};
  for (const friendlyKey in rawRow) {
    if (Object.prototype.hasOwnProperty.call(rawRow, friendlyKey)) {
      let originalValue = rawRow[friendlyKey];
      let value = originalValue;
      const newKey = KEY_MAP[friendlyKey] || friendlyKey;

      if (value === -1 || value === "-1" || value == "") {
        value = null;
      }

      if (value === null || value === undefined) {
         if (TYPE_CONFIG.FLOAT.has(newKey) || TYPE_CONFIG.INTEGER.has(newKey) || TYPE_CONFIG.DECIMAL.has(newKey)) {
            value = 0;
         } else if (TYPE_CONFIG.BOOLEAN.has(newKey)) {
            if (newKey === "is_primary_row") {value = false; } // Đặc biệt cho trường POSCAKE
         }
        else if (TYPE_CONFIG.TEXT.has(newKey)) {
            value = "";
         }
        else value = null;
        sanitizedRow[newKey] = value;
        continue;
      }

      if (TYPE_CONFIG.FLOAT.has(newKey) || TYPE_CONFIG.INTEGER.has(newKey)) {
         let numericValue = Number(value);
         if (isNaN(numericValue)) {
             numericValue = 0;
         }
         value = TYPE_CONFIG.INTEGER.has(newKey) ? Math.round(numericValue) : numericValue;
      }
      else if (TYPE_CONFIG.DECIMAL.has(newKey)) {
         if (typeof value !== 'string') {
           value = String(value);
         }
      }
      else if (TYPE_CONFIG.DATE.has(newKey)) {
        try {
          const date = new Date(value);
          value = isNaN(date.getTime()) ? null : date;
        } catch (e) { value = null; }
      }
      else if (TYPE_CONFIG.JSON.has(newKey)) {
        if (typeof value === 'string') {
          try { value = JSON.parse(value); } catch (e) { value = null; }
        } else if (typeof value !== 'object') { value = null; }
      }
      else if (TYPE_CONFIG.TEXT.has(newKey)) {
        value = String(value);
      }
      else if (TYPE_CONFIG.BOOLEAN.has(newKey)) {
        value = Boolean(value);
      }
      sanitizedRow[newKey] = value;
    }
  }
  return sanitizedRow;
}

export async function writeDataToDatabase(templateName, dataRows, userId) {
  // 1. Kiểm tra đầu vào
  if (!dataRows || dataRows.length === 0) {
    console.log(`DB Writer: No data to write/upsert for "${templateName}".`);
    return { success: true, count: 0 };
  }

  // 2. Tìm config
  const config = TEMPLATE_MAP[templateName];
  if (!config || !config.tableName || !config.conflictTarget) {
    console.warn(`DB Writer: Incomplete config for template: "${templateName}"`);
    return { success: false, count: 0, error: `Incomplete config for template: ${templateName}` };
  }

  // Thêm user id vào conflictTarget
  const { tableName } = config;
  const conflictTarget = [...config.conflictTarget, "user_id"];

  // 3. Chuẩn hóa dữ liệu
  const sanitizedData = dataRows.map((row, index) => _transformAndSanitizeRow(row, index + 1, userId));

  // 4. Lọc spend (optional, bypassed)
  let filteredData = sanitizedData
  if (config.filter_spend) {
    filteredData = sanitizedData.filter(row =>
          row.spend !== undefined && row.spend !== null && typeof row.spend === 'number' && row.spend >= 0
      );
  }


  const originalCount = sanitizedData.length;
  const filteredCount = filteredData.length;

  if (originalCount > 0 && originalCount !== filteredCount) {
    console.log(`DB Writer (${templateName}): Filtered out ${originalCount - filteredCount} rows due to invalid spend (negative?).`);
  }
  

  const deduplicatedData = filteredData;

  if (deduplicatedData.length < filteredData.length) {
    console.log(`DB Writer (${templateName}): Deduplicated ${filteredData.length - deduplicatedData.length} rows with the same conflict key (within the batch).`);
  }

  if (deduplicatedData.length === 0) {
    console.log(`DB Writer (${templateName}): No valid rows remaining after filtering/deduplicating.`);
    return { success: true, count: 0 };
  }

  // 5: Chuẩn hóa cột (cho INSERT)
  const allPossibleColumns = new Set();
  deduplicatedData.forEach(row => {
      Object.keys(row).forEach(key => {
          if (key !== 'pkId' && key !== 'createdAt' && key !== 'updatedAt') {
              allPossibleColumns.add(key);
          }
      });
  });
  
  const finalColumns = Array.from(allPossibleColumns);

  const normalizedData = deduplicatedData.map(row => {
      const normalizedRow = {};
      for (const col of finalColumns) {
          normalizedRow[col] = Object.prototype.hasOwnProperty.call(row, col) ? row[col] : null;
      }
      return normalizedRow;
  });

  // 6.  Xây dựng 2 câu lệnh: DELETE và INSERT
  if (normalizedData.length === 0) {
      return { success: true, count: 0 };
  }

  const dataChunks = chunkArray(normalizedData, DB_BATCH_SIZE_ROWS);
  let totalInsertedCount = 0;

  let deleteValues = [];
  let allInsertValues = [];

  console.log(`DB Writer (${templateName}): Preparing transaction for ${normalizedData.length} rows, divided into ${dataChunks.length} chunks of ~${DB_BATCH_SIZE_ROWS} rows.`);

  // 7. [LOGIC MỚI] Thực thi trong một Interactive Transaction
  try {
    // Bắt đầu một giao dịch lớn
    await prisma.$transaction(async (tx) => {
      console.log(`DB Writer (${templateName}): Transaction started...`);

      // Lặp qua từng đợt dữ liệu
      for (const [index, chunk] of dataChunks.entries()) {
        if (chunk.length === 0) continue;
        
        console.log(`   -> Processing chunk ${index + 1}/${dataChunks.length} (${chunk.length} rows)...`);

        // === 6.A. Xây dựng lệnh DELETE (cho đợt này) ===
        const conflictTargetSql = conflictTarget.map(col => `"${col}"`).join(", ");
        let deleteParamIndex = 1;
        deleteValues = []; 
        const deletePlaceholders = chunk.map(row => {
            const rowParams = [];
            for (const col of conflictTarget) {
                let castType = "";
                if (TYPE_CONFIG.DATE.has(col)) castType = "::timestamp";
                else if (TYPE_CONFIG.JSON.has(col)) castType = "::jsonb";
                else if (TYPE_CONFIG.DECIMAL.has(col)) castType = "::decimal";
                else if (TYPE_CONFIG.BOOLEAN.has(col)) castType = "::boolean";

                rowParams.push(`$${deleteParamIndex++}${castType}`);
                
                const val = row[col];
                if (val instanceof Date) deleteValues.push(val.toISOString());
                else deleteValues.push(val);
            }
            return `(${rowParams.join(", ")})`;
        }).join(", ");

        const deleteSql = `DELETE FROM "${tableName}" WHERE (${conflictTargetSql}) IN (${deletePlaceholders});`;

        // === 6.B. Xây dựng lệnh INSERT (cho đợt này) ===
        const columnsSql = finalColumns.map(col => `"${col}"`).join(", ");
        const valuePlaceholders = chunk.map((_, rowIndex) => 
            `(${finalColumns.map((col, colIndex) => {
                const paramIndex = rowIndex * finalColumns.length + colIndex + 1;
                let castType = "";
                if (TYPE_CONFIG.DATE.has(col)) castType = "::timestamp";
                else if (TYPE_CONFIG.JSON.has(col)) castType = "::jsonb";
                else if (TYPE_CONFIG.DECIMAL.has(col)) castType = "::decimal";
                return `$${paramIndex}${castType}`;
            }).join(", ")})`
        ).join(", ");

        allInsertValues = chunk.flatMap(row => finalColumns.map(col => { 
            const val = row[col];
            if (val === null || val === undefined) return null;
            if (val instanceof Date) return val.toISOString();
            if (TYPE_CONFIG.JSON.has(col) && typeof val === 'object') return JSON.stringify(val);
            if (TYPE_CONFIG.DECIMAL.has(col)) return String(val);
            if (TYPE_CONFIG.BOOLEAN.has(col)) return Boolean(val);

            if (TYPE_CONFIG.INTEGER.has(col) || TYPE_CONFIG.FLOAT.has(col)) return Number(val);
            return String(val);
        }));
        
        const insertSql = `INSERT INTO "${tableName}" (${columnsSql}) VALUES ${valuePlaceholders};`;

        // 7. Thực thi 2 lệnh (DELETE, INSERT) cho đợt này
        // const deleteCommand = tx.$executeRawUnsafe(deleteSql, ...deleteValues);
        const insertCommand = tx.$executeRawUnsafe(insertSql, ...allInsertValues);

        // Chạy song song delete và insert cho đợt này
        // const [deleteResultCount, insertResultCount] = await Promise.all([
        //   deleteCommand,
        //   insertCommand
        // ]);

        const [insertResultCount] = await Promise.all([
          insertCommand
        ]);

        totalInsertedCount += insertResultCount;
        // console.log(`   ... Chunk ${index + 1} done. Deleted: ${deleteResultCount}, Inserted: ${insertResultCount}`);
        console.log(`   ... Chunk ${index + 1} done. Deleted: ${0}, Inserted: ${insertResultCount}`);
      }
      // Nếu vòng lặp 'for' hoàn thành mà không có lỗi, transaction sẽ tự động commit
    }, 
    {
      timeout: 60000 // Tăng timeout lên 60 giây (mặc định là 5s)
    });

    // Giao dịch đã thành công
    console.log(`DB Writer (${templateName}): Transaction successful.`);
    console.log(`   - Total Rows Inserted: ${totalInsertedCount}`);
    
    return { success: true, count: totalInsertedCount };

  } catch (e) {
    // Nếu bất kỳ đợt nào (chunk) thất bại, toàn bộ giao dịch sẽ bị rollback
    console.error(`DB Writer (${templateName}): Transaction FAILED and was Rolled Back:`, e.message);
    console.error("   - Delete Value count (last chunk):", deleteValues?.length || "N/A");
    console.error("   - Insert Value count (last chunk):", allInsertValues?.length || "N/A");
    if (e.message && e.message.includes("is of type")) {
        console.error("   - Potential type mismatch detected by DB.");
    }
    return { success: false, count: 0, error: e.message };
  }
}
