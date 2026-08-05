// Backend DateTimes are ISO-8601 UTC strings. Food entries are logged/filtered by
// calendar day; we key days by their local YYYY-MM-DD.

export function toDayKey(date: Date): string {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, '0');
  const d = String(date.getDate()).padStart(2, '0');
  return `${y}-${m}-${d}`;
}

/** Day key of an ISO timestamp, interpreted in the viewer's local time zone. */
export function isoToDayKey(iso: string): string {
  return toDayKey(new Date(iso));
}

export function formatDayLabel(date: Date): string {
  return date.toLocaleDateString(undefined, {
    weekday: 'short',
    month: 'short',
    day: 'numeric',
  });
}

/** ISO timestamp for a day anchored at local noon (avoids day-shift across time zones). */
export function dayAtNoonIso(date: Date): string {
  const noon = new Date(date.getFullYear(), date.getMonth(), date.getDate(), 12, 0, 0);
  return noon.toISOString();
}
