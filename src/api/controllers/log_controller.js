// import { prisma } from '../../db/client.js'; // Import PrismaClient
import  logger  from '../../utils/logger.js'; // Import logger của bạn

/**
 * Xử lý việc ghi log tiến trình vào database.
 * Sử dụng `upsert` để tạo mới hoặc cập nhật log cho một task_id.
 */
export const handleLogProgress = async (req, res, next) => {
  try {
    const { task_id, status, message, progress } = req.body;

    logger.info(`Nhận log cho task ${task_id}: ${status} - ${progress}%`);

    // Ghi vào DB (Giả sử bạn có model TaskProgress)
    // Nếu bạn chưa có, hãy thêm model này vào schema.prisma
    /*
    model TaskProgress {
      id        String   @id @default(cuid())
      taskId    String   @unique
      status    String
      message   String?
      progress  Int
      updatedAt DateTime @updatedAt
    }
    */
    // const logEntry = await prisma.taskProgress.upsert({
    //   where: { taskId: task_id },
    //   update: {
    //     status: status,
    //     message: message,
    //     progress: progress,
    //   },
    //   create: {
    //     taskId: task_id,
    //     status: status,
    //     message: message,
    //     progress: progress,
    //   },
    // });

    res.status(200).json({ success: true, message: 'Log received'});
    logger.info(`Nhận được dữ liệu task: ${req.body.message}`)
  } catch (error) {
    logger.error(`Lỗi khi ghi log cho task ${req.body.task_id}:`, error);
    next(error); // Chuyển lỗi cho errorHandler
  }
};