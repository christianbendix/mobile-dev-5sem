import { ApiError, rentalDays } from '../src/api';
import { toBooking, toCar, type ListingRecord } from '../src/api/backend/records';
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

  it('keeps only providers that accept the driver age', async () => {
    // Avis takes 18+, Hertz and Sixt 21+, Europcar 24+
    const at20 = await fixtureCars.search({ driverAge: 20 });
    const at21 = await fixtureCars.search({ driverAge: 21 });

    expect(at20.map((car) => car.vendorName)).toEqual(['Avis']);
    expect(at21.map((car) => car.vendorName).sort()).toEqual(['Avis', 'Hertz', 'Sixt']);
    await expect(fixtureCars.search({ driverAge: 24 })).resolves.toHaveLength(FIXTURE_CARS.length);
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

const LISTING: ListingRecord = {
  id: 'cpnhdgsoi1qkjw4',
  brand_id: 'brand-1',
  vehicle_id: 'vehicle-1',
  location_id: 'location-1',
  daily_price: 1379,
  currency: 'DKK',
  expand: {
    vehicle_id: { id: 'vehicle-1', make: 'Tesla', model: 'Model 3', category: 'Luxury' },
    location_id: { id: 'location-1', name: 'Copenhagen Airport', city: 'Kastrup' },
    brand_id: { id: 'brand-1', name: 'Hertz' },
  },
};

describe('toCar', () => {
  it('maps a listing and its expanded relations', () => {
    expect(toCar(LISTING)).toEqual({
      id: 'cpnhdgsoi1qkjw4',
      name: 'Tesla Model 3',
      vendorName: 'Hertz',
      type: 'Luxury',
      pricePerDay: 1379,
      location: 'Copenhagen Airport',
    });
  });

  it("carries the provider's minimum driver age", () => {
    const withAge: ListingRecord = {
      ...LISTING,
      expand: { ...LISTING.expand, brand_id: { id: 'brand-1', name: 'Hertz', min_driver_age: 21 } },
    };

    expect(toCar(withAge).minDriverAge).toBe(21);
    expect(toCar(LISTING)).not.toHaveProperty('minDriverAge');
  });

  it('falls back when a relation is not viewable', () => {
    const car = toCar({ ...LISTING, expand: { vehicle_id: LISTING.expand?.vehicle_id } });

    expect(car.vendorName).toBe('Unknown vendor');
    expect(car.location).toBe('Unknown location');
  });
});

describe('toBooking', () => {
  const record = {
    id: 'booking-1',
    user_id: 'user-1',
    listing_id: LISTING.id,
    start_date: '2026-10-01 00:00:00.000Z',
    end_date: '2026-10-03 00:00:00.000Z',
    total_price: 2758,
    expand: { listing_id: LISTING },
  };

  it('trims PocketBase datetimes to ISO dates', () => {
    expect(toBooking(record, new Date('2026-09-30'))).toMatchObject({
      carId: LISTING.id,
      carName: 'Tesla Model 3',
      vendorName: 'Hertz',
      startDate: '2026-10-01',
      endDate: '2026-10-03',
      totalPrice: 2758,
    });
  });

  it('is active through the return date and completed after it', () => {
    expect(toBooking(record, new Date('2026-10-03T12:00:00Z')).status).toBe('active');
    expect(toBooking(record, new Date('2026-10-04T00:00:00Z')).status).toBe('completed');
  });
});
