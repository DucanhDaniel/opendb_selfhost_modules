import { Router } from 'express';
import userRoutes from './routes/user.routes.js';
import taskRoutes from './routes/task.routes.js';
import authRoutes from './routes/auth.routes.js'; // <-- 1. Import
import { authMiddleware } from './middleware/auth.middleware.js'; // <-- 2. Import

const router = Router();

router.get('/health', (req, res) => res.status(200).json({ status: 'OK' }));

// 3. Gắn các route CÔNG KHAI (không cần đăng nhập)
router.use('/auth', authRoutes);

// 4. Gắn các route ĐƯỢC BẢO VỆ (phải có Access Token)
router.use('/users', authMiddleware, userRoutes);
router.use('/task', authMiddleware, taskRoutes);

export default router;