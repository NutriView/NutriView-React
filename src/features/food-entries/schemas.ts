import { z } from 'zod';

export const addEntrySchema = z.object({
  foodId: z.string().min(1, 'Pick a food'),
  quantity: z.number({ message: 'Enter a quantity' }).positive('Must be > 0'),
  unit: z.string().min(1, 'Unit is required'),
});

export type AddEntryForm = z.infer<typeof addEntrySchema>;
