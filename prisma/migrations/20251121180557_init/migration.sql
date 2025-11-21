-- CreateTable
CREATE TABLE "FAD_CampaignOverviewReport" (
    "pkId" TEXT NOT NULL DEFAULT gen_random_uuid(),
    "user_id" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "id" TEXT,
    "name" TEXT,
    "objective" TEXT,
    "account_id" TEXT,
    "account_name" TEXT,
    "status" TEXT,
    "effective_status" TEXT,
    "start_time" TIMESTAMP(3),
    "stop_time" TIMESTAMP(3),
    "created_time" TIMESTAMP(3),
    "updated_time" TIMESTAMP(3),
    "buying_type" TEXT,
    "bid_strategy" TEXT,
    "spend" DOUBLE PRECISION,
    "reach" INTEGER,
    "clicks" INTEGER,
    "cpc" DOUBLE PRECISION,
    "cpm" DOUBLE PRECISION,
    "ctr" DOUBLE PRECISION,
    "date_start" TIMESTAMP(3),
    "date_stop" TIMESTAMP(3),
    "newMessagingConnections" INTEGER,
    "costPerNewMessaging" DOUBLE PRECISION,
    "leads" INTEGER,
    "costLeads" DOUBLE PRECISION,
    "purchases" INTEGER,
    "costPurchases" DOUBLE PRECISION,
    "purchaseValue" DOUBLE PRECISION,
    "purchaseROAS" DOUBLE PRECISION,
    "websitePurchases" INTEGER,
    "onFacebookPurchases" INTEGER,

    CONSTRAINT "FAD_CampaignOverviewReport_pkey" PRIMARY KEY ("pkId")
);

-- CreateTable
CREATE TABLE "FAD_CampaignPerformanceByAge" (
    "pkId" TEXT NOT NULL DEFAULT gen_random_uuid(),
    "user_id" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "campaign_id" TEXT,
    "campaign_name" TEXT,
    "account_id" TEXT,
    "account_name" TEXT,
    "age" TEXT,
    "spend" DOUBLE PRECISION,
    "newMessagingConnections" INTEGER,
    "costPerNewMessaging" DOUBLE PRECISION,
    "leads" INTEGER,
    "costLeads" DOUBLE PRECISION,
    "purchases" INTEGER,
    "costPurchases" DOUBLE PRECISION,
    "purchaseValue" DOUBLE PRECISION,
    "purchaseROAS" DOUBLE PRECISION,
    "websitePurchases" INTEGER,
    "onFacebookPurchases" INTEGER,
    "date_start" TIMESTAMP(3),
    "date_stop" TIMESTAMP(3),

    CONSTRAINT "FAD_CampaignPerformanceByAge_pkey" PRIMARY KEY ("pkId")
);

-- CreateTable
CREATE TABLE "FAD_CampaignPerformanceByGender" (
    "pkId" TEXT NOT NULL DEFAULT gen_random_uuid(),
    "user_id" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "campaign_id" TEXT,
    "campaign_name" TEXT,
    "account_id" TEXT,
    "account_name" TEXT,
    "gender" TEXT,
    "spend" DOUBLE PRECISION,
    "newMessagingConnections" INTEGER,
    "costPerNewMessaging" DOUBLE PRECISION,
    "leads" INTEGER,
    "costLeads" DOUBLE PRECISION,
    "purchases" INTEGER,
    "costPurchases" DOUBLE PRECISION,
    "purchaseValue" DOUBLE PRECISION,
    "purchaseROAS" DOUBLE PRECISION,
    "websitePurchases" INTEGER,
    "onFacebookPurchases" INTEGER,
    "date_start" TIMESTAMP(3),
    "date_stop" TIMESTAMP(3),

    CONSTRAINT "FAD_CampaignPerformanceByGender_pkey" PRIMARY KEY ("pkId")
);

-- CreateTable
CREATE TABLE "FAD_CampaignPerformanceByPlatform" (
    "pkId" TEXT NOT NULL DEFAULT gen_random_uuid(),
    "user_id" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "account_id" TEXT,
    "account_name" TEXT,
    "campaign_id" TEXT,
    "campaign_name" TEXT,
    "publisher_platform" TEXT,
    "platform_position" TEXT,
    "date_start" TIMESTAMP(3),
    "date_stop" TIMESTAMP(3),
    "spend" DOUBLE PRECISION,
    "impressions" INTEGER,
    "clicks" INTEGER,
    "newMessagingConnections" INTEGER,
    "costPerNewMessaging" DOUBLE PRECISION,
    "leads" INTEGER,
    "costLeads" DOUBLE PRECISION,
    "purchases" INTEGER,
    "costPurchases" DOUBLE PRECISION,
    "purchaseValue" DOUBLE PRECISION,
    "purchaseROAS" DOUBLE PRECISION,
    "websitePurchases" INTEGER,
    "onFacebookPurchases" INTEGER,

    CONSTRAINT "FAD_CampaignPerformanceByPlatform_pkey" PRIMARY KEY ("pkId")
);

-- CreateTable
CREATE TABLE "FAD_CampaignPerformanceByRegion" (
    "pkId" TEXT NOT NULL DEFAULT gen_random_uuid(),
    "user_id" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "campaign_id" TEXT,
    "campaign_name" TEXT,
    "account_id" TEXT,
    "account_name" TEXT,
    "region" TEXT,
    "spend" DOUBLE PRECISION,
    "impressions" INTEGER,
    "clicks" INTEGER,
    "ctr" DOUBLE PRECISION,
    "newMessagingConnections" INTEGER,
    "costPerNewMessaging" DOUBLE PRECISION,
    "leads" INTEGER,
    "costLeads" DOUBLE PRECISION,
    "purchases" INTEGER,
    "costPurchases" DOUBLE PRECISION,
    "purchaseValue" DOUBLE PRECISION,
    "websitePurchases" INTEGER,
    "onFacebookPurchases" INTEGER,
    "date_start" TIMESTAMP(3),
    "date_stop" TIMESTAMP(3),

    CONSTRAINT "FAD_CampaignPerformanceByRegion_pkey" PRIMARY KEY ("pkId")
);

