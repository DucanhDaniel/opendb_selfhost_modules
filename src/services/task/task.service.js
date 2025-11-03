import prisma from '../../db/client.js';
import logger from '../../utils/logger.js';

// Tên key mà chúng ta sẽ dùng để lưu lịch sử trong cột 'settings' (JSONB)
const TASK_HISTORY_KEY = "TASK_HISTORY";

/**
 * Lấy lịch sử task của một user
 * @param {string} userId - ID của user (từ token)
 */
async function getTaskHistory(userId) {
  // Lấy chỉ cột 'settings'
  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: { settings: true }
  });

  if (!user || !user.settings) {
    return []; // Trả về mảng rỗng nếu không có settings
  }

  // Trả về giá trị của key, hoặc mảng rỗng nếu key không tồn tại
  return user.settings[TASK_HISTORY_KEY] || [];
}

/**
 * Xóa lịch sử task của một user
 * @param {string} userId - ID của user (từ token)
 */
async function deleteTaskHistory(userId) {
  // 1. Lấy settings hiện tại
  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: { settings: true }
  });

  const currentSettings = user?.settings || {};

  // 2. Kiểm tra xem key có tồn tại không
  if (!currentSettings[TASK_HISTORY_KEY]) {
    logger.warn(`User ${userId} đã xóa lịch sử (không có gì để xóa).`);
    return "Lịch sử đã trống.";
  }

  // 3. Xóa key khỏi object
  delete currentSettings[TASK_HISTORY_KEY];

  // 4. Cập nhật lại settings
  await prisma.user.update({
    where: { id: userId },
    data: { settings: currentSettings }
  });

  logger.info(`Đã xóa lịch sử task cho user ${userId}`);
  return "Đã xóa lịch sử thành công.";
}

// Export service
export const taskService = {
  getTaskHistory,
  deleteTaskHistory
};