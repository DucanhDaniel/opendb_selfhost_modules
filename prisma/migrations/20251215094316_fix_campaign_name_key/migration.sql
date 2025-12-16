/*
  Warnings:

  - A unique constraint covering the columns `[user_id,account_id,date_start,date_stop,campaign_id,publisher_platform,platform_position]` on the table `FAD_CampaignPerformanceByPlatform` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[user_id,account_id,date_start,date_stop,campaign_id,region]` on the table `FAD_CampaignPerformanceByRegion` will be added. If there are existing duplicate values, this will fail.

*/
-- DropIndex
DROP INDEX "public"."FAD_CampaignPerformanceByPlatform_user_id_account_id_date_s_key";

-- DropIndex
DROP INDEX "public"."FAD_CampaignPerformanceByRegion_user_id_account_id_date_sta_key";

-- CreateIndex
CREATE UNIQUE INDEX "FAD_CampaignPerformanceByPlatform_user_id_account_id_date_s_key" ON "FAD_CampaignPerformanceByPlatform"("user_id", "account_id", "date_start", "date_stop", "campaign_id", "publisher_platform", "platform_position");

-- CreateIndex
CREATE UNIQUE INDEX "FAD_CampaignPerformanceByRegion_user_id_account_id_date_sta_key" ON "FAD_CampaignPerformanceByRegion"("user_id", "account_id", "date_start", "date_stop", "campaign_id", "region");
