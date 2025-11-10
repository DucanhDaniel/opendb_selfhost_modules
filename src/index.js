import 'dotenv/config'; 
import logger from './utils/logger.js';
import { createApiServer } from './api/server.js';
import { initializeWorker } from './core/jobQueue.js';

const API_PORT = process.env.PORT || 3000;

async function main() {
  logger.info('Bắt đầu khởi động dịch vụ...');

  createApiServer(API_PORT);

  initializeWorker();
  logger.info('Worker đang chạy...');

}

main().catch((err) => {
  logger.error('Lỗi nghiêm trọng khi khởi động:', err);
  process.exit(1);
});