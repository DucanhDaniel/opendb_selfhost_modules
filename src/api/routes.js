import { Router } from 'express';
import { validate } from './middleware/validate.js';
import { logSchema, dataSchema } from './validators/taskSchemas.js';
import { handleLogProgress } from './controllers/log_controller.js';
import { handleSubmitData } from './controllers/gmv_data_controller.js';

import {
  userParamSchema,
  singleKeySchema,
  updateSettingsSchema,
} from './validators/user.settings.schema.js';

import { createUserSchema } from './validators/user.schema.js';
import { handleCreateUser } from './controllers/user.controller.js';

import {
  handleGetAllSettings,
  handleUpdateSettings,
  handleGetSingleSetting,
  handleSetSingleSetting,
} from './controllers/user.settings.controller.js';

const router = Router();

// Định nghĩa các route
router.get('/health', (req, res) => res.status(200).json({ status: 'OK' }));

// 1. Endpoint Ghi Log
router.post('/log/progress', validate(logSchema), handleLogProgress);

// 2. Endpoint Ghi Data
router.post('/data/submit', validate(dataSchema), handleSubmitData);

// 1. Lấy toàn bộ settings của user
// GET /api/v1/users/clxja123.../settings
router.get(
  '/users/:userId/settings',
  validate(userParamSchema),
  handleGetAllSettings
);

// 2. Cập nhật (merge) nhiều settings
// PATCH /api/v1/users/clxja123.../settings
// Body: { "theme": "dark", "notifications": false }
router.patch(
  '/users/:userId/settings',
  validate(updateSettingsSchema),
  handleUpdateSettings
);

// 3. Lấy giá trị của 1 key
// GET /api/v1/users/clxja123.../settings/theme
router.get(
  '/users/:userId/settings/:key',
  validate(singleKeySchema),
  handleGetSingleSetting
);

// 4. Set/Cập nhật giá trị của 1 key
// POST /api/v1/users/clxja123.../settings/theme
// Body: { "value": "dark" }
router.post(
  '/users/:userId/settings/:key',
  validate(singleKeySchema), // Dùng chung schema vì params giống hệt
  handleSetSingleSetting
);

// POST /api/v1/users
// Body: { "email": "test@example.com", "name": "Test User" }
router.post(
  '/users',
  validate(createUserSchema),
  handleCreateUser
);

export default router;