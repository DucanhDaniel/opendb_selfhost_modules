import prisma from '../../db/client.js';
import jwt from 'jsonwebtoken';
import { randomBytes, createHash } from 'crypto';
import bcrypt from 'bcryptjs';

const ACCESS_SECRET = process.env.ACCESS_TOKEN_SECRET;
const ACCESS_EXP = process.env.ACCESS_TOKEN_EXPIRATION;
const REFRESH_EXP_DAYS = parseInt(process.env.REFRESH_TOKEN_EXPIRATION_DAYS);

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
  
  return dbToken.user; // Trả về user
}

export const authService = {
  hashPassword,
  comparePassword,
  generateAccessToken,
  generateRefreshToken,
  saveRefreshToken,
  deleteRefreshToken,
  verifyRefreshToken
};