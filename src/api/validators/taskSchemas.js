// src/api/validators/taskSchemas.js
import { z } from 'zod';

/**
 * Validator cho body của request log
 */
export const logSchema = z.object({
  body: z.object({
    task_id: z.string({
      required_error: 'task_id là bắt buộc',
    }).min(1, 'task_id không được rỗng'),
    
    status: z.string({
      required_error: 'status là bắt buộc',
    }),
    
    message: z.string().default(''),
    
    progress: z.number({
      required_error: 'progress là bắt buộc',
    }).int().min(0).max(100),
  }),
}).loose(); 


/**
 * Validator cho body của request data
 */
export const dataSchema = z.object({
  body: z.object({
    // Dùng task_id để liên kết dữ liệu
    task_id: z.string().min(1, 'task_id không được rỗng'), 
    
    // Giúp phân loại dữ liệu
    source: z.string().min(1, 'source là bắt buộc (vd: facebook, tiktok)'), 
    report_type: z.string().min(1, 'report_type là bắt buộc (vd: performance, daily)'),
    
    // Dữ liệu chính: một mảng các object
    data: z.array(z.record(z.any())), // Cho phép mảng rỗng
    
    // Các trường tùy chọn
    headers: z.array(z.string()).optional(),
    options: z.record(z.any()).optional(),
  }),
}).loose();

// Schema cho body của /tasks/initiate
export const initiateTaskSchema = z.object({
  body: z.object({
    taskType: z.string().min(1, 'taskType là bắt buộc'),
    params: z.object({}).loose(), 
    description: z.string().min(1, 'description là bắt buộc'),
    runType: z.string().optional().default('MANUAL'),
  }),
}).loose();