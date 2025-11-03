import { userPropertiesService } from '../../services/user/properties.js';
import logger from '../../utils/logger.js';

/**
 * [GET] Lấy toàn bộ settings của user
 */
export const handleGetAllSettings = async (req, res, next) => {
  try {
    const { userId } = req.user;


    const settings = await userPropertiesService.getAllUserSettings(userId);
    res.status(200).json({ success: true, data: settings });
  } catch (error) {
    logger.error('Lỗi khi lấy tất cả user settings:', error);
    next(error);
  }
};

/**
 * [PATCH] Cập nhật (merge) settings
 */
export const handleUpdateSettings = async (req, res, next) => {
  try {
    const { userId } = req.user;
    const newSettings = req.body; // { "theme": "dark", "last_project": "abc" }
    
    const updatedSettings = await userPropertiesService.updateUserSettings(userId, newSettings);
    res.status(200).json({ success: true, data: updatedSettings });
  } catch (error) {
    logger.error('Lỗi khi cập nhật user settings:', error);
    next(error);
  }
};

/**
 * [GET] Lấy giá trị của 1 key
 */
export const handleGetSingleSetting = async (req, res, next) => {
  try {
    const { key } = req.params;
    const { userId } = req.user;

    const value = await userPropertiesService.getUserSetting(userId, key);
    res.status(200).json({ success: true, key: key, value: value });
  } catch (error) {
    logger.error(`Lỗi khi lấy user setting (key: ${req.params.key}):`, error);
    next(error);
  }
};

/**
 * [POST] Set giá trị cho 1 key
 */
export const handleSetSingleSetting = async (req, res, next) => {
  try {
    const { key } = req.params;
    const { userId } = req.user;

    const { value } = req.body; 
    
    const updatedSettings = await userPropertiesService.setUserSetting(userId, key, value);
    res.status(200).json({ success: true, data: updatedSettings });
  } catch (error) {
    logger.error(`Lỗi khi set user setting (key: ${req.params.key}):`, error);
    next(error);
  }
};