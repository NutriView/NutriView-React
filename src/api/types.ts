import type { components } from './schema';

// Request DTOs + enums come straight from the generated OpenAPI schema.
type Schemas = components['schemas'];

export type GenderEnum = Schemas['GenderEnum'];
export type MeasurementBaseEnum = Schemas['MeasurementBaseEnum'];

export type LoginDTO = Schemas['LoginDTO'];
export type UserCreateDTO = Schemas['UserCreateDTO'];
export type UserUpdateDTO = Schemas['UserUpdateDTO'];
export type FoodCreateDTO = Schemas['FoodCreateDTO'];
export type FoodUpdateDTO = Schemas['FoodUpdateDTO'];
export type FoodEntryCreateDTO = Schemas['FoodEntryCreateDTO'];
export type FoodEntryUpdateDTO = Schemas['FoodEntryUpdateDTO'];
export type ReminderCreateDTO = Schemas['ReminderCreateDTO'];
export type ReminderUpdateDTO = Schemas['ReminderUpdateDTO'];
export type NutritionValueDTO = Schemas['NutritionValueDTO'];

// Response DTOs are hand-authored: the API actions return IActionResult with no
// [ProducesResponseType], so the OpenAPI doc omits response bodies. These mirror
// the C# *ResponseDTO classes exactly. Regenerate/replace if the backend adds
// typed responses.
export interface UserResponse {
  userId: string;
  email: string;
  nickName: string;
  dailyCalorieGoal: number;
  weight?: number | null;
  height?: number | null;
  age?: number | null;
  createdAt: string;
  gender?: GenderEnum | null;
  image?: string | null;
  nutritionDailyGoal?: NutritionValueDTO | null;
}

export interface FoodResponse {
  foodId: string;
  name: string;
  brand?: string | null;
  isGlobal: boolean;
  nutrition?: NutritionValueDTO | null;
}

export interface FoodEntryResponse {
  foodEntryId: string;
  foodId: string;
  foodName: string;
  mealId: number;
  mealName: string;
  quantity: number;
  unit: string;
  calories: number;
  entryDate: string;
}

export interface ReminderResponse {
  reminderId: string;
  userId: string;
  mealId: number;
  mealName: string;
  timeOfDay: string;
  isActive: boolean;
}
