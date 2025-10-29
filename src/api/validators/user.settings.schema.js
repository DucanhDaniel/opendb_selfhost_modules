import { z } from 'zod';

// Schema cho các request chỉ cần userId
export const userParamSchema = z.object({
  params: z.object({
    userId: z.string(), 
  }),
}).loose();

// Schema cho request lấy/set 1 key
export const singleKeySchema = z.object({
  params: z.object({
    userId: z.string().cuid('UserID không hợp lệ'),
    key: z.string().min(1, 'Key không được rỗng'),
  }),
  body: z.object({
    value: z.any(), // Cho phép lưu trữ bất kỳ giá trị nào
  }).optional(), // Body chỉ bắt buộc khi set
}).loose();

// Schema cho request update (merge) nhiều key
export const updateSettingsSchema = z.object({
  params: z.object({
    userId: z.string().cuid('UserID không hợp lệ'),
  }),
  body: z.record(z.any())
}).loose();