-- CreateTable
CREATE TABLE "FAD_AdSetPerformanceReport" (
    "pkId" TEXT NOT NULL DEFAULT gen_random_uuid(),
    "user_id" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "id" TEXT,
    "name" TEXT,
    "campaign_id" TEXT,
    "campaign_name" TEXT,
    "account_id" TEXT,
    "account_name" TEXT,
    "status" TEXT,
    "effective_status" TEXT,
    "created_time" TIMESTAMP(3),
    "daily_budget" DOUBLE PRECISION,
    "lifetime_budget" DOUBLE PRECISION,
    "budget_remaining" DOUBLE PRECISION,
    "spend" DOUBLE PRECISION,
    "impressions" INTEGER,
    "reach" INTEGER,
    "clicks" INTEGER,
    "ctr" DOUBLE PRECISION,
    "cpc" DOUBLE PRECISION,
    "cpm" DOUBLE PRECISION,
    "newMessagingConnections" INTEGER,
    "costPerNewMessaging" DOUBLE PRECISION,
    "leads" INTEGER,
    "costLeads" DOUBLE PRECISION,
    "purchases" INTEGER,
    "costPurchases" DOUBLE PRECISION,
    "purchaseValue" DOUBLE PRECISION,
    "purchaseROAS" DOUBLE PRECISION,
    "websitePurchases" INTEGER,
    "onFacebookPurchases" INTEGER,
    "date_start" TIMESTAMP(3),
    "date_stop" TIMESTAMP(3),

    CONSTRAINT "FAD_AdSetPerformanceReport_pkey" PRIMARY KEY ("pkId")
);

-- CreateTable
CREATE TABLE "FAD_AdPerformanceReport" (
    "pkId" TEXT NOT NULL DEFAULT gen_random_uuid(),
    "user_id" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "id" TEXT,
    "name" TEXT,
    "adset_id" TEXT,
    "adset_name" TEXT,
    "campaign_id" TEXT,
    "campaign_name" TEXT,
    "account_id" TEXT,
    "account_name" TEXT,
    "created_time" TIMESTAMP(3),
    "updated_time" TIMESTAMP(3),
    "status" TEXT,
    "effective_status" TEXT,
    "spend" DOUBLE PRECISION,
    "impressions" INTEGER,
    "reach" INTEGER,
    "clicks" INTEGER,
    "ctr" DOUBLE PRECISION,
    "cpc" DOUBLE PRECISION,
    "cpm" DOUBLE PRECISION,
    "frequency" DOUBLE PRECISION,
    "newMessagingConnections" INTEGER,
    "costPerNewMessaging" DOUBLE PRECISION,
    "leads" INTEGER,
    "costLeads" DOUBLE PRECISION,
    "purchases" INTEGER,
    "costPurchases" DOUBLE PRECISION,
    "purchaseValue" DOUBLE PRECISION,
    "purchaseROAS" DOUBLE PRECISION,
    "websitePurchases" INTEGER,
    "onFacebookPurchases" INTEGER,
    "date_start" TIMESTAMP(3),
    "date_stop" TIMESTAMP(3),

    CONSTRAINT "FAD_AdPerformanceReport_pkey" PRIMARY KEY ("pkId")
);

-- CreateTable
CREATE TABLE "FAD_AccountDailyReport" (
    "pkId" TEXT NOT NULL DEFAULT gen_random_uuid(),
    "user_id" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "account_id" TEXT,
    "account_name" TEXT,
    "account_currency" TEXT,
    "date_start" TIMESTAMP(3),
    "date_stop" TIMESTAMP(3),
    "spend" DOUBLE PRECISION,
    "impressions" INTEGER,
    "clicks" INTEGER,
    "cpc" DOUBLE PRECISION,
    "cpm" DOUBLE PRECISION,
    "ctr" DOUBLE PRECISION,
    "reach" INTEGER,
    "frequency" DOUBLE PRECISION,
    "newMessagingConnections" INTEGER,
    "costPerNewMessaging" DOUBLE PRECISION,
    "leads" INTEGER,
    "costLeads" DOUBLE PRECISION,
    "purchases" INTEGER,
    "costPurchases" DOUBLE PRECISION,
    "purchaseValue" DOUBLE PRECISION,
    "purchaseROAS" DOUBLE PRECISION,
    "websitePurchases" INTEGER,
    "onFacebookPurchases" INTEGER,

    CONSTRAINT "FAD_AccountDailyReport_pkey" PRIMARY KEY ("pkId")
);

-- CreateTable
CREATE TABLE "FAD_CampaignDailyReport" (
    "pkId" TEXT NOT NULL DEFAULT gen_random_uuid(),
    "user_id" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "campaign_id" TEXT,
    "campaign_name" TEXT,
    "account_id" TEXT,
    "account_name" TEXT,
    "date_start" TIMESTAMP(3),
    "date_stop" TIMESTAMP(3),
    "spend" DOUBLE PRECISION,
    "impressions" INTEGER,
    "reach" INTEGER,
    "clicks" INTEGER,
    "cpc" DOUBLE PRECISION,
    "cpm" DOUBLE PRECISION,
    "ctr" DOUBLE PRECISION,
    "frequency" DOUBLE PRECISION,
    "newMessagingConnections" INTEGER,
    "costPerNewMessaging" DOUBLE PRECISION,
    "leads" INTEGER,
    "costLeads" DOUBLE PRECISION,
    "purchases" INTEGER,
    "costPurchases" DOUBLE PRECISION,
    "purchaseValue" DOUBLE PRECISION,
    "purchaseROAS" DOUBLE PRECISION,
    "websitePurchases" INTEGER,
    "onFacebookPurchases" INTEGER,

    CONSTRAINT "FAD_CampaignDailyReport_pkey" PRIMARY KEY ("pkId")
);

