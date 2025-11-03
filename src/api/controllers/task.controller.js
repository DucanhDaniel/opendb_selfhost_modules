import { taskService } from '../../services/task/task.service.js';
import logger from '../../utils/logger.js';

/**
 * [GET] /tasks/history
 * Lấy lịch sử task của user đang đăng nhập
 */
export const handleGetTaskHistory = async (req, res, next) => {
  try {
    // Lấy userId từ token (đã được authMiddlewarexác thực)
    const { userId } = req.user; 
    
    const history = await taskService.getTaskHistory(userId);
    
    // Trả về mảng history (có thể là mảng rỗng)
    res.status(200).json(history); 

  } catch (error) {
    logger.error('Lỗi khi lấy lịch sử task:', error);
    next(error);
  }
};

/**
 * [DELETE] /tasks/history
 * Xóa lịch sử task của user đang đăng nhập
 */
export const handleDeleteTaskHistory = async (req, res, next) => {
  try {
    // Lấy userId từ token
    const { userId } = req.user;

    const message = await taskService.deleteTaskHistory(userId);
    
    res.status(200).json({ success: true, message: message });

  } catch (error) {
    logger.error('Lỗi khi xóa lịch sử task:', error);
    next(error);
  }
};