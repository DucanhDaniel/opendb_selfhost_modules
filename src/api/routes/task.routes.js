import { Router } from 'express';
import { validate } from '../middleware/validate.js';
import { logSchema, dataSchema, initiateTaskSchema, getTaskParamsSchema } from '../validators/taskSchemas.js';
import { handleLogProgress } from '../controllers/log_controller.js'; 
import { handleSubmitData } from '../controllers/gmv_data_controller.js';

import { 
  handleGetTaskHistory, 
  handleDeleteTaskHistory,
  handleInitiateTask, handleExecuteTask,
  handleGetTaskParams, handleGetTaskStatusByQuery
} from '../controllers/task.controller.js';

const router = Router();




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

// POST /api/v1/task/execute
router.post(
  '/execute', 
  handleExecuteTask
);

// GET /api/v1/task/get/task-param?taskId=...
router.get(
  '/get/task-param',
  validate(getTaskParamsSchema),
  handleGetTaskParams
);

// GET /api/v1/tasks/get/status?taskId=...
router.get(
  '/get/status',
  validate(getTaskParamsSchema), 
  handleGetTaskStatusByQuery
);
export default router;