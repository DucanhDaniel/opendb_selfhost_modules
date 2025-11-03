import { Queue, Worker } from 'bullmq';
import logger from '../utils/logger.js';

// [QUAN TRỌNG] Import hàm xử lý logic của bạn từ file taskProcessor.js
import { processJobWorker } from './taskProcessor.js'; 

// 1. Định nghĩa Tên Hàng đợi (Queue Name)
// Đảm bảo tên này là duy nhất
const QUEUE_NAME = 'task-queue';

// 2. Cấu hình kết nối Redis
// (Lấy từ file .env của bạn)
const connectionOptions = {
  host: process.env.REDIS_HOST || '127.0.0.1',
  port: process.env.REDIS_PORT || 6379,
  // Thêm password nếu có: password: process.env.REDIS_PASSWORD
};

// 3. Tạo và Export đối tượng QUEUE
// (Dùng để THÊM job từ các service khác)
export const taskQueue = new Queue(QUEUE_NAME, {
  connection: connectionOptions,
  defaultJobOptions: {
    attempts: 3, // Thử lại 3 lần nếu thất bại
    backoff: {
      type: 'exponential',
      delay: 5000, // Chờ 5 giây trước khi thử lại
    },
    removeOnComplete: true, // Tự động xóa job khi hoàn thành
    removeOnFail: 100, // Giữ lại 100 job lỗi gần nhất
  },
});

logger.info('Đã kết nối Queue (BullMQ)');

// 4. Khởi tạo đối tượng WORKER
// (Dùng để XỬ LÝ job)
// File này sẽ được import trong index.js để khởi chạy worker
export function initializeWorker() {
  const taskWorker = new Worker(QUEUE_NAME, processJobWorker, {
    connection: connectionOptions,
    concurrency: 5, // Xử lý 5 job cùng lúc (tùy chỉnh)
    limiter: {      // Giới hạn (ví dụ: 100 job mỗi 30 giây)
      max: 100,
      duration: 30000,
    },
  });

  // 5. [Quan trọng] Thêm các trình lắng nghe sự kiện (Event Listeners)
  taskWorker.on('completed', (job, result) => {
    logger.info(`Job ${job.id} (Name: ${job.name}) đã hoàn thành.`);
  });

  taskWorker.on('failed', (job, err) => {
    logger.error(`Job ${job.id} (Name: ${job.name}) thất bại: ${err.message}`);
  });

  taskWorker.on('error', (err) => {
    logger.error(`Lỗi worker BullMQ: ${err.message}`);
  });

  logger.info('Worker (BullMQ) đã khởi chạy và đang lắng nghe...');
}