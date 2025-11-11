class RedisRateLimiter {
  /**
   * Khởi tạo limiter.
   * @param {import('ioredis').Redis} redisClient - Instance của ioredis.
   * @param {Array<[number, number]>} rules - Một mảng các quy tắc.
   * Mỗi quy tắc là một mảng [limit, period].
   * Ví dụ: [[10, 1], [600, 60]]
   */
  constructor(redisClient, rules) {
    if (!redisClient) {
      throw new Error("redisClient là bắt buộc.");
    }
    if (!rules || rules.length === 0) {
      throw new Error("Phải có ít nhất một quy tắc giới hạn.");
    }
    this.redis = redisClient;
    this.rules = rules.sort((a, b) => a[1] - b[1]);
  }

  /**
   * Cố gắng "chiếm" một slot request. Trả về true nếu được phép.
   * @param {string} baseKey - Key cơ sở (ví dụ: 'tiktok_api')
   * @returns {Promise<boolean>} - True nếu được phép, False nếu bị giới hạn.
   */
  async acquire(baseKey) {
    for (const [limit, period] of this.rules) {
      // Tạo một key duy nhất trong Redis cho mỗi quy tắc
      const key = `${baseKey}:${period}s`;

      const multi = this.redis.multi();

      multi.incr(key); // Tăng bộ đếm
      multi.expire(key, period); // Đặt lại thời gian hết hạn (sliding window)

      // Thực thi transaction
      let results;
      try {
        results = await multi.exec();
      } catch (error) {
        console.error(`Lỗi Redis transaction: ${error.message}`);
        return false; 
      }

      const currentCount = results[0][1];

      // Nếu vi phạm bất kỳ quy tắc nào, từ chối ngay lập tức
      if (currentCount > limit) {
        return false;
      }
    }

    // Nếu vượt qua tất cả các quy tắc, cho phép request
    return true;
  }
}

export default RedisRateLimiter;