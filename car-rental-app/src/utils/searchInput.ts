/* ___ Search input helpers ___________________________
    Pure functions behind the search form: checking
    the typed driver age, and the date maths for the
    calendar (ISO dates, month grids, formatting).
   ____________________________________________________*/

export const MIN_DRIVER_AGE = 18;
export const MAX_DRIVER_AGE = 99;

/** A whole number of years within the allowed range, or null. */
export function parseDriverAge(text: string): number | null {
  const trimmed = text.trim();
  if (!/^\d+$/.test(trimmed)) return null;
  const age = Number(trimmed);
  return age >= MIN_DRIVER_AGE && age <= MAX_DRIVER_AGE ? age : null;
}

/** YYYY-MM-DD as a local date (new Date("YYYY-MM-DD") would be UTC midnight). */
function parseIsoDate(iso: string): Date {
  const [year, month, day] = iso.split('-').map(Number);
  return new Date(year, month - 1, day);
}

function toIsoDate(date: Date): string {
  const pad = (n: number) => String(n).padStart(2, '0');
  return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}`;
}

/** `from` + `offsetDays`, as YYYY-MM-DD. */
export function addDays(from: Date | string, offsetDays: number): string {
  const date = typeof from === 'string' ? parseIsoDate(from) : new Date(from);
  date.setDate(date.getDate() + offsetDays);
  return toIsoDate(date);
}

/** Whole days from `start` to `end` (both YYYY-MM-DD). */
export function daysBetween(start: string, end: string): number {
  const ms = parseIsoDate(end).getTime() - parseIsoDate(start).getTime();
  // round, so a daylight-saving change does not cost a day
  return Math.round(ms / 86_400_000);
}

/** fx "2026-10-02" -> "Fri 2 Oct" */
export function formatDay(iso: string): string {
  return parseIsoDate(iso).toLocaleDateString('en-GB', {
    weekday: 'short',
    day: 'numeric',
    month: 'short',
  });
}

export type CalendarMonth = {
  /** fx "October 2026" */
  title: string;
  /** Monday-first weeks of YYYY-MM-DD dates; null pads the first and last week */
  weeks: (string | null)[][];
};

/** `count` months, starting with the month `first` is in. */
export function calendarMonths(first: string, count: number): CalendarMonth[] {
  const start = parseIsoDate(first);

  return Array.from({ length: count }, (_, i) => {
    const monthStart = new Date(start.getFullYear(), start.getMonth() + i, 1);
    const daysInMonth = new Date(monthStart.getFullYear(), monthStart.getMonth() + 1, 0).getDate();
    // getDay() is Sunday = 0; shift so Monday is the first column
    const leading = (monthStart.getDay() + 6) % 7;

    const cells: (string | null)[] = Array(leading).fill(null);
    for (let day = 1; day <= daysInMonth; day++) {
      cells.push(toIsoDate(new Date(monthStart.getFullYear(), monthStart.getMonth(), day)));
    }
    while (cells.length % 7 !== 0) cells.push(null);

    const weeks = Array.from({ length: cells.length / 7 }, (_, w) => cells.slice(w * 7, w * 7 + 7));
    const title = monthStart.toLocaleDateString('en-GB', { month: 'long', year: 'numeric' });
    return { title, weeks };
  });
}

/** Every `stepMinutes` slot of a day as "HH:MM", fx "00:00", "00:30" … "23:30". */
export function timeSlots(stepMinutes = 30): string[] {
  const pad = (n: number) => String(n).padStart(2, '0');
  return Array.from({ length: (24 * 60) / stepMinutes }, (_, i) => {
    const minutes = i * stepMinutes;
    return `${pad(Math.floor(minutes / 60))}:${pad(minutes % 60)}`;
  });
}

/** A same-day rental that ends at or before it starts. "HH:MM" compares as a string. */
export function isReturnBeforePickup(
  pickupDate: string,
  pickupTime: string,
  returnDate: string,
  returnTime: string,
): boolean {
  return pickupDate === returnDate && returnTime <= pickupTime;
}
