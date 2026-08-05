import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import {
  Button,
  Group,
  Modal,
  Select,
  SimpleGrid,
  Stack,
  Switch,
  TextInput,
} from '@mantine/core';
import { NumberField } from '../../components/form/NumberField';
import { MEASUREMENT_BASE_SELECT_DATA } from '../../lib/enums';
import type { FoodResponse, MeasurementBaseEnum } from '../../api/types';
import { useCreateFood, useUpdateFood } from './useFoods';
import { emptyFoodForm, foodSchema, type FoodForm } from './schemas';

interface Props {
  opened: boolean;
  onClose: () => void;
  /** When set, the modal edits this food; otherwise it creates a new one. */
  food?: FoodResponse | null;
}

function toForm(food: FoodResponse): FoodForm {
  const n = food.nutrition;
  return {
    name: food.name,
    brand: food.brand ?? '',
    isGlobal: food.isGlobal,
    nutrition: {
      protein: n?.protein ?? 0,
      carbs: n?.carbs ?? 0,
      fat: n?.fat ?? 0,
      sugar: n?.sugar ?? 0,
      fiber: n?.fiber ?? 0,
      sodium: n?.sodium ?? 0,
      alcohol: n?.alcohol ?? 0,
      measurementBase: (n?.measurementBase ?? 'Per100g') as MeasurementBaseEnum,
    },
  };
}

export function FoodFormModal({ opened, onClose, food }: Props) {
  const createFood = useCreateFood();
  const updateFood = useUpdateFood();
  const editing = Boolean(food);

  const {
    register,
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<FoodForm>({
    resolver: zodResolver(foodSchema),
    values: food ? toForm(food) : emptyFoodForm,
  });

  function onSubmit(values: FoodForm) {
    const dto = { ...values, brand: values.brand || null };
    if (food) {
      updateFood.mutate({ id: food.foodId, dto }, { onSuccess: onClose });
    } else {
      createFood.mutate(dto, { onSuccess: onClose });
    }
  }

  const macros = [
    ['protein', 'Protein (g)'],
    ['carbs', 'Carbs (g)'],
    ['fat', 'Fat (g)'],
    ['sugar', 'Sugar (g)'],
    ['fiber', 'Fiber (g)'],
    ['sodium', 'Sodium (mg)'],
    ['alcohol', 'Alcohol (g)'],
  ] as const;

  return (
    <Modal opened={opened} onClose={onClose} title={editing ? 'Edit food' : 'New food'} centered>
      <form onSubmit={handleSubmit(onSubmit)}>
        <Stack>
          <TextInput label="Name" error={errors.name?.message} {...register('name')} />
          <TextInput label="Brand (optional)" {...register('brand')} />
          <Controller
            control={control}
            name="isGlobal"
            render={({ field }) => (
              <Switch
                label="Shared (global) food"
                checked={field.value}
                onChange={(e) => field.onChange(e.currentTarget.checked)}
              />
            )}
          />
          <Controller
            control={control}
            name="nutrition.measurementBase"
            render={({ field }) => (
              <Select
                label="Measured per"
                data={MEASUREMENT_BASE_SELECT_DATA}
                value={field.value}
                onChange={(v) => field.onChange(v)}
                allowDeselect={false}
              />
            )}
          />
          <SimpleGrid cols={2}>
            {macros.map(([key, label]) => (
              <NumberField
                key={key}
                control={control}
                name={`nutrition.${key}`}
                label={label}
                min={0}
                error={errors.nutrition?.[key]?.message}
              />
            ))}
          </SimpleGrid>
          <Group justify="flex-end" mt="sm">
            <Button variant="default" onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit" loading={createFood.isPending || updateFood.isPending}>
              {editing ? 'Save' : 'Create'}
            </Button>
          </Group>
        </Stack>
      </form>
    </Modal>
  );
}
