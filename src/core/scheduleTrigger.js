import logger from '../utils/logger.js';
import { taskService } from '../services/task/task.service.js';
import prisma from '../db/client.js';
import { subDays, addDays, format, isAfter, parseISO } from 'date-fns';

export const processScheduleTrigger = async (job) => {
  const { scheduleId, userId } = job.data;
  
  try {
    // 1. Lấy thông tin lịch mới nhất từ DB
    const schedule = await prisma.taskSchedule.findUnique({
      where: { id: scheduleId }
    });

    if (!schedule || !schedule.isActive) {
      return;
    }

    const currentParams = schedule.taskData.params || {};
    
    // A. Xác định Đích đến (Target): Luôn là "Hôm qua" 
    const yesterday = subDays(new Date(), 1);
    const yesterdayStr = format(yesterday, 'yyyy-MM-dd');

    // B. Xác định Điểm xuất phát (Source): Lấy từ DB
    // Nếu DB chưa có startDate, mặc định là lấy dữ liệu của chính "Hôm qua"
    const runStartDateStr = currentParams.startDate || yesterdayStr;

    console.log("runStartDateStr: ", runStartDateStr);
    
    // C. Xác định Điểm kết thúc (End):
    // Luôn chạy đến "Hôm qua" để bắt kịp dữ liệu (Catch-up)
    const runEndDateStr = yesterdayStr;

    // D. Kiểm tra điều kiện chạy
    // Nếu "Ngày cần chạy" (Start) nằm sau "Hôm qua" (End) -> Nghĩa là đã chạy xong hết rồi
    if (isAfter(parseISO(runStartDateStr), yesterday)) {
        const prevDate = subDays(parseISO(runStartDateStr), 1);
        const prevDateStr = format(prevDate, 'yyyy-MM-dd'); 
        logger.info(`[Schedule ${scheduleId}] Dữ liệu đã được cập nhật đến ${prevDateStr}. Chưa có dữ liệu mới.`);
        return; 
    }

    logger.info(`[Schedule ${scheduleId}] 🟢 Kích hoạt chạy từ ${runStartDateStr} đến ${runEndDateStr}`);

    // 2. Chuẩn bị Task Data (Ghi đè ngày tháng)
    const runtimeTaskData = {
      ...schedule.taskData,
      params: {
        ...currentParams,
        startDate: runStartDateStr,
        endDate: runEndDateStr, 
      },
      runType: "SCHEDULED", 
      description: `[Auto] ${schedule.name} (${runStartDateStr} -> ${runEndDateStr})`,
      scheduleId: schedule.id 
    };

    // 3. Khởi tạo & Thực thi
    const newTask = await taskService.initiateTask(userId, runtimeTaskData);
    
    if (newTask && newTask.taskId) {
        await taskService.executeTask(userId);

        // 4. [QUAN TRỌNG] CẬP NHẬT "CON TRỎ" CHO LẦN SAU
        // Logic: Lần sau sẽ bắt đầu từ (Ngày kết thúc vừa chạy + 1 ngày)
        const runEndDateObj = parseISO(runEndDateStr);
        const nextStartDateObj = addDays(runEndDateObj, 1);
        const nextStartDateStr = format(nextStartDateObj, 'yyyy-MM-dd');

        // Update JSON trong DB
        const newTaskData = {
            ...schedule.taskData,
            params: {
                ...currentParams,
                startDate: nextStartDateStr, // <-- CẬP NHẬT START DATE MỚI
                // endDate: Có thể giữ nguyên hoặc xóa, vì lần chạy sau code sẽ tự tính lại endDate là Yesterday
            }
        };

        await prisma.taskSchedule.update({
            where: { id: scheduleId },
            data: { taskData: newTaskData }
        });

        logger.info(`[Schedule ${scheduleId}] ✅ Đã cập nhật lịch: Lần tới sẽ chạy từ ${nextStartDateStr}`);
    }

  } catch (error) {
    logger.error(`[Schedule ${scheduleId}] ❌ Lỗi kích hoạt: ${error.message}`);
  }
};