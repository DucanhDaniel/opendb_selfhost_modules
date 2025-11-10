import prisma from '../db/client.js';
import logger from '../utils/logger.js';

// [MỚI] Import các hàm "dispatcher" nghiệp vụ của bạn
import { processFacebookJob } from '../services/facebook/index.js';
import { processTiktokJob } from '../services/tiktok/index.js'; 
// import { processGoogleJob } from '../services/google/index.js'; // (Giả sử bạn có)

// Hằng số (copy từ service qua)
const CURRENT_TASK_PROPERTY = "TASK_MANAGER_CURRENT_TASK";
const TASK_HISTORY_PROPERTY = "TASK_MANAGER_HISTORY";

/**
 * Hàm worker chính, xử lý 1 job từ queue
 * @param {object} job - Job từ BullMQ
 */
export const processJobWorker = async (job) => {
  const { task, userId, accessToken } = job.data;
  const taskId = task.taskId;
  logger.info(`Worker bắt đầu xử lý task ${taskId} cho user ${userId}...`);

  try {
    let result; // { status, data, newRows }
    
    // 1. [QUAN TRỌNG] Điều phối (Dispatch) tác vụ
    // (Đây là logic switch-case bạn đã có trong GAS)
    if (task.taskType.startsWith("FACEBOOK_")) {
      result = await processFacebookJob(task.params, accessToken, userId);
    
    } else if (task.taskType.startsWith("TIKTOK_")) {
      result = await processTiktokJob(task, accessToken, userId);
      
    } else if (task.taskType.startsWith("GOOGLE_")) {
      // result = await processGoogleJob(task.params, accessToken, userId);
      throw new Error("Google processor chưa được implement");
      
    } else {
      throw new Error(`Loại task không xác định: ${task.taskType}`);
    }

    // 2. Xử lý kết quả THÀNH CÔNG
    logger.info(`Task ${taskId} hoàn thành. Status: ${result.status}. New rows: ${result.newRows}`);
    
    // Cập nhật trạng thái
    const finalMessage = `Hoàn tất! (Tổng cộng ${result.newRows || 0} dòng mới)`;
    await updateTaskStatus(userId, taskId, "COMPLETED", finalMessage);

  } catch (error) {
    // 3. Xử lý lỗi (FAILED)
    logger.error(`Task ${taskId} thất bại: ${error.message}`);
    await updateTaskStatus(userId, taskId, "FAILED", `Lỗi: ${error.message}`);
  }
};

/**
 * Hàm nội bộ để cập nhật settings của user sau khi job xong
 */
async function updateTaskStatus(userId, taskId, status, message) {
  try {
    const user = await prisma.user.findUnique({ where: { id: userId }, select: { settings: true }});
    if (!user) return;

    const settings = user.settings || {};
    
    // Cập nhật task đang chạy (nếu nó vẫn là task hiện tại)
    if (settings[CURRENT_TASK_PROPERTY] && settings[CURRENT_TASK_PROPERTY].taskId === taskId) {
      settings[CURRENT_TASK_PROPERTY].status = status;
      settings[CURRENT_TASK_PROPERTY].progress.message = message;
      // Dọn dẹp task hiện tại
      delete settings[CURRENT_TASK_PROPERTY]; 
    }
    
    // Cập nhật lịch sử
    const history = settings[TASK_HISTORY_PROPERTY] || [];
    const taskIndex = history.findIndex(item => item.taskId === taskId);
    if (taskIndex !== -1) {
      history[taskIndex].status = status;
      history[taskIndex].message = message;
      settings[TASK_HISTORY_PROPERTY] = history;
    }

    // Lưu lại DB
    await prisma.user.update({
      where: { id: userId },
      data: { settings: settings }
    });

  } catch (dbError) {
    logger.error(`Lỗi nghiêm trọng khi cập nhật status cho task ${taskId}: ${dbError.message}`);
  }
}

