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
    // this.rules = rules.sort((a, b) => a[1] - b[1]);
    this.rules = [...rules].sort((a, b) => a[1] - b[1]);
  }

  /**
   * Cố gắng "chiếm" một slot request. Trả về true nếu được phép.
   * @param {string} baseKey - Key cơ sở (ví dụ: 'tiktok_api')
   * @returns {Promise<boolean>} - True nếu được phép, False nếu bị giới hạn.
   */
async acquire(baseKey) {
    for (const [limit, period] of this.rules) {
      const key = `${baseKey}:${period}s`;

      // 1. Lấy giá trị hiện tại và TTL
      // Dùng pipeline để lấy dữ liệu nhanh
      const pipe = this.redis.pipeline();
      pipe.get(key);
      pipe.ttl(key);
      const results = await pipe.exec();
      
      let currentCount = parseInt(results[0][1]) || 0;
      let ttl = results[1][1];

      // 2. Nếu đã quá giới hạn -> TRẢ VỀ FALSE NGAY (Không tăng count, không reset TTL)
      if (currentCount >= limit) {
        return false; 
      }

      // 3. Nếu chưa quá giới hạn -> Tăng count
      const multi = this.redis.multi();
      multi.incr(key);
      
      // Chỉ đặt expire nếu key chưa tồn tại hoặc chưa có TTL
      if (currentCount === 0 || ttl === -1) {
         multi.expire(key, period);
      }
      
      await multi.exec();
    }

    return true;
  }
}

export default RedisRateLimiter;