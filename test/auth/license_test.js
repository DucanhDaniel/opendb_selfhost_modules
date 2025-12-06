// import { describe, test, expect, afterAll, beforeAll } from '@jest/globals';
// import { authService } from '../../src/services/auth/auth.service.js';
// import prisma from '../../src/db/client.js';

// // --- CẤU HÌNH ---
// // Lưu ý: Đảm bảo ID này tồn tại trong Database test của bạn
// const REAL_USER_ID = "cmiah10am0000qemsn515u97n";
// const TASK_TYPE_TO_TEST = "FACEBOOK_FAD";

// describe('Auth Service - Live License Check', () => {

//   // 1. Kiểm tra điều kiện tiên quyết trước khi chạy
//   beforeAll(async () => {
//     const user = await prisma.user.findUnique({ where: { id: REAL_USER_ID } });
//     if (!user) {
//       console.warn(`⚠️ CẢNH BÁO: User ID ${REAL_USER_ID} không tồn tại trong DB. Test có thể thất bại.`);
//     } else {
//       console.log("✅ User Settings tìm thấy:");
//     }
//   });

//   // 2. Dọn dẹp kết nối sau khi test xong
//   afterAll(async () => {
//     await prisma.$disconnect();
//   });

//   // 3. Test Case Chính
//   test('Should validate license successfully for real user', async () => {
//     // Gọi hàm
//     const result = await authService.checkUserLicensePermission(REAL_USER_ID, TASK_TYPE_TO_TEST);

//     // Kiểm tra kết quả (Thay vì if/else console.log)
//     // Mong đợi hàm trả về true (nếu hàm throw lỗi, test sẽ tự động Fail)
//     expect(result).toBe(true);
    
//   }, 30000); // Set timeout lên 30s vì gọi API Google Script thực tế có thể chậm

// });