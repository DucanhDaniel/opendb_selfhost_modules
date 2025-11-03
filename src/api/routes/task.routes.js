import { Router } from 'express';
import { validate } from '../middleware/validate.js';
import { logSchema, dataSchema, initiateTaskSchema } from '../validators/taskSchemas.js';
import { handleLogProgress } from '../controllers/log_controller.js'; 
import { handleSubmitData } from '../controllers/gmv_data_controller.js';

// [MỚI] Import controllers
import { 
  handleGetTaskHistory, 
  handleDeleteTaskHistory,
  handleInitiateTask, handleExecuteTask
} from '../controllers/task.controller.js';

const router = Router();

// --- Các route cũ ---
// router.post('/log/progress', validate(logSchema), handleLogProgress);
// router.post('/data/submit', validate(dataSchema), handleSubmitData);

// --- [MỚI] API Lịch sử Task ---

// GET /api/v1/task/history
router.get(
  '/history',
  handleGetTaskHistory
);

// DELETE /api/v1/task/history
router.delete(
  '/history',
  handleDeleteTaskHistory
);

// POST /api/v1/task/initiate
router.post(
  '/initiate',
  validate(initiateTaskSchema),
  handleInitiateTask
);

router.post(
  '/execute', 
  handleExecuteTask
);

export default router;