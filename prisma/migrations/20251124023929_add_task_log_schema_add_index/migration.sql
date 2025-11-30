-- CreateTable
CREATE TABLE "TaskLog" (
    "id" TEXT NOT NULL,
    "taskId" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "level" TEXT NOT NULL,
    "message" TEXT NOT NULL,
    "timestamp" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "TaskLog_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "TaskLog_taskId_idx" ON "TaskLog"("taskId");

-- CreateIndex
CREATE INDEX "TaskLog_userId_idx" ON "TaskLog"("userId");

-- CreateIndex
CREATE INDEX "GMV_CreativeDetailReport_user_id_idx" ON "GMV_CreativeDetailReport"("user_id");

-- CreateIndex
CREATE INDEX "GMV_LiveCampaignPerformance_user_id_idx" ON "GMV_LiveCampaignPerformance"("user_id");

-- CreateIndex
CREATE INDEX "GMV_ProductCampaignPerformance_user_id_idx" ON "GMV_ProductCampaignPerformance"("user_id");

-- CreateIndex
CREATE INDEX "GMV_ProductDetailReport_user_id_idx" ON "GMV_ProductDetailReport"("user_id");

-- CreateIndex
CREATE INDEX "RefreshToken_userId_idx" ON "RefreshToken"("userId");

-- CreateIndex
CREATE INDEX "User_id_idx" ON "User"("id");
