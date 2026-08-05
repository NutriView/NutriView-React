// Reminder.TimeOfDay is a .NET TimeSpan serialized as "hh:mm:ss".
// Mantine's TimeInput works with "HH:mm".

/** "08:30:00" | "08:30" -> "08:30" */
export function timeSpanToInput(value: string): string {
  const [h = '00', m = '00'] = value.split(':');
  return `${h.padStart(2, '0')}:${m.padStart(2, '0')}`;
}

/** "08:30" -> "08:30:00" */
export function inputToTimeSpan(value: string): string {
  const [h = '00', m = '00'] = value.split(':');
  return `${h.padStart(2, '0')}:${m.padStart(2, '0')}:00`;
}
