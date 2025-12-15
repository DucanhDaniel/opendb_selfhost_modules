/*
  Warnings:

  - A unique constraint covering the columns `[user_id,bc_id]` on the table `BCA_BCInfo` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[user_id,account_id,date_start,date_stop]` on the table `FAD_AccountDailyReport` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[user_id,account_id,date_start,date_stop,campaign_id,adset_id,id]` on the table `FAD_AdCreativeReport` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[user_id,account_id,date_start,date_stop,campaign_id,adset_id,id]` on the table `FAD_AdDailyReport` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[user_id,account_id,date_start,date_stop,campaign_id,adset_id,id]` on the table `FAD_AdPerformanceReport` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[user_id,account_id,date_start,date_stop,campaign_id,id]` on the table `FAD_AdSetDailyReport` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[user_id,account_id,date_start,date_stop,campaign_id,id]` on the table `FAD_AdSetPerformanceReport` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[user_id,bm_id,account_id]` on the table `FAD_BmAndAdAccounts` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[user_id,account_id,campaign_id,date_start,date_stop]` on the table `FAD_CampaignDailyReport` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[user_id,account_id,date_start,date_stop,campaign_id,gender]` on the table `FAD_CampaignPerformanceByGender` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[user_id,account_id,date_start,date_stop,campaign_name,publisher_platform,platform_position]` on the table `FAD_CampaignPerformanceByPlatform` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[user_id,account_id,date_start,date_stop,campaign_name,region]` on the table `FAD_CampaignPerformanceByRegion` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[user_id,accountId,transactionId]` on the table `FBT_FbBillingData` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[user_id,advertiser_id,store_id,campaign_id,start_date,end_date,stat_time_day]` on the table `GMV_AllCampaignPerformance` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[user_id,advertiser_id,store_id,campaign_id,start_date,end_date,item_group_id,item_id]` on the table `GMV_CreativeDetailReport` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[user_id,advertiser_id,store_id,campaign_id,start_date,end_date,stat_time_day]` on the table `GMV_LiveCampaignPerformance` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[user_id,advertiser_id,store_id,campaign_id,start_date,end_date,stat_time_day]` on the table `GMV_ProductCampaignPerformance` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[user_id,advertiser_id,store_id,campaign_id,start_date,end_date,stat_time_day,item_group_id]` on the table `GMV_ProductDetailReport` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[user_id,order_id,item_id]` on the table `POS_BasicReport` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[user_id,advertiser_id,adgroup_id,start_date,end_date]` on the table `TTA_AdGroupPerformance` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[user_id,advertiser_id,campaign_name,adgroup_name,ad_id,start_date,end_date]` on the table `TTA_AdPerformance` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[user_id,start_date,end_date,advertiser_id,campaign_id,age,gender,stat_time_day]` on the table `TTA_AudienceAgeGenderReport` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[user_id,start_date,end_date,advertiser_id,campaign_id,age,stat_time_day]` on the table `TTA_AudienceAgeReport` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[user_id,start_date,end_date,advertiser_id,campaign_id,country_code,stat_time_day]` on the table `TTA_AudienceCountryReport` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[user_id,start_date,end_date,advertiser_id,campaign_id,gender,stat_time_day]` on the table `TTA_AudienceGenderReport` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[user_id,start_date,end_date,advertiser_id,campaign_id,province_id]` on the table `TTA_AudienceRegionReport` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[user_id,advertiser_id,campaign_id,objective_type,start_date,end_date]` on the table `TTA_CampaignPerformance` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[user_id,advertiser_id,campaign_id,adgroup_id,ad_id,start_date,end_date]` on the table `TTA_CreativePerformance` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[user_id,start_date,end_date,advertiser_id,campaign_id,placement]` on the table `TTA_PlacementReport` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[user_id,start_date,end_date,advertiser_id,campaign_id,platform]` on the table `TTA_PlatformReport` will be added. If there are existing duplicate values, this will fail.

*/
-- DropIndex
DROP INDEX "public"."POS_BasicReport_order_id_item_id_idx";

-- DropIndex
DROP INDEX "public"."POS_BasicReport_user_id_created_at_idx";

