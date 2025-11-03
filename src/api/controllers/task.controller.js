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

export const handleInitiateTask = async (req, res, next) => {
  try {
    // Lấy userId từ token (do authMiddleware thêm vào)
    const { userId } = req.user; 
    
    // Lấy data từ body (đã được validatorxác thực)
    const taskData = req.body; 

    const newTask = await taskService.initiateTask(userId, taskData);

    // 201 Created là status code phù hợp cho việc tạo mới
    res.status(201).json(newTask); 

  } catch (error) {
    logger.error('Lỗi khi khởi tạo task:', error);
    next(error);
  }
};