import { useState } from 'react';
import {
  ActionIcon,
  Badge,
  Button,
  Card,
  Group,
  Loader,
  Stack,
  Text,
  Title,
} from '@mantine/core';
import { useDisclosure } from '@mantine/hooks';
import { DeleteButton } from '../../components/DeleteButton';
import { timeSpanToInput } from '../../lib/timespan';
import type { ReminderResponse } from '../../api/types';
import { useCurrentUserId } from '../auth/AuthContext';
import { useDeleteReminder, useReminders } from './useReminders';
import { ReminderFormModal } from './ReminderFormModal';

export function RemindersPage() {
  const userId = useCurrentUserId();
  const { data: reminders, isLoading, isError } = useReminders(userId);
  const deleteReminder = useDeleteReminder(userId);
  const [opened, { open, close }] = useDisclosure(false);
  const [editing, setEditing] = useState<ReminderResponse | null>(null);

  function openNew() {
    setEditing(null);
    open();
  }

  function openEdit(reminder: ReminderResponse) {
    setEditing(reminder);
    open();
  }

  return (
    <Stack>
      <Group justify="space-between">
        <Title order={3}>Reminders</Title>
        <Button onClick={openNew}>New reminder</Button>
      </Group>

      {isLoading && <Loader />}
      {isError && <Text c="red">Could not load reminders.</Text>}
      {!isLoading && (reminders ?? []).length === 0 && (
        <Text c="dimmed">No reminders yet.</Text>
      )}

      <Stack gap="xs">
        {(reminders ?? []).map((reminder) => (
          <Card key={reminder.reminderId} withBorder padding="sm">
            <Group justify="space-between" wrap="nowrap">
              <Group gap="sm">
                <Text fw={600}>{timeSpanToInput(reminder.timeOfDay)}</Text>
                <Text>{reminder.mealName}</Text>
                <Badge color={reminder.isActive ? 'teal' : 'gray'} variant="light">
                  {reminder.isActive ? 'Active' : 'Off'}
                </Badge>
              </Group>
              <Group gap={4} wrap="nowrap">
                <ActionIcon variant="subtle" onClick={() => openEdit(reminder)} aria-label="Edit">
                  ✏️
                </ActionIcon>
                <DeleteButton
                  onConfirm={() => deleteReminder.mutate(reminder)}
                  loading={deleteReminder.isPending}
                  label="Delete this reminder?"
                />
              </Group>
            </Group>
          </Card>
        ))}
      </Stack>

      <ReminderFormModal opened={opened} onClose={close} userId={userId} reminder={editing} />
    </Stack>
  );
}
