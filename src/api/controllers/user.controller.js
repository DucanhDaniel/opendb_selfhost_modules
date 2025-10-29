import { userService } from '../../services/user/user.js';
import logger from '../../utils/logger.js';

/**
 * [POST] Tạo một user mới
 */
export const handleCreateUser = async (req, res, next) => {
  try {
    const { email, name } = req.body;
    
    const newUser = await userService.createUser(email, name);
    
    // 201 Created - Trạng thái chuẩn cho việc tạo mới
    res.status(201).json({ success: true, data: newUser }); 

  } catch (error) {
    // Xử lý lỗi "Email already exists"
    if (error.message === 'Email already exists') {
      return res.status(409).json({ // 409 Conflict
        success: false,
        message: 'Email đã tồn tại',
      });
    }
    
    logger.error('Lỗi khi tạo user:', error);
    next(error); // Chuyển các lỗi khác cho errorHandler
  }
};