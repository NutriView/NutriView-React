import { Controller, useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import {
  Button,
  Card,
  Divider,
  Group,
  Select,
  SimpleGrid,
  Stack,
  Text,
  TextInput,
  Title,
} from '@mantine/core';
import { useNavigate } from 'react-router-dom';
import { useQueryClient } from '@tanstack/react-query';
import { NumberField } from '../../components/form/NumberField';
import { GENDER_SELECT_DATA } from '../../lib/enums';
import type { GenderEnum } from '../../api/types';
import { useAuth } from '../auth/AuthContext';
import { useUpdateProfile } from './useProfile';
import { profileSchema, type ProfileForm } from './schemas';

export function ProfilePage() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const updateProfile = useUpdateProfile();

  const {
    control,
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ProfileForm>({
    resolver: zodResolver(profileSchema),
    values: {
      nickName: user?.nickName ?? '',
      dailyCalorieGoal: user?.dailyCalorieGoal ?? 0,
      weight: user?.weight ?? 0,
      height: user?.height ?? 0,
      age: user?.age ?? 0,
      gender: user?.gender ?? null,
    },
  });

  function handleLogout() {
    logout();
    queryClient.clear();
    navigate('/login', { replace: true });
  }

  function onSubmit(values: ProfileForm) {
    updateProfile.mutate({
      ...values,
      // The update DTO's gender is optional-not-nullable; omit it to clear.
      gender: values.gender ?? undefined,
      image: user?.image ?? null,
    });
  }

  return (
    <Stack>
      <Title order={3}>Profile</Title>

      <Card withBorder>
        <form onSubmit={handleSubmit(onSubmit)}>
          <Stack>
            <Group justify="space-between">
              <Text c="dimmed">Email</Text>
              <Text fw={500}>{user?.email}</Text>
            </Group>
            <Divider />
            <TextInput label="Nickname" error={errors.nickName?.message} {...register('nickName')} />
            <NumberField
              control={control}
              name="dailyCalorieGoal"
              label="Daily calorie goal"
              min={0}
              error={errors.dailyCalorieGoal?.message}
            />
            <SimpleGrid cols={{ base: 2, sm: 3 }}>
              <NumberField control={control} name="weight" label="Weight (kg)" min={0} />
              <NumberField control={control} name="height" label="Height (cm)" min={0} />
              <NumberField control={control} name="age" label="Age" min={0} />
            </SimpleGrid>
            <Controller
              control={control}
              name="gender"
              render={({ field }) => (
                <Select
                  label="Gender"
                  data={GENDER_SELECT_DATA}
                  value={field.value}
                  onChange={(v) => field.onChange((v as GenderEnum | null) ?? null)}
                  clearable
                />
              )}
            />
            <Button type="submit" loading={updateProfile.isPending}>
              Save profile
            </Button>
          </Stack>
        </form>
      </Card>

      <Button color="red" variant="light" onClick={handleLogout}>
        Log out
      </Button>
    </Stack>
  );
}
