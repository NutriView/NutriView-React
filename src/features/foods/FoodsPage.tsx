import { useMemo, useState } from 'react';
import {
  ActionIcon,
  Badge,
  Button,
  Card,
  Group,
  Loader,
  Stack,
  Text,
  TextInput,
  Title,
} from '@mantine/core';
import { useDisclosure } from '@mantine/hooks';
import { DeleteButton } from '../../components/DeleteButton';
import type { FoodResponse } from '../../api/types';
import { useDeleteFood, useFoods } from './useFoods';
import { FoodFormModal } from './FoodFormModal';

export function FoodsPage() {
  const { data: foods, isLoading, isError } = useFoods();
  const deleteFood = useDeleteFood();
  const [opened, { open, close }] = useDisclosure(false);
  const [editing, setEditing] = useState<FoodResponse | null>(null);
  const [search, setSearch] = useState('');

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    if (!q) return foods ?? [];
    return (foods ?? []).filter(
      (f) => f.name.toLowerCase().includes(q) || (f.brand ?? '').toLowerCase().includes(q),
    );
  }, [foods, search]);

  function openNew() {
    setEditing(null);
    open();
  }

  function openEdit(food: FoodResponse) {
    setEditing(food);
    open();
  }

  return (
    <Stack>
      <Group justify="space-between">
        <Title order={3}>Foods</Title>
        <Button onClick={openNew}>New food</Button>
      </Group>

      <TextInput
        placeholder="Search foods…"
        value={search}
        onChange={(e) => setSearch(e.currentTarget.value)}
      />

      {isLoading && <Loader />}
      {isError && <Text c="red">Could not load foods.</Text>}
      {!isLoading && filtered.length === 0 && <Text c="dimmed">No foods found.</Text>}

      <Stack gap="xs">
        {filtered.map((food) => (
          <Card key={food.foodId} withBorder padding="sm">
            <Group justify="space-between" wrap="nowrap">
              <div style={{ minWidth: 0 }}>
                <Group gap="xs">
                  <Text fw={500} truncate>
                    {food.name}
                  </Text>
                  {food.isGlobal && (
                    <Badge size="xs" variant="light">
                      Global
                    </Badge>
                  )}
                </Group>
                <Text size="sm" c="dimmed">
                  {food.brand ? `${food.brand} · ` : ''}
                  {Math.round(food.nutrition?.calories ?? 0)} kcal
                </Text>
              </div>
              <Group gap={4} wrap="nowrap">
                <ActionIcon variant="subtle" onClick={() => openEdit(food)} aria-label="Edit">
                  ✏️
                </ActionIcon>
                <DeleteButton
                  onConfirm={() => deleteFood.mutate(food)}
                  loading={deleteFood.isPending}
                  label={`Delete "${food.name}"?`}
                />
              </Group>
            </Group>
          </Card>
        ))}
      </Stack>

      <FoodFormModal opened={opened} onClose={close} food={editing} />
    </Stack>
  );
}