-- CreateTable
CREATE TABLE "FAD_AdSetDailyReport" (
    "pkId" TEXT NOT NULL DEFAULT gen_random_uuid(),
    "user_id" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "id" TEXT,
    "name" TEXT,
    "campaign_id" TEXT,
    "campaign_name" TEXT,
    "account_id" TEXT,
    "account_name" TEXT,
    "date_start" TIMESTAMP(3),
    "date_stop" TIMESTAMP(3),
    "status" TEXT,
    "effective_status" TEXT,
    "daily_budget" DOUBLE PRECISION,
    "lifetime_budget" DOUBLE PRECISION,
    "budget_remaining" DOUBLE PRECISION,
    "spend" DOUBLE PRECISION,
    "impressions" INTEGER,
    "reach" INTEGER,
    "clicks" INTEGER,
    "ctr" DOUBLE PRECISION,
    "cpc" DOUBLE PRECISION,
    "cpm" DOUBLE PRECISION,
    "frequency" DOUBLE PRECISION,
    "newMessagingConnections" INTEGER,
    "costPerNewMessaging" DOUBLE PRECISION,
    "leads" INTEGER,
    "costLeads" DOUBLE PRECISION,
    "purchases" INTEGER,
    "costPurchases" DOUBLE PRECISION,
    "purchaseValue" DOUBLE PRECISION,
    "purchaseROAS" DOUBLE PRECISION,
    "websitePurchases" INTEGER,
    "onFacebookPurchases" INTEGER,

    CONSTRAINT "FAD_AdSetDailyReport_pkey" PRIMARY KEY ("pkId")
);

-- CreateTable
CREATE TABLE "FAD_AdDailyReport" (
    "pkId" TEXT NOT NULL DEFAULT gen_random_uuid(),
    "user_id" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "id" TEXT,
    "name" TEXT,
    "adset_id" TEXT,
    "adset_name" TEXT,
    "campaign_id" TEXT,
    "campaign_name" TEXT,
    "account_id" TEXT,
    "account_name" TEXT,
    "date_start" TIMESTAMP(3),
    "date_stop" TIMESTAMP(3),
    "status" TEXT,
    "effective_status" TEXT,
    "created_time" TIMESTAMP(3),
    "spend" DOUBLE PRECISION,
    "impressions" INTEGER,
    "reach" INTEGER,
    "clicks" INTEGER,
    "ctr" DOUBLE PRECISION,
    "cpc" DOUBLE PRECISION,
    "cpm" DOUBLE PRECISION,
    "frequency" DOUBLE PRECISION,
    "newMessagingConnections" INTEGER,
    "costPerNewMessaging" DOUBLE PRECISION,
    "leads" INTEGER,
    "costLeads" DOUBLE PRECISION,
    "purchases" INTEGER,
    "costPurchases" DOUBLE PRECISION,
    "purchaseValue" DOUBLE PRECISION,
    "purchaseROAS" DOUBLE PRECISION,
    "websitePurchases" INTEGER,
    "onFacebookPurchases" INTEGER,

    CONSTRAINT "FAD_AdDailyReport_pkey" PRIMARY KEY ("pkId")
);

-- CreateTable
CREATE TABLE "FAD_AdCreativeReport" (
    "pkId" TEXT NOT NULL DEFAULT gen_random_uuid(),
    "user_id" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "id" TEXT,
    "name" TEXT,
    "adset_id" TEXT,
    "adset_name" TEXT,
    "campaign_id" TEXT,
    "campaign_name" TEXT,
    "account_id" TEXT,
    "account_name" TEXT,
    "status" TEXT,
    "effective_status" TEXT,
    "creative_id" TEXT,
    "actor_id" TEXT,
    "page_name" TEXT,
    "creative_title" TEXT,
    "creative_body" TEXT,
    "creative_thumbnail_url" TEXT,
    "creative_thumbnail_raw_url" TEXT,
    "creative_link" TEXT,
    "spend" DOUBLE PRECISION,
    "impressions" INTEGER,
    "leads" INTEGER,
    "costLeads" DOUBLE PRECISION,
    "reach" INTEGER,
    "clicks" INTEGER,
    "ctr" DOUBLE PRECISION,
    "cpc" DOUBLE PRECISION,
    "cpm" DOUBLE PRECISION,
    "newMessagingConnections" INTEGER,
    "costPerNewMessaging" DOUBLE PRECISION,
    "purchases" INTEGER,
    "purchaseValue" DOUBLE PRECISION,
    "purchaseROAS" DOUBLE PRECISION,
    "date_start" TIMESTAMP(3),
    "date_stop" TIMESTAMP(3),

    CONSTRAINT "FAD_AdCreativeReport_pkey" PRIMARY KEY ("pkId")
);

-- CreateTable
CREATE TABLE "FAD_BmAndAdAccounts" (
    "pkId" TEXT NOT NULL DEFAULT gen_random_uuid(),
    "user_id" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "bm_id" TEXT,
    "bm_name" TEXT,
    "bm_created_time" TIMESTAMP(3),
    "bm_verification_status" TEXT,
    "bm_profile_picture_uri" TEXT,
    "account_type" TEXT,
    "account_id" TEXT,
    "account_name" TEXT,
    "account_status_text" TEXT,
    "currency" TEXT,
    "timezone_name" TEXT,
    "amount_spent" DOUBLE PRECISION,
    "balance" DOUBLE PRECISION,
    "current_payment_method" TEXT,
    "tax_and_fee" DOUBLE PRECISION,

    CONSTRAINT "FAD_BmAndAdAccounts_pkey" PRIMARY KEY ("pkId")
);

