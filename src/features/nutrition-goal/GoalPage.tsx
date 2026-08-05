import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Button, Card, Group, Loader, SimpleGrid, Stack, Text, Title } from '@mantine/core';
import { NumberField } from '../../components/form/NumberField';
import { estimateCalories } from '../../lib/nutrition';
import { useCurrentUserId } from '../auth/AuthContext';
import { useGoal, useSetGoal } from './useGoal';
import { emptyGoalForm, goalSchema, type GoalForm } from './schemas';

const FIELDS = [
  ['protein', 'Protein (g)'],
  ['carbs', 'Carbs (g)'],
  ['fat', 'Fat (g)'],
  ['sugar', 'Sugar (g)'],
  ['fiber', 'Fiber (g)'],
  ['sodium', 'Sodium (mg)'],
  ['alcohol', 'Alcohol (g)'],
] as const;

export function GoalPage() {
  const userId = useCurrentUserId();
  const { data: goal, isLoading } = useGoal(userId);
  const setGoal = useSetGoal(userId);

  const {
    control,
    handleSubmit,
    reset,
    watch,
    formState: { errors },
  } = useForm<GoalForm>({ resolver: zodResolver(goalSchema), defaultValues: emptyGoalForm });

  // Populate the form once the goal loads.
  useEffect(() => {
    if (goal) {
      reset({
        protein: goal.protein ?? 0,
        carbs: goal.carbs ?? 0,
        fat: goal.fat ?? 0,
        sugar: goal.sugar ?? 0,
        fiber: goal.fiber ?? 0,
        sodium: goal.sodium ?? 0,
        alcohol: goal.alcohol ?? 0,
      });
    }
  }, [goal, reset]);

  const preview = Math.round(estimateCalories(watch()));

  function onSubmit(values: GoalForm) {
    // measurementBase is irrelevant for a daily total; calories are computed server-side.
    setGoal.mutate({ ...values, measurementBase: 'Per100g' });
  }

  if (isLoading) return <Loader />;

  return (
    <Stack>
      <Title order={3}>Daily Nutrition Goal</Title>
      {!goal && <Text c="dimmed">No goal set yet — fill this in to track your macros.</Text>}

      <Card withBorder>
        <form onSubmit={handleSubmit(onSubmit)}>
          <Stack>
            <SimpleGrid cols={2}>
              {FIELDS.map(([key, label]) => (
                <NumberField
                  key={key}
                  control={control}
                  name={key}
                  label={label}
                  min={0}
                  error={errors[key]?.message}
                />
              ))}
            </SimpleGrid>
            <Group justify="space-between" mt="sm">
              <Text size="sm" c="dimmed">
                ≈ {preview} kcal / day
              </Text>
              <Button type="submit" loading={setGoal.isPending}>
                Save goal
              </Button>
            </Group>
          </Stack>
        </form>
      </Card>
    </Stack>
  );
}
