import { z } from 'zod';

export const loginSchema = z.object({
  email: z.string().email('Enter a valid email'),
  password: z.string().min(1, 'Password is required'),
});
export type LoginForm = z.infer<typeof loginSchema>;

export const registerSchema = z.object({
  email: z.string().email('Enter a valid email'),
  password: z.string().min(6, 'At least 6 characters'),
  nickName: z.string().min(1, 'Nickname is required'),
  dailyCalorieGoal: z.number({ message: 'Enter a number' }).int().min(0),
});
export type RegisterForm = z.infer<typeof registerSchema>;