-- CreateTable
CREATE TABLE "FBT_FbBillingData" (
    "pkId" TEXT NOT NULL DEFAULT gen_random_uuid(),
    "user_id" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "accountId" TEXT,
    "accountName" TEXT,
    "eventType" TEXT,
    "dateTimeInTimezone" TEXT,
    "fetchTimestamp" TIMESTAMP(3),
    "currency" TEXT,
    "value" DECIMAL(65,30),
    "totalValue" DECIMAL(65,30),
    "tax" DECIMAL(65,30),
    "transactionId" TEXT,
    "action" TEXT,
    "type" TEXT,
    "taxAndFeePercent" DOUBLE PRECISION,
    "billingHubLink" TEXT,
    "downloadInvoiceLink" TEXT,

    CONSTRAINT "FBT_FbBillingData_pkey" PRIMARY KEY ("pkId")
);

-- CreateTable
CREATE TABLE "MPI_BcTuongTacTangTruongCongDong" (
    "pkId" TEXT NOT NULL DEFAULT gen_random_uuid(),
    "user_id" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "page_daily_follows_unique" INTEGER,
    "page_daily_unfollows_unique" INTEGER,
    "page_post_engagements" INTEGER,
    "page_fan_adds" INTEGER,
    "page_fan_removes" INTEGER,
    "page_views_total" INTEGER,

    CONSTRAINT "MPI_BcTuongTacTangTruongCongDong_pkey" PRIMARY KEY ("pkId")
);

-- CreateTable
CREATE TABLE "MPI_BcHienThiTiepCanTrang" (
    "pkId" TEXT NOT NULL DEFAULT gen_random_uuid(),
    "user_id" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "page_impressions" INTEGER,
    "page_impressions_paid" INTEGER,
    "page_impressions_unique" INTEGER,
    "page_impressions_paid_unique" INTEGER,

    CONSTRAINT "MPI_BcHienThiTiepCanTrang_pkey" PRIMARY KEY ("pkId")
);

-- CreateTable
CREATE TABLE "MPI_BcHieuSuatBaiVietTongHop" (
    "pkId" TEXT NOT NULL DEFAULT gen_random_uuid(),
    "user_id" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "post_impressions" INTEGER,
    "post_impressions_unique" INTEGER,
    "post_clicks" INTEGER,
    "post_impressions_paid" INTEGER,
    "post_impressions_paid_unique" INTEGER,
    "post_impressions_organic" INTEGER,
    "post_impressions_organic_unique" INTEGER,
    "post_impressions_fan" INTEGER,
    "post_impressions_fan_unique" INTEGER,
    "post_reactions_like_total" INTEGER,
    "post_reactions_love_total" INTEGER,
    "post_reactions_wow_total" INTEGER,
    "post_reactions_haha_total" INTEGER,
    "post_reactions_sorry_total" INTEGER,
    "post_reactions_anger_total" INTEGER,
    "post_video_views" INTEGER,
    "post_activity_by_action_type" JSONB,

    CONSTRAINT "MPI_BcHieuSuatBaiVietTongHop_pkey" PRIMARY KEY ("pkId")
);

-- CreateTable
CREATE TABLE "MPI_BcPhanTichCamXucBaiViet" (
    "pkId" TEXT NOT NULL DEFAULT gen_random_uuid(),
    "user_id" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "post_reactions_like_total" INTEGER,
    "post_reactions_love_total" INTEGER,
    "post_reactions_wow_total" INTEGER,
    "post_reactions_haha_total" INTEGER,
    "post_reactions_sorry_total" INTEGER,
    "post_reactions_anger_total" INTEGER,

    CONSTRAINT "MPI_BcPhanTichCamXucBaiViet_pkey" PRIMARY KEY ("pkId")
);

-- CreateTable
CREATE TABLE "MPI_BcPhanTichFanTheoViTri" (
    "pkId" TEXT NOT NULL DEFAULT gen_random_uuid(),
    "user_id" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "page_fans_country" JSONB,
    "page_fans_city" JSONB,

    CONSTRAINT "MPI_BcPhanTichFanTheoViTri_pkey" PRIMARY KEY ("pkId")
);

-- CreateTable
CREATE TABLE "MPI_BcPhanTichNguonLuotThichMoi" (
    "pkId" TEXT NOT NULL DEFAULT gen_random_uuid(),
    "user_id" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "page_fan_adds_by_paid_non_paid_unique" JSONB,

    CONSTRAINT "MPI_BcPhanTichNguonLuotThichMoi_pkey" PRIMARY KEY ("pkId")
);

-- CreateTable
CREATE TABLE "MPI_BcHieuSuatVideoTungVideo" (
    "pkId" TEXT NOT NULL DEFAULT gen_random_uuid(),
    "user_id" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "post_impressions_unique" INTEGER,
    "post_video_retention_graph" JSONB,
    "post_video_followers" INTEGER,
    "post_video_avg_time_watched" DOUBLE PRECISION,
    "post_video_social_actions" INTEGER,
    "post_video_view_time" DOUBLE PRECISION,
    "post_video_likes_by_reaction_type" JSONB,

    CONSTRAINT "MPI_BcHieuSuatVideoTungVideo_pkey" PRIMARY KEY ("pkId")
);

