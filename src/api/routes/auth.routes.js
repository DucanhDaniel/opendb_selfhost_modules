import { Router } from 'express';
import { validate } from '../middleware/validate.js';
import { registerSchema, loginSchema } from '../validators/auth.schema.js';
import { 
  handleRegister, 
  handleLogin, 
  handleRefreshToken,
  handleLogout 
} from '../controllers/auth.controller.js';

const router = Router();

// Các route này có tiền tố là /api/v1/auth

router.post('/register', validate(registerSchema), handleRegister);
router.post('/login', validate(loginSchema), handleLogin);
router.post('/refresh', handleRefreshToken);
router.post('/logout', handleLogout);

export default router;