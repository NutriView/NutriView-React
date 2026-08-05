import { NumberInput } from '@mantine/core';
import type { NumberInputProps } from '@mantine/core';
import { Controller } from 'react-hook-form';
import type { Control, FieldPath, FieldValues } from 'react-hook-form';

interface NumberFieldProps<T extends FieldValues>
  extends Omit<NumberInputProps, 'value' | 'onChange' | 'onBlur' | 'error' | 'name'> {
  control: Control<T>;
  name: FieldPath<T>;
  error?: string;
}

/** RHF-controlled Mantine NumberInput — coerces the value to a number. */
export function NumberField<T extends FieldValues>({
  control,
  name,
  error,
  ...props
}: NumberFieldProps<T>) {
  return (
    <Controller
      control={control}
      name={name}
      render={({ field }) => (
        <NumberInput
          {...props}
          value={field.value as number}
          onChange={(v) => field.onChange(typeof v === 'number' ? v : Number(v) || 0)}
          onBlur={field.onBlur}
          error={error}
        />
      )}
    />
  );
}