-- CreateTable
CREATE TABLE "MPI_BcHieuSuatVideoTongHop" (
    "pkId" TEXT NOT NULL DEFAULT gen_random_uuid(),
    "user_id" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "page_video_views" INTEGER,
    "page_video_views_paid" INTEGER,
    "page_video_views_organic" INTEGER,
    "page_video_views_unique" INTEGER,
    "page_video_complete_views_30s" INTEGER,
    "page_video_complete_views_30s_unique" INTEGER,
    "page_video_view_time" DOUBLE PRECISION,

    CONSTRAINT "MPI_BcHieuSuatVideoTongHop_pkey" PRIMARY KEY ("pkId")
);

-- CreateTable
CREATE TABLE "MPI_BcTongHopHieuSuatTrangNangCao" (
    "pkId" TEXT NOT NULL DEFAULT gen_random_uuid(),
    "user_id" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "platform" TEXT,
    "page_id" TEXT,
    "page_name" TEXT,
    "date" TIMESTAMP(3),
    "followers_total" INTEGER,
    "follows_new" INTEGER,
    "unfollows" INTEGER,
    "net_follows" INTEGER,
    "impressions_total" INTEGER,
    "reach_total" INTEGER,
    "impressions_paid" INTEGER,
    "reach_paid" INTEGER,
    "frequency" DOUBLE PRECISION,
    "page_views" INTEGER,
    "post_impressions" INTEGER,
    "post_reach" INTEGER,
    "engagements" INTEGER,
    "cta_clicks" INTEGER,
    "engagement_rate" DOUBLE PRECISION,
    "video_views" INTEGER,
    "video_view_time" DOUBLE PRECISION,

    CONSTRAINT "MPI_BcTongHopHieuSuatTrangNangCao_pkey" PRIMARY KEY ("pkId")
);

-- CreateTable
CREATE TABLE "MPI_BcHieuSuatBaiVietLifetime" (
    "pkId" TEXT NOT NULL DEFAULT gen_random_uuid(),
    "user_id" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "post_impressions" INTEGER,
    "post_impressions_unique" INTEGER,
    "post_clicks" INTEGER,
    "post_reactions_by_type_total" JSONB,
    "post_video_views" INTEGER,
    "post_video_views_unique" INTEGER,

    CONSTRAINT "MPI_BcHieuSuatBaiVietLifetime_pkey" PRIMARY KEY ("pkId")
);

-- CreateTable
CREATE TABLE "BCA_BCInfo" (
    "pkId" TEXT NOT NULL DEFAULT gen_random_uuid(),
    "user_id" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "bc_id" TEXT,
    "bc_name" TEXT,
    "company" TEXT,
    "currency" TEXT,
    "status" TEXT,
    "type" TEXT,
    "timezone" TEXT,
    "user_role" TEXT,
    "finance_role" TEXT,

    CONSTRAINT "BCA_BCInfo_pkey" PRIMARY KEY ("pkId")
);

-- CreateTable
CREATE TABLE "BCA_BCAccountInfo" (
    "pkId" TEXT NOT NULL DEFAULT gen_random_uuid(),
    "user_id" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "advertiser_id" TEXT,
    "name" TEXT,
    "status" TEXT,
    "currency" TEXT,
    "timezone" TEXT,
    "company" TEXT,
    "industry" TEXT,
    "country" TEXT,
    "address" TEXT,
    "contacter" TEXT,
    "email" TEXT,
    "cellphone_number" TEXT,
    "owner_bc_id" TEXT,
    "create_time" TIMESTAMP(3),
    "balance" DOUBLE PRECISION,
    "role" TEXT,

    CONSTRAINT "BCA_BCAccountInfo_pkey" PRIMARY KEY ("pkId")
);

-- CreateTable
CREATE TABLE "BCA_BCAssetInfo" (
    "pkId" TEXT NOT NULL DEFAULT gen_random_uuid(),
    "user_id" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "bc_id" TEXT,
    "asset_type" TEXT,
    "asset_id" TEXT,
    "asset_name" TEXT,
    "owner_bc_name" TEXT,
    "relation_type" TEXT,
    "advertiser_status" TEXT,
    "advertiser_role" TEXT,
    "catalog_role" TEXT,
    "store_role" TEXT,
    "relation_status" TEXT,

    CONSTRAINT "BCA_BCAssetInfo_pkey" PRIMARY KEY ("pkId")
);

-- CreateTable
CREATE TABLE "TTA_CampaignPerformance" (
    "pkId" TEXT NOT NULL DEFAULT gen_random_uuid(),
    "user_id" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "stat_time_day" TIMESTAMP(3),
    "campaign_id" TEXT,
    "start_date" TIMESTAMP(3),
    "end_date" TIMESTAMP(3),
    "advertiser_id" TEXT,
    "advertiser_name" TEXT,
    "campaign_name" TEXT,
    "objective_type" TEXT,
    "spend" DOUBLE PRECISION,
    "impressions" INTEGER,
    "clicks" INTEGER,
    "ctr" DOUBLE PRECISION,
    "cpc" DOUBLE PRECISION,
    "cpm" DOUBLE PRECISION,
    "reach" INTEGER,
    "frequency" DOUBLE PRECISION,
    "conversion" INTEGER,
    "cost_per_conversion" DOUBLE PRECISION,
    "conversion_rate" DOUBLE PRECISION,
    "video_play_actions" INTEGER,
    "profile_visits" INTEGER,
    "likes" INTEGER,
    "comments" INTEGER,
    "shares" INTEGER,
    "follows" INTEGER,
    "live_views" INTEGER,
    "purchase" INTEGER,
    "total_onsite_shopping_value" DOUBLE PRECISION,
    "onsite_shopping" INTEGER,
    "onsite_shopping_roas" DOUBLE PRECISION,
    "cost_per_onsite_shopping" DOUBLE PRECISION,

    CONSTRAINT "TTA_CampaignPerformance_pkey" PRIMARY KEY ("pkId")
);

