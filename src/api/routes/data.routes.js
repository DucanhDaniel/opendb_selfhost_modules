import { Router } from 'express';
import { validate } from '../middleware/validate.js';

// Import schema cho 'submit'
import { dataSchema } from '../validators/taskSchemas.js'; 
// Import schema cho 'query'
import { queryDataSchema } from '../validators/data.schema.js';

// Import controller
import { handleSubmitData } from '../controllers/gmv_data_controller.js';
import { handleQueryData } from '../controllers/data.controller.js';

const router = Router();

// Endpoint CŨ (dùng để GHI dữ liệu)
// POST /api/v1/data/submit
router.post(
  '/submit', 
  validate(dataSchema), 
  handleSubmitData
);

// Endpoint MỚI (dùng để ĐỌC dữ liệu)
// GET /api/v1/data/query?sheetName=...
router.get(
  '/query',
  validate(queryDataSchema),
  handleQueryData
);

// --- Các route cũ ---
// router.post('/log/progress', validate(logSchema), handleLogProgress);

export default router;