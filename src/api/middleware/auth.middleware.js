import jwt from 'jsonwebtoken';
import logger from '../../utils/logger.js';

export const authMiddleware = (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ message: 'Không có token, ủy quyền thất bại' });
    }

    const token = authHeader.split(' ')[1]; // Lấy token
    const decoded = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);

    // Gắn thông tin user vào request để các controller sau có thể dùng
    req.user = decoded; // { userId: '...', username: '...' }
    next();
  } catch (error) {
    logger.warn('Token không hợp lệ:', error.message);
    return res.status(401).json({ message: 'Token không hợp lệ' });
  }
};