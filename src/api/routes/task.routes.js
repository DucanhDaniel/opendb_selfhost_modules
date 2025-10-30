import { Router } from 'express';
import { validate } from '../middleware/validate.js';
import { logSchema, dataSchema } from '../validators/taskSchemas.js';
import { handleLogProgress } from '../controllers/log_controller.js';
import { handleSubmitData } from '../controllers/gmv_data_controller.js';

const router = Router();

// --- Các route này sẽ được gắn vào /api/v1/ ---

// POST /api/v1/task/log/progress
router.post('/log/progress', validate(logSchema), handleLogProgress);

// POST /api/v1/task/data/submit
router.post('/data/submit', validate(dataSchema), handleSubmitData);

export default router;