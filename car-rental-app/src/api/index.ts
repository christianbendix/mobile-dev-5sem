/**
 * The API layer (FR-01). Every data query in the app goes through the `api`
 * object exported here — screens and contexts import from '../api' and nothing
 * outside src/api/ imports `pocketbase` or touches a collection name.
 *
 * Swapping the transport, or pointing a screen at a different backend, is a
 * change to this file rather than to the screens.
 */
import { backendAuth } from './backend/auth';
import { backendBookings } from './backend/bookings';
import { backendCars } from './backend/cars';
import { backendLocations } from './backend/locations';
import { isReachable } from './client';
import { DATA_SOURCE } from './config';
import type { Api } from './contract';
import { fixtureBookings, fixtureCars, fixtureLocations } from './fixtures';

const useBackendData = DATA_SOURCE === 'backend';

export const api: Api = {
  isReachable,
  // Auth is always real; fixtures hold no users.
  auth: backendAuth,
  // Car and booking data follows DATA_SOURCE. See src/api/config.ts.
  cars: useBackendData ? backendCars : fixtureCars,
  locations: useBackendData ? backendLocations : fixtureLocations,
  bookings: useBackendData ? backendBookings : fixtureBookings,
};

export type {
  Api,
  AuthApi,
  AuthUser,
  Booking,
  BookingsApi,
  BookingStatus,
  Car,
  CarFilters,
  CarsApi,
  Coordinates,
  LocationsApi,
  NewBooking,
  RentalLocation,
} from './contract';
export { ApiError, type ApiErrorKind } from './errors';
export { estimateTotal, rentalDays } from './pricing';
export { DEFAULT_RADIUS_KM, distanceKm } from './geo';
export { DATA_SOURCE, POCKETBASE_URL, type DataSource } from './config';
