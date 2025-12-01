-- CreateTable
CREATE TABLE "TaskSchedule" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "taskData" JSONB NOT NULL,
    "cronExpression" TEXT NOT NULL,
    "timezone" TEXT NOT NULL DEFAULT 'Asia/Ho_Chi_Minh',
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "TaskSchedule_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "TaskMetric" (
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

    CONSTRAINT "TaskMetric_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "TaskSchedule_userId_idx" ON "TaskSchedule"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "TaskMetric_taskId_key" ON "TaskMetric"("taskId");

-- CreateIndex
CREATE INDEX "TaskMetric_userId_idx" ON "TaskMetric"("userId");

-- CreateIndex
CREATE INDEX "TaskMetric_scheduleId_idx" ON "TaskMetric"("scheduleId");

-- CreateIndex
CREATE INDEX "TaskMetric_createdAt_idx" ON "TaskMetric"("createdAt");

-- AddForeignKey
ALTER TABLE "TaskSchedule" ADD CONSTRAINT "TaskSchedule_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "TaskMetric" ADD CONSTRAINT "TaskMetric_scheduleId_fkey" FOREIGN KEY ("scheduleId") REFERENCES "TaskSchedule"("id") ON DELETE SET NULL ON UPDATE CASCADE;
