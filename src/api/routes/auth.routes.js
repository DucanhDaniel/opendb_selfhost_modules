import { Router } from 'express';
import { validate } from '../middleware/validate.js';
import { registerSchema, loginSchema } from '../validators/auth.schema.js';
import { 
  handleRegister, 
  handleLogin, 
  handleRefreshToken,
  handleLogout,
  handleForgotPassword,
  handleResetPassword
} from '../controllers/auth.controller.js';

import { forgotPasswordLimiter } from '../middleware/rateLimiter.js'

const router = Router();

// Các route này có tiền tố là /api/v1/auth

router.post('/register', validate(registerSchema), handleRegister);
router.post('/login', validate(loginSchema), handleLogin);
router.post('/refresh', handleRefreshToken);
router.post('/logout', handleLogout);
router.post('/forgot-password', forgotPasswordLimiter, handleForgotPassword);
router.post('/reset-password', handleResetPassword);
export default router;