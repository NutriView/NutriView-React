import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { notifications } from '@mantine/notifications';
import type { FoodCreateDTO, FoodResponse, FoodUpdateDTO } from '../../api/types';
import { ApiError } from '../../api/http';
import { createFood, deleteFood, getFoods, updateFood } from './foods.api';

export const foodsKey = ['foods'] as const;

export function useFoods() {
  return useQuery({ queryKey: foodsKey, queryFn: getFoods });
}

function notifyError(fallback: string) {
  return (error: unknown) =>
    notifications.show({
      color: 'red',
      title: 'Error',
      message: error instanceof ApiError ? error.message : fallback,
    });
}

export function useCreateFood() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (dto: FoodCreateDTO) => createFood(dto),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: foodsKey });
      notifications.show({ color: 'teal', message: 'Food created' });
    },
    onError: notifyError('Could not create food'),
  });
}

export function useUpdateFood() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, dto }: { id: string; dto: FoodUpdateDTO }) => updateFood(id, dto),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: foodsKey });
      notifications.show({ color: 'teal', message: 'Food updated' });
    },
    onError: notifyError('Could not update food'),
  });
}

export function useDeleteFood() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (food: FoodResponse) => deleteFood(food.foodId),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: foodsKey });
      notifications.show({ color: 'teal', message: 'Food deleted' });
    },
    onError: notifyError('Could not delete food'),
  });
}