-- CreateTable
CREATE TABLE "TTA_AdGroupPerformance" (
    "pkId" TEXT NOT NULL DEFAULT gen_random_uuid(),
    "user_id" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "stat_time_day" TIMESTAMP(3),
    "adgroup_id" TEXT,
    "start_date" TIMESTAMP(3),
    "end_date" TIMESTAMP(3),
    "advertiser_id" TEXT,
    "advertiser_name" TEXT,
    "adgroup_name" TEXT,
    "campaign_name" TEXT,
    "spend" DOUBLE PRECISION,
    "impressions" INTEGER,
    "clicks" INTEGER,
    "ctr" DOUBLE PRECISION,
    "cpc" DOUBLE PRECISION,
    "cpm" DOUBLE PRECISION,
    "reach" INTEGER,
    "frequency" DOUBLE PRECISION,
    "conversion" INTEGER,
    "cost_per_conversion" DOUBLE PRECISION,
    "conversion_rate" DOUBLE PRECISION,
    "video_play_actions" INTEGER,
    "purchase" INTEGER,
    "profile_visits" INTEGER,
    "likes" INTEGER,
    "comments" INTEGER,
    "shares" INTEGER,
    "follows" INTEGER,
    "live_views" INTEGER,
    "total_onsite_shopping_value" DOUBLE PRECISION,
    "onsite_shopping" INTEGER,
    "onsite_shopping_roas" DOUBLE PRECISION,
    "cost_per_onsite_shopping" DOUBLE PRECISION,

    CONSTRAINT "TTA_AdGroupPerformance_pkey" PRIMARY KEY ("pkId")
);

-- CreateTable
CREATE TABLE "TTA_AdPerformance" (
    "pkId" TEXT NOT NULL DEFAULT gen_random_uuid(),
    "user_id" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "stat_time_day" TIMESTAMP(3),
    "ad_id" TEXT,
    "start_date" TIMESTAMP(3),
    "end_date" TIMESTAMP(3),
    "advertiser_id" TEXT,
    "advertiser_name" TEXT,
    "campaign_name" TEXT,
    "adgroup_name" TEXT,
    "ad_text" TEXT,
    "ad_name" TEXT,
    "spend" DOUBLE PRECISION,
    "impressions" INTEGER,
    "clicks" INTEGER,
    "ctr" DOUBLE PRECISION,
    "cpc" DOUBLE PRECISION,
    "cpm" DOUBLE PRECISION,
    "reach" INTEGER,
    "frequency" DOUBLE PRECISION,
    "conversion" INTEGER,
    "cost_per_conversion" DOUBLE PRECISION,
    "conversion_rate" DOUBLE PRECISION,
    "video_play_actions" INTEGER,
    "purchase" INTEGER,
    "profile_visits" INTEGER,
    "likes" INTEGER,
    "comments" INTEGER,
    "shares" INTEGER,
    "follows" INTEGER,
    "live_views" INTEGER,
    "total_onsite_shopping_value" DOUBLE PRECISION,
    "onsite_shopping" INTEGER,
    "onsite_shopping_roas" DOUBLE PRECISION,
    "cost_per_onsite_shopping" DOUBLE PRECISION,

    CONSTRAINT "TTA_AdPerformance_pkey" PRIMARY KEY ("pkId")
);

-- CreateTable
CREATE TABLE "TTA_CreativePerformance" (
    "pkId" TEXT NOT NULL DEFAULT gen_random_uuid(),
    "user_id" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "ad_id" TEXT,
    "start_date" TIMESTAMP(3),
    "end_date" TIMESTAMP(3),
    "advertiser_id" TEXT,
    "advertiser_name" TEXT,
    "campaign_id" TEXT,
    "campaign_name" TEXT,
    "adgroup_id" TEXT,
    "adgroup_name" TEXT,
    "ad_name" TEXT,
    "spend" DOUBLE PRECISION,
    "impressions" INTEGER,
    "clicks" INTEGER,
    "ctr" DOUBLE PRECISION,
    "conversion" INTEGER,
    "cost_per_conversion" DOUBLE PRECISION,

    CONSTRAINT "TTA_CreativePerformance_pkey" PRIMARY KEY ("pkId")
);

-- CreateTable
CREATE TABLE "TTA_AudienceRegionReport" (
    "pkId" TEXT NOT NULL DEFAULT gen_random_uuid(),
    "user_id" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "campaign_id" TEXT,
    "province_id" TEXT,
    "province_name" TEXT,
    "start_date" TIMESTAMP(3),
    "end_date" TIMESTAMP(3),
    "advertiser_id" TEXT,
    "advertiser_name" TEXT,
    "campaign_name" TEXT,
    "spend" DOUBLE PRECISION,
    "impressions" INTEGER,
    "clicks" INTEGER,
    "ctr" DOUBLE PRECISION,
    "cpc" DOUBLE PRECISION,
    "cpm" DOUBLE PRECISION,
    "reach" INTEGER,
    "conversion" INTEGER,
    "cost_per_conversion" DOUBLE PRECISION,
    "conversion_rate" DOUBLE PRECISION,
    "profile_visits" INTEGER,
    "likes" INTEGER,
    "comments" INTEGER,
    "shares" INTEGER,
    "follows" INTEGER,
    "video_play_actions" INTEGER,
    "video_watched_2s" INTEGER,
    "video_watched_6s" INTEGER,
    "video_views_p25" INTEGER,
    "video_views_p50" INTEGER,
    "video_views_p75" INTEGER,
    "video_views_p100" INTEGER,
    "average_video_play" DOUBLE PRECISION,

    CONSTRAINT "TTA_AudienceRegionReport_pkey" PRIMARY KEY ("pkId")
);

