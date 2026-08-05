import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { notifications } from '@mantine/notifications';
import type {
  ReminderCreateDTO,
  ReminderResponse,
  ReminderUpdateDTO,
} from '../../api/types';
import { ApiError } from '../../api/http';
import {
  createReminder,
  deleteReminder,
  getReminders,
  updateReminder,
} from './reminders.api';

export const remindersKey = (userId: string) => ['reminders', userId] as const;

export function useReminders(userId: string) {
  return useQuery({
    queryKey: remindersKey(userId),
    queryFn: () => getReminders(userId),
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

export function useCreateReminder(userId: string) {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (dto: ReminderCreateDTO) => createReminder(dto),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: remindersKey(userId) });
      notifications.show({ color: 'teal', message: 'Reminder created' });
    },
    onError: notifyError('Could not create reminder'),
  });
}

export function useUpdateReminder(userId: string) {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, dto }: { id: string; dto: ReminderUpdateDTO }) => updateReminder(id, dto),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: remindersKey(userId) });
      notifications.show({ color: 'teal', message: 'Reminder updated' });
    },
    onError: notifyError('Could not update reminder'),
  });
}

export function useDeleteReminder(userId: string) {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (reminder: ReminderResponse) => deleteReminder(reminder.reminderId),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: remindersKey(userId) });
      notifications.show({ color: 'teal', message: 'Reminder deleted' });
    },
    onError: notifyError('Could not delete reminder'),
  });
}
