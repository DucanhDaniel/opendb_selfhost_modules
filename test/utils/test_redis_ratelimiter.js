import Redis from 'ioredis';
import RedisRateLimiter from '../../src/utils/rate_limiter.js'; // Đảm bảo đường dẫn đúng

// --- Cấu hình Redis ---
const redis = new Redis({
  host: 'localhost', 
  port: 6379,
});

const sleep = (ms) => new Promise(resolve => setTimeout(resolve, ms));

async function runTest() {
  console.log("🚀 Bắt đầu test: Mô phỏng Spam Request khi đang bị Block...");

  // --- KỊCH BẢN TEST ---
  // Quy tắc: Cho phép tối đa 2 requests trong 3 giây
  // Thời gian 3 giây đủ dài để chúng ta spam thử
  const PERIOD = 3;
  const LIMIT = 2;
  const rules = [[LIMIT, PERIOD]]; 
  
  const limiter = new RedisRateLimiter(redis, rules);
  const testKey = "user_spam_test";
  const redisKey = `${testKey}:${PERIOD}s`;

  // 1. Dọn dẹp dữ liệu cũ
  await redis.del(redisKey);
  console.log(`🧹 Đã dọn dẹp key cũ: ${redisKey}`);

  // 2. Dùng hết hạn ngạch (Quota)
  console.log("\n--- BƯỚC 1: Dùng hết hạn ngạch ---");
  await limiter.acquire(testKey); // Req 1
  await limiter.acquire(testKey); // Req 2
  console.log(`✅ Đã gửi ${LIMIT} request thành công.`);

  // 3. Kích hoạt chặn
  const blocked = await limiter.acquire(testKey); // Req 3
  console.log(`🛑 Request thứ 3: ${blocked ? "FAILED (Chưa bị chặn)" : "OK (Đã bị chặn)"}`);

  // Kiểm tra TTL ban đầu
  let ttl = await redis.ttl(redisKey);
  console.log(`ℹ️ TTL ban đầu khi vừa bị chặn: ${ttl}s (Mong đợi: ~${PERIOD}s)`);

  // 4. Giai đoạn SPAM (Spamming Phase)
  console.log("\n--- BƯỚC 2: Spam liên tục trong 2 giây ---");
  console.log("   (Mục tiêu: TTL phải giảm dần, KHÔNG được reset về 3s)");

  for (let i = 1; i <= 4; i++) {
    await sleep(500); // Chờ 0.5s
    
    // Gửi request spam
    await limiter.acquire(testKey); 
    
    // Kiểm tra TTL ngay lập tức
    ttl = await redis.ttl(redisKey);
    console.log(`   ⏱️ Sau ${i * 0.5}s spam: TTL còn ${ttl}s`);

    if (ttl > PERIOD - 0.5) { // Nếu TTL vẫn gần bằng 3s sau khi đã đợi
        throw new Error(`❌ LỖI LOGIC: TTL bị reset! Spam request đang gia hạn thời gian chờ.`);
    }
  }

  // 5. Kiểm tra kết quả sau khi hết thời gian gốc (3s)
  console.log("\n--- BƯỚC 3: Chờ hết thời gian gốc (Tổng > 3.5s) ---");
  await sleep(1500); // Chờ thêm 1.5s (Tổng cộng đã trôi qua > 3.5s)

  ttl = await redis.ttl(redisKey);
  console.log(`ℹ️ TTL hiện tại: ${ttl} (Mong đợi: -2 hoặc -1 tức là key đã xóa)`);

  const finalResult = await limiter.acquire(testKey);
  
  if (finalResult) {
    console.log("✅ TEST THÀNH CÔNG: Request được chấp nhận sau thời gian chờ (dù có spam).");
  } else {
    console.error("❌ TEST THẤT BẠI: Request vẫn bị chặn. (Vòng lặp vô tận)");
    throw new Error("Spam request đã ngăn cản việc reset hạn ngạch.");
  }

  redis.disconnect();
}

runTest().catch(err => {
  console.error("\n💥 ERROR:", err.message);
  redis.disconnect();
});