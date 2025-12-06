export default {
  // Môi trường chạy test (Node.js thay vì Browser)
  testEnvironment: 'node',
  
  // Nhận diện các file test (có đuôi .test.js hoặc .spec.js)
  testMatch: ['**/*.test.js'],
  
  // Hiển thị log chi tiết khi chạy
  verbose: true,

  // Tự động xóa mock sau mỗi lần test (giúp tránh lỗi logic giữa các bài test)
  clearMocks: true,
};