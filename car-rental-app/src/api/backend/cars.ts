import { pb } from '../client';
import { COLLECTIONS } from '../config';
import type { CarFilters, CarsApi } from '../contract';
import { toApiError } from '../errors';
import { DEFAULT_RADIUS_KM } from '../geo';
import { LISTING_EXPAND, toCar, type ListingRecord } from './records';

/** pb.filter() escapes the values, so user input is safe to interpolate. */
function buildFilter(filters: CarFilters): string {
  const parts: string[] = [];

  if (filters.query?.trim()) {
    parts.push(
      pb.filter(
        '(vehicle_id.make ~ {:q} || vehicle_id.model ~ {:q} || vehicle_id.category ~ {:q} || brand_id.name ~ {:q})',
        { q: filters.query.trim() },
      ),
    );
  }
  if (filters.maxPricePerDay !== undefined) {
    parts.push(pb.filter('daily_price <= {:max}', { max: filters.maxPricePerDay }));
  }
  if (filters.type?.trim()) {
    parts.push(pb.filter('vehicle_id.category ~ {:type}', { type: filters.type.trim() }));
  }
  if (filters.near) {
    // geoDistance takes lon before lat, and returns km
    parts.push(
      pb.filter(
        'geoDistance(location_id.geo_point.lon, location_id.geo_point.lat, {:lon}, {:lat}) < {:radius}',
        {
          lon: filters.near.lon,
          lat: filters.near.lat,
          radius: filters.radiusKm ?? DEFAULT_RADIUS_KM,
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
      return result.items.map(toCar);
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
      return records.map(toCar);
    } catch (cause) {
      throw toApiError(cause, 'Search failed.');
    }
  },
};
