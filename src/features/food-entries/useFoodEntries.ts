import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { notifications } from '@mantine/notifications';
import type { FoodEntryCreateDTO, FoodEntryResponse } from '../../api/types';
import { ApiError } from '../../api/http';
import { createEntry, deleteEntry, getMyEntries } from './foodEntries.api';

// The API scopes entries to the token; userId only keeps caches apart per user.
export const foodEntriesKey = (userId: string) => ['foodEntries', userId] as const;

export function useFoodEntries(userId: string) {
  return useQuery({
    queryKey: foodEntriesKey(userId),
    queryFn: getMyEntries,
  });
}

function notifyError(fallback: string) {
  return (error: unknown) =>
    notifications.show({
      color: 'red',
      title: 'Error',
      message: error instanceof ApiError ? error.message : fallback,
    });
}

export function useCreateEntry(userId: string) {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (dto: FoodEntryCreateDTO) => createEntry(dto),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: foodEntriesKey(userId) });
      notifications.show({ color: 'teal', message: 'Entry added' });
    },
    onError: notifyError('Could not add entry'),
  });
}

export function useDeleteEntry(userId: string) {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (entry: FoodEntryResponse) => deleteEntry(entry.foodEntryId),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: foodEntriesKey(userId) });
      notifications.show({ color: 'teal', message: 'Entry removed' });
    },
    onError: notifyError('Could not remove entry'),
  });
}
