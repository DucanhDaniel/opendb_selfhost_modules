import 'dotenv/config';
import { authService } from '../../src/services/auth/auth.service.js';
import prisma from '../../src/db/client.js';

const REAL_USER_ID = "cmiah10am0000qemsn515u97n";
const TASK_TYPE_TO_TEST = "FACEBOOK_FAD";

async function runRealTest() {
  console.log("🚀 Đang kiểm tra License thật...");

  try {
    const user = await prisma.user.findUnique({ where: { id: REAL_USER_ID } });
    console.log("User Settings:", user?.settings);

    const isValid = await authService.checkUserLicensePermission(REAL_USER_ID, TASK_TYPE_TO_TEST);
    
    if (isValid) {
        console.log(`✅ THÀNH CÔNG: User có quyền truy cập ${TASK_TYPE_TO_TEST}`);
    }
  } catch (error) {
    console.error("❌ THẤT BẠI:", error.message);
  } finally {
    await prisma.$disconnect();
  }
}

runRealTest();