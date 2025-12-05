import { scheduleService } from '../../services/schedule/schedule.service.js';
import logger from '../../utils/logger.js';

export const handleCreateSchedule = async (req, res, next) => {
  try {
    const { userId } = req.user; // Lấy từ Token
    const result = await scheduleService.createSchedule(userId, req.body);
    res.status(201).json(result);
  } catch (error) {
    logger.error(`Lỗi tạo lịch: ${error.message}`);
    next(error);
  }
};

export const handleDeleteSchedule = async (req, res, next) => {
  try {
    const { userId } = req.user;
    const { id } = req.params;
    const result = await scheduleService.deleteSchedule(userId, id);
    res.status(200).json(result);
  } catch (error) {
    next(error);
  }
};

export const handleGetSchedules = async (req, res, next) => {
  try {
    const { userId } = req.user;
    const result = await scheduleService.getUserSchedules(userId);
    res.status(200).json(result);
  } catch (error) {
    next(error);
  }
};

export const handleUpdateSchedule = async (req, res, next) => {
  try {
    const { userId } = req.user;
    const { id } = req.params;
    const result = await scheduleService.updateSchedule(userId, id, req.body);
    res.status(200).json(result);
  } catch (e) { next(e); }
};