import { z } from 'zod';

// Schema cho body khi tạo user
export const createUserSchema = z.object({
  body: z.object({
    email: z.string({
      required_error: 'Email là bắt buộc',
    }).email('Email không hợp lệ'),
    
    name: z.string().optional(), // Tên là tùy chọn
  }),
}).loose(); // Dùng .loose() thay cho .passthrough()