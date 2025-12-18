import { runSchedulerWatchdog } from './core/schedulerWatchdog.js'; 
import logger from './utils/logger.js';
import prisma from './db/client.js';
import { taskQueue } from './core/jobQueue.js'; 

const startWatchdog = async () => {
  logger.info('Starting Schedule Async Service (Dedicated Process)...');
  
  // Kiểm tra kết nối DB & Redis trước khi chạy
  try {
    await prisma.$connect();
    logger.info('✅ Connected to Database');
    
    // Đảm bảo Redis queue đã sẵn sàng (Optional check)
    await taskQueue.waitUntilReady(); 
    logger.info('✅ Connected to Redis Queue');

    // Bắt đầu chạy Cron
    runSchedulerWatchdog();
    
    logger.info('🚀 Service is running and waiting for schedule...');
  } catch (error) {
    logger.error('❌ Init failed:', error);
    process.exit(1);
  }
};

// Xử lý tắt Graceful Shutdown
const shutdown = async () => {
  logger.info('🛑 Shutting down Schedule Async process...');
  await prisma.$disconnect();
  await taskQueue.close();
  process.exit(0);
};

process.on('SIGTERM', shutdown);
process.on('SIGINT', shutdown);

startWatchdog();