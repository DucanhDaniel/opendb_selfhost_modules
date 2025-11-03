import express from 'express';
import apiRoutes from './routes.js';
import cookieParser from 'cookie-parser';
import { errorHandler } from './middleware/errorHandler.js';
import logger from '../utils/logger.js';

export function createApiServer(port) {
  const app = express();

  // Middlewares
  app.use(express.json({ limit: '50mb' })); 
  app.use(express.urlencoded({ extended: true, limit: '50mb' }));

  app.use(cookieParser());

  // Routes
  app.use('/api/v1', apiRoutes); // Thêm prefix /api/v1

  // 404 Handler
  app.use((req, res) => {
    res.status(404).json({ success: false, message: 'Endpoint không tồn tại' });
  });

  // Error Handler
  app.use(errorHandler);

  // Start server
  app.listen(port, () => {
    logger.info(`🚀 API server đang chạy tại http://localhost:${port}`);
  });

  return app;
}