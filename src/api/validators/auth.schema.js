import { z } from 'zod';

export const registerSchema = z.object({
  body: z.object({
    username: z.string().min(3, 'Username phải có ít nhất 3 ký tự'),
    password: z.string().min(6, 'Password phải có ít nhất 6 ký tự'),
    email: z.string().email('Email không hợp lệ').optional(),
  }),
}).loose();

export const loginSchema = z.object({
  body: z.object({
    username: z.string().min(1, 'Vui lòng nhập username'),
    password: z.string().min(1, 'Vui lòng nhập password'),
  }),
}).loose();