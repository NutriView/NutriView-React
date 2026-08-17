import { Controller, useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useMutation } from '@tanstack/react-query';
import { Link, useNavigate } from 'react-router-dom';
import {
  Anchor,
  Button,
  Card,
  Center,
  NumberInput,
  PasswordInput,
  Stack,
  Text,
  TextInput,
  Title,
} from '@mantine/core';
import { notifications } from '@mantine/notifications';
import { register as registerUser } from './auth.api';
import { useAuth } from './AuthContext';
import { registerSchema, type RegisterForm } from './schemas';
import { ApiError } from '../../api/http';

export function RegisterPage() {
  const navigate = useNavigate();
  const { setSession } = useAuth();
  const {
    register,
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<RegisterForm>({
    resolver: zodResolver(registerSchema),
    defaultValues: { dailyCalorieGoal: 2000 },
  });

  const mutation = useMutation({
    mutationFn: registerUser,
    onSuccess: (auth) => {
      setSession(auth);
      navigate('/', { replace: true });
    },
    onError: (error) => {
      notifications.show({
        color: 'red',
        title: 'Registration failed',
        message: error instanceof ApiError ? error.message : 'Something went wrong',
      });
    },
  });

  return (
    <Center mih="100dvh" p="md">
      <Card withBorder shadow="sm" w="100%" maw={400} padding="lg">
        <form onSubmit={handleSubmit((values) => mutation.mutate(values))}>
          <Stack>
            <Title order={2} ta="center">
              Create account
            </Title>
            <TextInput
              label="Email"
              placeholder="you@example.com"
              error={errors.email?.message}
              {...register('email')}
            />
            <PasswordInput
              label="Password"
              error={errors.password?.message}
              {...register('password')}
            />
            <TextInput
              label="Nickname"
              error={errors.nickName?.message}
              {...register('nickName')}
            />
            <Controller
              control={control}
              name="dailyCalorieGoal"
              render={({ field }) => (
                <NumberInput
                  label="Daily calorie goal"
                  min={0}
                  value={field.value}
                  onChange={(v) => field.onChange(typeof v === 'number' ? v : Number(v) || 0)}
                  onBlur={field.onBlur}
                  error={errors.dailyCalorieGoal?.message}
                />
              )}
            />
            <Button type="submit" loading={mutation.isPending} fullWidth>
              Register
            </Button>
            <Text size="sm" ta="center" c="dimmed">
              Already have an account?{' '}
              <Anchor component={Link} to="/login">
                Log in
              </Anchor>
            </Text>
          </Stack>
        </form>
      </Card>
    </Center>
  );
}
