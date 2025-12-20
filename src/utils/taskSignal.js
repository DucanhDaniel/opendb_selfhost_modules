import Redis from 'ioredis';

// Sử dụng chung cấu hình Redis với project của bạn
// Nếu bạn đã có file export redis client thì import vào, nếu chưa thì tạo mới
const redis = new Redis({
  host: process.env.REDIS_HOST || 'localhost',
  port: process.env.REDIS_PORT || 6379,
  // password: ...
});

const PREFIX = 'task:stop:';
const EXPIRY_SECONDS = 60 * 60 * 24; // Cờ tồn tại 24h

export const taskSignal = {
  /**
   * Đặt cờ dừng cho 1 task
   */
  async setStopSignal(taskId) {
    // Set key: "task:stop:<taskId>" = "1"
    await redis.set(`${PREFIX}${taskId}`, '1', 'EX', EXPIRY_SECONDS);
    console.log(`[Signal] Đã cắm cờ dừng cho task: ${taskId}`);
  },

  /**
   * Kiểm tra xem task có bị yêu cầu dừng không
   * Nếu có -> Throw Error ngay lập tức
   */
  async checkStopSignal(taskId) {
    const isStopped = await redis.get(`${PREFIX}${taskId}`);
    if (isStopped === '1') {
       throw new Error('JOB_CANCELLED_BY_USER');
    }
  },

  /**
   * Dọn dẹp cờ sau khi task xong (để tiết kiệm Redis)
   */
  async clearStopSignal(taskId) {
    await redis.del(`${PREFIX}${taskId}`);
  }
};