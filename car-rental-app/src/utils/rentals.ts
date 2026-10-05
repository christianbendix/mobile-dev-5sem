/* ___ Rental helpers _________________________________
    Pure functions behind the My Rentals page: how a
    rental period reads, what the status pill says,
    the order of the lists, and the link that opens
    directions to where the car is picked up.
   ____________________________________________________*/

import type { Booking, Car } from '../api';
import { addDays, daysBetween } from './searchInput';

const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

function parts(iso: string) {
  const [year, month, day] = iso.split('-').map(Number);
  return { year, month: MONTHS[month - 1], day };
}

/**
 * fx "14 – 17 Oct", "30 Sep – 2 Oct", or with `withYear` "14 – 17 Aug 2026".
 * Both ends get a year when the rental runs into the next year.
 */
export function formatDateRange(start: string, end: string, withYear = false): string {
  const a = parts(start);
  const b = parts(end);
  const sameYear = a.year === b.year;
  const endText = `${b.day} ${b.month}${withYear || !sameYear ? ` ${b.year}` : ''}`;

  if (sameYear && a.month === b.month) return `${a.day} – ${endText}`;
  return `${a.day} ${a.month}${sameYear ? '' : ` ${a.year}`} – ${endText}`;
}

/** The pill on an upcoming rental: "Active now" or "Confirmed · in 3 days". */
export function rentalStatusLabel(booking: Booking, today: string): string {
  const days = daysBetween(today, booking.startDate);
  if (days <= 0) return 'Active now';
  if (days === 1) return 'Confirmed · starts tomorrow';
  return `Confirmed · in ${days} days`;
}

/** Upcoming soonest first, past most recent first. */
export function splitRentals(bookings: Booking[]): { upcoming: Booking[]; past: Booking[] } {
  const upcoming = bookings
    .filter((b) => b.status === 'active')
    .sort((a, b) => a.startDate.localeCompare(b.startDate));
  const past = bookings
    .filter((b) => b.status === 'completed')
    .sort((a, b) => b.startDate.localeCompare(a.startDate));
  return { upcoming, past };
}

/** Google Maps directions to the pickup: the coordinates, or else the location's name. */
export function directionsUrl(car: Car): string {
  const destination = car.coordinates
    ? `${car.coordinates.lat},${car.coordinates.lon}`
    : car.location;
  return `https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(destination)}`;
}

/** Today as YYYY-MM-DD in local time. */
export function todayIso(): string {
  return addDays(new Date(), 0);
}
