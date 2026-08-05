// Meals are seeded fixed on the backend (no Meal controller): the client maps them.
export const MEALS = [
  { id: 1, name: 'Breakfast' },
  { id: 2, name: 'Lunch' },
  { id: 3, name: 'Dinner' },
  { id: 4, name: 'Snack' },
] as const;

export const MEAL_NAME: Record<number, string> = Object.fromEntries(
  MEALS.map((m) => [m.id, m.name]),
);

export const MEAL_SELECT_DATA = MEALS.map((m) => ({
  value: String(m.id),
  label: m.name,
}));
