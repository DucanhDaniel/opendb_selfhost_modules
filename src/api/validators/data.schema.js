import { z } from 'zod';

// Schema cho GET /data/query
export const queryDataSchema = z.object({
  query: z.object({
    sheetName: z.string().min(1, 'sheetName là bắt buộc'),
    
    // Dùng 'coerce' để tự động chuyển "100" (string) thành 100 (number)
    page: z.coerce.number().int().positive().optional().default(1),

    limit: z.coerce.number().int().positive().optional().default(100)
    
    // Bạn có thể thêm các trường lọc khác ở đây
    // Ví dụ: startDate, endDate
  }),
}).loose();