import { ApiError, rentalDays } from '../src/api';
import { toApiError } from '../src/api/errors';
import { fixtureBookings, fixtureCars } from '../src/api/fixtures';
import { FIXTURE_CARS } from '../src/api/fixtures/data';

describe('toApiError', () => {
  it('passes an ApiError straight through', () => {
    const original = new ApiError('invalid', 'nope', 400);

    expect(toApiError(original, 'fallback')).toBe(original);
  });

  it('reads a locked-down collection as forbidden and says so', () => {
    const error = toApiError({ status: 403 }, 'Could not load offers.');

    expect(error.kind).toBe('forbidden');
    expect(error.message).toContain('not readable');
  });

  it('reads a missing collection as not-found and says so', () => {
    const error = toApiError({ status: 404 }, 'Could not load bookings.');

    expect(error.kind).toBe('not-found');
    expect(error.message).toContain('does not exist');
  });

  it('treats a transport failure as offline', () => {
    const error = toApiError(new TypeError('Network request failed'), 'Search failed.');

    expect(error.kind).toBe('offline');
  });
});

describe('rentalDays', () => {
  it('counts whole days', () => {
    expect(rentalDays('2026-10-01', '2026-10-04')).toBe(3);
  });

  it('floors at a single day', () => {
    expect(rentalDays('2026-10-01', '2026-10-01')).toBe(1);
    expect(rentalDays('not-a-date', 'nope')).toBe(1);
  });
});

describe('fixture cars', () => {
  it('limits the highlighted offers', async () => {
    await expect(fixtureCars.listHighlighted(2)).resolves.toHaveLength(2);
  });

  it('matches the query against name, vendor and type', async () => {
    await expect(fixtureCars.search({ query: 'tesla' })).resolves.toEqual([
      expect.objectContaining({ name: 'Tesla Model 3' }),
    ]);
    await expect(fixtureCars.search({ query: 'europcar' })).resolves.toHaveLength(2);
  });

  it('applies the price ceiling', async () => {
    const results = await fixtureCars.search({ maxPricePerDay: 320 });

    expect(results.map((car) => car.pricePerDay)).toEqual([210, 320]);
  });

  it('returns everything for empty filters', async () => {
    await expect(fixtureCars.search({})).resolves.toHaveLength(FIXTURE_CARS.length);
  });
});

describe('fixture bookings', () => {
  it('prices a booking by day and lists it back', async () => {
    const car = FIXTURE_CARS[0];

    const booking = await fixtureBookings.create({
      carId: car.id,
      startDate: '2026-10-01',
      endDate: '2026-10-03',
      fullName: 'admin',
      phone: '12345678',
    });

    expect(booking.totalPrice).toBe(car.pricePerDay * 2);
    expect(booking.status).toBe('active');
    await expect(fixtureBookings.listForUser('user-1')).resolves.toContainEqual(booking);
  });

  it('rejects an unknown car', async () => {
    await expect(
      fixtureBookings.create({
        carId: 'nope',
        startDate: '2026-10-01',
        endDate: '2026-10-02',
        fullName: 'admin',
        phone: '12345678',
      }),
    ).rejects.toThrow(ApiError);
  });
});
