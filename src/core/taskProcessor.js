import prisma from '../db/client.js';
import logger from '../utils/logger.js';

import { TaskLogger } from '../utils/task_logger.js';
import { authService } from '../services/auth/auth.service.js';

import { sendEmail } from '../services/emailer/emailer.service.js'

import { processFacebookJob } from '../services/facebook/index.js';
import { processTiktokJob } from '../services/tiktok/index.js'; 
import { processPoscakeJob } from '../services/pancake/index.js';
import { processScheduleTrigger } from './scheduleTrigger.js';
// import { processGoogleJob } from '../services/google/index.js'; 

const CURRENT_TASK_PROPERTY = "TASK_MANAGER_CURRENT_TASK";
const TASK_HISTORY_PROPERTY = "TASK_MANAGER_HISTORY";

/**
 * Hàm worker chính, xử lý 1 job từ queue
 * @param {object} job - Job từ BullMQ
 */
export const processJobWorker = async (job) => {
  // console.log(job);

  if (job.name.startsWith('sched:')) {
        logger.info(`[Worker] Nhận lịch: ${job.name}`);
        return processScheduleTrigger(job);
    }
  
  // 1. Bắt đầu đo giờ
  const startTime = Date.now();
  let status = "FAILED";
  let rowsWritten = 0;

  const { task, userId, accessToken } = job.data;
  const taskId = task.taskId;
  console.log(`Worker bắt đầu xử lý task ${taskId} cho user ${userId}...`);

  const task_logger = new TaskLogger(userId, taskId);
  task_logger.info(`Khởi tạo task logger thành công!`);

  try {

    // const isLicenseValid = await authService.checkUserLicensePermission(userId, task.taskType);
    // if (isLicenseValid) {
    //   task_logger.info("License hợp lệ!");
    // }

    let result; // { status, data, newRows }
    
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

    console.log("Đang đóng logger...");
    await task_logger.close(); 
    console.log("Logger đã đóng.");
    
    // Cập nhật trạng thái
    const finalMessage = `Hoàn tất! (Tổng cộng ${result.newRows || 0} dòng mới)`;
    rowsWritten = result.newRows || 0;

    console.log("Bắt đầu cập nhật trạng thái COMPLETED...");
    status = "COMPLETED";
    await updateTaskStatus(userId, taskId, "COMPLETED", finalMessage);
    console.log("Hoàn thành cập nhật trạng thái!");

  } catch (error) {
    if (error.message === "JOB_CANCELLED_BY_USER") {
      status = "CANCELLED";
      task_logger.info('Task đã bị dừng bởi người dùng!');
      await task_logger.close();
      await updateTaskStatus(userId, taskId, "CANCELLED", `Task đã bị dừng bởi người dùng`);
    }
    else {
      // 3. Xử lý lỗi (FAILED)
      status = "FAILED";
      task_logger.error(`Task thất bại: ${error.message}`);
      await task_logger.close();
      await updateTaskStatus(userId, taskId, "FAILED", `Lỗi: ${error.message}`);
    }
  }
  finally {
    // 2. Kết thúc đo giờ
    const durationMs = Date.now() - startTime;

    // 3. Ghi tổng kết vào bảng TaskMetric
    try {
      const scheduleId = task.scheduleId || null;

      await prisma.taskMetric.create({
        data: {
          taskId: taskId,
          userId: userId,
          taskType: task.taskType,
          status: status,
          
          durationMs: durationMs,
          rowsWritten: rowsWritten,
          
          scheduleId: scheduleId 
        }
      });

      if ((task.sendEmail && status === 'COMPLETED') || status === "FAILED" || status === "RUNNING") {
        await sendTaskStatusEmail(task, userId, taskId, status, rowsWritten, durationMs);
      }

            
      logger.info(`[Metric] Ghi nhận lịch sử chạy cho Task ${taskId} (Schedule: ${scheduleId || 'Manual'})`);

    } catch (e) {
      logger.error(`Lỗi ghi TaskMetric: ${e.message}`);
    }
  }
};

async function sendTaskStatusEmail(task, userId, taskId, status, rowsWritten, durationMs) {
        try {
          const user = await prisma.user.findUnique({
            where: { id: userId },
            select: { email: true } 
          });

          if (user && user.email) {
            // 2. Lấy log từ DB và sắp xếp luôn bằng Prisma
            const logs = await prisma.taskLog.findMany({
              where: { taskId: taskId },
              orderBy: { timestamp: 'asc' }, // Sắp xếp tăng dần theo thời gian
              // take: 50 // (Tùy chọn) Chỉ lấy 50 dòng log cuối để tránh email quá dài
            });

            // 3. Format log thành chuỗi HTML dễ đọc
            const logHtml = logs.map(log => {
               const time = new Date(log.timestamp).toLocaleTimeString('vi-VN');
               // Tô màu cho log lỗi
               const color = log.level === 'ERROR' ? 'red' : 'black'; 
               return `<div style="color: ${color}">[${time}] [${log.level}] ${log.message}</div>`;
            }).join('');

            // 4. Nội dung email
            const subject = `[OpenDB] Báo cáo Task: ${task.params.templateName} - ${new Date().toLocaleString('vi-VN')}`;
            const htmlContent = `
              <h3>Kết quả chạy Task</h3>
              <ul>
                <li><b>Task ID:</b> ${taskId}</li>
                <li><b>Trạng thái:</b> ${status}</li>
                <li><b>Số dòng dữ liệu mới:</b> ${rowsWritten}</li>
                <li><b>Thời gian chạy:</b> ${durationMs / 1000}s</li>
              </ul>
              <hr/>
              <h4>Chi tiết Log:</h4>
              <div style="background: #f4f4f4; padding: 10px; font-family: monospace; font-size: 12px;">
                ${logHtml || '<i>Không có log nào được ghi nhận.</i>'}
              </div>
            `;

            await sendEmail(user.email, subject, htmlContent); 
            
            console.log(`[Email] Đã gửi báo cáo tới ${user.email}`);
          }
        } catch (mailError) {
          console.error(`[Email Error] Không thể gửi mail báo cáo: ${mailError.message}`);
          // Không throw error để tránh làm fail cả task chỉ vì lỗi gửi mail
        }
}

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

