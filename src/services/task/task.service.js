import prisma from '../../db/client.js';
import logger from '../../utils/logger.js';
import { randomUUID } from 'crypto';

import { taskQueue } from '../../core/jobQueue.js';

// Tên key mà chúng ta sẽ dùng để lưu lịch sử trong cột 'settings' (JSONB)
const CURRENT_TASK_PROPERTY = "TASK_MANAGER_CURRENT_TASK";
const TASK_HISTORY_PROPERTY = "TASK_MANAGER_HISTORY";
const TASK_PARAMS_PREFIX = "TASK_PARAMS_";
const MAX_HISTORY_ENTRIES = 20;

/**
 * Lấy lịch sử task của một user
 * @param {string} userId - ID của user (từ token)
 */
async function getTaskHistory(userId) {
  // Lấy chỉ cột 'settings'
  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: { settings: true }
  });

  if (!user || !user.settings) {
    return []; // Trả về mảng rỗng nếu không có settings
  }

  // Trả về giá trị của key, hoặc mảng rỗng nếu key không tồn tại
  return user.settings[TASK_HISTORY_PROPERTY] || [];
}

/**
 * Xóa lịch sử task của một user
 * @param {string} userId - ID của user (từ token)
 */
async function deleteTaskHistory(userId) {
  // 1. Lấy settings hiện tại
  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: { settings: true }
  });

  const currentSettings = user?.settings || {};

  // 2. Kiểm tra xem key có tồn tại không
  if (!currentSettings[TASK_HISTORY_PROPERTY]) {
    logger.warn(`User ${userId} đã xóa lịch sử (không có gì để xóa).`);
    return "Lịch sử đã trống.";
  }

  // 3. Xóa key khỏi object
  delete currentSettings[TASK_HISTORY_PROPERTY];

  // 4. Cập nhật lại settings
  await prisma.user.update({
    where: { id: userId },
    data: { settings: currentSettings }
  });

  logger.info(`Đã xóa lịch sử task cho user ${userId}`);
  return "Đã xóa lịch sử thành công.";
}

async function initiateTask(userId, taskData) {
  const { taskType, params, description, runType } = taskData;
  
  // 1. Tạo Task ID và đối tượng Task mới
  const taskId = randomUUID(); // Thay thế Utilities.getUuid()
  const createdAt = new Date().toISOString();

  const newTask = {
    taskId: taskId,
    taskType: taskType,
    description: description,
    params: params,
    status: "QUEUED",
    progress: {
      processed: 0,
      total: 0,
      message: "Đang chờ xử lý...",
      totalNewRows: 0,
    },
    createdAt: createdAt,
    runType: runType,
    chunks: [],
    tempData: [],
    nextChunkIndex: 0,
  };

  // 2. Lấy settings hiện tại (chúng ta cần cập nhật nhiều key)
  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: { settings: true }
  });
  const currentSettings = user?.settings || {};

  // 3. Logic của _saveTaskParams (GAS)
  const taskParamsToSave = {
    createdAt: createdAt,
    taskType: taskType,
    ...params,
  };

  // 4. Logic của _logTaskHistory (GAS)
  const newHistoryEntry = {
    taskId: taskId,
    timestamp: createdAt,
    description: description,
    runType: runType,
    status: "QUEUED",
    message: "Đang chờ xử lý...",
  };
  
  const currentHistory = currentSettings[TASK_HISTORY_PROPERTY] || [];
  currentHistory.unshift(newHistoryEntry); // Thêm vào đầu mảng
  if (currentHistory.length > MAX_HISTORY_ENTRIES) {
    currentHistory.pop(); // Xóa entry cũ nhất
  }

  // 5. Cập nhật đối tượng settings
  const updatedSettings = {
    ...currentSettings,
    [CURRENT_TASK_PROPERTY]: newTask, // Logic của _saveCurrentTask
    [TASK_HISTORY_PROPERTY]: currentHistory, // Logic của _logTaskHistory
    [TASK_PARAMS_PREFIX + taskId]: taskParamsToSave // Logic của _saveTaskParams
  };

  // 6. Lưu lại vào DB
  await prisma.user.update({
    where: { id: userId },
    data: { settings: updatedSettings }
  });

  logger.info(`Đã khởi tạo task ${taskId} cho user ${userId}`);
  
  // 7. Trả về task mới cho controller
  return newTask;
}

async function executeTask(userId) {
  // 1. Lấy settings hiện tại
  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: { settings: true }
  });
  const currentSettings = user?.settings || {};

  // 2. Load task từ key cố định
  const task = currentSettings[CURRENT_TASK_PROPERTY];

  // 3. Validate task
  if (!task) {
    throw new Error("Không có task nào đang chờ (CURRENT_TASK is null).");
  }
  
  // Lấy taskId từ chính task object
  const taskId = task.taskId; 

  if (task.status !== "QUEUED") {
     throw new Error(`Task ${taskId} đã ở trạng thái ${task.status}, không thể thực thi.`);
  }

let accessToken;
  if (task.taskType.startsWith("F")) {
    accessToken = currentSettings["FACEBOOK_ACCESS_TOKEN"]; // Ví dụ
  } else if (task.taskType.startsWith("T")) {
    accessToken = currentSettings["TIKTOK_ACCESS_TOKEN"]; // Ví dụ
  }
  
  if (!accessToken) {
    throw new Error(`Không tìm thấy Access Token cho ${task.taskType}`);
  }

  // 5. Cập nhật trạng thái task (vẫn giống như cũ)
  task.status = "RUNNING";
  task.progress.message = "Đã gửi đến hàng đợi xử lý...";
  
  const updatedSettings = { ...currentSettings, [CURRENT_TASK_PROPERTY]: task };
  
  await prisma.user.update({
    where: { id: userId },
    data: { settings: updatedSettings }
  });

  // 6. [QUAN TRỌNG] Thêm task vào hàng đợi (BullMQ)
  // 'process-job' là tên của job, worker sẽ lắng nghe tên này
  try {
    await taskQueue.add('process-job', {
      task: task, // Toàn bộ object task
      userId: userId, // ID của user để worker cập nhật lại settings
      accessToken: accessToken // Token để worker sử dụng
    });
    
    logger.info(`Đã thêm task ${task.taskId} vào hàng đợi.`);
    return task; // Trả về task (đã cập nhật status)

  } catch (queueError) {
     logger.error(`Lỗi khi thêm task vào hàng đợi: ${queueError.message}`);
     // (Bạn có thể implement logic để rollback status task về 'QUEUED' ở đây)
     throw new Error("Lỗi hệ thống khi xếp hàng tác vụ.");
  }
}

// Export service
export const taskService = {
  getTaskHistory,
  deleteTaskHistory,
  initiateTask,
  executeTask
};