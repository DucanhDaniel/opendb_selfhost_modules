import { Router } from 'express';
import { 
  handleCreateSchedule, 
  handleDeleteSchedule, 
  handleGetSchedules,
  handleUpdateSchedule 
} from '../controllers/schedule.controller.js';

const router = Router();

// GET /api/v1/schedules - Lấy danh sách
router.get('/', handleGetSchedules);

// POST /api/v1/schedules - Tạo mới
// Body: { name: "...", cronExpression: "0 8 * * *", taskData: {...} }
router.post('/', handleCreateSchedule);

// DELETE /api/v1/schedules/:id - Xóa
router.delete('/:id', handleDeleteSchedule);

router.put('/:id', handleUpdateSchedule);

export default router;