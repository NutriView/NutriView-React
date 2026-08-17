import { ApiError, http } from '../../api/http';
import type { NutritionValueDTO } from '../../api/types';

/** Returns null when the user has no goal set (API responds 404). */
export async function getGoal(): Promise<NutritionValueDTO | null> {
  try {
    return await http.get<NutritionValueDTO>('/User/me/nutrition-goal');
  } catch (e) {
    if (e instanceof ApiError && e.status === 404) return null;
    throw e;
  }
}

export function setGoal(dto: NutritionValueDTO): Promise<void> {
  return http.put<void>('/User/me/nutrition-goal', dto);
}
