import { useMutation } from '@tanstack/react-query';
import { notifications } from '@mantine/notifications';
import type { UserUpdateDTO } from '../../api/types';
import { ApiError } from '../../api/http';
import { useCurrentUserId } from '../auth/AuthContext';
import { useRefreshUser } from '../auth/useRefreshUser';
import { updateUser } from './profile.api';

export function useUpdateProfile() {
  const userId = useCurrentUserId();
  const refreshUser = useRefreshUser();
  return useMutation({
    mutationFn: (dto: UserUpdateDTO) => updateUser(userId, dto),
    onSuccess: async () => {
      await refreshUser();
      notifications.show({ color: 'teal', message: 'Profile saved' });
    },
    onError: (error: unknown) =>
      notifications.show({
        color: 'red',
        title: 'Error',
        message: error instanceof ApiError ? error.message : 'Could not save profile',
      }),
  });
}