-- CreateIndex
CREATE UNIQUE INDEX "BCA_BCInfo_user_id_bc_id_key" ON "BCA_BCInfo"("user_id", "bc_id");

-- CreateIndex
CREATE UNIQUE INDEX "FAD_AccountDailyReport_user_id_account_id_date_start_date_s_key" ON "FAD_AccountDailyReport"("user_id", "account_id", "date_start", "date_stop");

-- CreateIndex
CREATE UNIQUE INDEX "FAD_AdCreativeReport_user_id_account_id_date_start_date_sto_key" ON "FAD_AdCreativeReport"("user_id", "account_id", "date_start", "date_stop", "campaign_id", "adset_id", "id");

-- CreateIndex
CREATE UNIQUE INDEX "FAD_AdDailyReport_user_id_account_id_date_start_date_stop_c_key" ON "FAD_AdDailyReport"("user_id", "account_id", "date_start", "date_stop", "campaign_id", "adset_id", "id");

-- CreateIndex
CREATE UNIQUE INDEX "FAD_AdPerformanceReport_user_id_account_id_date_start_date__key" ON "FAD_AdPerformanceReport"("user_id", "account_id", "date_start", "date_stop", "campaign_id", "adset_id", "id");

-- CreateIndex
CREATE UNIQUE INDEX "FAD_AdSetDailyReport_user_id_account_id_date_start_date_sto_key" ON "FAD_AdSetDailyReport"("user_id", "account_id", "date_start", "date_stop", "campaign_id", "id");

-- CreateIndex
CREATE UNIQUE INDEX "FAD_AdSetPerformanceReport_user_id_account_id_date_start_da_key" ON "FAD_AdSetPerformanceReport"("user_id", "account_id", "date_start", "date_stop", "campaign_id", "id");

-- CreateIndex
CREATE UNIQUE INDEX "FAD_BmAndAdAccounts_user_id_bm_id_account_id_key" ON "FAD_BmAndAdAccounts"("user_id", "bm_id", "account_id");

-- CreateIndex
CREATE UNIQUE INDEX "FAD_CampaignDailyReport_user_id_account_id_campaign_id_date_key" ON "FAD_CampaignDailyReport"("user_id", "account_id", "campaign_id", "date_start", "date_stop");

-- CreateIndex
CREATE UNIQUE INDEX "FAD_CampaignPerformanceByGender_user_id_account_id_date_sta_key" ON "FAD_CampaignPerformanceByGender"("user_id", "account_id", "date_start", "date_stop", "campaign_id", "gender");

-- CreateIndex
CREATE UNIQUE INDEX "FAD_CampaignPerformanceByPlatform_user_id_account_id_date_s_key" ON "FAD_CampaignPerformanceByPlatform"("user_id", "account_id", "date_start", "date_stop", "campaign_name", "publisher_platform", "platform_position");

-- CreateIndex
CREATE UNIQUE INDEX "FAD_CampaignPerformanceByRegion_user_id_account_id_date_sta_key" ON "FAD_CampaignPerformanceByRegion"("user_id", "account_id", "date_start", "date_stop", "campaign_name", "region");

-- CreateIndex
CREATE UNIQUE INDEX "FBT_FbBillingData_user_id_accountId_transactionId_key" ON "FBT_FbBillingData"("user_id", "accountId", "transactionId");

-- CreateIndex
CREATE UNIQUE INDEX "GMV_AllCampaignPerformance_user_id_advertiser_id_store_id_c_key" ON "GMV_AllCampaignPerformance"("user_id", "advertiser_id", "store_id", "campaign_id", "start_date", "end_date", "stat_time_day");

-- CreateIndex
CREATE UNIQUE INDEX "GMV_CreativeDetailReport_user_id_advertiser_id_store_id_cam_key" ON "GMV_CreativeDetailReport"("user_id", "advertiser_id", "store_id", "campaign_id", "start_date", "end_date", "item_group_id", "item_id");

