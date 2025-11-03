import { Router } from 'express';
import { validate } from '../middleware/validate.js';
import { logSchema, dataSchema } from '../validators/taskSchemas.js';
import { handleLogProgress } from '../controllers/log_controller.js'; 
import { handleSubmitData } from '../controllers/gmv_data_controller.js';

// [MỚI] Import controllers
import { 
  handleGetTaskHistory, 
  handleDeleteTaskHistory 
} from '../controllers/task.controller.js';

const router = Router();

// --- Các route cũ ---
// router.post('/log/progress', validate(logSchema), handleLogProgress);
// router.post('/data/submit', validate(dataSchema), handleSubmitData);

// --- [MỚI] API Lịch sử Task ---
// (Các API này đã được bảo vệ bởi authMiddleware trong file routes.js chính)

// GET /api/v1/tasks/history
router.get(
  '/history',
  handleGetTaskHistory
);

// DELETE /api/v1/tasks/history
router.delete(
  '/history',
  handleDeleteTaskHistory
);

export default router;