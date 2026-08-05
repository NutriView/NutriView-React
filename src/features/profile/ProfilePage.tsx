import { Button, Card, Group, Stack, Text, Title } from '@mantine/core';
import { useNavigate } from 'react-router-dom';
import { useQueryClient } from '@tanstack/react-query';
import { useAuth } from '../auth/AuthContext';

export function ProfilePage() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  function handleLogout() {
    logout();
    queryClient.clear();
    navigate('/login', { replace: true });
  }

  return (
    <Stack>
      <Title order={3}>Profile</Title>
      <Card withBorder>
        <Stack gap="xs">
          <Group justify="space-between">
            <Text c="dimmed">Nickname</Text>
            <Text fw={500}>{user?.nickName}</Text>
          </Group>
          <Group justify="space-between">
            <Text c="dimmed">Email</Text>
            <Text fw={500}>{user?.email}</Text>
          </Group>
          <Group justify="space-between">
            <Text c="dimmed">Daily calorie goal</Text>
            <Text fw={500}>{user?.dailyCalorieGoal} kcal</Text>
          </Group>
        </Stack>
      </Card>
      <Button color="red" variant="light" onClick={handleLogout}>
        Log out
      </Button>
    </Stack>
  );
}
