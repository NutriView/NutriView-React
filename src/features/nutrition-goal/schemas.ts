import { z } from 'zod';

const macro = z.number({ message: 'Enter a number' }).min(0, 'Must be ≥ 0');

export const goalSchema = z.object({
  protein: macro,
  carbs: macro,
  fat: macro,
  sugar: macro,
  fiber: macro,
  sodium: macro,
  alcohol: macro,
});

export type GoalForm = z.infer<typeof goalSchema>;

export const emptyGoalForm: GoalForm = {
  protein: 0,
  carbs: 0,
  fat: 0,
  sugar: 0,
  fiber: 0,
  sodium: 0,
  alcohol: 0,
};
