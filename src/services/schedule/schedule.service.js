import prisma from '../../db/client.js';
import { taskQueue } from '../../core/jobQueue.js'; 
import logger from '../../utils/logger.js';

const JOB_NAME = 'schedule-trigger'; // Tên job để Worker nhận diện

/**
 * Tạo lịch chạy tự động
 * @param {string} userId - ID của user
 * @param {object} data - { name, cronExpression, timezone, taskData }
 */
async function createSchedule(userId, data) {
  const { name, cronExpression, timezone, taskData } = data;

  // 1. Validate
  if (!taskData || !taskData.taskType) {
    throw new Error("Dữ liệu taskData không hợp lệ.");
  }

  // 2. Lưu vào Database
  // (Dùng để hiển thị lên UI và quản lý)
  const schedule = await prisma.taskSchedule.create({
    data: {
      userId,
      name,
      cronExpression,
      timezone: timezone || 'Asia/Ho_Chi_Minh',
      taskData: taskData // Lưu nguyên cục JSON params
    }
  });

  // 3. Đăng ký với BullMQ (Redis)
  // (Dùng để kích hoạt chạy đúng giờ)
  await _addJobToQueue(schedule);

  logger.info(`[Schedule] User ${userId} đã tạo lịch ${schedule.id} (${cronExpression})`);
  return schedule;
}

/**
 * Xóa lịch
 */
async function deleteSchedule(userId, scheduleId) {
  // 1. Tìm lịch trong DB để lấy thông tin Cron (cần để xóa Job trong BullMQ)
  const schedule = await prisma.taskSchedule.findFirst({
    where: { id: scheduleId, userId: userId }
  });

  if (!schedule) {
    throw new Error("Lịch không tồn tại hoặc bạn không có quyền xóa.");
  }

  // 2. Xóa trong BullMQ trước
  await _removeJobFromQueue(schedule);

  // 3. Xóa trong Database sau
  await prisma.taskSchedule.delete({
    where: { id: scheduleId }
  });

  logger.info(`[Schedule] Đã xóa lịch ${scheduleId}`);
  return { success: true, id: scheduleId };
}

/**
 * Lấy danh sách lịch của User
 */
async function getUserSchedules(userId) {
  return prisma.taskSchedule.findMany({
    where: { userId },
    orderBy: { createdAt: 'desc' }
  });
}


async function _addJobToQueue(schedule) {
  // Tạo Job ID cố định: "sched:<UUID>" để dễ tìm và xóa sau này
  const jobId = `sched:${schedule.id}`;

  await taskQueue.add(
    JOB_NAME, // Tên Job: 'schedule-trigger'
    { 
      // Payload gửi cho Worker (chỉ cần ID là đủ để Worker tra cứu lại DB)
      scheduleId: schedule.id,
      userId: schedule.userId
    },
    {
      jobId: jobId, 
      repeat: {
        pattern: schedule.cronExpression,
        tz: schedule.timezone || "Asia/Ho_Chi_Minh"
      },
      // Giữ lại config này để debug
      removeOnComplete: true,
      removeOnFail: true
    }
  );
}

async function _removeJobFromQueue(schedule) {
  const jobId = `sched:${schedule.id}`;
  
  // BullMQ yêu cầu truyền đúng config repeat cũ để tìm và xóa
  await taskQueue.removeRepeatable(
    JOB_NAME,
    {
      pattern: schedule.cronExpression,
      tz: schedule.timezone || "Asia/Ho_Chi_Minh"
    },
    jobId 
  );
}

async function updateSchedule(userId, scheduleId, updateData) {
  // 1. Tìm lịch CŨ trong DB (để lấy cronExpression cũ dùng cho việc xóa job)
  const oldSchedule = await prisma.taskSchedule.findFirst({
    where: { id: scheduleId, userId: userId }
  });

  if (!oldSchedule) {
    throw new Error("Lịch không tồn tại hoặc bạn không có quyền sửa.");
  }

  // 2. Xóa Job cũ trong BullMQ (Quan trọng: Phải xóa trước khi update DB)
  // Nếu lịch đang active thì mới có job để xóa
  if (oldSchedule.isActive) {
    await _removeJobFromQueue(oldSchedule);
  }

  // 3. Cập nhật thông tin mới vào Database
  const newSchedule = await prisma.taskSchedule.update({
    where: { id: scheduleId },
    data: {
      name: updateData.name,
      cronExpression: updateData.cronExpression,
      timezone: updateData.timezone,
      taskData: updateData.taskData,
      isActive: updateData.isActive 
    }
  });

  // 4. Đăng ký Job mới vào BullMQ (Chỉ khi isActive = true)
  if (newSchedule.isActive) {
    await _addJobToQueue(newSchedule);
    logger.info(`[Schedule] Đã cập nhật và kích hoạt lại lịch ${scheduleId}`);
  } else {
    logger.info(`[Schedule] Đã cập nhật và TẮT lịch ${scheduleId}`);
  }

  return newSchedule;
}

export const scheduleService = {
  createSchedule,
  deleteSchedule,
  getUserSchedules,
  updateSchedule
};