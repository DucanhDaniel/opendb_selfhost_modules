import { Router } from 'express';
import { validate } from '../middleware/validate.js';

// Import tất cả validators và controllers liên quan đến User
import {
  userParamSchema,
  singleKeySchema,
  updateSettingsSchema,
} from '../validators/user.settings.schema.js';
import { createUserSchema } from '../validators/user.schema.js';
import { handleCreateUser } from '../controllers/user.controller.js';
import {
  handleGetAllSettings,
  handleUpdateSettings,
  handleGetSingleSetting,
  handleSetSingleSetting,
} from '../controllers/user.settings.controller.js';

const router = Router();

// --- Các route này sẽ được gắn vào /api/v1/users ---

// POST /api/v1/users
router.post(
  '/', // Gốc của /users
  validate(createUserSchema),
  handleCreateUser
);

// GET /api/v1/users/:userId/settings
router.get(
  '/:userId/settings',
  validate(userParamSchema),
  handleGetAllSettings
);

// PATCH /api/v1/users/:userId/settings
router.patch(
  '/:userId/settings',
  validate(updateSettingsSchema),
  handleUpdateSettings
);

// GET /api/v1/users/:userId/settings/:key
router.get(
  '/:userId/settings/:key',
  validate(singleKeySchema),
  handleGetSingleSetting
);

// POST /api/v1/users/:userId/settings/:key
router.post(
  '/:userId/settings/:key',
  validate(singleKeySchema),
  handleSetSingleSetting
);

export default router;