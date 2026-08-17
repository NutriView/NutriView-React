import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { notifications } from '@mantine/notifications';
import type { NutritionValueDTO } from '../../api/types';
import { ApiError } from '../../api/http';
import { useRefreshUser } from '../auth/useRefreshUser';
import { getGoal, setGoal } from './goal.api';

// The API scopes the goal to the token; userId only keeps caches apart per user.
export const goalKey = (userId: string) => ['nutrition-goal', userId] as const;

export function useGoal(userId: string) {
  return useQuery({
    queryKey: goalKey(userId),
    queryFn: getGoal,
  });
}

export function useSetGoal(userId: string) {
  const qc = useQueryClient();
  const refreshUser = useRefreshUser();
  return useMutation({
    mutationFn: (dto: NutritionValueDTO) => setGoal(dto),
    onSuccess: async () => {
      qc.invalidateQueries({ queryKey: goalKey(userId) });
      // The goal also lives on the cached user (drives the Daily Log macro bars).
      await refreshUser();
      notifications.show({ color: 'teal', message: 'Goal saved' });
    },
    onError: (error: unknown) =>
      notifications.show({
        color: 'red',
        title: 'Error',
        message: error instanceof ApiError ? error.message : 'Could not save goal',
      }),
  });
}
