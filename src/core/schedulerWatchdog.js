// import cron from 'node-cron';
// import prisma from '../db/client.js';
// import { taskQueue } from './jobQueue.js';
// import logger from '../utils/logger.js';
// import {scheduleService} from '../services/schedule/schedule.service.js'

// const JOB_NAME = 'schedule-trigger';
// let isSyncing = false; // Cờ khóa để tránh chạy chồng chéo

// export const runSchedulerWatchdog = () => {
//   // Cron syntax: "30 */2 * * * *" nghĩa là mỗi 2 phút, lúc 30 giây
//   cron.schedule('30 */2 * * * *', async () => {
    
//     if (isSyncing) {
//       logger.warn('⚠️ Quá trình đồng bộ trước chưa xong. Bỏ qua lần này.');
//       return;
//     }

//     isSyncing = true; // Khóa lại
//     logger.info('🛡️ [Watchdog] Bắt đầu kiểm tra và đồng bộ lịch...');

//     try {
//       await syncSchedulesLogic();
//     } catch (error) {
//       logger.error(`❌ [Watchdog] Lỗi đồng bộ: ${error.message}`);
//     } finally {
//       isSyncing = false; // Mở khóa
//     }
//   });
  
//   logger.info('✅ Watchdog đã bật: Sẽ quét DB mỗi 2 phút.');
// };

// // Logic đồng bộ cốt lõi (Tách ra để tái sử dụng)
// const syncSchedulesLogic = async () => {
//     // 1. Lấy DB Map
//     const dbSchedules = await prisma.taskSchedule.findMany({ where: { isActive: true } });
//     const dbScheduleMap = new Map(dbSchedules.map(s => [`sched:${s.id}`, s]));

//     // 2. Lấy Redis Jobs
//     const redisJobs = await taskQueue.getJobSchedulers();
    
//     // 3. QUÉT DỌN
//     for (const job of redisJobs) {
//       // Logic mới: Kiểm tra dựa trên job.name
//       const jobIdentifier = job.name; 

//       // Nếu tên job không bắt đầu bằng "sched:" -> Xóa (Rác cũ)
//       if (!jobIdentifier || !jobIdentifier.startsWith('sched:')) {
//          logger.warn(`🗑️ [Watchdog] Xóa job tên lạ (Legacy): ${jobIdentifier}`);
//          await taskQueue.removeJobScheduler(job.key);
//          continue;
//       }

//       // Check DB
//       const isExistInDb = dbScheduleMap.has(jobIdentifier);
      
//       if (!isExistInDb) {
//         logger.warn(`🗑️ [Watchdog] Xóa lịch rác: ${jobIdentifier}`);
//         await taskQueue.removeJobScheduler(job.key);
//       } else {
//         // Khớp -> Đánh dấu đã xử lý
//         dbScheduleMap.delete(jobIdentifier);
//       }
//     }

//     // 4. KHÔI PHỤC (Dùng code add mới)
//     for (const [jobName, schedule] of dbScheduleMap) {
//       logger.info(`❤️‍🩹 [Watchdog] Khôi phục: ${jobName}`);
//       await scheduleService._addJobToQueue(schedule); // Gọi lại hàm add đã sửa ở Bước 1
//     }
// };


import cron from 'node-cron';
import prisma from '../db/client.js';
import { taskQueue } from './jobQueue.js';
import logger from '../utils/logger.js';

const JOB_NAME_PREFIX = 'sched:';
let isSyncing = false;

export const runSchedulerWatchdog = () => {
  cron.schedule('30 */2 * * * *', async () => {
    if (isSyncing) return;
    isSyncing = true;
    
    logger.info('[Watchdog] Bắt đầu sync db với redis schedule...');
    try {
      await syncSchedulesLogic();
    } catch (error) {
      logger.error(`❌ [Watchdog] Lỗi: ${error.message}`);
    } finally {
      isSyncing = false;
    }
  });
};

const syncSchedulesLogic = async () => {
    // 1. Lấy dữ liệu chuẩn từ DB (Source of Truth)
    const dbSchedules = await prisma.taskSchedule.findMany({
      where: { isActive: true }
    });
    
    // Tạo Map để tra cứu: "sched:123" -> Object Schedule
    const dbScheduleMap = new Map(
      dbSchedules.map(s => [`${JOB_NAME_PREFIX}${s.id}`, s])
    );

    // 2. Lấy dữ liệu thực tế từ Redis
    const redisJobs = await taskQueue.getJobSchedulers();
    
    for (const job of redisJobs) {
      const redisKey = job.key;   
      const jobName = job.name;   

      // --- CHECK 1: Kiểm tra định dạng tên Job ---
      if (!jobName || !jobName.startsWith(JOB_NAME_PREFIX)) {
         logger.warn(`🗑️ [Watchdog] Xóa job rác/legacy (Tên sai): ${jobName || redisKey}`);
         await taskQueue.removeJobScheduler(redisKey);
         continue; // Xóa xong thì bỏ qua, đi tiếp
      }

      // --- CHECK 2: Kiểm tra tồn tại trong DB ---
      const dbSchedule = dbScheduleMap.get(jobName);
      
      if (!dbSchedule) {
        logger.warn(`🗑️ [Watchdog] Xóa job thừa (DB không có/đã tắt): ${jobName}`);
        await taskQueue.removeJobScheduler(redisKey);
        continue;
      }

      // --- CHECK 3: SO SÁNH CẤU HÌNH (Drift Check) ---
      
      const dbCron = dbSchedule.cronExpression;
      const dbTz = dbSchedule.timezone || "Asia/Ho_Chi_Minh";

      const redisCron = job.pattern;
      const redisTz = job.tz;

      const isConfigMatch = (redisCron === dbCron) && (redisTz === dbTz);

      if (!isConfigMatch) {
        logger.warn(`⚠️ [Watchdog] Phát hiện lệch cấu hình tại ${jobName}`);
        logger.warn(`   - DB:    ${dbCron} (${dbTz})`);
        logger.warn(`   - Redis: ${redisCron} (${redisTz})`);
        logger.info(`   -> Đang xóa để đồng bộ lại...`);
        
        // Xóa job sai cấu hình đi
        await taskQueue.removeJobScheduler(redisKey);
        
        continue;
      }

      dbScheduleMap.delete(jobName);
    }

    // 4. KHÔI PHỤC (ADD MISSING)
    // Những item còn lại trong dbScheduleMap là những cái:
    // - Mới tạo trong DB nhưng chưa qua Redis
    // - Hoặc vừa bị Xóa ở trên do sai cấu hình
    for (const [jobName, schedule] of dbScheduleMap) {
      logger.info(`❤️‍🩹 [Watchdog] Đồng bộ/Khôi phục: ${jobName}`);
      
      await taskQueue.add(
        jobName, // Tên Job là ID
        { 
            // Payload luôn được nạp mới nhất từ DB
            scheduleId: schedule.id, 
            userId: schedule.userId 
        },
        {
          repeat: {
            pattern: schedule.cronExpression,
            tz: schedule.timezone || "Asia/Ho_Chi_Minh"
          },
          // Config dọn dẹp
          removeOnComplete: { count: 50 },
          removeOnFail: { count: 100 }
        }
      );
    }
};