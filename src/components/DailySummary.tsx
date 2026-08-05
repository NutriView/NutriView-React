import { Card, Group, Progress, RingProgress, Stack, Text } from '@mantine/core';

export interface Macros {
  protein: number;
  carbs: number;
  fat: number;
}

interface Props {
  consumedCalories: number;
  goalCalories: number;
  macros: Macros;
  goalMacros?: Macros | null;
}

const MACRO_META: { key: keyof Macros; label: string; color: string }[] = [
  { key: 'protein', label: 'Protein', color: 'teal' },
  { key: 'carbs', label: 'Carbs', color: 'blue' },
  { key: 'fat', label: 'Fat', color: 'yellow' },
];

export function DailySummary({ consumedCalories, goalCalories, macros, goalMacros }: Props) {
  const pct = goalCalories > 0 ? Math.min(100, (consumedCalories / goalCalories) * 100) : 0;
  const remaining = Math.round(goalCalories - consumedCalories);

  return (
    <Card withBorder padding="md">
      <Group align="center" wrap="nowrap">
        <RingProgress
          size={120}
          thickness={12}
          roundCaps
          sections={[{ value: pct, color: pct >= 100 ? 'red' : 'teal' }]}
          label={
            <Text ta="center" fw={700} size="lg">
              {Math.round(consumedCalories)}
            </Text>
          }
        />
        <Stack gap={4} style={{ flex: 1 }}>
          <Text size="sm" c="dimmed">
            {Math.round(consumedCalories)} / {goalCalories} kcal
          </Text>
          <Text size="sm" fw={500} c={remaining < 0 ? 'red' : undefined}>
            {remaining >= 0 ? `${remaining} kcal left` : `${-remaining} kcal over`}
          </Text>
          <Stack gap={6} mt={4}>
            {MACRO_META.map(({ key, label, color }) => {
              const value = Math.round(macros[key]);
              const target = goalMacros ? Math.round(goalMacros[key]) : null;
              const mpct = target && target > 0 ? Math.min(100, (value / target) * 100) : 0;
              return (
                <div key={key}>
                  <Group justify="space-between" gap={4}>
                    <Text size="xs" c="dimmed">
                      {label}
                    </Text>
                    <Text size="xs">
                      {value}
                      {target ? ` / ${target} g` : ' g'}
                    </Text>
                  </Group>
                  {target ? <Progress value={mpct} color={color} size="sm" /> : null}
                </div>
              );
            })}
          </Stack>
        </Stack>
      </Group>
    </Card>
  );
}
