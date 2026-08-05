import { z } from 'zod';

export const reminderSchema = z.object({
  mealId: z.number({ message: 'Pick a meal' }).int().min(1).max(4),
  timeOfDay: z.string().min(1, 'Pick a time'),
  isActive: z.boolean(),
});

export type ReminderForm = z.infer<typeof reminderSchema>;
