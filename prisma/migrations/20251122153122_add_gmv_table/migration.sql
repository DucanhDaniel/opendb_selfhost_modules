/*
  Warnings:

  - You are about to drop the `GMV_CampaignPerformance` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropTable
DROP TABLE "public"."GMV_CampaignPerformance";

-- CreateTable
CREATE TABLE "GMV_AllCampaignPerformance" (
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

    CONSTRAINT "GMV_AllCampaignPerformance_pkey" PRIMARY KEY ("pkId")
);

-- CreateTable
CREATE TABLE "GMV_LiveCampaignPerformance" (
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

    CONSTRAINT "GMV_LiveCampaignPerformance_pkey" PRIMARY KEY ("pkId")
);

-- CreateTable
CREATE TABLE "GMV_ProductCampaignPerformance" (
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

    CONSTRAINT "GMV_ProductCampaignPerformance_pkey" PRIMARY KEY ("pkId")
);
