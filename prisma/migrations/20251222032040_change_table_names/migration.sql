/*
  Warnings:

  - You are about to drop the `BCA_BCAssetInfo` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `BCA_BCInfo` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `FAD_AccountDailyReport` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `FAD_AdCreativeReport` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `FAD_AdDailyReport` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `FAD_AdPerformanceReport` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `FAD_AdSetDailyReport` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `FAD_AdSetPerformanceReport` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `FAD_BmAndAdAccounts` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `FAD_CampaignDailyReport` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `FAD_CampaignOverviewReport` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `FAD_CampaignPerformanceByAge` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `FAD_CampaignPerformanceByGender` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `FAD_CampaignPerformanceByPlatform` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `FAD_CampaignPerformanceByRegion` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `FBT_FbBillingData` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `GMV_AllCampaignPerformance` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `GMV_CreativeDetailReport` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `GMV_LiveCampaignPerformance` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `GMV_ProductCampaignPerformance` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `GMV_ProductDetailReport` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `MPI_BcHienThiTiepCanTrang` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `MPI_BcHieuSuatBaiVietLifetime` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `MPI_BcHieuSuatBaiVietTongHop` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `MPI_BcHieuSuatVideoTongHop` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `MPI_BcHieuSuatVideoTungVideo` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `MPI_BcPhanTichCamXucBaiViet` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `MPI_BcPhanTichFanTheoViTri` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `MPI_BcPhanTichNguonLuotThichMoi` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `MPI_BcTongHopHieuSuatTrangNangCao` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `MPI_BcTuongTacTangTruongCongDong` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `POS_BasicReport` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `RefreshToken` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `TTA_AdGroupPerformance` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `TTA_AdPerformance` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `TTA_AudienceAgeGenderReport` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `TTA_AudienceAgeReport` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `TTA_AudienceCountryReport` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `TTA_AudienceGenderReport` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `TTA_AudienceRegionReport` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `TTA_CampaignPerformance` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `TTA_CreativePerformance` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `TTA_PlacementReport` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `TTA_PlatformReport` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `TaskLog` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `TaskMetric` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `TaskSchedule` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `User` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "public"."RefreshToken" DROP CONSTRAINT "RefreshToken_userId_fkey";

-- DropForeignKey
ALTER TABLE "public"."TaskMetric" DROP CONSTRAINT "TaskMetric_scheduleId_fkey";

-- DropForeignKey
ALTER TABLE "public"."TaskSchedule" DROP CONSTRAINT "TaskSchedule_userId_fkey";

-- AlterTable
ALTER TABLE "bca_bc_account_info" ALTER COLUMN "pkId" DROP DEFAULT;

-- DropTable
DROP TABLE "public"."BCA_BCAssetInfo";

-- DropTable
DROP TABLE "public"."BCA_BCInfo";

-- DropTable
DROP TABLE "public"."FAD_AccountDailyReport";

-- DropTable
DROP TABLE "public"."FAD_AdCreativeReport";

-- DropTable
DROP TABLE "public"."FAD_AdDailyReport";

-- DropTable
DROP TABLE "public"."FAD_AdPerformanceReport";

-- DropTable
DROP TABLE "public"."FAD_AdSetDailyReport";

-- DropTable
DROP TABLE "public"."FAD_AdSetPerformanceReport";

-- DropTable
DROP TABLE "public"."FAD_BmAndAdAccounts";

-- DropTable
DROP TABLE "public"."FAD_CampaignDailyReport";

-- DropTable
DROP TABLE "public"."FAD_CampaignOverviewReport";

-- DropTable
DROP TABLE "public"."FAD_CampaignPerformanceByAge";

-- DropTable
DROP TABLE "public"."FAD_CampaignPerformanceByGender";

-- DropTable
DROP TABLE "public"."FAD_CampaignPerformanceByPlatform";

-- DropTable
DROP TABLE "public"."FAD_CampaignPerformanceByRegion";

-- DropTable
DROP TABLE "public"."FBT_FbBillingData";

-- DropTable
DROP TABLE "public"."GMV_AllCampaignPerformance";

-- DropTable
DROP TABLE "public"."GMV_CreativeDetailReport";

-- DropTable
DROP TABLE "public"."GMV_LiveCampaignPerformance";

-- DropTable
DROP TABLE "public"."GMV_ProductCampaignPerformance";

-- DropTable
DROP TABLE "public"."GMV_ProductDetailReport";

-- DropTable
DROP TABLE "public"."MPI_BcHienThiTiepCanTrang";

-- DropTable
DROP TABLE "public"."MPI_BcHieuSuatBaiVietLifetime";

-- DropTable
DROP TABLE "public"."MPI_BcHieuSuatBaiVietTongHop";

-- DropTable
DROP TABLE "public"."MPI_BcHieuSuatVideoTongHop";

-- DropTable
DROP TABLE "public"."MPI_BcHieuSuatVideoTungVideo";

-- DropTable
DROP TABLE "public"."MPI_BcPhanTichCamXucBaiViet";

-- DropTable
DROP TABLE "public"."MPI_BcPhanTichFanTheoViTri";

-- DropTable
DROP TABLE "public"."MPI_BcPhanTichNguonLuotThichMoi";

-- DropTable
DROP TABLE "public"."MPI_BcTongHopHieuSuatTrangNangCao";

-- DropTable
DROP TABLE "public"."MPI_BcTuongTacTangTruongCongDong";

-- DropTable
DROP TABLE "public"."POS_BasicReport";

-- DropTable
DROP TABLE "public"."RefreshToken";

-- DropTable
DROP TABLE "public"."TTA_AdGroupPerformance";

-- DropTable
DROP TABLE "public"."TTA_AdPerformance";

-- DropTable
DROP TABLE "public"."TTA_AudienceAgeGenderReport";

-- DropTable
DROP TABLE "public"."TTA_AudienceAgeReport";

-- DropTable
DROP TABLE "public"."TTA_AudienceCountryReport";

-- DropTable
DROP TABLE "public"."TTA_AudienceGenderReport";

-- DropTable
DROP TABLE "public"."TTA_AudienceRegionReport";

-- DropTable
DROP TABLE "public"."TTA_CampaignPerformance";

-- DropTable
DROP TABLE "public"."TTA_CreativePerformance";

-- DropTable
DROP TABLE "public"."TTA_PlacementReport";

-- DropTable
DROP TABLE "public"."TTA_PlatformReport";

-- DropTable
DROP TABLE "public"."TaskLog";

-- DropTable
DROP TABLE "public"."TaskMetric";

-- DropTable
DROP TABLE "public"."TaskSchedule";

-- DropTable
DROP TABLE "public"."User";

-- CreateTable
CREATE TABLE "fad_campaign_overview_report" (
    "pkId" TEXT NOT NULL,
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

    CONSTRAINT "fad_campaign_overview_report_pkey" PRIMARY KEY ("pkId")
);

-- CreateTable
CREATE TABLE "fad_campaign_performance_by_age" (
    "pkId" TEXT NOT NULL,
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

    CONSTRAINT "fad_campaign_performance_by_age_pkey" PRIMARY KEY ("pkId")
);

-- CreateTable
CREATE TABLE "fad_campaign_performance_by_gender" (
    "pkId" TEXT NOT NULL,
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

    CONSTRAINT "fad_campaign_performance_by_gender_pkey" PRIMARY KEY ("pkId")
);

-- CreateTable
CREATE TABLE "fad_campaign_performance_by_platform" (
    "pkId" TEXT NOT NULL,
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

    CONSTRAINT "fad_campaign_performance_by_platform_pkey" PRIMARY KEY ("pkId")
);

-- CreateTable
CREATE TABLE "fad_campaign_performance_by_region" (
    "pkId" TEXT NOT NULL,
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

    CONSTRAINT "fad_campaign_performance_by_region_pkey" PRIMARY KEY ("pkId")
);

-- CreateTable
CREATE TABLE "fad_ad_set_performance_report" (
    "pkId" TEXT NOT NULL,
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

    CONSTRAINT "fad_ad_set_performance_report_pkey" PRIMARY KEY ("pkId")
);

-- CreateTable
CREATE TABLE "fad_ad_performance_report" (
    "pkId" TEXT NOT NULL,
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

    CONSTRAINT "fad_ad_performance_report_pkey" PRIMARY KEY ("pkId")
);

-- CreateTable
CREATE TABLE "fad_account_daily_report" (
    "pkId" TEXT NOT NULL,
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

    CONSTRAINT "fad_account_daily_report_pkey" PRIMARY KEY ("pkId")
);

-- CreateTable
CREATE TABLE "fad_campaign_daily_report" (
    "pkId" TEXT NOT NULL,
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

    CONSTRAINT "fad_campaign_daily_report_pkey" PRIMARY KEY ("pkId")
);

-- CreateTable
CREATE TABLE "fad_ad_set_daily_report" (
    "pkId" TEXT NOT NULL,
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

    CONSTRAINT "fad_ad_set_daily_report_pkey" PRIMARY KEY ("pkId")
);

-- CreateTable
CREATE TABLE "fad_ad_daily_report" (
    "pkId" TEXT NOT NULL,
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

    CONSTRAINT "fad_ad_daily_report_pkey" PRIMARY KEY ("pkId")
);

-- CreateTable
CREATE TABLE "fad_ad_creative_report" (
    "pkId" TEXT NOT NULL,
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

    CONSTRAINT "fad_ad_creative_report_pkey" PRIMARY KEY ("pkId")
);

-- CreateTable
CREATE TABLE "fad_bm_and_ad_accounts" (
    "pkId" TEXT NOT NULL,
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

    CONSTRAINT "fad_bm_and_ad_accounts_pkey" PRIMARY KEY ("pkId")
);

-- CreateTable
CREATE TABLE "fbt_fb_billing_data" (
    "pkId" TEXT NOT NULL,
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

    CONSTRAINT "fbt_fb_billing_data_pkey" PRIMARY KEY ("pkId")
);

-- CreateTable
CREATE TABLE "mpi_bc_tuong_tac_tang_truong_cong_dong" (
    "pkId" TEXT NOT NULL,
    "user_id" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "page_daily_follows_unique" INTEGER,
    "page_daily_unfollows_unique" INTEGER,
    "page_post_engagements" INTEGER,
    "page_fan_adds" INTEGER,
    "page_fan_removes" INTEGER,
    "page_views_total" INTEGER,

    CONSTRAINT "mpi_bc_tuong_tac_tang_truong_cong_dong_pkey" PRIMARY KEY ("pkId")
);

-- CreateTable
CREATE TABLE "mpi_bc_hien_thi_tiep_can_trang" (
    "pkId" TEXT NOT NULL,
    "user_id" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "page_impressions" INTEGER,
    "page_impressions_paid" INTEGER,
    "page_impressions_unique" INTEGER,
    "page_impressions_paid_unique" INTEGER,

    CONSTRAINT "mpi_bc_hien_thi_tiep_can_trang_pkey" PRIMARY KEY ("pkId")
);

-- CreateTable
CREATE TABLE "mpi_bc_hieu_suat_bai_viet_tong_hop" (
    "pkId" TEXT NOT NULL,
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

    CONSTRAINT "mpi_bc_hieu_suat_bai_viet_tong_hop_pkey" PRIMARY KEY ("pkId")
);

-- CreateTable
CREATE TABLE "mpi_bc_phan_tich_cam_xuc_bai_viet" (
    "pkId" TEXT NOT NULL,
    "user_id" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "post_reactions_like_total" INTEGER,
    "post_reactions_love_total" INTEGER,
    "post_reactions_wow_total" INTEGER,
    "post_reactions_haha_total" INTEGER,
    "post_reactions_sorry_total" INTEGER,
    "post_reactions_anger_total" INTEGER,

    CONSTRAINT "mpi_bc_phan_tich_cam_xuc_bai_viet_pkey" PRIMARY KEY ("pkId")
);

-- CreateTable
CREATE TABLE "mpi_bc_phan_tich_fan_theo_vi_tri" (
    "pkId" TEXT NOT NULL,
    "user_id" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "page_fans_country" JSONB,
    "page_fans_city" JSONB,

    CONSTRAINT "mpi_bc_phan_tich_fan_theo_vi_tri_pkey" PRIMARY KEY ("pkId")
);

-- CreateTable
CREATE TABLE "mpi_bc_phan_tich_nguon_luot_thich_moi" (
    "pkId" TEXT NOT NULL,
    "user_id" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "page_fan_adds_by_paid_non_paid_unique" JSONB,

    CONSTRAINT "mpi_bc_phan_tich_nguon_luot_thich_moi_pkey" PRIMARY KEY ("pkId")
);

-- CreateTable
CREATE TABLE "mpi_bc_hieu_suat_video_tung_video" (
    "pkId" TEXT NOT NULL,
    "user_id" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "post_impressions_unique" INTEGER,
    "post_video_retention_graph" JSONB,
    "post_video_followers" INTEGER,
    "post_video_avg_time_watched" DOUBLE PRECISION,
    "post_video_social_actions" INTEGER,
    "post_video_view_time" DOUBLE PRECISION,
    "post_video_likes_by_reaction_type" JSONB,

    CONSTRAINT "mpi_bc_hieu_suat_video_tung_video_pkey" PRIMARY KEY ("pkId")
);

-- CreateTable
CREATE TABLE "mpi_bc_hieu_suat_video_tong_hop" (
    "pkId" TEXT NOT NULL,
    "user_id" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "page_video_views" INTEGER,
    "page_video_views_paid" INTEGER,
    "page_video_views_organic" INTEGER,
    "page_video_views_unique" INTEGER,
    "page_video_complete_views_30s" INTEGER,
    "page_video_complete_views_30s_unique" INTEGER,
    "page_video_view_time" DOUBLE PRECISION,

    CONSTRAINT "mpi_bc_hieu_suat_video_tong_hop_pkey" PRIMARY KEY ("pkId")
);

-- CreateTable
CREATE TABLE "mpi_bc_tong_hop_hieu_suat_trang_nang_cao" (
    "pkId" TEXT NOT NULL,
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

    CONSTRAINT "mpi_bc_tong_hop_hieu_suat_trang_nang_cao_pkey" PRIMARY KEY ("pkId")
);

-- CreateTable
CREATE TABLE "mpi_bc_hieu_suat_bai_viet_lifetime" (
    "pkId" TEXT NOT NULL,
    "user_id" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "post_impressions" INTEGER,
    "post_impressions_unique" INTEGER,
    "post_clicks" INTEGER,
    "post_reactions_by_type_total" JSONB,
    "post_video_views" INTEGER,
    "post_video_views_unique" INTEGER,

    CONSTRAINT "mpi_bc_hieu_suat_bai_viet_lifetime_pkey" PRIMARY KEY ("pkId")
);

-- CreateTable
CREATE TABLE "bca_bc_info" (
    "pkId" TEXT NOT NULL,
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

    CONSTRAINT "bca_bc_info_pkey" PRIMARY KEY ("pkId")
);

-- CreateTable
CREATE TABLE "bca_bc_asset_info" (
    "pkId" TEXT NOT NULL,
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

    CONSTRAINT "bca_bc_asset_info_pkey" PRIMARY KEY ("pkId")
);

-- CreateTable
CREATE TABLE "tta_campaign_performance" (
    "pkId" TEXT NOT NULL,
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

    CONSTRAINT "tta_campaign_performance_pkey" PRIMARY KEY ("pkId")
);

-- CreateTable
CREATE TABLE "tta_adgroup_performance" (
    "pkId" TEXT NOT NULL,
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

    CONSTRAINT "tta_adgroup_performance_pkey" PRIMARY KEY ("pkId")
);

-- CreateTable
CREATE TABLE "tta_ad_performance" (
    "pkId" TEXT NOT NULL,
    "user_id" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "stat_time_day" TIMESTAMP(3),
    "ad_id" TEXT,
    "start_date" TIMESTAMP(3),
    "end_date" TIMESTAMP(3),
    "advertiser_id" TEXT,
    "advertiser_name" TEXT,
    "campaign_name" VARCHAR(255),
    "adgroup_name" VARCHAR(255),
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

    CONSTRAINT "tta_ad_performance_pkey" PRIMARY KEY ("pkId")
);

-- CreateTable
CREATE TABLE "tta_creative_performance" (
    "pkId" TEXT NOT NULL,
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

    CONSTRAINT "tta_creative_performance_pkey" PRIMARY KEY ("pkId")
);

-- CreateTable
CREATE TABLE "tta_audience_region_report" (
    "pkId" TEXT NOT NULL,
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

    CONSTRAINT "tta_audience_region_report_pkey" PRIMARY KEY ("pkId")
);

-- CreateTable
CREATE TABLE "tta_audience_country_report" (
    "pkId" TEXT NOT NULL,
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

    CONSTRAINT "tta_audience_country_report_pkey" PRIMARY KEY ("pkId")
);

-- CreateTable
CREATE TABLE "tta_audience_age_report" (
    "pkId" TEXT NOT NULL,
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

    CONSTRAINT "tta_audience_age_report_pkey" PRIMARY KEY ("pkId")
);

-- CreateTable
CREATE TABLE "tta_audience_gender_report" (
    "pkId" TEXT NOT NULL,
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

    CONSTRAINT "tta_audience_gender_report_pkey" PRIMARY KEY ("pkId")
);

-- CreateTable
CREATE TABLE "tta_audience_age_gender_report" (
    "pkId" TEXT NOT NULL,
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

    CONSTRAINT "tta_audience_age_gender_report_pkey" PRIMARY KEY ("pkId")
);

-- CreateTable
CREATE TABLE "tta_placement_report" (
    "pkId" TEXT NOT NULL,
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

    CONSTRAINT "tta_placement_report_pkey" PRIMARY KEY ("pkId")
);

-- CreateTable
CREATE TABLE "tta_platform_report" (
    "pkId" TEXT NOT NULL,
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

    CONSTRAINT "tta_platform_report_pkey" PRIMARY KEY ("pkId")
);

-- CreateTable
CREATE TABLE "gmv_all_campaign_performance" (
    "pkId" TEXT NOT NULL,
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

    CONSTRAINT "gmv_all_campaign_performance_pkey" PRIMARY KEY ("pkId")
);

-- CreateTable
CREATE TABLE "gmv_live_campaign_performance" (
    "pkId" TEXT NOT NULL,
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

    CONSTRAINT "gmv_live_campaign_performance_pkey" PRIMARY KEY ("pkId")
);

-- CreateTable
CREATE TABLE "gmv_product_campaign_performance" (
    "pkId" TEXT NOT NULL,
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

    CONSTRAINT "gmv_product_campaign_performance_pkey" PRIMARY KEY ("pkId")
);

-- CreateTable
CREATE TABLE "gmv_product_detail_report" (
    "pkId" TEXT NOT NULL,
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

    CONSTRAINT "gmv_product_detail_report_pkey" PRIMARY KEY ("pkId")
);

-- CreateTable
CREATE TABLE "gmv_creative_detail_report" (
    "pkId" TEXT NOT NULL,
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

    CONSTRAINT "gmv_creative_detail_report_pkey" PRIMARY KEY ("pkId")
);

-- CreateTable
CREATE TABLE "user" (
    "id" TEXT NOT NULL,
    "username" TEXT NOT NULL,
    "email" TEXT,
    "password" TEXT NOT NULL,
    "settings" JSONB DEFAULT '{}',

    CONSTRAINT "user_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "refresh_token" (
    "id" TEXT NOT NULL,
    "hashedToken" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "expiresAt" TIMESTAMP(3) NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "refresh_token_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "task_log" (
    "id" TEXT NOT NULL,
    "taskId" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "level" TEXT NOT NULL,
    "message" TEXT NOT NULL,
    "timestamp" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "task_log_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "pos_basic_report" (
    "pkId" TEXT NOT NULL,
    "user_id" TEXT NOT NULL,
    "task_id" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "is_primary_row" BOOLEAN,
    "order_id" TEXT,
    "display_id" TEXT,
    "system_id" TEXT,
    "shop_id" TEXT,
    "conversation_id" TEXT,
    "order_link" TEXT,
    "tracking_link" TEXT,
    "created_at" TIMESTAMP(3),
    "created_date" TEXT,
    "updated_at" TIMESTAMP(3),
    "status_code" INTEGER,
    "status_name" TEXT,
    "sub_status" TEXT,
    "is_locked" BOOLEAN,
    "is_received_at_shop" BOOLEAN,
    "source_name" TEXT,
    "source_id" TEXT,
    "ads_source" TEXT,
    "ad_id" TEXT,
    "page_id" TEXT,
    "page_name" TEXT,
    "page_username" TEXT,
    "post_id" TEXT,
    "marketer_id" TEXT,
    "utm_source" TEXT,
    "utm_medium" TEXT,
    "utm_campaign" TEXT,
    "utm_content" TEXT,
    "utm_term" TEXT,
    "creator_id" TEXT,
    "creator_name" TEXT,
    "seller_name" TEXT,
    "seller_id" TEXT,
    "seller_assigned_at" TIMESTAMP(3),
    "care_staff_name" TEXT,
    "care_staff_id" TEXT,
    "care_assigned_at" TIMESTAMP(3),
    "last_editor_name" TEXT,
    "customer_system_id" TEXT,
    "customer_uuid" TEXT,
    "customer_name" TEXT,
    "customer_phone" TEXT,
    "customer_email" TEXT,
    "customer_gender" TEXT,
    "full_address" TEXT,
    "street_address" TEXT,
    "ward_name" TEXT,
    "district_name" TEXT,
    "province_name" TEXT,
    "postal_code" TEXT,
    "currency" TEXT,
    "total_amount" DOUBLE PRECISION,
    "total_after_sub_discount" DOUBLE PRECISION,
    "total_discount" DOUBLE PRECISION,
    "amount_to_collect" DOUBLE PRECISION,
    "cod_amount" DOUBLE PRECISION,
    "carrier_cod_amount" DOUBLE PRECISION,
    "tax_amount" DOUBLE PRECISION,
    "surcharge_amount" DOUBLE PRECISION,
    "surcharge_cost" DOUBLE PRECISION,
    "shipping_fee_customer" DOUBLE PRECISION,
    "shipping_fee_carrier" DOUBLE PRECISION,
    "marketplace_fee" DOUBLE PRECISION,
    "is_customer_paying_shipping" BOOLEAN,
    "is_free_shipping" BOOLEAN,
    "payment_methods" TEXT,
    "payment_cash" DOUBLE PRECISION,
    "payment_transfer" DOUBLE PRECISION,
    "payment_card" DOUBLE PRECISION,
    "payment_momo" DOUBLE PRECISION,
    "payment_vnpay" DOUBLE PRECISION,
    "payment_qrpay" DOUBLE PRECISION,
    "payment_kredivo" DOUBLE PRECISION,
    "payment_fundiin" DOUBLE PRECISION,
    "payment_prepaid" DOUBLE PRECISION,
    "payment_points" DOUBLE PRECISION,
    "exchange_value" DOUBLE PRECISION,
    "carrier_name" TEXT,
    "tracking_code" TEXT,
    "sent_to_carrier_at" TIMESTAMP(3),
    "shipping_service" TEXT,
    "warehouse_id" TEXT,
    "warehouse_name" TEXT,
    "warehouse_address" TEXT,
    "order_total_quantity" INTEGER,
    "order_item_count" INTEGER,
    "item_id" TEXT,
    "product_code" TEXT,
    "sku_code" TEXT,
    "product_name" TEXT,
    "item_quantity" DOUBLE PRECISION,
    "item_retail_price" DOUBLE PRECISION,
    "item_cost_price" DOUBLE PRECISION,
    "item_discount" DOUBLE PRECISION,
    "item_price_final" DOUBLE PRECISION,
    "item_total_amount" DOUBLE PRECISION,
    "item_weight" DOUBLE PRECISION,
    "item_note" TEXT,
    "is_bonus_item" BOOLEAN,
    "is_wholesale_item" BOOLEAN,
    "internal_note" TEXT,
    "printed_note" TEXT,
    "tags" TEXT,
    "is_livestream" BOOLEAN,
    "is_live_shopping" BOOLEAN,
    "is_social_commerce" BOOLEAN,
    "is_exchange_order" BOOLEAN,
    "return_reason_id" TEXT,
    "return_reason_name" TEXT,

    CONSTRAINT "pos_basic_report_pkey" PRIMARY KEY ("pkId")
);

-- CreateTable
CREATE TABLE "task_schedule" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "taskData" JSONB NOT NULL,
    "cronExpression" TEXT NOT NULL,
    "timezone" TEXT NOT NULL DEFAULT 'Asia/Ho_Chi_Minh',
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "task_schedule_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "task_metric" (
    "id" TEXT NOT NULL,
    "taskId" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "taskType" TEXT NOT NULL,
    "status" TEXT NOT NULL,
    "durationMs" INTEGER NOT NULL DEFAULT 0,
    "rowsWritten" INTEGER NOT NULL DEFAULT 0,
    "apiCalls" INTEGER NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "scheduleId" TEXT,

    CONSTRAINT "task_metric_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "fad_campaign_overview_report_user_id_idx" ON "fad_campaign_overview_report"("user_id");

-- CreateIndex
CREATE UNIQUE INDEX "fad_campaign_overview_report_user_id_account_id_id_date_sta_key" ON "fad_campaign_overview_report"("user_id", "account_id", "id", "date_start", "date_stop");

-- CreateIndex
CREATE INDEX "fad_campaign_performance_by_age_user_id_idx" ON "fad_campaign_performance_by_age"("user_id");

-- CreateIndex
CREATE UNIQUE INDEX "fad_campaign_performance_by_age_user_id_account_id_date_sta_key" ON "fad_campaign_performance_by_age"("user_id", "account_id", "date_start", "date_stop", "campaign_id", "age");

-- CreateIndex
CREATE INDEX "fad_campaign_performance_by_gender_user_id_idx" ON "fad_campaign_performance_by_gender"("user_id");

-- CreateIndex
CREATE UNIQUE INDEX "fad_campaign_performance_by_gender_user_id_account_id_date__key" ON "fad_campaign_performance_by_gender"("user_id", "account_id", "date_start", "date_stop", "campaign_id", "gender");

-- CreateIndex
CREATE INDEX "fad_campaign_performance_by_platform_user_id_idx" ON "fad_campaign_performance_by_platform"("user_id");

-- CreateIndex
CREATE UNIQUE INDEX "fad_campaign_performance_by_platform_user_id_account_id_dat_key" ON "fad_campaign_performance_by_platform"("user_id", "account_id", "date_start", "date_stop", "campaign_id", "publisher_platform", "platform_position");

-- CreateIndex
CREATE INDEX "fad_campaign_performance_by_region_user_id_idx" ON "fad_campaign_performance_by_region"("user_id");

-- CreateIndex
CREATE UNIQUE INDEX "fad_campaign_performance_by_region_user_id_account_id_date__key" ON "fad_campaign_performance_by_region"("user_id", "account_id", "date_start", "date_stop", "campaign_id", "region");

-- CreateIndex
CREATE INDEX "fad_ad_set_performance_report_user_id_idx" ON "fad_ad_set_performance_report"("user_id");

-- CreateIndex
CREATE UNIQUE INDEX "fad_ad_set_performance_report_user_id_account_id_date_start_key" ON "fad_ad_set_performance_report"("user_id", "account_id", "date_start", "date_stop", "campaign_id", "id");

-- CreateIndex
CREATE INDEX "fad_ad_performance_report_user_id_idx" ON "fad_ad_performance_report"("user_id");

-- CreateIndex
CREATE UNIQUE INDEX "fad_ad_performance_report_user_id_account_id_date_start_dat_key" ON "fad_ad_performance_report"("user_id", "account_id", "date_start", "date_stop", "campaign_id", "adset_id", "id");

-- CreateIndex
CREATE INDEX "fad_account_daily_report_user_id_idx" ON "fad_account_daily_report"("user_id");

-- CreateIndex
CREATE UNIQUE INDEX "fad_account_daily_report_user_id_account_id_date_start_date_key" ON "fad_account_daily_report"("user_id", "account_id", "date_start", "date_stop");

-- CreateIndex
CREATE INDEX "fad_campaign_daily_report_user_id_idx" ON "fad_campaign_daily_report"("user_id");

-- CreateIndex
CREATE UNIQUE INDEX "fad_campaign_daily_report_user_id_account_id_campaign_id_da_key" ON "fad_campaign_daily_report"("user_id", "account_id", "campaign_id", "date_start", "date_stop");

-- CreateIndex
CREATE INDEX "fad_ad_set_daily_report_user_id_idx" ON "fad_ad_set_daily_report"("user_id");

-- CreateIndex
CREATE UNIQUE INDEX "fad_ad_set_daily_report_user_id_account_id_date_start_date__key" ON "fad_ad_set_daily_report"("user_id", "account_id", "date_start", "date_stop", "campaign_id", "id");

-- CreateIndex
CREATE INDEX "fad_ad_daily_report_user_id_idx" ON "fad_ad_daily_report"("user_id");

-- CreateIndex
CREATE UNIQUE INDEX "fad_ad_daily_report_user_id_account_id_date_start_date_stop_key" ON "fad_ad_daily_report"("user_id", "account_id", "date_start", "date_stop", "campaign_id", "adset_id", "id");

-- CreateIndex
CREATE INDEX "fad_ad_creative_report_user_id_idx" ON "fad_ad_creative_report"("user_id");

-- CreateIndex
CREATE UNIQUE INDEX "fad_ad_creative_report_user_id_account_id_date_start_date_s_key" ON "fad_ad_creative_report"("user_id", "account_id", "date_start", "date_stop", "campaign_id", "adset_id", "id");

-- CreateIndex
CREATE INDEX "fad_bm_and_ad_accounts_user_id_idx" ON "fad_bm_and_ad_accounts"("user_id");

-- CreateIndex
CREATE UNIQUE INDEX "fad_bm_and_ad_accounts_user_id_bm_id_account_id_key" ON "fad_bm_and_ad_accounts"("user_id", "bm_id", "account_id");

-- CreateIndex
CREATE INDEX "fbt_fb_billing_data_user_id_idx" ON "fbt_fb_billing_data"("user_id");

-- CreateIndex
CREATE UNIQUE INDEX "fbt_fb_billing_data_user_id_accountId_transactionId_key" ON "fbt_fb_billing_data"("user_id", "accountId", "transactionId");

-- CreateIndex
CREATE INDEX "mpi_bc_tuong_tac_tang_truong_cong_dong_user_id_idx" ON "mpi_bc_tuong_tac_tang_truong_cong_dong"("user_id");

-- CreateIndex
CREATE INDEX "mpi_bc_hien_thi_tiep_can_trang_user_id_idx" ON "mpi_bc_hien_thi_tiep_can_trang"("user_id");

-- CreateIndex
CREATE INDEX "mpi_bc_phan_tich_cam_xuc_bai_viet_user_id_idx" ON "mpi_bc_phan_tich_cam_xuc_bai_viet"("user_id");

-- CreateIndex
CREATE INDEX "mpi_bc_phan_tich_fan_theo_vi_tri_user_id_idx" ON "mpi_bc_phan_tich_fan_theo_vi_tri"("user_id");

-- CreateIndex
CREATE INDEX "mpi_bc_phan_tich_nguon_luot_thich_moi_user_id_idx" ON "mpi_bc_phan_tich_nguon_luot_thich_moi"("user_id");

-- CreateIndex
CREATE INDEX "mpi_bc_hieu_suat_video_tung_video_user_id_idx" ON "mpi_bc_hieu_suat_video_tung_video"("user_id");

-- CreateIndex
CREATE INDEX "mpi_bc_hieu_suat_video_tong_hop_user_id_idx" ON "mpi_bc_hieu_suat_video_tong_hop"("user_id");

-- CreateIndex
CREATE INDEX "mpi_bc_tong_hop_hieu_suat_trang_nang_cao_user_id_idx" ON "mpi_bc_tong_hop_hieu_suat_trang_nang_cao"("user_id");

-- CreateIndex
CREATE INDEX "mpi_bc_hieu_suat_bai_viet_lifetime_user_id_idx" ON "mpi_bc_hieu_suat_bai_viet_lifetime"("user_id");

-- CreateIndex
CREATE INDEX "bca_bc_info_user_id_idx" ON "bca_bc_info"("user_id");

-- CreateIndex
CREATE UNIQUE INDEX "bca_bc_info_user_id_bc_id_key" ON "bca_bc_info"("user_id", "bc_id");

-- CreateIndex
CREATE INDEX "bca_bc_asset_info_user_id_idx" ON "bca_bc_asset_info"("user_id");

-- CreateIndex
CREATE INDEX "tta_campaign_performance_user_id_idx" ON "tta_campaign_performance"("user_id");

-- CreateIndex
CREATE UNIQUE INDEX "tta_campaign_performance_user_id_advertiser_id_campaign_id__key" ON "tta_campaign_performance"("user_id", "advertiser_id", "campaign_id", "objective_type", "start_date", "end_date", "stat_time_day");

-- CreateIndex
CREATE INDEX "tta_adgroup_performance_user_id_idx" ON "tta_adgroup_performance"("user_id");

-- CreateIndex
CREATE UNIQUE INDEX "tta_adgroup_performance_user_id_advertiser_id_adgroup_id_st_key" ON "tta_adgroup_performance"("user_id", "advertiser_id", "adgroup_id", "start_date", "end_date", "stat_time_day");

-- CreateIndex
CREATE INDEX "tta_ad_performance_user_id_idx" ON "tta_ad_performance"("user_id");

-- CreateIndex
CREATE UNIQUE INDEX "tta_ad_performance_user_id_advertiser_id_campaign_name_adgr_key" ON "tta_ad_performance"("user_id", "advertiser_id", "campaign_name", "adgroup_name", "ad_id", "start_date", "end_date", "stat_time_day");

-- CreateIndex
CREATE INDEX "tta_creative_performance_user_id_idx" ON "tta_creative_performance"("user_id");

-- CreateIndex
CREATE UNIQUE INDEX "tta_creative_performance_user_id_advertiser_id_campaign_id__key" ON "tta_creative_performance"("user_id", "advertiser_id", "campaign_id", "adgroup_id", "ad_id", "start_date", "end_date");

-- CreateIndex
CREATE INDEX "tta_audience_region_report_user_id_idx" ON "tta_audience_region_report"("user_id");

-- CreateIndex
CREATE UNIQUE INDEX "tta_audience_region_report_user_id_start_date_end_date_adve_key" ON "tta_audience_region_report"("user_id", "start_date", "end_date", "advertiser_id", "campaign_id", "province_id");

-- CreateIndex
CREATE INDEX "tta_audience_country_report_user_id_idx" ON "tta_audience_country_report"("user_id");

-- CreateIndex
CREATE UNIQUE INDEX "tta_audience_country_report_user_id_start_date_end_date_adv_key" ON "tta_audience_country_report"("user_id", "start_date", "end_date", "advertiser_id", "campaign_id", "country_code", "stat_time_day");

-- CreateIndex
CREATE INDEX "tta_audience_age_report_user_id_idx" ON "tta_audience_age_report"("user_id");

-- CreateIndex
CREATE UNIQUE INDEX "tta_audience_age_report_user_id_start_date_end_date_adverti_key" ON "tta_audience_age_report"("user_id", "start_date", "end_date", "advertiser_id", "campaign_id", "age", "stat_time_day");

-- CreateIndex
CREATE INDEX "tta_audience_gender_report_user_id_idx" ON "tta_audience_gender_report"("user_id");

-- CreateIndex
CREATE UNIQUE INDEX "tta_audience_gender_report_user_id_start_date_end_date_adve_key" ON "tta_audience_gender_report"("user_id", "start_date", "end_date", "advertiser_id", "campaign_id", "gender", "stat_time_day");

-- CreateIndex
CREATE INDEX "tta_audience_age_gender_report_user_id_idx" ON "tta_audience_age_gender_report"("user_id");

-- CreateIndex
CREATE UNIQUE INDEX "tta_audience_age_gender_report_user_id_start_date_end_date__key" ON "tta_audience_age_gender_report"("user_id", "start_date", "end_date", "advertiser_id", "campaign_id", "age", "gender", "stat_time_day");

-- CreateIndex
CREATE INDEX "tta_placement_report_user_id_idx" ON "tta_placement_report"("user_id");

-- CreateIndex
CREATE UNIQUE INDEX "tta_placement_report_user_id_start_date_end_date_advertiser_key" ON "tta_placement_report"("user_id", "start_date", "end_date", "advertiser_id", "campaign_id", "placement");

-- CreateIndex
CREATE INDEX "tta_platform_report_user_id_idx" ON "tta_platform_report"("user_id");

-- CreateIndex
CREATE UNIQUE INDEX "tta_platform_report_user_id_start_date_end_date_advertiser__key" ON "tta_platform_report"("user_id", "start_date", "end_date", "advertiser_id", "campaign_id", "platform");

-- CreateIndex
CREATE INDEX "gmv_all_campaign_performance_user_id_idx" ON "gmv_all_campaign_performance"("user_id");

-- CreateIndex
CREATE UNIQUE INDEX "gmv_all_campaign_performance_user_id_advertiser_id_store_id_key" ON "gmv_all_campaign_performance"("user_id", "advertiser_id", "store_id", "campaign_id", "start_date", "end_date", "stat_time_day");

-- CreateIndex
CREATE INDEX "gmv_live_campaign_performance_user_id_idx" ON "gmv_live_campaign_performance"("user_id");

-- CreateIndex
CREATE UNIQUE INDEX "gmv_live_campaign_performance_user_id_advertiser_id_store_i_key" ON "gmv_live_campaign_performance"("user_id", "advertiser_id", "store_id", "campaign_id", "start_date", "end_date", "stat_time_day");

-- CreateIndex
CREATE INDEX "gmv_product_campaign_performance_user_id_idx" ON "gmv_product_campaign_performance"("user_id");

-- CreateIndex
CREATE UNIQUE INDEX "gmv_product_campaign_performance_user_id_advertiser_id_stor_key" ON "gmv_product_campaign_performance"("user_id", "advertiser_id", "store_id", "campaign_id", "start_date", "end_date", "stat_time_day");

-- CreateIndex
CREATE INDEX "gmv_product_detail_report_user_id_idx" ON "gmv_product_detail_report"("user_id");

-- CreateIndex
CREATE UNIQUE INDEX "gmv_product_detail_report_user_id_advertiser_id_store_id_ca_key" ON "gmv_product_detail_report"("user_id", "advertiser_id", "store_id", "campaign_id", "start_date", "end_date", "stat_time_day", "item_group_id");

-- CreateIndex
CREATE INDEX "gmv_creative_detail_report_user_id_idx" ON "gmv_creative_detail_report"("user_id");

-- CreateIndex
CREATE UNIQUE INDEX "gmv_creative_detail_report_user_id_advertiser_id_store_id_c_key" ON "gmv_creative_detail_report"("user_id", "advertiser_id", "store_id", "campaign_id", "start_date", "end_date", "item_group_id", "item_id");

-- CreateIndex
CREATE UNIQUE INDEX "user_username_key" ON "user"("username");

-- CreateIndex
CREATE UNIQUE INDEX "user_email_key" ON "user"("email");

-- CreateIndex
CREATE INDEX "user_id_idx" ON "user"("id");

-- CreateIndex
CREATE UNIQUE INDEX "refresh_token_hashedToken_key" ON "refresh_token"("hashedToken");

-- CreateIndex
CREATE INDEX "refresh_token_userId_idx" ON "refresh_token"("userId");

-- CreateIndex
CREATE INDEX "task_log_taskId_idx" ON "task_log"("taskId");

-- CreateIndex
CREATE INDEX "task_log_userId_idx" ON "task_log"("userId");

-- CreateIndex
CREATE INDEX "pos_basic_report_user_id_idx" ON "pos_basic_report"("user_id");

-- CreateIndex
CREATE UNIQUE INDEX "pos_basic_report_user_id_order_id_item_id_key" ON "pos_basic_report"("user_id", "order_id", "item_id");

-- CreateIndex
CREATE INDEX "task_schedule_userId_idx" ON "task_schedule"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "task_metric_taskId_key" ON "task_metric"("taskId");

-- CreateIndex
CREATE INDEX "task_metric_userId_idx" ON "task_metric"("userId");

-- CreateIndex
CREATE INDEX "task_metric_scheduleId_idx" ON "task_metric"("scheduleId");

-- CreateIndex
CREATE INDEX "task_metric_createdAt_idx" ON "task_metric"("createdAt");

-- AddForeignKey
ALTER TABLE "refresh_token" ADD CONSTRAINT "refresh_token_userId_fkey" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "task_schedule" ADD CONSTRAINT "task_schedule_userId_fkey" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "task_metric" ADD CONSTRAINT "task_metric_scheduleId_fkey" FOREIGN KEY ("scheduleId") REFERENCES "task_schedule"("id") ON DELETE SET NULL ON UPDATE CASCADE;
