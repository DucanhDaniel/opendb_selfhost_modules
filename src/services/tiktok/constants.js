// TikTok API Endpoints
export const TIKTOK_API_BASE_URL =
  process.env.TIKTOK_API_BASE_URL ||
  "https://business-api.tiktok.com/open_api/v1.3";
export const TIKTOK_TOKEN_URL = `${TIKTOK_API_BASE_URL}/oauth2/access_token/`;
export const TIKTOK_ADVERTISER_URL = `${TIKTOK_API_BASE_URL}/oauth2/advertiser/get/`;
export const TIKTOK_REPORT_URL = `${TIKTOK_API_BASE_URL}/report/integrated/get/`;
// export const TIKTOK_GMV_STORE_LIST_URL = `${TIKTOK_API_BASE_URL}/gmv_max/store/list/`; // Bỏ qua GMV
// export const TIKTOK_GMV_REPORT_URL = `${TIKTOK_API_BASE_URL}/gmv_max/report/get/`; // Bỏ qua GMV
export const TIKTOK_BC_INFO_URL = `${TIKTOK_API_BASE_URL}/bc/get/`;
export const TIKTOK_BC_AD_ACCOUNT_INFO_URL = `${TIKTOK_API_BASE_URL}/advertiser/info/`;
export const TIKTOK_BC_ASSET_INFO_URL = `${TIKTOK_API_BASE_URL}/bc/asset/admin/get/`;

// Metrics needing percentage formatting
export const TIKTOK_PERCENT_METRICS = [
  "ctr",
  "conversion_rate",
  "roi",
  "product_click_rate",
  "ad_click_rate",
  "ad_conversion_rate",
  "ad_video_view_rate_2s",
  "ad_video_view_rate_6s",
  "ad_video_view_rate_p25",
  "ad_video_view_rate_p50",
  "ad_video_view_rate_p75",
  "ad_video_view_rate_p100",
];

