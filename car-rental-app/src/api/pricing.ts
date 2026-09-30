import type { Car } from './contract';

/** Whole days between two ISO dates, floored at one. */
export function rentalDays(startDate: string, endDate: string): number {
  const start = Date.parse(startDate);
  const end = Date.parse(endDate);
  if (Number.isNaN(start) || Number.isNaN(end)) return 1;

  const days = Math.ceil((end - start) / (1000 * 60 * 60 * 24));
  return Math.max(days, 1);
}

/**
 * Client-side estimate, for showing a total before the user commits. The
 * booking's real price is whatever the backend returns from bookings.create().
 */
export function estimateTotal(car: Car, startDate: string, endDate: string): number {
  return car.pricePerDay * rentalDays(startDate, endDate);
}
