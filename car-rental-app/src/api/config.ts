/** Where the PocketBase instance lives. Swap when the db moves to the cloud. Local: 'http://192.168.1.252:8090'; */
export const POCKETBASE_URL = 'http://79.76.47.40:8090';

export type DataSource = 'backend' | 'fixtures';

/**
 * Which implementation of the car/booking queries the app runs against.
 *
 * `backend` reads the live PocketBase collections. `fixtures` serves in-memory
 * placeholder data, for demoing or developing without the server.
 * Authentication is always real either way — see src/api/index.ts.
 */
export const DATA_SOURCE: DataSource = 'backend';

/** Collection names, as verified against the running instance. */
export const COLLECTIONS = {
  users: 'users',
  /** a vehicle offered by a brand at a location — what the app calls a Car */
  listings: 'listings',
  /** rental locations, each with a `geo_point` */
  locations: 'locations',
  bookings: 'bookings',
} as const;
