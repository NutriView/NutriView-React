import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useMutation } from '@tanstack/react-query';
import { Link, useNavigate } from 'react-router-dom';
import {
  Anchor,
  Button,
  Card,
  Center,
  PasswordInput,
  Stack,
  Text,
  TextInput,
  Title,
} from '@mantine/core';
import { notifications } from '@mantine/notifications';
import { login } from './auth.api';
import { useAuth } from './AuthContext';
import { loginSchema, type LoginForm } from './schemas';
import { ApiError } from '../../api/http';

export function LoginPage() {
  const navigate = useNavigate();
  const { setSession } = useAuth();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginForm>({ resolver: zodResolver(loginSchema) });

  const mutation = useMutation({
    mutationFn: login,
    onSuccess: (auth) => {
      setSession(auth);
      navigate('/', { replace: true });
    },
    onError: (error) => {
      notifications.show({
        color: 'red',
        title: 'Login failed',
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
              NutriView
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
            <Button type="submit" loading={mutation.isPending} fullWidth>
              Log in
            </Button>
            <Text size="sm" ta="center" c="dimmed">
              No account?{' '}
              <Anchor component={Link} to="/register">
                Register
              </Anchor>
            </Text>
          </Stack>
        </form>
      </Card>
    </Center>
  );
}
