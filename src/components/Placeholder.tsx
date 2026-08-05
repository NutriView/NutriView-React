import { Card, Stack, Text, Title } from '@mantine/core';

export function Placeholder({ title, note }: { title: string; note: string }) {
  return (
    <Stack>
      <Title order={3}>{title}</Title>
      <Card withBorder>
        <Text c="dimmed">{note}</Text>
      </Card>
    </Stack>
  );
}
