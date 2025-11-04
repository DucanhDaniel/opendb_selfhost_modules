import prisma from '../../db/client.js';
import { authService } from '../../services/auth/auth.service.js';

/**
 * [POST] Đăng ký
 */
export const handleRegister = async (req, res, next) => {
  try {
    const { username, email, password } = req.body;

    // 1. Kiểm tra tồn tại
    const existingUser = await prisma.user.findFirst({
      where: { OR: [{ username: username }, { email: email }] },
    });
    if (existingUser) {
      return res.status(409).json({ message: 'Username hoặc Email đã tồn tại' });
    }

    // 2. Băm mật khẩu và tạo user
    const hashedPassword = await authService.hashPassword(password);
    const user = await prisma.user.create({
      data: {
        username,
        email,
        password: hashedPassword,
        settings: {},
      },
    });

    res.status(201).json({ message: 'Tạo user thành công', userId: user.id });
  } catch (error) {
    next(error);
  }
};

/**
 * [POST] Đăng nhập
 */
export const handleLogin = async (req, res, next) => {
  try {
    const { username, password } = req.body;

    // 1. Tìm user
    const user = await prisma.user.findUnique({ where: { username } });
    if (!user) {
      return res.status(401).json({ message: 'Username hoặc mật khẩu không đúng' });
    }

    // 2. So sánh mật khẩu
    const isMatch = await authService.comparePassword(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ message: 'Username hoặc mật khẩu không đúng' });
    }

    // 3. Tạo 2 token
    const accessToken = authService.generateAccessToken(user);
    const { token: refreshToken, hashedToken, expiresAt } = authService.generateRefreshToken();

    // 4. Lưu Refresh Token vào DB
    await authService.saveRefreshToken(user.id, hashedToken, expiresAt);

    // 5. Gửi Refresh Token qua HttpOnly Cookie
    res.cookie('refreshToken', refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      maxAge: parseInt(process.env.REFRESH_TOKEN_EXPIRATION_DAYS) * 24 * 60 * 60 * 1000
    });

    // 6. Gửi Access Token qua JSON
    res.status(200).json({
      accessToken: accessToken,
      user: { id: user.id, username: user.username, email: user.email },
    });
  } catch (error) {
    next(error);
  }
};

/**
 * [POST] Refresh Token
 */
export const handleRefreshToken = async (req, res, next) => {
  try {
    const plainToken = req.cookies.refreshToken;
    if (!plainToken) {
      return res.status(401).json({ message: 'Không tìm thấy refresh token' });
    }

    const user = await authService.verifyRefreshToken(plainToken);
    const newAccessToken = authService.generateAccessToken(user);

    res.status(200).json({ 
      accessToken: newAccessToken,
      user: { id: user.id, username: user.username, email: user.email }
    });
  } catch (error) {
    res.clearCookie('refreshToken');
    return res.status(403).json({ message: error.message });
  }
};

/**
 * [POST] Đăng xuất
 */
export const handleLogout = async (req, res, next) => {
  try {
    const plainToken = req.cookies.refreshToken;
    if (plainToken) {
      await authService.deleteRefreshToken(plainToken);
    }
    res.clearCookie('refreshToken');
    res.status(200).json({ message: 'Đăng xuất thành công' });
  } catch (error) {
    next(error);
  }
};