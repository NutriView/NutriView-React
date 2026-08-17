import { useMemo } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Button, Group, Modal, Select, Stack, TextInput } from '@mantine/core';
import { NumberField } from '../../components/form/NumberField';
import { dayAtNoonIso } from '../../lib/date';
import { useFoods } from '../foods/useFoods';
import { useCreateEntry } from './useFoodEntries';
import { addEntrySchema, type AddEntryForm } from './schemas';

interface Props {
  opened: boolean;
  onClose: () => void;
  userId: string;
  mealId: number;
  mealName: string;
  day: Date;
}

export function AddEntryModal({ opened, onClose, userId, mealId, mealName, day }: Props) {
  const { data: foods } = useFoods();
  const createEntry = useCreateEntry(userId);

  const foodOptions = useMemo(
    () =>
      (foods ?? []).map((f) => ({
        value: f.foodId,
        label: f.brand ? `${f.name} (${f.brand})` : f.name,
      })),
    [foods],
  );

  const {
    control,
    handleSubmit,
    register,
    reset,
    formState: { errors },
  } = useForm<AddEntryForm>({
    resolver: zodResolver(addEntrySchema),
    defaultValues: { foodId: '', quantity: 100, unit: 'g' },
  });

  function close() {
    reset();
    onClose();
  }

  function onSubmit(values: AddEntryForm) {
    createEntry.mutate(
      {
        foodId: values.foodId,
        mealId,
        quantity: values.quantity,
        unit: values.unit,
        entryDate: dayAtNoonIso(day),
      },
      { onSuccess: close },
    );
  }

  return (
    <Modal opened={opened} onClose={close} title={`Add to ${mealName}`} centered>
      <form onSubmit={handleSubmit(onSubmit)}>
        <Stack>
          <Controller
            control={control}
            name="foodId"
            render={({ field }) => (
              <Select
                label="Food"
                placeholder="Search foods…"
                data={foodOptions}
                searchable
                value={field.value}
                onChange={(v) => field.onChange(v ?? '')}
                error={errors.foodId?.message}
                nothingFoundMessage="No foods — add one on the Foods tab"
              />
            )}
          />
          <Group grow align="flex-start">
            <NumberField
              control={control}
              name="quantity"
              label="Quantity"
              min={0}
              error={errors.quantity?.message}
            />
            <TextInput label="Unit" error={errors.unit?.message} {...register('unit')} />
          </Group>
          <Group justify="flex-end" mt="sm">
            <Button variant="default" onClick={close}>
              Cancel
            </Button>
            <Button type="submit" loading={createEntry.isPending}>
              Add
            </Button>
          </Group>
        </Stack>
      </form>
    </Modal>
  );
}
