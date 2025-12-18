
import prisma from '../db/client.js';
import { taskQueue } from './jobQueue.js';
import logger from '../utils/logger.js';

const JOB_NAME_PREFIX = 'sched:';
const CHECK_INTERVAL_MS = 2 * 60 * 1000; // Nghỉ 2 phút giữa các lần chạy

export const runSchedulerWatchdog = () => {
  logger.info('Watchdog Loop Started (Recursive Mode).');

  const loop = async () => {
    try {
      logger.info('🔍 Watchdog scanning...'); // Mở comment nếu muốn log mỗi lần chạy
      await syncSchedulesLogic();
    } catch (error) {
      logger.error(`❌ [Watchdog] Error: ${error.message}`);
    } finally {
      // QUAN TRỌNG: Dùng setTimeout thay vì Cron
      // Logic: Làm xong việc -> Đợi 2 phút -> Gọi lại chính mình
      setTimeout(loop, CHECK_INTERVAL_MS);
    }
  };

  // Chạy lần đầu tiên sau 5 giây (để hệ thống ổn định kết nối)
  setTimeout(loop, 5000);
};

const syncSchedulesLogic = async () => {
    console.log("running... async schedule");
    // 1. Lấy Source of Truth
    const dbSchedules = await prisma.taskSchedule.findMany({
      where: { isActive: true }
    });
    
    const dbScheduleMap = new Map(
      dbSchedules.map(s => [`${JOB_NAME_PREFIX}${s.id}`, s])
    );

    // 2. Lấy dữ liệu thực tế từ Redis
    const redisJobs = await taskQueue.getRepeatableJobs(); 
    
    for (const job of redisJobs) {
      const redisKey = job.key;   
      const jobName = job.name;   

      // --- CHECK 1: Tên Job ---
      if (!jobName || !jobName.startsWith(JOB_NAME_PREFIX)) {
         logger.warn(`🗑️ [Watchdog] Xóa legacy: ${jobName || redisKey}`);
         await taskQueue.removeRepeatableByKey(redisKey);
         continue; 
      }

      // --- CHECK 2: DB Existence ---
      const dbSchedule = dbScheduleMap.get(jobName);
      if (!dbSchedule) {
        logger.warn(`🗑️ [Watchdog] Xóa job thừa: ${jobName}`);
        await taskQueue.removeRepeatableByKey(redisKey);
        continue;
      }

      // --- CHECK 3: Config Drift ---
      const dbCron = dbSchedule.cronExpression;
      const dbTz = dbSchedule.timezone || "Asia/Ho_Chi_Minh";
      const redisCron = job.pattern;
      const redisTz = job.tz;

      if ((redisCron !== dbCron) || (redisTz !== dbTz)) {
        logger.warn(`⚠️ [Watchdog] Lệch cấu hình: ${jobName}`);
        await taskQueue.removeRepeatableByKey(redisKey);
        continue; 
      }

      // Khớp hoàn toàn
      dbScheduleMap.delete(jobName);
    }

    // 4. ADD MISSING
    for (const [jobName, schedule] of dbScheduleMap) {
      logger.info(`❤️‍🩹 [Watchdog] Khôi phục/Tạo mới: ${jobName}`);
      await taskQueue.add(
        jobName, 
        { scheduleId: schedule.id, userId: schedule.userId },
        {
          repeat: {
            pattern: schedule.cronExpression,
            tz: schedule.timezone || "Asia/Ho_Chi_Minh"
          },
          removeOnComplete: { count: 50 },
          removeOnFail: { count: 100 }
        }
      );
    }
};