import prisma from '../../db/client.js';
import logger from '../../utils/logger.js';
import axios from 'axios';
import { userPropertiesService } from '../user/properties.js'; // Import service bạn vừa tạo

// --- Các hằng số từ code gốc ---
const LICENSE_SERVER_URL = "https://script.google.com/macros/s/AKfycby53OHlRwDI8YLXHy9GTlyplHL4TygM2lFsDiWjnejbWvaIMGeYSdvV-ohGO3YYwG0O-g/exec";
const API_KEY = "1OW9GAF7Wqy_MOh54SabwDd17tMB4REc0WW-d_MejXio";

/**
 * [checkLicense] - Hàm chính
 * Xác thực license key bằng cách gọi API bên ngoài
 * @param {string} userId - ID của user (thay cho Session.getActiveUser())
 * @param {string} licenseCode - License key cần kiểm tra
 * @param {string} deviceId - ID của thiết bị (thay cho SpreadsheetApp.getId())
 */
async function checkLicense(userId, licenseCode, deviceId) {
  // 1. Lấy email của user từ DB (thay cho Session.getActiveUser().getEmail())
  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: { email: true }
  });

  if (!user) {
    return { isValid: false, message: "Người dùng không tồn tại." };
  }
  const userEmail = user.email;

  // 2. Xây dựng URL và gọi API (thay cho UrlFetchApp)
  const params = {
    licenseKey: licenseCode,
    email: userEmail,
    deviceId: deviceId,
    apiKey: API_KEY
  };

  try {
    const response = await axios.get(LICENSE_SERVER_URL, { params });
    const result = response.data; // axios tự động parse JSON

    // 3. Xử lý kết quả
    if (result.status === "valid") {
      // 3.1. Lưu thông tin license (thay cho các hàm save... riêng lẻ)
      await _saveLicenseInfo(userId, userEmail, licenseCode, result);
      
      return {
        isValid: true,
        message: result.message,
        numAccount: result.numaccount,
        permissions: result.permissions,
      };
    } else {
      // Nếu không valid, xóa key cũ
      await clearLicenseInfo(userId);
      return { isValid: false, message: result.message };
    }
  } catch (e) {
    logger.error("Lỗi kết nối đến License Server:", e.message);
    return { isValid: false, message: "Lỗi kết nối: " + e.message };
  }
}

/**
 * [Hàm nội bộ] - _saveLicenseInfo
 * Lưu tất cả thông tin license vào cột 'settings' của User
 * (Thay thế cho saveNumAccountAndExpiredDate, savedDateAndKeyFormat, saveLicenseKey)
 */
async function _saveLicenseInfo(userId, userEmail, licenseCode, resultData) {
  const { numaccount, expirationdate, newUpdate } = resultData;

  // Định dạng ngày (dd-MM-yyyy) - dùng 'en-GB' cho format dd/mm/yyyy
  let finalDate = "";
  if (expirationdate) {
    try {
      // 'en-GB' = dd/mm/yyyy. Thay '-' bằng '/' nếu cần.
      finalDate = new Date(expirationdate).toLocaleDateString('en-GB'); 
    } catch (e) {
      logger.warn("Không thể định dạng ngày hết hạn:", expirationdate);
    }
  }

  // Định dạng key và email
  const emailPart = userEmail ? userEmail.split('@')[0] : "";
  const keyPart = licenseCode ? (licenseCode.substring(0, 3) + "***") : "";

  // Tạo một object chứa tất cả các setting cần lưu
  const licenseSettings = {
    "SAVED_LICENSE_KEY": licenseCode,
    "SAVED_NUM_ACCOUNT": numaccount,
    "SAVED_EXPIRATIONDATE": expirationdate, // Lưu dạng ISO để so sánh
    "SAVED_NEW_UPDATE": newUpdate || "",
    "SAVED_EXPIRATIONDATE_FORMAT": finalDate,
    "SAVED_LICENSE_KEY_FORMAT": keyPart,
    "SAVED_USER_EMAIL_FORMAT": emailPart
  };

  try {
    // Gọi hàm updateUserSettings để merge các settings này
    await userPropertiesService.updateUserSettings(userId, licenseSettings);
    logger.info(`Đã lưu thông tin license cho user ${userId}`);
  } catch (e) {
    logger.error("Lỗi lưu thông tin license:", e.message);
  }
}

/**
 * [kiemTraHanGiayPhep]
 * Kiểm tra ngày hết hạn, nếu hết hạn trả về true
 * @param {string} userId - ID của user
 */
async function kiemTraHanGiayPhep(userId) {
  const settings = await userPropertiesService.getAllUserSettings(userId);
  const ngayHetHanString = settings.SAVED_EXPIRATIONDATE;

  if (!ngayHetHanString) {
    logger.warn(`User ${userId} không có SAVED_EXPIRATIONDATE`);
    return true; // Coi như hết hạn nếu không tìm thấy
  }

  try {
    const thoiGianHienTai = new Date();
    const ngayHetHan = new Date(ngayHetHanString);
    return thoiGianHienTai > ngayHetHan;
  } catch (e) {
    logger.error("Lỗi so sánh ngày hết hạn:", e.message);
    return true; // Coi như hết hạn nếu lỗi
  }
}

/**
 * [getDateAndKeyFormat]
 * Lấy thông tin đã định dạng để hiển thị (ví dụ: trên UI)
 * @param {string} userId - ID của user
 */
async function getDateAndKeyFormat(userId) {
  const settings = await userPropertiesService.getAllUserSettings(userId);
  return {
    date: settings.SAVED_EXPIRATIONDATE_FORMAT || "",
    key: settings.SAVED_LICENSE_KEY_FORMAT || "",
    email: settings.SAVED_USER_EMAIL_FORMAT || "",
    newUpdate: settings.SAVED_NEW_UPDATE || ""
  };
}

/**
 * [clearLicenseInfo]
 * Xóa thông tin license (khi hết hạn hoặc không valid)
 * (Thay thế cho clearSavedLicenseKey)
 * @param {string} userId - ID của user
 */
async function clearLicenseInfo(userId) {
  // Lấy settings hiện tại
  const currentSettings = await userPropertiesService.getAllUserSettings(userId);
  
  // Xóa các key liên quan đến license
  delete currentSettings.SAVED_LICENSE_KEY;
  delete currentSettings.SAVED_NUM_ACCOUNT;
  delete currentSettings.SAVED_EXPIRATIONDATE;
  delete currentSettings.SAVED_NEW_UPDATE;
  delete currentSettings.SAVED_EXPIRATIONDATE_FORMAT;
  delete currentSettings.SAVED_LICENSE_KEY_FORMAT;
  delete currentSettings.SAVED_USER_EMAIL_FORMAT;

  try {
    // Ghi đè lại toàn bộ settings
    await prisma.user.update({
      where: { id: userId },
      data: { settings: currentSettings }
    });
    logger.info(`Đã xóa thông tin license cho user ${userId}`);
    return { success: true, message: "License key cleared successfully" };
  } catch (e) {
    logger.error("Lỗi xóa thông tin license:", e.toString());
    return { success: false, message: "Failed to clear license key" };
  }
}

// Export tất cả các hàm public
export default {
  checkLicense,
  kiemTraHanGiayPhep,
  getDateAndKeyFormat,
  clearLicenseInfo
};