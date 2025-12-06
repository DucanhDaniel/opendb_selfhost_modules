import { jest } from '@jest/globals';
import Redis from 'ioredis';
import RedisRateLimiter from '../../src/utils/rate_limiter.js'; 

const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

const REDIS_CONFIG = {
  host: 'localhost',
  port: 6379,
};

describe('Integration Test: Redis Rate Limiter (Spam Logic)', () => {
  // Tăng timeout lên 15s vì test này cần chờ đợi thời gian thực (hơn 3s)
  jest.setTimeout(15000);

  let redis;
  let limiter;
  
  // Setup & Teardown
  beforeAll(() => {
    redis = new Redis(REDIS_CONFIG);
  });

  afterAll(async () => {
    await redis.quit(); // Đóng kết nối sạch sẽ
    console.log('[Jest] Đã đóng kết nối Redis.');
  });

  test('should NOT reset TTL when spamming during blocked period', async () => {
    // --- KỊCH BẢN ---
    // Rule: Tối đa 2 requests trong 3 giây
    const PERIOD = 3;
    const LIMIT = 2;
    const TEST_KEY = `jest_spam_test_${Date.now()}`;
    const REDIS_KEY = `${TEST_KEY}:${PERIOD}s`; // Key thực tế trong Redis phụ thuộc implementation của bạn

    // Khởi tạo Limiter
    limiter = new RedisRateLimiter(redis, [[LIMIT, PERIOD]]);

    console.log(`[Jest] Bắt đầu test key: ${TEST_KEY}`);

    // 1. Dùng hết hạn ngạch (Quota)
    await limiter.acquire(TEST_KEY); // Req 1
    await limiter.acquire(TEST_KEY); // Req 2
    console.log(`✅ Step 1: Đã dùng hết ${LIMIT} request.`);

    // 2. Kích hoạt chặn (Req 3)
    const result3 = await limiter.acquire(TEST_KEY);
    // Giả sử hàm acquire trả về false khi bị chặn
    expect(result3).toBeFalsy(); 
    console.log('✅ Step 2: Request thứ 3 đã bị chặn đúng như mong đợi.');

    // Kiểm tra TTL ban đầu
    const initialTtl = await redis.ttl(REDIS_KEY);
    console.log(`ℹ️ TTL ban đầu: ${initialTtl}s`);
    expect(initialTtl).toBeGreaterThan(0);
    expect(initialTtl).toBeLessThanOrEqual(PERIOD);

    // 3. Giai đoạn SPAM (Spamming Phase)
    console.log("\n--- BƯỚC 3: Spam liên tục trong 2 giây ---");
    
    for (let i = 1; i <= 4; i++) {
      await sleep(500); // Chờ 0.5s
      
      // Cố tình Spam request
      const spamResult = await limiter.acquire(TEST_KEY);
      expect(spamResult).toBeFalsy(); // Vẫn phải bị chặn

      // Kiểm tra TTL ngay lập tức
      const currentTtl = await redis.ttl(REDIS_KEY);
      console.log(`   ⏱️ Spam lần ${i} (Sau ${i * 0.5}s): TTL còn ${currentTtl}s`);

      // ASSERTION QUAN TRỌNG:
      // TTL phải giảm dần theo thời gian trôi qua.
      // Nó KHÔNG được phép reset về gần mức PERIOD (3s) chỉ vì có request mới chạm vào.
      // Logic: Tại thời điểm này, TTL phải nhỏ hơn (PERIOD - thời gian đã trôi qua)
      // Tuy nhiên để an toàn (do độ trễ mạng/xử lý), ta chỉ cần check nó không bị reset về 3.
      if (i > 1) {
        expect(currentTtl).toBeLessThan(PERIOD);
        expect(currentTtl).toBeLessThan(initialTtl);
      }
      
    }

    // 4. Kiểm tra khả năng phục hồi (Recovery)
    console.log("\n--- BƯỚC 4: Chờ hết thời gian gốc ---");
    // Tổng thời gian đã chờ ở vòng lặp trên là 4 * 0.5 = 2s.
    // Cần chờ thêm > 1s nữa để tổng > 3s.
    await sleep(1500); 

    // Kiểm tra Key đã hết hạn chưa
    const ttlAfterExpire = await redis.ttl(REDIS_KEY);
    // Redis trả về -2 nếu key không tồn tại, -1 nếu không có expire
    console.log(`ℹ️ TTL sau khi hết hạn: ${ttlAfterExpire}`);
    
    // Key nên tự động biến mất (-2) hoặc hết hạn
    expect([-2, -1]).toContain(ttlAfterExpire); 

    // Thử request lại -> Phải thành công
    const finalResult = await limiter.acquire(TEST_KEY);
    expect(finalResult).toBeTruthy();
    
    console.log("✅ TEST THÀNH CÔNG: User đã được mở khóa sau thời gian phạt.");
  });
});