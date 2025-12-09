import { Queue } from 'bullmq';
import IORedis from 'ioredis';

const connection = new IORedis({ host: 'localhost', port: 6379 });
const taskQueue = new Queue('task-queue', { connection }); // Thay 'task-queue' bằng tên queue thật của bạn

async function checkJobData() {
  console.log('🔍 Đang kiểm tra các job đang chờ (Delayed)...');
  
  // Lấy các job đang nằm trong hàng đợi Delayed (Sắp chạy)
  const delayedJobs = await taskQueue.getJobs(['delayed']);

  if (delayedJobs.length === 0) {
    console.log('⚠️ Không có job nào đang chờ chạy.');
  }

  delayedJobs.forEach(job => {
    // Chỉ quan tâm các job của Schedule (tên bắt đầu bằng sched:)
    if (job.name.startsWith('sched:')) {
      console.log('------------------------------------------------');
      console.log(`🆔 Job ID: ${job.id}`);
      console.log(`🏷️ Job Name: ${job.name}`);
      console.log(`📦 DATA:`, job.data); // <--- ĐÂY LÀ CÁI BẠN CẦN TÌM
      console.log(`⏰ Chạy lúc: ${new Date(job.timestamp + job.opts.delay).toLocaleString()}`);
    }
  });

  await taskQueue.close();
  process.exit(0);
}

checkJobData();