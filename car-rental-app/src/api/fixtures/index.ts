/**
 * In-memory stand-in for the car and booking queries, satisfying the same
 * contract as src/api/backend, for demoing or developing without the server
 * (DATA_SOURCE = 'fixtures'). It holds no auth: login always hits the backend.
 *
 * Bookings created here live for the session only.
 */
import type { Booking, BookingsApi, Car, CarFilters, CarsApi, LocationsApi } from '../contract';
import { ApiError } from '../errors';
import { filterOptionsFor } from '../filterOptions';
import { distanceKm, sortByDistance } from '../geo';
import { rentalDays } from '../pricing';
import { FIXTURE_CARS, FIXTURE_LOCATIONS } from './data';

function matches(car: Car, filters: CarFilters): boolean {
  const query = filters.query?.trim().toLowerCase();
  if (query) {
    const haystack = `${car.name} ${car.vendorName} ${car.type}`.toLowerCase();
    if (!haystack.includes(query)) return false;
  }
  const inList = (list: string[] | undefined, value: string) =>
    !list?.length || list.includes(value);
  if (!inList(filters.brands, car.make)) return false;
  if (!inList(filters.vendors, car.vendorName)) return false;
  if (!inList(filters.carTypes, car.type)) return false;
  if (filters.transmission && car.transmission !== filters.transmission) return false;
  if (filters.minPricePerDay !== undefined && car.pricePerDay < filters.minPricePerDay) {
    return false;
  }
  if (filters.maxPricePerDay !== undefined && car.pricePerDay > filters.maxPricePerDay) {
    return false;
  }
  if (filters.driverAge !== undefined && (car.minDriverAge ?? 0) > filters.driverAge) {
    return false;
  }
  if (filters.near && filters.radiusKm !== undefined) {
    if (!car.coordinates) return false;
    if (distanceKm(car.coordinates, filters.near) >= filters.radiusKm) return false;
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
    const cars = byPrice(FIXTURE_CARS.filter((car) => matches(car, filters)));
    return filters.near ? sortByDistance(cars, filters.near) : cars;
  },

  async filterOptions() {
    return filterOptionsFor(FIXTURE_CARS);
  },

  async getById(id) {
    const car = FIXTURE_CARS.find((candidate) => candidate.id === id);
    if (!car) {
      throw new ApiError('not-found', 'That car no longer exists.', 404);
    }
    // fixtures carry no specs or uploaded files, so only the basics are filled
    return { ...car, provider: { name: car.vendorName } };
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
