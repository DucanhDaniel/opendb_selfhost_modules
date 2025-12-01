import prisma from '../db/client.js';
import logger from '../utils/logger.js';

import { TaskLogger } from '../utils/task_logger.js';
import { authService } from '../services/auth/auth.service.js';

import { processFacebookJob } from '../services/facebook/index.js';
import { processTiktokJob } from '../services/tiktok/index.js'; 
import { processPoscakeJob } from '../services/pancake/index.js';
// import { processGoogleJob } from '../services/google/index.js'; 

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

  const task_logger = new TaskLogger(userId, taskId);
  task_logger.info(`Khởi tạo task logger thành công!`);

  try {

    // const isLicenseValid = await authService.checkUserLicensePermission(userId, task.taskType);
    // if (isLicenseValid) {
    //   task_logger.info("License hợp lệ!");
    // }

    let result; // { status, data, newRows }
    
    // 1. [QUAN TRỌNG] Điều phối (Dispatch) tác vụ
    // (Đây là logic switch-case bạn đã có trong GAS)
    if (task.taskType.startsWith("FACEBOOK_")) {
      result = await processFacebookJob(task.params, accessToken, userId, task_logger);
    
    } else if (task.taskType.startsWith("TIKTOK_")) {
      result = await processTiktokJob(task, accessToken, userId, task_logger);
      
    } else if (task.taskType.startsWith("GOOGLE_")) {
      // result = await processGoogleJob(task.params, accessToken, userId);
      throw new Error("Google processor chưa được implement");
      
    } else if (task.taskType.startsWith("POSCAKE_")) {
      result = await processPoscakeJob(task.params, accessToken, userId, task_logger, taskId);
      console.log("Thoát processor poscake");
    } 
    else {
      throw new Error(`Loại task không xác định: ${task.taskType}`);
    }
    console.log("Bắt đầu cập nhật trạng thái!");
    // 2. Xử lý kết quả THÀNH CÔNG
    // task_logger.info(`Task hoàn thành. Status: ${result.status}. New rows: ${result.newRows}`)

    console.log("Đang đóng logger...");
    await task_logger.close(); 
    console.log("Logger đã đóng.");
    
    // Cập nhật trạng thái
    const finalMessage = `Hoàn tất! (Tổng cộng ${result.newRows || 0} dòng mới)`;
    console.log("Bắt đầu cập nhật trạng thái COMPLETED...");
    await updateTaskStatus(userId, taskId, "COMPLETED", finalMessage);
    console.log("Hoàn thành cập nhật trạng thái!");

  } catch (error) {
    // 3. Xử lý lỗi (FAILED)
    task_logger.error(`Task thất bại: ${error.message}`);
    await task_logger.close();
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

