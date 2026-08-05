import type { GenderEnum, MeasurementBaseEnum } from '../api/types';

export const GENDER_SELECT_DATA: { value: GenderEnum; label: string }[] = [
  { value: 'Male', label: 'Male' },
  { value: 'Female', label: 'Female' },
  { value: 'NonBinary', label: 'Non-binary' },
];

export const MEASUREMENT_BASE_SELECT_DATA: { value: MeasurementBaseEnum; label: string }[] = [
  { value: 'Per100g', label: 'Per 100 g' },
  { value: 'Per1g', label: 'Per 1 g' },
  { value: 'Per1kg', label: 'Per 1 kg' },
  { value: 'Per1oz', label: 'Per 1 oz' },
  { value: 'Per1lb', label: 'Per 1 lb' },
  { value: 'PerServing', label: 'Per serving' },
  { value: 'PerCup', label: 'Per cup' },
  { value: 'PerTablespoon', label: 'Per tablespoon' },
  { value: 'PerTeaspoon', label: 'Per teaspoon' },
];