-- CreateIndex
CREATE UNIQUE INDEX "GMV_LiveCampaignPerformance_user_id_advertiser_id_store_id__key" ON "GMV_LiveCampaignPerformance"("user_id", "advertiser_id", "store_id", "campaign_id", "start_date", "end_date", "stat_time_day");

-- CreateIndex
CREATE UNIQUE INDEX "GMV_ProductCampaignPerformance_user_id_advertiser_id_store__key" ON "GMV_ProductCampaignPerformance"("user_id", "advertiser_id", "store_id", "campaign_id", "start_date", "end_date", "stat_time_day");

-- CreateIndex
CREATE UNIQUE INDEX "GMV_ProductDetailReport_user_id_advertiser_id_store_id_camp_key" ON "GMV_ProductDetailReport"("user_id", "advertiser_id", "store_id", "campaign_id", "start_date", "end_date", "stat_time_day", "item_group_id");

-- CreateIndex
CREATE UNIQUE INDEX "POS_BasicReport_user_id_order_id_item_id_key" ON "POS_BasicReport"("user_id", "order_id", "item_id");

-- CreateIndex
CREATE UNIQUE INDEX "TTA_AdGroupPerformance_user_id_advertiser_id_adgroup_id_sta_key" ON "TTA_AdGroupPerformance"("user_id", "advertiser_id", "adgroup_id", "start_date", "end_date");

-- CreateIndex
CREATE UNIQUE INDEX "TTA_AdPerformance_user_id_advertiser_id_campaign_name_adgro_key" ON "TTA_AdPerformance"("user_id", "advertiser_id", "campaign_name", "adgroup_name", "ad_id", "start_date", "end_date");

-- CreateIndex
CREATE UNIQUE INDEX "TTA_AudienceAgeGenderReport_user_id_start_date_end_date_adv_key" ON "TTA_AudienceAgeGenderReport"("user_id", "start_date", "end_date", "advertiser_id", "campaign_id", "age", "gender", "stat_time_day");

-- CreateIndex
CREATE UNIQUE INDEX "TTA_AudienceAgeReport_user_id_start_date_end_date_advertise_key" ON "TTA_AudienceAgeReport"("user_id", "start_date", "end_date", "advertiser_id", "campaign_id", "age", "stat_time_day");

-- CreateIndex
CREATE UNIQUE INDEX "TTA_AudienceCountryReport_user_id_start_date_end_date_adver_key" ON "TTA_AudienceCountryReport"("user_id", "start_date", "end_date", "advertiser_id", "campaign_id", "country_code", "stat_time_day");

-- CreateIndex
CREATE UNIQUE INDEX "TTA_AudienceGenderReport_user_id_start_date_end_date_advert_key" ON "TTA_AudienceGenderReport"("user_id", "start_date", "end_date", "advertiser_id", "campaign_id", "gender", "stat_time_day");

-- CreateIndex
CREATE UNIQUE INDEX "TTA_AudienceRegionReport_user_id_start_date_end_date_advert_key" ON "TTA_AudienceRegionReport"("user_id", "start_date", "end_date", "advertiser_id", "campaign_id", "province_id");

-- CreateIndex
CREATE UNIQUE INDEX "TTA_CampaignPerformance_user_id_advertiser_id_campaign_id_o_key" ON "TTA_CampaignPerformance"("user_id", "advertiser_id", "campaign_id", "objective_type", "start_date", "end_date");

-- CreateIndex
CREATE UNIQUE INDEX "TTA_CreativePerformance_user_id_advertiser_id_campaign_id_a_key" ON "TTA_CreativePerformance"("user_id", "advertiser_id", "campaign_id", "adgroup_id", "ad_id", "start_date", "end_date");

-- CreateIndex
CREATE UNIQUE INDEX "TTA_PlacementReport_user_id_start_date_end_date_advertiser__key" ON "TTA_PlacementReport"("user_id", "start_date", "end_date", "advertiser_id", "campaign_id", "placement");

-- CreateIndex
CREATE UNIQUE INDEX "TTA_PlatformReport_user_id_start_date_end_date_advertiser_i_key" ON "TTA_PlatformReport"("user_id", "start_date", "end_date", "advertiser_id", "campaign_id", "platform");