// TikTok Report Template Structure (Chỉ BCA và TTA)
export const TIKTOK_REPORT_TEMPLATES_STRUCTURE = [
  {
    groupName: "BCA: Báo cáo BC & Account",
    templates: [
      {
        name: "BCs Info",
        config: {
          type: "BCA_BC_INFO",
          api_endpoint: TIKTOK_BC_INFO_URL,
          requiredInputs: [],
          selectable_metrics: {
            "Thông tin Business Center": [
              "bc_id",
              "bc_name",
              "company",
              "currency",
              "status",
              "type",
              "timezone",
            ],
            "Quyền truy cập": ["user_role", "finance_role"],
          },
        },
      },
      {
        name: "BC & Accounts Info",
        config: {
          type: "BCA_ACCOUNT_INFO",
          api_endpoint: TIKTOK_BC_AD_ACCOUNT_INFO_URL,
          requiredInputs: ["bc", "account"], // Inputs needed from UI/params
          selectable_metrics: {
            "Thông tin chính": [
              "advertiser_id",
              "name",
              "status",
              "currency",
              "timezone",
            ],
            "Thông tin công ty": ["company", "industry", "country", "address"],
            "Thông tin liên hệ": ["contacter", "email", "cellphone_number"],
            "Thông tin khác": [
              "owner_bc_id",
              "create_time",
              "balance",
              "role",
            ],
          },
        },
      },
      {
        name: "BC Assets Info",
        config: {
          type: "BCA_ASSET_INFO",
          api_endpoint: TIKTOK_BC_ASSET_INFO_URL,
          requiredInputs: ["bc", "asset"], // Inputs needed from UI/params
          selectable_dimensions: {
            // Dimensions relevant for API call filtering
            "Lựa chọn đầu vào": ["bc_id", "asset_type"],
          },
          selectable_metrics: {
            // Fields to select from the API response
            "Thông tin Asset": [
              "asset_id",
              "asset_name",
              "owner_bc_name",
              "relation_type",
            ],
            "Trạng thái & Vai trò": [
              "advertiser_status",
              "advertiser_role",
              "catalog_role",
              "store_role",
              "relation_status",
            ],
          },
        },
      },
    ],
  },
  {
    groupName: "TTA: Báo cáo hiệu suất",
    templates: [
      {
        name: "Campaign Performance",
        config: {
          type: "BASIC",
          api_endpoint: TIKTOK_REPORT_URL,
          api_params: {
            data_level: "AUCTION_CAMPAIGN",
            report_type: "BASIC",
          },
          selectable_dimensions: {
            "Thông tin định danh": [
              "start_date",
              "end_date",
              "advertiser_id",
              "advertiser_name",
            ],
            "Trường (Dimensions)": ["stat_time_day", "campaign_id"],
          },
          selectable_metrics: {
            "Số liệu (Metrics)": [
              "spend",
              "campaign_name",
              "impressions",
              "objective_type",
              "clicks",
              "ctr",
              "cpc",
              "cpm",
              "reach",
              "frequency",
              "conversion",
              "cost_per_conversion",
              "conversion_rate",
              "video_play_actions",
              "total_onsite_shopping_value",
              "purchase",
              "onsite_shopping",
              "onsite_shopping_roas",
              "cost_per_onsite_shopping",
              "profile_visits",
              "likes",
              "comments",
              "shares",
              "follows",
              "live_views",
            ],
          },
        },
      },
      {
        name: "AdGroup Performance",
        config: {
          type: "BASIC",
          api_endpoint: TIKTOK_REPORT_URL,
          api_params: { data_level: "AUCTION_ADGROUP", report_type: "BASIC" },
          selectable_dimensions: {
            "Thông tin định danh": [
              "start_date",
              "end_date",
              "advertiser_id",
              "advertiser_name",
            ],
            "Trường (Dimensions)": ["stat_time_day", "adgroup_id"],
          },
          selectable_metrics: {
            "Số liệu (Metrics)": [
              "adgroup_name",
              "spend",
              "campaign_name",
              "impressions",
              "clicks",
              "ctr",
              "cpc",
              "cpm",
              "reach",
              "frequency",
              "conversion",
              "cost_per_conversion",
              "conversion_rate",
              "video_play_actions",
              "purchase",
              "onsite_shopping",
              "total_onsite_shopping_value",
              "onsite_shopping_roas",
              "cost_per_onsite_shopping",
              "profile_visits",
              "likes",
              "comments",
              "shares",
              "follows",
              "live_views",
            ],
          },
        },
      },
      {
        name: "Ad Performance",
        config: {
          type: "BASIC",
          api_endpoint: TIKTOK_REPORT_URL,
          api_params: { data_level: "AUCTION_AD", report_type: "BASIC" },
          selectable_dimensions: {
            "Thông tin định danh": [
              "start_date",
              "end_date",
              "advertiser_id",
              "advertiser_name",
            ],
            "Trường (Dimensions)": ["stat_time_day", "ad_id"],
          },
          selectable_metrics: {
            "Số liệu (Metrics)": [
              "ad_text",
              "spend",
              "campaign_name",
              "adgroup_name",
              "ad_name",
              "impressions",
              "clicks",
              "ctr",
              "cpc",
              "cpm",
              "reach",
              "frequency",
              "conversion",
              "cost_per_conversion",
              "conversion_rate",
              "video_play_actions",
              "purchase",
              "onsite_shopping",
              "total_onsite_shopping_value",
              "onsite_shopping_roas",
              "cost_per_onsite_shopping",
              "profile_visits",
              "likes",
              "comments",
              "shares",
              "follows",
              "live_views",
            ],
          },
        },
      },
      {
        name: "Creative Performance (Video/Image)",
        config: {
          type: "BASIC",
          api_endpoint: TIKTOK_REPORT_URL,
          api_params: { data_level: "AUCTION_AD", report_type: "BASIC" },
          selectable_dimensions: {
            "Thông tin định danh": [
              "start_date",
              "end_date",
              "advertiser_id",
              "advertiser_name",
            ],
            "Trường (Dimensions)": ["ad_id"],
          },
          selectable_metrics: {
            "Số liệu (Metrics)": [
              "campaign_id",
              "campaign_name",
              "adgroup_id",
              "adgroup_name",
              "ad_name",
              "spend",
              "impressions",
              "clicks",
              "ctr",
              "conversion",
              "cost_per_conversion",
            ],
          },
        },
      },
    ],
  },
  {
    groupName: "TTA: Báo cáo đối tượng & vị trí",
    templates: [
      {
        name: "Audience Report: Region by Campaign",
        config: {
          type: "BASIC",
          api_endpoint: TIKTOK_REPORT_URL,
          api_params: {
            data_level: "AUCTION_CAMPAIGN",
            report_type: "AUDIENCE",
          },
          selectable_dimensions: {
            "Thông tin định danh": [
              "start_date",
              "end_date",
              "advertiser_id",
              "advertiser_name",
            ],
            "Trường (Dimensions)": [
              "campaign_id",
              "province_id",
              "province_name",
            ],
          },
          selectable_metrics: {
            "Số liệu (Metrics)": [
              "campaign_name",
              "spend",
              "impressions",
              "clicks",
              "ctr",
              "cpc",
              "cpm",
              "reach",
              "conversion",
              "cost_per_conversion",
              "conversion_rate",
              "profile_visits",
              "likes",
              "comments",
              "shares",
              "follows",
              "video_play_actions",
              "video_watched_2s",
              "video_watched_6s",
              "video_views_p25",
              "video_views_p50",
              "video_views_p75",
              "video_views_p100",
              "average_video_play",
            ],
          },
        },
      },
      {
        name: "Audience Report: Country by Campaign",
        config: {
          type: "BASIC",
          api_endpoint: TIKTOK_REPORT_URL,
          api_params: {
            data_level: "AUCTION_CAMPAIGN",
            report_type: "AUDIENCE",
          },
          selectable_dimensions: {
            "Thông tin định danh": [
              "start_date",
              "end_date",
              "advertiser_id",
              "advertiser_name",
            ],
            "Trường (Dimensions)": [
              "stat_time_day",
              "campaign_id",
              "country_code",
            ],
          },
          selectable_metrics: {
            "Số liệu (Metrics)": [
              "spend",
              "campaign_name",
              "impressions",
              "clicks",
              "ctr",
              "cpc",
              "cpm",
              "reach",
              "conversion",
              "cost_per_conversion",
              "conversion_rate",
              "video_play_actions",
              "likes",
              "comments",
              "shares",
              "follows",
              "profile_visits",
            ],
          },
        },
      },
      {
        name: "Audience Report: Age by Campaign",
        config: {
          type: "BASIC",
          api_endpoint: TIKTOK_REPORT_URL,
          api_params: {
            data_level: "AUCTION_CAMPAIGN",
            report_type: "AUDIENCE",
          },
          selectable_dimensions: {
            "Thông tin định danh": [
              "start_date",
              "end_date",
              "advertiser_id",
              "advertiser_name",
            ],
            "Trường (Dimensions)": ["stat_time_day", "campaign_id", "age"],
          },
          selectable_metrics: {
            "Số liệu (Metrics)": [
              "spend",
              "campaign_name",
              "impressions",
              "clicks",
              "ctr",
              "cpc",
              "cpm",
              "reach",
              "conversion",
              "cost_per_conversion",
              "conversion_rate",
              "video_play_actions",
              "likes",
              "comments",
              "shares",
              "follows",
              "profile_visits",
            ],
          },
        },
      },
      {
        name: "Audience Report: Gender by Campaign",
        config: {
          type: "BASIC",
          api_endpoint: TIKTOK_REPORT_URL,
          api_params: {
            data_level: "AUCTION_CAMPAIGN",
            report_type: "AUDIENCE",
          },
          selectable_dimensions: {
            "Thông tin định danh": [
              "start_date",
              "end_date",
              "advertiser_id",
              "advertiser_name",
            ],
            "Trường (Dimensions)": ["stat_time_day", "campaign_id", "gender"],
          },
          selectable_metrics: {
            "Số liệu (Metrics)": [
              "spend",
              "campaign_name",
              "impressions",
              "clicks",
              "ctr",
              "cpc",
              "cpm",
              "reach",
              "conversion",
              "cost_per_conversion",
              "conversion_rate",
              "video_play_actions",
              "likes",
              "comments",
              "shares",
              "follows",
              "profile_visits",
            ],
          },
        },
      },
      {
        name: "Audience Report: Age & Gender by Campaign",
        config: {
          type: "BASIC",
          api_endpoint: TIKTOK_REPORT_URL,
          api_params: {
            data_level: "AUCTION_CAMPAIGN",
            report_type: "AUDIENCE",
          },
          selectable_dimensions: {
            "Thông tin định danh": [
              "start_date",
              "end_date",
              "advertiser_id",
              "advertiser_name",
            ],
            "Trường (Dimensions)": [
              "stat_time_day",
              "campaign_id",
              "age",
              "gender",
            ],
          },
          selectable_metrics: {
            "Số liệu (Metrics)": [
              "spend",
              "campaign_name",
              "impressions",
              "clicks",
              "ctr",
              "cpc",
              "cpm",
              "reach",
              "conversion",
              "cost_per_conversion",
              "conversion_rate",
              "video_play_actions",
              "likes",
              "comments",
              "shares",
              "follows",
              "profile_visits",
            ],
          },
        },
      },
      {
        name: "Placement Report by Campaign",
        config: {
          type: "BASIC",
          api_endpoint: TIKTOK_REPORT_URL,
          api_params: {
            data_level: "AUCTION_CAMPAIGN",
            report_type: "AUDIENCE",
          },
          selectable_dimensions: {
            "Thông tin định danh": [
              "start_date",
              "end_date",
              "advertiser_id",
              "advertiser_name",
            ],
            "Trường (Dimensions)": ["campaign_id", "placement"],
          },
          selectable_metrics: {
            "Số liệu (Metrics)": [
              "campaign_name",
              "spend",
              "impressions",
              "clicks",
              "ctr",
              "conversion",
              "cost_per_conversion",
            ],
          },
        },
      },
      {
        name: "Platform Report by Campaign",
        config: {
          type: "BASIC",
          api_endpoint: TIKTOK_REPORT_URL,
          api_params: {
            data_level: "AUCTION_CAMPAIGN",
            report_type: "AUDIENCE",
          },
          selectable_dimensions: {
            "Thông tin định danh": [
              "start_date",
              "end_date",
              "advertiser_id",
              "advertiser_name",
            ],
            "Trường (Dimensions)": ["campaign_id", "platform"],
          },
          selectable_metrics: {
            "Số liệu (Metrics)": [
              "campaign_name",
              "spend",
              "impressions",
              "clicks",
              "ctr",
              "conversion",
              "cost_per_conversion",
            ],
          },
        },
      },
    ],
  },
  {
    groupName: "GMV: Báo cáo chi tiết",
    templates: [
      {
        name: "GMV Campaign / Product Detail",
        config: {
          type: "MULTI_STEP_GMV_PRODUCT",
          mandatory_keys: ["campaign_id", "item_group_id", "stat_time_day"],
          selectable_dimensions: {
            "Thông tin định danh": [
              "start_date",
              "end_date",
              "advertiser_id",
              "advertiser_name",
              "store_id",
              "store_name",
            ],
            "Trường (Dimensions)": [
              "stat_time_day",
              "campaign_id",
              "item_group_id",
              "product_img",
            ],
          },
          selectable_metrics: {
            "Thuộc tính": [
              "campaign_name",
              "operation_status",
              "bid_type",
              "product_name",
              "product_image_url",
            ],
            "Hiệu suất": [
              "orders",
              "gross_revenue",
              "cost",
              "cost_per_order",
              "roi",
            ],
          },
          field_to_api_map: {
            step1_get_campaigns: [
              "campaign_name",
              "operation_status",
              "bid_type",
            ],
            step2_get_performance: [
              "orders",
              "gross_revenue",
              "cost",
              "cost_per_order",
              "roi",
            ],
            step3_get_product_details: ["product_name", "product_image_url"],
          },
        },
      },
      {
        name: "GMV Campaign / Creative Detail",
        config: {
          type: "MULTI_STEP_GMV_CREATIVE",
          mandatory_keys: ["campaign_id", "item_group_id", "item_id"],
          selectable_dimensions: {
            "Thông tin định danh": [
              "start_date",
              "end_date",
              "advertiser_id",
              "advertiser_name",
              "store_id",
              "store_name",
              "campaign_id",
              "item_group_id",
              "item_id",
              "product_img",
            ],
          },
          selectable_metrics: {
            "Thuộc tính": [
              "campaign_name",
              "operation_status",
              "product_name",
              "product_status",
              "product_image_url",
              "creative_delivery_status",
              "title",
              "tt_account_name",
              "tt_account_profile_image_url",
            ],
            "Hiệu suất chính": [
              "cost",
              "orders",
              "cost_per_order",
              "gross_revenue",
              "roi",
            ],
            "Chỉ số sản phẩm": [
              "product_impressions",
              "product_clicks",
              "product_click_rate",
            ],
            "Chỉ số quảng cáo": ["ad_conversion_rate"],
            "Tỷ lệ xem video": [
              "ad_video_view_rate_2s",
              "ad_video_view_rate_6s",
              "ad_video_view_rate_p25",
              "ad_video_view_rate_p50",
              "ad_video_view_rate_p75",
              "ad_video_view_rate_p100",
            ],
          },
          field_to_api_map: {
            step1_get_campaigns: ["campaign_name", "operation_status"],
            step2b_get_product_attributes: [
              "product_name",
              "product_image_url",
              "product_status",
            ],
            step3a_get_creative_performance: [
              "creative_delivery_status",
              "cost",
              "orders",
              "cost_per_order",
              "gross_revenue",
              "roi",
              "product_impressions",
              "product_clicks",
              "product_click_rate",
              "ad_conversion_rate",
              "ad_video_view_rate_2s",
              "ad_video_view_rate_6s",
              "ad_video_view_rate_p25",
              "ad_video_view_rate_p50",
              "ad_video_view_rate_p75",
              "ad_video_view_rate_p100",
            ],
            step3b_get_creative_attributes: [
              "title",
              "tt_account_name",
              "tt_account_profile_image_url",
            ],
          },
        },
      },
    ],
  }
];

// --- Gist URL for Province Map ---
export const PROVINCE_MAP_GIST_URL =
  "https://gist.githubusercontent.com/manhpikaavn/368a4541c3b0163ef8dda2810b488728/raw/9e9ec775a40874eaa8294d6117237ff6787ac64a/gistfile1.txt";