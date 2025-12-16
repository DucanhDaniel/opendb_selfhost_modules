/*
  Warnings:

  - A unique constraint covering the columns `[account_id,id,date_start,date_stop]` on the table `FAD_CampaignOverviewReport` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[account_id,date_start,date_stop,campaign_id,age]` on the table `FAD_CampaignPerformanceByAge` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "FAD_CampaignOverviewReport_account_id_id_date_start_date_st_key" ON "FAD_CampaignOverviewReport"("account_id", "id", "date_start", "date_stop");

-- CreateIndex
CREATE UNIQUE INDEX "FAD_CampaignPerformanceByAge_account_id_date_start_date_sto_key" ON "FAD_CampaignPerformanceByAge"("account_id", "date_start", "date_stop", "campaign_id", "age");
