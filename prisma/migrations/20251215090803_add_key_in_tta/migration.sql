/*
  Warnings:

  - A unique constraint covering the columns `[user_id,advertiser_id,adgroup_id,start_date,end_date,stat_time_day]` on the table `TTA_AdGroupPerformance` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[user_id,advertiser_id,campaign_name,adgroup_name,ad_id,start_date,end_date,stat_time_day]` on the table `TTA_AdPerformance` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[user_id,advertiser_id,campaign_id,objective_type,start_date,end_date,stat_time_day]` on the table `TTA_CampaignPerformance` will be added. If there are existing duplicate values, this will fail.

*/
-- DropIndex
DROP INDEX "public"."TTA_AdGroupPerformance_user_id_advertiser_id_adgroup_id_sta_key";

-- DropIndex
DROP INDEX "public"."TTA_AdPerformance_user_id_advertiser_id_campaign_name_adgro_key";

-- DropIndex
DROP INDEX "public"."TTA_CampaignPerformance_user_id_advertiser_id_campaign_id_o_key";

-- CreateIndex
CREATE UNIQUE INDEX "TTA_AdGroupPerformance_user_id_advertiser_id_adgroup_id_sta_key" ON "TTA_AdGroupPerformance"("user_id", "advertiser_id", "adgroup_id", "start_date", "end_date", "stat_time_day");

-- CreateIndex
CREATE UNIQUE INDEX "TTA_AdPerformance_user_id_advertiser_id_campaign_name_adgro_key" ON "TTA_AdPerformance"("user_id", "advertiser_id", "campaign_name", "adgroup_name", "ad_id", "start_date", "end_date", "stat_time_day");

-- CreateIndex
CREATE UNIQUE INDEX "TTA_CampaignPerformance_user_id_advertiser_id_campaign_id_o_key" ON "TTA_CampaignPerformance"("user_id", "advertiser_id", "campaign_id", "objective_type", "start_date", "end_date", "stat_time_day");
