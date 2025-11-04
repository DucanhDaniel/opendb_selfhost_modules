import prisma from '../../db/client.js';
import logger from '../../utils/logger.js';

/**
 * Tạo một user mới
 * @param {string} email - Email của user
 * @param {string} [name] - Tên (tùy chọn)
 */
async function createUser(email, name = null) {
  // 1. Kiểm tra xem email đã tồn tại chưa
  const existingUser = await prisma.user.findUnique({
    where: { email: email },
  });

  if (existingUser) {
    logger.warn(`Email ${email} đã tồn tại.`);
    // Ném lỗi để Controller bắt
    throw new Error('Email already exists'); 
  }

  // 2. Tạo user mới
  const newUser = await prisma.user.create({
    data: {
      email: email,
      name: name,
      settings: {}, // Khởi tạo settings rỗng
    },
  });

  logger.info(`Đã tạo user mới: ${newUser.id} - ${newUser.email}`);
  return newUser;
}

// Export service
export const userService = {
  createUser,
};