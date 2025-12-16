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
     conflictTarget: ["account_id", "date_start", "date_stop", "campaign_id", "age"],
      filter_spend: true,
      insightDateKey: ["date_start", "date_stop"]
   },
   "Campaign Performance by Gender": {
     tableName: "FAD_CampaignPerformanceByGender",
     conflictTarget: ["account_id", "date_start", "date_stop", "campaign_id", "gender"],
      filter_spend: true,
      insightDateKey: ["date_start", "date_stop"]
   },
   "Campaign Performance by Platform": {
     tableName: "FAD_CampaignPerformanceByPlatform",
     conflictTarget: ["account_id", "date_start", "date_stop", "campaign_id", "publisher_platform", "platform_position"],
      filter_spend: true,
      insightDateKey: ["date_start", "date_stop"]
   },
    "Campaign Performance by Region": {
      tableName: "FAD_CampaignPerformanceByRegion",
      conflictTarget: ["account_id", "date_start", "date_stop", "campaign_id", "region"],
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
    conflictTarget: ["advertiser_id", "campaign_id", "objective_type", "start_date", "end_date", "stat_time_day"],
    insightDateKey: ["start_date", "end_date"],
    filter_spend: true 
  }, 

  "AdGroup Performance": {
    tableName: "TTA_AdGroupPerformance",
    conflictTarget: ["advertiser_id", "adgroup_id", "start_date", "end_date", "stat_time_day"],
    insightDateKey: ["start_date", "end_date"],
    filter_spend: true 
  },

  "Ad Performance": {
    tableName: "TTA_AdPerformance",
    conflictTarget: ["advertiser_id", "campaign_name", "adgroup_name", "ad_id", "start_date", "end_date", "stat_time_day"],
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
    filterNullMetrics: ["province_id"],
    conflictTarget: ["start_date", "end_date", "advertiser_id", "campaign_id", "province_id"],
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
    conflictTarget: ["advertiser_id", "store_id", "campaign_id", "start_date", "end_date", "stat_time_day", "item_group_id"],
    insightDateKey: ["start_date", "end_date"],
    filter_spend: false // Trong logic của GMV detail đã có sẵn lọc cost để tối ưu xử lý
  },

  "GMV Campaign / Creative Detail": {
    tableName: "GMV_CreativeDetailReport",
    conflictTarget: ["advertiser_id", "store_id", "campaign_id", "start_date", "end_date", "item_group_id", "item_id"],
    insightDateKey: ["start_date", "end_date"],
    filter_spend: false // Trong logic của GMV detail đã có sẵn lọc cost để tối ưu xử lý
  },

  "GMV Product Campaign Performance": {
    tableName: "GMV_ProductCampaignPerformance",
    conflictTarget: ["advertiser_id", "store_id", "campaign_id", "start_date", "end_date", "stat_time_day"],
    insightDateKey: ["start_date", "end_date"],
    filter_spend: false
  },

  "GMV All Campaign Performance": {
    tableName: "GMV_AllCampaignPerformance",
    conflictTarget: ["advertiser_id", "store_id", "campaign_id", "start_date", "end_date", "stat_time_day"],
    insightDateKey: ["start_date", "end_date"],
    filter_spend: false
  },

  "GMV Live Campaign Performance": {
    tableName: "GMV_LiveCampaignPerformance",
    conflictTarget: ["advertiser_id", "store_id", "campaign_id", "start_date", "end_date", "stat_time_day"],
    insightDateKey: ["start_date", "end_date"],
    filter_spend: false
  },

  "Báo cáo đơn hàng chi tiết (Full Data)": {
    tableName: "POS_BasicReport",
    conflictTarget: ["order_id", "item_id"],
    insightDateKey: [],
    filter_spend: false
  }
};

const generateDuplicateCheckQueries = (map) => {
  console.log("-- === SQL CHECK TRÙNG LẶP CHO TẤT CẢ BẢNG === --\n");
  
  Object.keys(map).forEach(reportName => {
    const config = map[reportName];
    if (!config.tableName || !config.conflictTarget) return;

    // QUAN TRỌNG: Thêm 'user_id' vào danh sách check trùng nếu logic của bạn cần
    // Nếu bảng nào chưa có user_id thì bạn xóa chữ "user_id" trong mảng này đi
    const checkColumns = [...config.conflictTarget, "user_id"];
    
    const columnsStr = checkColumns.map(c => `"${c}"`).join(", ");
    
    const sql = `
-- Check bảng: ${config.tableName} (${reportName})
SELECT ${columnsStr}, COUNT(*)
FROM "${config.tableName}"
GROUP BY ${columnsStr}
HAVING COUNT(*) > 1;
`;
    console.log(sql);
  });
};

// Chạy hàm
generateDuplicateCheckQueries(TEMPLATE_MAP);