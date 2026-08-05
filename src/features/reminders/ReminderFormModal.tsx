import { Controller, useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Button, Group, Modal, Select, Stack, Switch } from '@mantine/core';
import { TimeInput } from '@mantine/dates';
import { MEAL_SELECT_DATA } from '../../api/meals';
import { inputToTimeSpan, timeSpanToInput } from '../../lib/timespan';
import type { ReminderResponse } from '../../api/types';
import { useCreateReminder, useUpdateReminder } from './useReminders';
import { reminderSchema, type ReminderForm } from './schemas';

interface Props {
  opened: boolean;
  onClose: () => void;
  userId: string;
  reminder?: ReminderResponse | null;
}

export function ReminderFormModal({ opened, onClose, userId, reminder }: Props) {
  const createReminder = useCreateReminder(userId);
  const updateReminder = useUpdateReminder(userId);
  const editing = Boolean(reminder);

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<ReminderForm>({
    resolver: zodResolver(reminderSchema),
    values: reminder
      ? {
          mealId: reminder.mealId,
          timeOfDay: timeSpanToInput(reminder.timeOfDay),
          isActive: reminder.isActive,
        }
      : { mealId: 1, timeOfDay: '08:00', isActive: true },
  });

  function onSubmit(values: ReminderForm) {
    const timeOfDay = inputToTimeSpan(values.timeOfDay);
    if (reminder) {
      updateReminder.mutate(
        { id: reminder.reminderId, dto: { mealId: values.mealId, timeOfDay, isActive: values.isActive } },
        { onSuccess: onClose },
      );
    } else {
      createReminder.mutate(
        { userId, mealId: values.mealId, timeOfDay, isActive: values.isActive },
        { onSuccess: onClose },
      );
    }
  }

  return (
    <Modal opened={opened} onClose={onClose} title={editing ? 'Edit reminder' : 'New reminder'} centered>
      <form onSubmit={handleSubmit(onSubmit)}>
        <Stack>
          <Controller
            control={control}
            name="mealId"
            render={({ field }) => (
              <Select
                label="Meal"
                data={MEAL_SELECT_DATA}
                value={String(field.value)}
                onChange={(v) => field.onChange(Number(v))}
                allowDeselect={false}
                error={errors.mealId?.message}
              />
            )}
          />
          <Controller
            control={control}
            name="timeOfDay"
            render={({ field }) => (
              <TimeInput
                label="Time"
                value={field.value}
                onChange={(e) => field.onChange(e.currentTarget.value)}
                error={errors.timeOfDay?.message}
              />
            )}
          />
          <Controller
            control={control}
            name="isActive"
            render={({ field }) => (
              <Switch
                label="Active"
                checked={field.value}
                onChange={(e) => field.onChange(e.currentTarget.checked)}
              />
            )}
          />
          <Group justify="flex-end" mt="sm">
            <Button variant="default" onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit" loading={createReminder.isPending || updateReminder.isPending}>
              {editing ? 'Save' : 'Create'}
            </Button>
          </Group>
        </Stack>
      </form>
    </Modal>
  );
}
