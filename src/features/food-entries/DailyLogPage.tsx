import { useMemo, useState } from 'react';
import { Group, Loader, Stack, Text, Title } from '@mantine/core';
import { DatePickerInput } from '@mantine/dates';
import { useDisclosure } from '@mantine/hooks';
import { MEALS } from '../../api/meals';
import { isoToDayKey, toDayKey } from '../../lib/date';
import { DailySummary, type Macros } from '../../components/DailySummary';
import { useAuth, useCurrentUserId } from '../auth/AuthContext';
import { useFoods } from '../foods/useFoods';
import { useDeleteEntry, useFoodEntries } from './useFoodEntries';
import { MealSection } from './MealSection';
import { AddEntryModal } from './AddEntryModal';

const ZERO_MACROS: Macros = { protein: 0, carbs: 0, fat: 0 };

export function DailyLogPage() {
  const userId = useCurrentUserId();
  const { user } = useAuth();
  // Mantine v8 date inputs use "YYYY-MM-DD" strings; keep the day as a string.
  const [dayKey, setDayKey] = useState<string>(() => toDayKey(new Date()));
  const [addMeal, setAddMeal] = useState<{ id: number; name: string } | null>(null);
  const [opened, { open, close }] = useDisclosure(false);

  const { data: entries, isLoading } = useFoodEntries(userId);
  const { data: foods } = useFoods();
  const deleteEntry = useDeleteEntry(userId);

  const foodById = useMemo(
    () => new Map((foods ?? []).map((f) => [f.foodId, f])),
    [foods],
  );

  // Local Date anchored at noon on the selected day (for entryDate on new entries).
  const day = useMemo(() => new Date(`${dayKey}T12:00:00`), [dayKey]);
  const dayEntries = useMemo(
    () => (entries ?? []).filter((e) => isoToDayKey(e.entryDate) === dayKey),
    [entries, dayKey],
  );

  // Consumed macros are derived by scaling each food's macros by the ratio of the
  // entry's (server-computed) calories to the food's calories — proportional, so it
  // holds regardless of the food's measurement base.
  const { totalCalories, macros } = useMemo(() => {
    let totalCalories = 0;
    const m: Macros = { ...ZERO_MACROS };
    for (const e of dayEntries) {
      totalCalories += e.calories;
      const food = foodById.get(e.foodId);
      const fc = food?.nutrition?.calories ?? 0;
      if (food?.nutrition && fc > 0) {
        const scale = e.calories / fc;
        m.protein += (food.nutrition.protein ?? 0) * scale;
        m.carbs += (food.nutrition.carbs ?? 0) * scale;
        m.fat += (food.nutrition.fat ?? 0) * scale;
      }
    }
    return { totalCalories, macros: m };
  }, [dayEntries, foodById]);

  const goal = user?.nutritionDailyGoal;
  const goalMacros: Macros | null = goal
    ? { protein: goal.protein ?? 0, carbs: goal.carbs ?? 0, fat: goal.fat ?? 0 }
    : null;

  function openAdd(id: number, name: string) {
    setAddMeal({ id, name });
    open();
  }

  return (
    <Stack>
      <Group justify="space-between">
        <Title order={3}>Daily Log</Title>
        <DatePickerInput
          value={dayKey}
          onChange={(v) => v && setDayKey(v)}
          maxDate={toDayKey(new Date())}
          valueFormat="ddd, MMM D"
          w={160}
        />
      </Group>

      <DailySummary
        consumedCalories={totalCalories}
        goalCalories={user?.dailyCalorieGoal ?? 0}
        macros={macros}
        goalMacros={goalMacros}
      />

      {isLoading && <Loader />}
      {!isLoading && dayEntries.length === 0 && (
        <Text c="dimmed" ta="center" mt="sm">
          Nothing logged for this day yet.
        </Text>
      )}

      {MEALS.map((meal) => {
        const mealEntries = dayEntries.filter((e) => e.mealId === meal.id);
        const subtotal = mealEntries.reduce((sum, e) => sum + e.calories, 0);
        return (
          <MealSection
            key={meal.id}
            mealName={meal.name}
            entries={mealEntries}
            subtotal={subtotal}
            onAdd={() => openAdd(meal.id, meal.name)}
            onDelete={(entry) => deleteEntry.mutate(entry)}
            deleting={deleteEntry.isPending}
          />
        );
      })}

      {addMeal && (
        <AddEntryModal
          opened={opened}
          onClose={close}
          userId={userId}
          mealId={addMeal.id}
          mealName={addMeal.name}
          day={day}
        />
      )}
    </Stack>
  );
}
