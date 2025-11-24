import prisma from '../db/client.js';
import logger from './logger.js'; 

const FLUSH_INTERVAL_MS = 5000;      // Ghi xuống DB mỗi 5 giây
const BUFFER_SIZE = 100;             // Hoặc ghi khi gom đủ 100 dòng log
const STATUS_UPDATE_THROTTLE = 2000; // Cập nhật trạng thái task (UI) tối đa 1 lần/2 giây

export class TaskLogger {
  /**
   * @param {string} userId 
   * @param {string} taskId 
   */
  constructor(userId, taskId) {
    this.userId = userId;
    this.taskId = taskId;
    
    this.logBuffer = [];
    this.flushTimer = null;

    this.lastStatusUpdate = 0;
    this.pendingStatusMessage = null;
  }

  info(message) {
    this._handleLog('INFO', message);
  }

  warn(message) {
    this._handleLog('WARN', message);
  }

  error(message) {
    this._handleLog('ERROR', message);
  }

  /**
   * Logic xử lý: Console + Buffer + Throttle Update
   */
  _handleLog(level, message) {
    // 1. Console Log ngay lập tức (để debug realtime trên server)
    if (level === 'INFO') logger.info(`[Task ${this.taskId}] ${message}`);
    else if (level === 'WARN') logger.warn(`[Task ${this.taskId}] ${message}`);
    else logger.error(`[Task ${this.taskId}] ${message}`);

    // 2. Đẩy vào Buffer (cho bảng TaskLog)
    this.logBuffer.push({
      taskId: this.taskId,
      level: level,
      message: message,
      timestamp: new Date(),
      userId: this.userId 
    });

    // Logic xả buffer (Flush)
    if (this.logBuffer.length >= BUFFER_SIZE) {
      this.flush(); // Đầy thì ghi ngay
    } else if (!this.flushTimer) {
      // Chưa đầy thì hẹn giờ ghi
      this.flushTimer = setTimeout(() => this.flush(), FLUSH_INTERVAL_MS);
    }

    // 3. Cập nhật Status Message (cho UI xem tiến độ)
    this.pendingStatusMessage = message;
    const now = Date.now();
    // Chỉ gọi DB cập nhật status nếu đã qua thời gian throttle
    if (now - this.lastStatusUpdate > STATUS_UPDATE_THROTTLE) {
      this._updateTaskStatusInDb(message);
      this.lastStatusUpdate = now;
    }
  }

  /**
   * Ghi Buffer xuống bảng TaskLog (Bulk Insert)
   */
  async flush() {
    if (this.flushTimer) {
      clearTimeout(this.flushTimer);
      this.flushTimer = null;
    }

    if (this.logBuffer.length === 0) return;

    // Cắt mảng để ghi, reset buffer ngay lập tức
    const logsToWrite = [...this.logBuffer];
    this.logBuffer = [];

    try {
      await prisma.taskLog.createMany({
        data: logsToWrite
      });
    } catch (e) {
      console.error(`❌ [TaskLogger] Lỗi khi flush logs xuống DB cho task ${this.taskId}:`, e.message);
    }
  }

  /**
   * Cập nhật message vào cột settings của User
   * (Hàm này đã được throttle để không gọi quá nhiều)
   */
  async _updateTaskStatusInDb(message) {
    try {
      // Lưu ý: Update JSONB liên tục có thể gây race condition nhẹ, 
      // nhưng với throttle 2s thì chấp nhận được cho message tiến độ.
      
      const user = await prisma.user.findUnique({
        where: { id: this.userId },
        select: { settings: true }
      });
      
      if (!user || !user.settings) return;
      
      const settings = user.settings;
      const currentTask = settings["TASK_MANAGER_CURRENT_TASK"];

      // Chỉ cập nhật nếu Task ID khớp (để tránh ghi đè task mới nếu task cũ chạy quá lâu)
      if (currentTask && currentTask.taskId === this.taskId) {
        currentTask.progress.message = message;
        
        await prisma.user.update({
          where: { id: this.userId },
          data: { settings: settings }
        });
      }
    } catch (e) {
      // Không throw error để tránh ảnh hưởng luồng chính
      console.error("⚠️ [TaskLogger] Lỗi cập nhật status message:", e.message);
    }
  }

  /**
   * [QUAN TRỌNG] Gọi hàm này khi Task kết thúc hoặc Worker shutdown
   * để đảm bảo mọi log còn sót được ghi xuống DB.
   */
  async close() {
    // Ghi nốt log còn trong buffer
    await this.flush();
    
    // Ghi nốt status message cuối cùng (thường là "Hoàn tất" hoặc "Lỗi")
    if (this.pendingStatusMessage) {
      await this._updateTaskStatusInDb(this.pendingStatusMessage);
    }
  }
}