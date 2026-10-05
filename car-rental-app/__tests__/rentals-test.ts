import type { Booking, Car } from '../src/api';
import {
  directionsUrl,
  formatDateRange,
  rentalStatusLabel,
  splitRentals,
} from '../src/utils/rentals';

function booking(overrides: Partial<Booking>): Booking {
  return {
    id: 'b',
    carId: 'c',
    carName: 'Car',
    vendorName: 'Hertz',
    startDate: '2026-10-14',
    endDate: '2026-10-17',
    totalPrice: 1000,
    status: 'active',
    ...overrides,
  };
}

describe('formatDateRange', () => {
  it('shortens a range within one month', () => {
    expect(formatDateRange('2026-10-14', '2026-10-17')).toBe('14 – 17 Oct');
    expect(formatDateRange('2026-08-14', '2026-08-17', true)).toBe('14 – 17 Aug 2026');
  });

  it('names both months across a month, and both years across a year', () => {
    expect(formatDateRange('2026-09-30', '2026-10-02')).toBe('30 Sep – 2 Oct');
    expect(formatDateRange('2026-12-30', '2027-01-02')).toBe('30 Dec 2026 – 2 Jan 2027');
  });
});

describe('rentalStatusLabel', () => {
  it('counts the days to pick-up, and says when the rental has started', () => {
    expect(rentalStatusLabel(booking({ startDate: '2026-10-14' }), '2026-10-01')).toBe(
      'Confirmed · in 13 days',
    );
    expect(rentalStatusLabel(booking({ startDate: '2026-10-02' }), '2026-10-01')).toBe(
      'Confirmed · starts tomorrow',
    );
    expect(rentalStatusLabel(booking({ startDate: '2026-09-30' }), '2026-10-01')).toBe(
      'Active now',
    );
  });
});

describe('splitRentals', () => {
  it('lists upcoming soonest first and past most recent first', () => {
    const { upcoming, past } = splitRentals([
      booking({ id: 'later', startDate: '2026-11-01' }),
      booking({ id: 'old', startDate: '2026-05-01', status: 'completed' }),
      booking({ id: 'soon', startDate: '2026-10-05' }),
      booking({ id: 'recent', startDate: '2026-08-01', status: 'completed' }),
    ]);

    expect(upcoming.map((b) => b.id)).toEqual(['soon', 'later']);
    expect(past.map((b) => b.id)).toEqual(['recent', 'old']);
  });
});

describe('directionsUrl', () => {
  const car = { location: 'Aarhus C' } as Car;

  it('points at the coordinates when there are some, else at the name', () => {
    expect(directionsUrl({ ...car, coordinates: { lat: 56.15, lon: 10.2 } })).toBe(
      'https://www.google.com/maps/dir/?api=1&destination=56.15%2C10.2',
    );
    expect(directionsUrl(car)).toBe(
      'https://www.google.com/maps/dir/?api=1&destination=Aarhus%20C',
    );
  });
});
