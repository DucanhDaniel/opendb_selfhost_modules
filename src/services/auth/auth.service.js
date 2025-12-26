import prisma from '../../db/client.js';
import jwt from 'jsonwebtoken';
import { randomBytes, createHash } from 'crypto';
import bcrypt from 'bcryptjs';
import axios from 'axios';
import { sendForgotPasswordToken } from '../emailer/emailer.service.js'

const ACCESS_SECRET = process.env.ACCESS_TOKEN_SECRET;
const ACCESS_EXP = process.env.ACCESS_TOKEN_EXPIRATION;
const REFRESH_EXP_DAYS = parseInt(process.env.REFRESH_TOKEN_EXPIRATION_DAYS);
const LICENSE_CHECK_URL = "https://script.google.com/macros/s/AKfycbxtv9lizmKlLAB-vq9yvzGm9rM7FdKNl3k5xPbgp9ua1tsGKzYh87LLZMDLnMESHUxOGw/exec";
const LICENSE_API_KEY = "1TPy0FvdftgKNqG1bxNfxoZLv7ZJAx-ZRdMJRYMK3_zE";

/**
 * Băm mật khẩu
 */
async function hashPassword(password) {
  return bcrypt.hash(password, 10);
}

/**
 * So sánh mật khẩu
 */
async function comparePassword(plainPassword, hashedPassword) {
  return bcrypt.compare(plainPassword, hashedPassword);
}

/**
 * Tạo Access Token (JWT ngắn hạn)
 */
function generateAccessToken(user) {
  const payload = {
    userId: user.id,
    username: user.username,
  };
  return jwt.sign(payload, ACCESS_SECRET, { expiresIn: ACCESS_EXP });
}

/**
 * Tạo Refresh Token (Chuỗi ngẫu nhiên dài hạn)
 */
function generateRefreshToken() {
  const token = randomBytes(64).toString('hex');
  const hashedToken = createHash('sha256').update(token).digest('hex');
  const expiresAt = new Date(Date.now() + REFRESH_EXP_DAYS * 24 * 60 * 60 * 1000);
  return { token, hashedToken, expiresAt };
}

/**
 * Lưu Refresh Token vào DB
 */
async function saveRefreshToken(userId, hashedToken, expiresAt) {
  return prisma.refreshToken.create({
    data: {
      userId: userId,
      hashedToken: hashedToken,
      expiresAt: expiresAt,
    },
  });
}

/**
 * Xóa Refresh Token (khi logout)
 */
async function deleteRefreshToken(plainToken) {
  try {
    const hashedToken = createHash('sha256').update(plainToken).digest('hex');
    await prisma.refreshToken.delete({
      where: { hashedToken: hashedToken },
    });
    return true;
  } catch (error) {
    return false;
  }
}

/**
 * Xác thực Refresh Token
 */
async function verifyRefreshToken(plainToken) {
  const hashedToken = createHash('sha256').update(plainToken).digest('hex');

  const dbToken = await prisma.refreshToken.findUnique({
    where: { hashedToken: hashedToken },
    include: { user: true },
  });

  if (!dbToken || new Date() > new Date(dbToken.expiresAt)) {
    if (dbToken) {
      await prisma.refreshToken.delete({ where: { id: dbToken.id } });
    }
    throw new Error('Refresh token không hợp lệ hoặc đã hết hạn');
  }
  
  return dbToken.user; 
}

/**
 * Kiểm tra License và Quyền hạn cho Task
 * @param {string} userId - ID của user
 * @param {string} taskType - Loại task (VD: 'FACEBOOK_FAD', 'TIKTOK_GMV')
 * @returns {Promise<boolean>} - True nếu hợp lệ, Ném lỗi nếu không hợp lệ
 */
async function checkUserLicensePermission(userId, taskType) {
  // 1. Lấy License Key từ DB User
  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: { settings: true } // Chỉ lấy settings
  });

  if (!user || !user.settings) {
    throw new Error("Không tìm thấy thông tin người dùng.");
  }

  // Lấy key từ JSONB (cẩn thận case-sensitive)
  const licenseKey = user.settings['SAVED_LICENSE_KEY'];

  if (!licenseKey) {
    throw new Error("Người dùng chưa nhập License Key.");
  }

  // 2. Gọi API Check License
  try {
    const response = await axios.get(LICENSE_CHECK_URL, {
      params: {
        licenseKey: licenseKey,
        apiKey: LICENSE_API_KEY
      },
      timeout: 10000 // Timeout 10s
    });

    const data = response.data;

    // 3. Kiểm tra trạng thái License
    if (data.status !== 'valid') {
      throw new Error(`License không hợp lệ: ${data.message}`);
    }

    // 4. Kiểm tra quyền theo Task Type
    const permissionKey = taskType.split('_').pop();

    const permissions = data.permissions || {};

    // Kiểm tra xem key này có = true trong permissions không
    if (permissions[permissionKey] === true) {
      return true; // Hợp lệ
    } else {
      throw new Error(`License của bạn không có quyền truy cập module: ${permissionKey}`);
    }

  } catch (error) {
    // Xử lý lỗi từ axios hoặc lỗi logic
    if (axios.isAxiosError(error)) {
      logger.error(`Lỗi kết nối Server License: ${error.message}`);
      throw new Error("Không thể kết nối đến máy chủ kiểm tra License.");
    }
    throw error; // Ném lại lỗi logic (License invalid, Permission denied)
  }
}

  
  // 1. YÊU CẦU RESET (FORGOT PASSWORD)
  async function forgotPassword(email) {
    const user = await prisma.user.findUnique({ where: { email } });
    
    if (!user) return true; 

    // Tạo token ngẫu nhiên (32 bytes hex)
    const resetToken = randomBytes(4).toString('hex');
    
    // hết hạn sau 15 phút
    const expiresAt = new Date(Date.now() + 15 * 60 * 1000); 

    await prisma.passwordResetToken.create({
      data: {
        userId: user.id,
        token: resetToken,
        expiresAt: expiresAt
      }
    });

    sendForgotPasswordToken(
      user.email,
      resetToken
    );

    return true;
  }

  // 2. ĐẶT LẠI MẬT KHẨU (RESET PASSWORD)
  async function resetPassword(token, newPassword) {
    // Tìm token trong DB
    const storedToken = await prisma.passwordResetToken.findUnique({
      where: { token },
      include: { user: true } // Join bảng User để lấy info
    });

    // Validate Token
    if (!storedToken) {
      throw new Error('Token không hợp lệ hoặc không tồn tại.');
    }

    if (storedToken.expiresAt < new Date()) {
      throw new Error('Token đã hết hạn. Vui lòng yêu cầu lại.');
    }

    // Hash mật khẩu mới
    const hashedPassword = await bcrypt.hash(newPassword, 10);

    // Transaction: Cập nhật pass + Xóa token cũ (và các token khác của user này để bảo mật)
    await prisma.$transaction([
      prisma.user.update({
        where: { id: storedToken.userId },
        data: { password: hashedPassword },
      }),
      // Xóa tất cả token reset của user này để tránh tái sử dụng
      prisma.passwordResetToken.deleteMany({
        where: { userId: storedToken.userId }
      })
    ]);

    return { success: true };
  }

export const authService = {
  hashPassword,
  comparePassword,
  generateAccessToken,
  generateRefreshToken,
  saveRefreshToken,
  deleteRefreshToken,
  verifyRefreshToken,
  checkUserLicensePermission,
  forgotPassword,
  resetPassword
};