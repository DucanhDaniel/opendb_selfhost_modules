import { PrismaClient } from '@prisma/client';

/**
 * Khởi tạo một instance duy nhất của PrismaClient.
 * Bằng cách export `prisma` (một hằng số), chúng ta đảm bảo
 * toàn bộ ứng dụng sẽ chia sẻ chung một connection pool.
 */
const prisma = new PrismaClient({
  // Bật log query để debug.
  // Bạn nên tắt 'query' ở môi trường production để tránh spam log.
  log: ['query', 'info', 'warn', 'error'],
});

export default prisma;
