import { ActionIcon, Button, Group, Popover, Text } from '@mantine/core';
import { useDisclosure } from '@mantine/hooks';

interface Props {
  onConfirm: () => void;
  loading?: boolean;
  label?: string;
}

/** Trash button with an inline "Delete?" confirmation popover. */
export function DeleteButton({ onConfirm, loading, label = 'Delete this item?' }: Props) {
  const [opened, { open, close }] = useDisclosure(false);

  return (
    <Popover opened={opened} onClose={close} position="bottom-end" withArrow shadow="md">
      <Popover.Target>
        <ActionIcon variant="subtle" color="red" onClick={open} aria-label="Delete">
          🗑️
        </ActionIcon>
      </Popover.Target>
      <Popover.Dropdown>
        <Text size="sm" mb="xs">
          {label}
        </Text>
        <Group justify="flex-end" gap="xs">
          <Button size="xs" variant="default" onClick={close}>
            Cancel
          </Button>
          <Button
            size="xs"
            color="red"
            loading={loading}
            onClick={() => {
              onConfirm();
              close();
            }}
          >
            Delete
          </Button>
        </Group>
      </Popover.Dropdown>
    </Popover>
  );
}
