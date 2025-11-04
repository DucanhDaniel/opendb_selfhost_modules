-- CreateTable
CREATE TABLE "BCA_BCInfo" (
    "pkId" TEXT NOT NULL DEFAULT gen_random_uuid(),
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

    CONSTRAINT "GMV_ProductDetailReport_pkey" PRIMARY KEY ("pkId")
);

-- CreateTable
CREATE TABLE "GMV_CreativeDetailReport" (
    "pkId" TEXT NOT NULL DEFAULT gen_random_uuid(),
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