-- CreateTable
CREATE TABLE "TTA_AudienceCountryReport" (
    "pkId" TEXT NOT NULL DEFAULT gen_random_uuid(),
    "user_id" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "stat_time_day" TIMESTAMP(3),
    "campaign_id" TEXT,
    "country_code" TEXT,
    "start_date" TIMESTAMP(3),
    "end_date" TIMESTAMP(3),
    "advertiser_id" TEXT,
    "advertiser_name" TEXT,
    "campaign_name" TEXT,
    "spend" DOUBLE PRECISION,
    "impressions" INTEGER,
    "clicks" INTEGER,
    "ctr" DOUBLE PRECISION,
    "cpc" DOUBLE PRECISION,
    "cpm" DOUBLE PRECISION,
    "reach" INTEGER,
    "conversion" INTEGER,
    "cost_per_conversion" DOUBLE PRECISION,
    "conversion_rate" DOUBLE PRECISION,
    "video_play_actions" INTEGER,
    "likes" INTEGER,
    "comments" INTEGER,
    "shares" INTEGER,
    "follows" INTEGER,
    "profile_visits" INTEGER,

    CONSTRAINT "TTA_AudienceCountryReport_pkey" PRIMARY KEY ("pkId")
);

-- CreateTable
CREATE TABLE "TTA_AudienceAgeReport" (
    "pkId" TEXT NOT NULL DEFAULT gen_random_uuid(),
    "user_id" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "stat_time_day" TIMESTAMP(3),
    "campaign_id" TEXT,
    "age" TEXT,
    "start_date" TIMESTAMP(3),
    "end_date" TIMESTAMP(3),
    "advertiser_id" TEXT,
    "advertiser_name" TEXT,
    "campaign_name" TEXT,
    "spend" DOUBLE PRECISION,
    "impressions" INTEGER,
    "clicks" INTEGER,
    "ctr" DOUBLE PRECISION,
    "cpc" DOUBLE PRECISION,
    "cpm" DOUBLE PRECISION,
    "reach" INTEGER,
    "conversion" INTEGER,
    "cost_per_conversion" DOUBLE PRECISION,
    "conversion_rate" DOUBLE PRECISION,
    "video_play_actions" INTEGER,
    "likes" INTEGER,
    "comments" INTEGER,
    "shares" INTEGER,
    "follows" INTEGER,
    "profile_visits" INTEGER,

    CONSTRAINT "TTA_AudienceAgeReport_pkey" PRIMARY KEY ("pkId")
);

-- CreateTable
CREATE TABLE "TTA_AudienceGenderReport" (
    "pkId" TEXT NOT NULL DEFAULT gen_random_uuid(),
    "user_id" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "stat_time_day" TIMESTAMP(3),
    "campaign_id" TEXT,
    "gender" TEXT,
    "start_date" TIMESTAMP(3),
    "end_date" TIMESTAMP(3),
    "advertiser_id" TEXT,
    "advertiser_name" TEXT,
    "campaign_name" TEXT,
    "spend" DOUBLE PRECISION,
    "impressions" INTEGER,
    "clicks" INTEGER,
    "ctr" DOUBLE PRECISION,
    "cpc" DOUBLE PRECISION,
    "cpm" DOUBLE PRECISION,
    "reach" INTEGER,
    "conversion" INTEGER,
    "cost_per_conversion" DOUBLE PRECISION,
    "conversion_rate" DOUBLE PRECISION,
    "video_play_actions" INTEGER,
    "likes" INTEGER,
    "comments" INTEGER,
    "shares" INTEGER,
    "follows" INTEGER,
    "profile_visits" INTEGER,

    CONSTRAINT "TTA_AudienceGenderReport_pkey" PRIMARY KEY ("pkId")
);

-- CreateTable
CREATE TABLE "TTA_AudienceAgeGenderReport" (
    "pkId" TEXT NOT NULL DEFAULT gen_random_uuid(),
    "user_id" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "stat_time_day" TIMESTAMP(3),
    "campaign_id" TEXT,
    "age" TEXT,
    "gender" TEXT,
    "start_date" TIMESTAMP(3),
    "end_date" TIMESTAMP(3),
    "advertiser_id" TEXT,
    "advertiser_name" TEXT,
    "campaign_name" TEXT,
    "spend" DOUBLE PRECISION,
    "impressions" INTEGER,
    "clicks" INTEGER,
    "ctr" DOUBLE PRECISION,
    "cpc" DOUBLE PRECISION,
    "cpm" DOUBLE PRECISION,
    "reach" INTEGER,
    "conversion" INTEGER,
    "cost_per_conversion" DOUBLE PRECISION,
    "conversion_rate" DOUBLE PRECISION,
    "video_play_actions" INTEGER,
    "likes" INTEGER,
    "comments" INTEGER,
    "shares" INTEGER,
    "follows" INTEGER,
    "profile_visits" INTEGER,

    CONSTRAINT "TTA_AudienceAgeGenderReport_pkey" PRIMARY KEY ("pkId")
);

-- CreateTable
CREATE TABLE "TTA_PlacementReport" (
    "pkId" TEXT NOT NULL DEFAULT gen_random_uuid(),
    "user_id" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "campaign_id" TEXT,
    "placement" TEXT,
    "start_date" TIMESTAMP(3),
    "end_date" TIMESTAMP(3),
    "advertiser_id" TEXT,
    "advertiser_name" TEXT,
    "campaign_name" TEXT,
    "spend" DOUBLE PRECISION,
    "impressions" INTEGER,
    "clicks" INTEGER,
    "ctr" DOUBLE PRECISION,
    "conversion" INTEGER,
    "cost_per_conversion" DOUBLE PRECISION,

    CONSTRAINT "TTA_PlacementReport_pkey" PRIMARY KEY ("pkId")
);

