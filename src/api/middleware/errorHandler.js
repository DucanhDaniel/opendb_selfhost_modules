import logger from '../../utils/logger.js';

export const errorHandler = (err, req, res, next) => {
  logger.error('Lỗi server:', err.stack);
  
  const statusCode = err.statusCode || 500;
  const message = err.message || 'Lỗi hệ thống';

  res.status(statusCode).json({
    success: false,
    message: message,
  });
};