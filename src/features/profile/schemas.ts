import { z } from 'zod';

export const profileSchema = z.object({
  nickName: z.string().min(1, 'Nickname is required'),
  dailyCalorieGoal: z.number({ message: 'Enter a number' }).int().min(0),
  weight: z.number().min(0),
  height: z.number().min(0),
  age: z.number().int().min(0),
  gender: z.enum(['Male', 'Female', 'NonBinary']).nullable(),
});

export type ProfileForm = z.infer<typeof profileSchema>;
