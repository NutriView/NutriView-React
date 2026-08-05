// Mirrors NutritionService.CalculateCalories on the backend for a live preview.
// The server remains the source of truth; this is display-only.
export function estimateCalories(m: {
  protein: number;
  carbs: number;
  fat: number;
  fiber: number;
  alcohol: number;
}): number {
  const netCarbs = Math.max(0, m.carbs - m.fiber / 2);
  return m.protein * 4 + netCarbs * 4 + m.fat * 9 + m.alcohol * 7;
}
