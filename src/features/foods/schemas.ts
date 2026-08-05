import { z } from 'zod';

const macro = z.number({ message: 'Enter a number' }).min(0, 'Must be ≥ 0');

export const foodSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  brand: z.string().optional(),
  isGlobal: z.boolean(),
  nutrition: z.object({
    protein: macro,
    carbs: macro,
    fat: macro,
    sugar: macro,
    fiber: macro,
    sodium: macro,
    alcohol: macro,
    measurementBase: z.enum([
      'Per100g',
      'Per1g',
      'Per1kg',
      'Per1oz',
      'Per1lb',
      'PerServing',
      'PerCup',
      'PerTablespoon',
      'PerTeaspoon',
    ]),
  }),
});

export type FoodForm = z.infer<typeof foodSchema>;

export const emptyFoodForm: FoodForm = {
  name: '',
  brand: '',
  isGlobal: true,
  nutrition: {
    protein: 0,
    carbs: 0,
    fat: 0,
    sugar: 0,
    fiber: 0,
    sodium: 0,
    alcohol: 0,
    measurementBase: 'Per100g',
  },
};
