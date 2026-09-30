import { pb } from '../client';
import { COLLECTIONS } from '../config';
import type { CarFilters, CarsApi } from '../contract';
import { toApiError } from '../errors';
import { toCar, VEHICLE_EXPAND, type VehicleRecord } from './records';

/** pb.filter() escapes the values, so user input is safe to interpolate. */
function buildFilter(filters: CarFilters): string {
  const parts: string[] = [];

  if (filters.query?.trim()) {
    parts.push(
      pb.filter('(model ~ {:q} || type ~ {:q} || provider.name ~ {:q} || brand.name ~ {:q})', {
        q: filters.query.trim(),
      }),
    );
  }
  if (filters.maxPricePerDay !== undefined) {
    parts.push(pb.filter('pricePerDay <= {:max}', { max: filters.maxPricePerDay }));
  }
  if (filters.type?.trim()) {
    parts.push(pb.filter('type ~ {:type}', { type: filters.type.trim() }));
  }

  return parts.join(' && ');
}

export const backendCars: CarsApi = {
  async listHighlighted(limit = 3) {
    try {
      const result = await pb.collection(COLLECTIONS.vehicles).getList<VehicleRecord>(1, limit, {
        expand: VEHICLE_EXPAND,
        sort: 'pricePerDay',
        requestKey: 'cars-highlighted',
      });
      return result.items.map(toCar);
    } catch (cause) {
      throw toApiError(cause, 'Could not load offers.');
    }
  },

  async search(filters) {
    try {
      const records = await pb.collection(COLLECTIONS.vehicles).getFullList<VehicleRecord>({
        filter: buildFilter(filters),
        expand: VEHICLE_EXPAND,
        sort: 'pricePerDay',
        requestKey: 'cars-search',
      });
      return records.map(toCar);
    } catch (cause) {
      throw toApiError(cause, 'Search failed.');
    }
  },
};
