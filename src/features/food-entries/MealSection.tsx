import { Button, Card, Group, Stack, Text } from '@mantine/core';
import { DeleteButton } from '../../components/DeleteButton';
import type { FoodEntryResponse } from '../../api/types';

interface Props {
  mealName: string;
  entries: FoodEntryResponse[];
  subtotal: number;
  onAdd: () => void;
  onDelete: (entry: FoodEntryResponse) => void;
  deleting: boolean;
}

export function MealSection({ mealName, entries, subtotal, onAdd, onDelete, deleting }: Props) {
  return (
    <Card withBorder padding="sm">
      <Group justify="space-between" mb={entries.length ? 'xs' : 0}>
        <Text fw={600}>{mealName}</Text>
        <Text size="sm" c="dimmed">
          {Math.round(subtotal)} kcal
        </Text>
      </Group>

      <Stack gap={4}>
        {entries.map((entry) => (
          <Group key={entry.foodEntryId} justify="space-between" wrap="nowrap">
            <div style={{ minWidth: 0 }}>
              <Text size="sm" truncate>
                {entry.foodName}
              </Text>
              <Text size="xs" c="dimmed">
                {entry.quantity} {entry.unit} · {Math.round(entry.calories)} kcal
              </Text>
            </div>
            <DeleteButton
              onConfirm={() => onDelete(entry)}
              loading={deleting}
              label="Remove this entry?"
            />
          </Group>
        ))}
      </Stack>

      <Button variant="subtle" size="compact-sm" mt="xs" onClick={onAdd}>
        + Add food
      </Button>
    </Card>
  );
}
