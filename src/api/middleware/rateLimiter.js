import rateLimit from 'express-rate-limit';
import { RedisStore } from 'rate-limit-redis';
import Redis from 'ioredis';

// Tạo client Redis riêng cho Rate Limit (hoặc dùng chung client cũ cũng được)
const redisClient = new Redis({
  host: process.env.REDIS_HOST || 'localhost',
  port: process.env.REDIS_PORT || 6379,
  password: process.env.REDIS_PASSWORD
});

export const forgotPasswordLimiter = rateLimit({
  windowMs: 60 * 60 * 1000, 
  max: 5, // 5 lần thử trong 1h
  message: { success: false, message: "Quá nhiều yêu cầu. Thử lại sau 1 giờ." },
  standardHeaders: true,
  legacyHeaders: false,
  
  // Cấu hình Store lưu vào Redis
  store: new RedisStore({
    sendCommand: (...args) => redisClient.call(...args),
  }),
});