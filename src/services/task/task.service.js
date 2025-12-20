import prisma from '../../db/client.js';
import logger from '../../utils/logger.js';
import { randomUUID } from 'crypto';
import { taskSignal } from '../../utils/taskSignal.js';
import { taskQueue } from '../../core/jobQueue.js';

const CURRENT_TASK_PROPERTY = "TASK_MANAGER_CURRENT_TASK";
const TASK_HISTORY_PROPERTY = "TASK_MANAGER_HISTORY";
const TASK_PARAMS_PREFIX = "TASK_PARAMS_";
const MAX_HISTORY_ENTRIES = 20;

/**
 * Lấy lịch sử task của một user
 * @param {string} userId - ID của user (từ token)
 */
async function getTaskHistory(userId) {
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
  const { taskType, params, description, runType, scheduleId } = taskData;
  
  // 1. Tạo Task ID và đối tượng Task mới
  const taskId = randomUUID(); 
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
    
    scheduleId: scheduleId || null,
  };

  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: { settings: true }
  });
  const currentSettings = user?.settings || {};

  // 1. Cập nhật History (Giữ nguyên)
  const currentHistory = currentSettings[TASK_HISTORY_PROPERTY] || [];
  const newHistoryEntry = {
    taskId: taskId,
    timestamp: createdAt,
    description: description,
    runType: runType,
    status: "QUEUED",
    message: "Đang chờ xử lý...",
  };
  
  currentHistory.unshift(newHistoryEntry);
  
  // Nếu history quá dài, cắt bớt
  if (currentHistory.length > MAX_HISTORY_ENTRIES) {
    currentHistory.pop(); 
  }

  // 2. [LOGIC MỚI] Dọn dẹp các key TASK_PARAMS cũ
  // Lấy danh sách tất cả taskId đang có trong history (bao gồm cả cái mới)
  const validTaskIds = new Set(currentHistory.map(h => h.taskId));
  
  // Tạo một object settings mới để cập nhật
  const nextSettings = { ...currentSettings };

  // Duyệt qua tất cả key trong settings hiện tại
  Object.keys(nextSettings).forEach(key => {
    // Nếu key là một TASK_PARAM (bắt đầu bằng prefix)
    if (key.startsWith(TASK_PARAMS_PREFIX)) {
      // Trích xuất taskId từ key (ví dụ: TASK_PARAMS_123abc -> 123abc)
      const existingTaskId = key.replace(TASK_PARAMS_PREFIX, '');
      
      // Nếu taskId này KHÔNG còn nằm trong danh sách lịch sử hợp lệ
      if (!validTaskIds.has(existingTaskId)) {
        delete nextSettings[key]; // Xóa nó đi
        logger.info(`Đã dọn dẹp params cũ cho task ${existingTaskId}`);
      }
    }
  });

  // 3. Thêm các giá trị mới vào nextSettings
  nextSettings[CURRENT_TASK_PROPERTY] = newTask;
  nextSettings[TASK_HISTORY_PROPERTY] = currentHistory;
  
  const taskParamsToSave = {
    createdAt: createdAt,
    taskType: taskType,
    ...params,
  };
  nextSettings[TASK_PARAMS_PREFIX + taskId] = taskParamsToSave;

  // 4. Lưu lại vào DB
  await prisma.user.update({
    where: { id: userId },
    data: { settings: nextSettings }
  });

  logger.info(`Đã khởi tạo task ${taskId} cho user ${userId}`);
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
  if (task.taskType.startsWith("FACEBOOK")) {
    accessToken = currentSettings["FACEBOOK_ACCESS_TOKEN"]; 
  } else if (task.taskType.startsWith("TIKTOK")) {
    accessToken = currentSettings["TIKTOK_ACCESS_TOKEN"]; 
  } else if (task.taskType.startsWith("POSCAKE")) {
    accessToken = currentSettings["POSCAKE_ACCESS_TOKEN"];
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
    }, {
      jobId: taskId
    });
    
    logger.info(`Đã thêm task ${task.taskId} vào hàng đợi.`);
    return task; // Trả về task (đã cập nhật status)

  } catch (queueError) {
     logger.error(`Lỗi khi thêm task vào hàng đợi: ${queueError.message}`);
     // (Bạn có thể implement logic để rollback status task về 'QUEUED' ở đây)
     throw new Error("Lỗi hệ thống khi xếp hàng tác vụ.");
  }
}

async function getTaskParams(userId, taskId) {
  // 1. Lấy settings
  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: { settings: true }
  });
  const settings = user?.settings || {};

  // 2. Xây dựng key và lấy dữ liệu
  const key = TASK_PARAMS_PREFIX + taskId;
  const paramsData = settings[key];

  // 3. Xử lý
  if (!paramsData) {
    // Ném lỗi 404 để controller bắt
    throw new Error(`Không tìm thấy cấu hình cho Task ID: ${taskId}`);
  }
  
  // Dữ liệu đã là JSON, chỉ cần trả về
  return paramsData;
}

async function getTaskStatus(userId, taskId) {
  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: { settings: true }
  });
  const settings = user?.settings || {};

  // 1. Kiểm tra task đang chạy (CURRENT_TASK)
  const currentTask = settings[CURRENT_TASK_PROPERTY];
  if (currentTask && currentTask.taskId === taskId) {
    // Trả về task đang chạy (với progress, message, v.v.)
    return currentTask; 
  }

  // 2. Nếu không, kiểm tra trong lịch sử (HISTORY)
  const history = settings[TASK_HISTORY_PROPERTY] || [];
  const historyEntry = history.find(h => h.taskId === taskId);
  
  if (historyEntry) {
    // Trả về một object "giả-task" từ lịch sử
    return {
      taskId: taskId,
      status: historyEntry.status,
      progress: { message: historyEntry.message },
    };
  }

  // 3. Nếu không tìm thấy ở đâu cả
  throw new Error("Không tìm thấy Task ID.");
}

async function stopTask(taskId) {
    // 1. Kiểm tra xem job có tồn tại trong queue không (Optional - để báo lỗi 404 cho chuẩn)
    const job = await taskQueue.getJob(taskId); // Lưu ý: taskId phải khớp jobId như đã bàn ở bài trước
    
    if (!job) {
        throw new Error('Job not found');
    }

    // 2. Cắm cờ dừng vào Redis
    await taskSignal.setStopSignal(taskId);
    
    // (Optional) Vẫn có thể gọi job.discard() nếu muốn BullMQ biết, 
    // nhưng không bắt buộc vì Worker sẽ tự throw lỗi.
    try { await job.discard(); } catch (e) {}

    return { message: 'Signal sent successfully' };
}

// Export service
export const taskService = {
  getTaskHistory,
  deleteTaskHistory,
  initiateTask,
  executeTask,
  getTaskParams,
  getTaskStatus,
  stopTask
};