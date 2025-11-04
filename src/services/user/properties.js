import prisma from '../../db/client.js';

async function setUserSetting(userId, key, value) {
  // 1. Lấy settings hiện tại
  const user = await prisma.user.findUnique({ where: { id: userId } });
  const currentSettings = user.settings || {};

  // 2. Cập nhật giá trị
  currentSettings[key] = value;

  // 3. Lưu lại
  await prisma.user.update({
    where: { id: userId },
    data: { settings: currentSettings },
  });
  return currentSettings; // Trả về settings đã cập nhật
}

async function getUserSetting(userId, key) {
  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: { settings: true },
  });
  return user?.settings?.[key] || null;
}

/**
 * Lấy toàn bộ đối tượng settings của user
 */
async function getAllUserSettings(userId) {
  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: { settings: true },
  });
  return user?.settings || {};
}

/**
 * Cập nhật (merge) nhiều settings cùng lúc
 * @param {string} userId - ID của user
 * @param {object} newSettings - Object chứa các key/value cần cập nhật
 */
async function updateUserSettings(userId, newSettings) {
  // 1. Lấy settings hiện tại
  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: { settings: true },
  });
  const currentSettings = user?.settings || {};

  // 2. Merge với settings mới (newSettings sẽ ghi đè currentSettings)
  const updatedSettings = { ...currentSettings, ...newSettings };

  // 3. Lưu lại
  const updatedUser = await prisma.user.update({
    where: { id: userId },
    data: { settings: updatedSettings },
    select: { settings: true },
  });
  
  return updatedUser.settings;
}


// Export tất cả các hàm
export const userPropertiesService = {
  setUserSetting,
  getUserSetting,
  getAllUserSettings,
  updateUserSettings
};