-- CreateTable
CREATE TABLE "TTA_PlatformReport" (
    "pkId" TEXT NOT NULL DEFAULT gen_random_uuid(),
    "user_id" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "campaign_id" TEXT,
    "platform" TEXT,
    "start_date" TIMESTAMP(3),
    "end_date" TIMESTAMP(3),
    "advertiser_id" TEXT,
    "advertiser_name" TEXT,
    "campaign_name" TEXT,
    "spend" DOUBLE PRECISION,
    "impressions" INTEGER,
    "clicks" INTEGER,
    "ctr" DOUBLE PRECISION,
    "conversion" INTEGER,
    "cost_per_conversion" DOUBLE PRECISION,

    CONSTRAINT "TTA_PlatformReport_pkey" PRIMARY KEY ("pkId")
);

-- CreateTable
CREATE TABLE "GMV_CampaignPerformance" (
    "pkId" TEXT NOT NULL DEFAULT gen_random_uuid(),
    "user_id" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "campaign_id" TEXT,
    "stat_time_day" TIMESTAMP(3),
    "start_date" TIMESTAMP(3),
    "end_date" TIMESTAMP(3),
    "advertiser_id" TEXT,
    "advertiser_name" TEXT,
    "store_id" TEXT,
    "store_name" TEXT,
    "campaign_name" TEXT,
    "cost" DOUBLE PRECISION,
    "orders" INTEGER,
    "roi" DOUBLE PRECISION,
    "cost_per_order" DOUBLE PRECISION,
    "gross_revenue" DOUBLE PRECISION,
    "net_cost" DOUBLE PRECISION,
    "roas_bid" DOUBLE PRECISION,
    "operation_status" TEXT,
    "schedule_type" TEXT,
    "schedule_start_time" TIMESTAMP(3),
    "schedule_end_time" TIMESTAMP(3),
    "target_roi_budget" DOUBLE PRECISION,
    "bid_type" TEXT,
    "max_delivery_budget" DOUBLE PRECISION,

    CONSTRAINT "GMV_CampaignPerformance_pkey" PRIMARY KEY ("pkId")
);

-- CreateTable
CREATE TABLE "GMV_ProductDetailReport" (
    "pkId" TEXT NOT NULL DEFAULT gen_random_uuid(),
    "user_id" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "stat_time_day" TIMESTAMP(3),
    "campaign_id" TEXT,
    "item_group_id" TEXT,
    "product_img" TEXT,
    "start_date" TIMESTAMP(3),
    "end_date" TIMESTAMP(3),
    "advertiser_id" TEXT,
    "advertiser_name" TEXT,
    "store_id" TEXT,
    "store_name" TEXT,
    "campaign_name" TEXT,
    "operation_status" TEXT,
    "bid_type" TEXT,
    "product_name" TEXT,
    "product_image_url" TEXT,
    "orders" INTEGER,
    "gross_revenue" DOUBLE PRECISION,
    "cost" DOUBLE PRECISION,
    "cost_per_order" DOUBLE PRECISION,
    "roi" DOUBLE PRECISION,
    "currency" TEXT,
    "product_status" TEXT,

    CONSTRAINT "GMV_ProductDetailReport_pkey" PRIMARY KEY ("pkId")
);

-- CreateTable
CREATE TABLE "GMV_CreativeDetailReport" (
    "pkId" TEXT NOT NULL DEFAULT gen_random_uuid(),
    "user_id" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "campaign_id" TEXT,
    "item_group_id" TEXT,
    "item_id" TEXT,
    "product_img" TEXT,
    "start_date" TIMESTAMP(3),
    "end_date" TIMESTAMP(3),
    "advertiser_id" TEXT,
    "advertiser_name" TEXT,
    "store_id" TEXT,
    "store_name" TEXT,
    "campaign_name" TEXT,
    "operation_status" TEXT,
    "product_name" TEXT,
    "product_status" TEXT,
    "product_image_url" TEXT,
    "creative_delivery_status" TEXT,
    "title" TEXT,
    "tt_account_name" TEXT,
    "tt_account_profile_image_url" TEXT,
    "cost" DOUBLE PRECISION,
    "orders" INTEGER,
    "cost_per_order" DOUBLE PRECISION,
    "gross_revenue" DOUBLE PRECISION,
    "roi" DOUBLE PRECISION,
    "currency" TEXT,
    "product_impressions" INTEGER,
    "product_clicks" INTEGER,
    "product_click_rate" DOUBLE PRECISION,
    "ad_conversion_rate" DOUBLE PRECISION,
    "ad_video_view_rate_2s" DOUBLE PRECISION,
    "ad_video_view_rate_6s" DOUBLE PRECISION,
    "ad_video_view_rate_p25" DOUBLE PRECISION,
    "ad_video_view_rate_p50" DOUBLE PRECISION,
    "ad_video_view_rate_p75" DOUBLE PRECISION,
    "ad_video_view_rate_p100" DOUBLE PRECISION,

    CONSTRAINT "GMV_CreativeDetailReport_pkey" PRIMARY KEY ("pkId")
);

-- CreateTable
CREATE TABLE "User" (
    "id" TEXT NOT NULL,
    "username" TEXT NOT NULL,
    "email" TEXT,
    "password" TEXT NOT NULL,
    "settings" JSONB DEFAULT '{}',

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "RefreshToken" (
    "id" TEXT NOT NULL,
    "hashedToken" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "expiresAt" TIMESTAMP(3) NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "RefreshToken_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "User_username_key" ON "User"("username");

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");

-- CreateIndex
CREATE UNIQUE INDEX "RefreshToken_hashedToken_key" ON "RefreshToken"("hashedToken");

-- AddForeignKey
ALTER TABLE "RefreshToken" ADD CONSTRAINT "RefreshToken_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
