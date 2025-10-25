-- CreateTable
CREATE TABLE "FAD_CampaignOverviewReport" (
    "pkId" TEXT NOT NULL,
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
    "pkId" TEXT NOT NULL,
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
    "pkId" TEXT NOT NULL,
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
    "pkId" TEXT NOT NULL,
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
    "pkId" TEXT NOT NULL,
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
    "pkId" TEXT NOT NULL,
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
    "pkId" TEXT NOT NULL,
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
    "pkId" TEXT NOT NULL,
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
    "pkId" TEXT NOT NULL,
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
    "pkId" TEXT NOT NULL,
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
    "pkId" TEXT NOT NULL,
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
    "pkId" TEXT NOT NULL,
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
    "pkId" TEXT NOT NULL,
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
    "pkId" TEXT NOT NULL,
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
    "pkId" TEXT NOT NULL,
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
    "pkId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "page_impressions" INTEGER,
    "page_impressions_paid" INTEGER,
    "page_impressions_unique" INTEGER,
    "page_impressions_paid_unique" INTEGER,

    CONSTRAINT "MPI_BcHienThiTiepCanTrang_pkey" PRIMARY KEY ("pkId")
);

-- CreateTable
CREATE TABLE "MPI_BcHieuSuatBaiVietTongHop" (
    "pkId" TEXT NOT NULL,
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
    "pkId" TEXT NOT NULL,
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
    "pkId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "page_fans_country" JSONB,
    "page_fans_city" JSONB,

    CONSTRAINT "MPI_BcPhanTichFanTheoViTri_pkey" PRIMARY KEY ("pkId")
);

-- CreateTable
CREATE TABLE "MPI_BcPhanTichNguonLuotThichMoi" (
    "pkId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "page_fan_adds_by_paid_non_paid_unique" JSONB,

    CONSTRAINT "MPI_BcPhanTichNguonLuotThichMoi_pkey" PRIMARY KEY ("pkId")
);

-- CreateTable
CREATE TABLE "MPI_BcHieuSuatVideoTungVideo" (
    "pkId" TEXT NOT NULL,
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
    "pkId" TEXT NOT NULL,
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
    "pkId" TEXT NOT NULL,
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
    "pkId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "post_impressions" INTEGER,
    "post_impressions_unique" INTEGER,
    "post_clicks" INTEGER,
    "post_reactions_by_type_total" JSONB,
    "post_video_views" INTEGER,
    "post_video_views_unique" INTEGER,

    CONSTRAINT "MPI_BcHieuSuatBaiVietLifetime_pkey" PRIMARY KEY ("pkId")
);

-- CreateIndex
CREATE UNIQUE INDEX "FAD_CampaignOverviewReport_account_id_date_start_date_stop_key" ON "FAD_CampaignOverviewReport"("account_id", "date_start", "date_stop");

-- CreateIndex
CREATE UNIQUE INDEX "FAD_CampaignPerformanceByAge_account_id_date_start_date_sto_key" ON "FAD_CampaignPerformanceByAge"("account_id", "date_start", "date_stop");

-- CreateIndex
CREATE UNIQUE INDEX "FAD_CampaignPerformanceByGender_account_id_date_start_date__key" ON "FAD_CampaignPerformanceByGender"("account_id", "date_start", "date_stop");

-- CreateIndex
CREATE UNIQUE INDEX "FAD_CampaignPerformanceByPlatform_account_id_date_start_dat_key" ON "FAD_CampaignPerformanceByPlatform"("account_id", "date_start", "date_stop");

-- CreateIndex
CREATE UNIQUE INDEX "FAD_CampaignPerformanceByRegion_account_id_date_start_date__key" ON "FAD_CampaignPerformanceByRegion"("account_id", "date_start", "date_stop");

-- CreateIndex
CREATE UNIQUE INDEX "FAD_AdSetPerformanceReport_account_id_date_start_date_stop_key" ON "FAD_AdSetPerformanceReport"("account_id", "date_start", "date_stop");

-- CreateIndex
CREATE UNIQUE INDEX "FAD_AdPerformanceReport_account_id_date_start_date_stop_key" ON "FAD_AdPerformanceReport"("account_id", "date_start", "date_stop");

-- CreateIndex
CREATE UNIQUE INDEX "FAD_AccountDailyReport_account_id_date_start_date_stop_key" ON "FAD_AccountDailyReport"("account_id", "date_start", "date_stop");

-- CreateIndex
CREATE UNIQUE INDEX "FAD_CampaignDailyReport_account_id_date_start_date_stop_key" ON "FAD_CampaignDailyReport"("account_id", "date_start", "date_stop");

-- CreateIndex
CREATE UNIQUE INDEX "FAD_AdSetDailyReport_account_id_date_start_date_stop_key" ON "FAD_AdSetDailyReport"("account_id", "date_start", "date_stop");

-- CreateIndex
CREATE UNIQUE INDEX "FAD_AdDailyReport_account_id_date_start_date_stop_key" ON "FAD_AdDailyReport"("account_id", "date_start", "date_stop");

-- CreateIndex
CREATE UNIQUE INDEX "FAD_AdCreativeReport_account_id_date_start_date_stop_key" ON "FAD_AdCreativeReport"("account_id", "date_start", "date_stop");

-- CreateIndex
CREATE UNIQUE INDEX "FAD_BmAndAdAccounts_bm_id_account_id_key" ON "FAD_BmAndAdAccounts"("bm_id", "account_id");

-- CreateIndex
CREATE UNIQUE INDEX "FBT_FbBillingData_accountId_transactionId_key" ON "FBT_FbBillingData"("accountId", "transactionId");
