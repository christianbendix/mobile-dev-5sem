/**
 * In-memory stand-in for the car and booking queries, satisfying the same
 * contract as src/api/backend, for demoing or developing without the server
 * (DATA_SOURCE = 'fixtures'). It holds no auth: login always hits the backend.
 *
 * Bookings created here live for the session only.
 */
import type { Booking, BookingsApi, Car, CarFilters, CarsApi, LocationsApi } from '../contract';
import { ApiError } from '../errors';
import { DEFAULT_RADIUS_KM, distanceKm } from '../geo';
import { rentalDays } from '../pricing';
import { FIXTURE_CARS, FIXTURE_LOCATIONS } from './data';

function matches(car: Car, filters: CarFilters): boolean {
  const query = filters.query?.trim().toLowerCase();
  if (query) {
    const haystack = `${car.name} ${car.vendorName} ${car.type}`.toLowerCase();
    if (!haystack.includes(query)) return false;
  }
  if (filters.maxPricePerDay !== undefined && car.pricePerDay > filters.maxPricePerDay) {
    return false;
  }
  const type = filters.type?.trim().toLowerCase();
  if (type && !car.type.toLowerCase().includes(type)) return false;
  if (filters.near) {
    if (!car.coordinates) return false;
    const radius = filters.radiusKm ?? DEFAULT_RADIUS_KM;
    if (distanceKm(car.coordinates, filters.near) >= radius) return false;
  }

  return true;
}

/** mirrors the backend's `sort: 'daily_price'`, so ordering is consistent */
function byPrice(cars: Car[]): Car[] {
  return [...cars].sort((a, b) => a.pricePerDay - b.pricePerDay);
}

export const fixtureCars: CarsApi = {
  async listHighlighted(limit = 3) {
    return byPrice(FIXTURE_CARS).slice(0, limit);
  },

  async search(filters) {
    return byPrice(FIXTURE_CARS.filter((car) => matches(car, filters)));
  },
};

export const fixtureLocations: LocationsApi = {
  async list() {
    return [...FIXTURE_LOCATIONS];
  },
};

const created: Booking[] = [];

export const fixtureBookings: BookingsApi = {
  async listForUser() {
    return [...created];
  },

  async create(input) {
    const car = FIXTURE_CARS.find((candidate) => candidate.id === input.carId);
    if (!car) {
      throw new ApiError('not-found', 'That car no longer exists.', 404);
    }

    const booking: Booking = {
      id: `fixture-booking-${created.length + 1}`,
      carId: car.id,
      carName: car.name,
      vendorName: car.vendorName,
      startDate: input.startDate,
      endDate: input.endDate,
      totalPrice: car.pricePerDay * rentalDays(input.startDate, input.endDate),
      status: 'active',
    };
    created.push(booking);
    return booking;
  },
};
