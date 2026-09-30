import { pb } from '../client';
import { COLLECTIONS } from '../config';
import type { LocationsApi, RentalLocation } from '../contract';
import { toApiError } from '../errors';
import { toRentalLocation, type LocationRecord } from './records';

export const backendLocations: LocationsApi = {
  async list() {
    try {
      const records = await pb.collection(COLLECTIONS.locations).getFullList<LocationRecord>({
        sort: 'city,name',
        requestKey: 'locations-list',
      });
      return records
        .map(toRentalLocation)
        .filter((location): location is RentalLocation => location !== null);
    } catch (cause) {
      throw toApiError(cause, 'Could not load locations.');
    }
  },
};
