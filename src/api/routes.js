import { Router } from 'express';

// [MỚI] Import các router con
import userRoutes from './routes/user.routes.js';
import taskRoutes from './routes/task.routes.js';

const router = Router();

// Định nghĩa route health-check
router.get('/health', (req, res) => res.status(200).json({ status: 'OK' }));

// [MỚI] Điều phối các route
// Gắn tất cả các route từ user.routes.js vào tiền tố '/users'
router.use('/users', userRoutes);

// Gắn các route từ task.routes.js vào tiền tố '/task'
router.use('/task', taskRoutes);

export default router;