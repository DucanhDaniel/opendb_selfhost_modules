import 'dotenv/config'; // Đảm bảo config được load đầu tiên
import logger from './utils/logger.js';
import { createApiServer } from './api/server.js';
import { initializeWorker } from './core/jobQueue.js';

const API_PORT = process.env.PORT || 3000;

async function main() {
  logger.info('Bắt đầu khởi động dịch vụ...');

  // 1. Khởi động API Server
  createApiServer(API_PORT);



  // 2. Khởi động Worker (BullMQ processor)
  // Đảm bảo bạn gọi hàm khởi động worker của mình ở đây
  initializeWorker();
  logger.info('Worker (task processor) đang chạy...');
  
  // (Bạn có thể cần import và chạy logic từ /core/taskProcessor.js ở đây)

}

main().catch((err) => {
  logger.error('Lỗi nghiêm trọng khi khởi động:', err);
  process.exit(1);
});