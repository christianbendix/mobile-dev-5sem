import { pb } from '../client';
import { COLLECTIONS } from '../config';
import type { CarFilters, CarsApi } from '../contract';
import { toApiError } from '../errors';
import { filterOptionsFor } from '../filterOptions';
import { sortByDistance } from '../geo';
import { fileUrl } from './files';
import { LISTING_EXPAND, toCar, toCarDetails, type ListingRecord } from './records';

/** `field = a || field = b ...` for a non-empty list, escaped by pb.filter(). */
function anyOf(field: string, values: string[] | undefined): string | null {
  if (!values?.length) return null;
  const params = Object.fromEntries(values.map((value, i) => [`v${i}`, value]));
  const clauses = values.map((_, i) => `${field} = {:v${i}}`);
  return pb.filter(`(${clauses.join(' || ')})`, params);
}

/** pb.filter() escapes the values, so user input is safe to interpolate. */
export function buildFilter(filters: CarFilters): string {
  const parts: string[] = [];

  if (filters.query?.trim()) {
    parts.push(
      pb.filter(
        '(vehicle_id.make ~ {:q} || vehicle_id.model ~ {:q} || vehicle_id.category ~ {:q} || brand_id.name ~ {:q})',
        { q: filters.query.trim() },
      ),
    );
  }
  for (const clause of [
    anyOf('vehicle_id.make', filters.brands),
    anyOf('brand_id.name', filters.vendors),
    anyOf('vehicle_id.category', filters.carTypes),
  ]) {
    if (clause) parts.push(clause);
  }
  if (filters.transmission) {
    parts.push(
      pb.filter('vehicle_id.automatic = {:auto}', {
        auto: filters.transmission === 'automatic',
      }),
    );
  }
  if (filters.minPricePerDay !== undefined) {
    parts.push(pb.filter('daily_price >= {:min}', { min: filters.minPricePerDay }));
  }
  if (filters.maxPricePerDay !== undefined) {
    parts.push(pb.filter('daily_price <= {:max}', { max: filters.maxPricePerDay }));
  }
  if (filters.driverAge !== undefined) {
    parts.push(pb.filter('brand_id.min_driver_age <= {:age}', { age: filters.driverAge }));
  }
  if (filters.near && filters.radiusKm !== undefined) {
    // geoDistance takes lon before lat, and returns km
    parts.push(
      pb.filter(
        'geoDistance(location_id.geo_point.lon, location_id.geo_point.lat, {:lon}, {:lat}) < {:radius}',
        {
          lon: filters.near.lon,
          lat: filters.near.lat,
          radius: filters.radiusKm,
        },
      ),
    );
  }

  return parts.join(' && ');
}

export const backendCars: CarsApi = {
  async listHighlighted(limit = 3) {
    try {
      const result = await pb.collection(COLLECTIONS.listings).getList<ListingRecord>(1, limit, {
        expand: LISTING_EXPAND,
        sort: 'daily_price',
        requestKey: 'cars-highlighted',
      });
      return result.items.map((record) => toCar(record, fileUrl));
    } catch (cause) {
      throw toApiError(cause, 'Could not load offers.');
    }
  },

  async search(filters) {
    try {
      const records = await pb.collection(COLLECTIONS.listings).getFullList<ListingRecord>({
        filter: buildFilter(filters),
        expand: LISTING_EXPAND,
        sort: 'daily_price',
        requestKey: 'cars-search',
      });
      const cars = records.map((record) => toCar(record, fileUrl));
      return filters.near ? sortByDistance(cars, filters.near) : cars;
    } catch (cause) {
      throw toApiError(cause, 'Search failed.');
    }
  },

  async filterOptions() {
    try {
      const records = await pb.collection(COLLECTIONS.listings).getFullList<ListingRecord>({
        expand: LISTING_EXPAND,
        requestKey: 'cars-filter-options',
      });
      return filterOptionsFor(records.map((record) => toCar(record)));
    } catch (cause) {
      throw toApiError(cause, 'Could not load the filters.');
    }
  },

  async getById(id) {
    try {
      const record = await pb.collection(COLLECTIONS.listings).getOne<ListingRecord>(id, {
        expand: LISTING_EXPAND,
        requestKey: 'cars-details',
      });
      return toCarDetails(record, fileUrl);
    } catch (cause) {
      throw toApiError(cause, 'Could not load the car.');
    }
  },
};
