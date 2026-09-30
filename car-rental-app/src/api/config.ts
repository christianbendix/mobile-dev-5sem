/** Where the PocketBase instance lives. Swap when the db moves to the cloud. */
export const POCKETBASE_URL = 'http://192.168.1.252:8090';

export type DataSource = 'backend' | 'fixtures';

/**
 * Which implementation of the car/booking queries the app runs against.
 *
 * `fixtures` serves in-memory placeholder data. It is the default because the
 * backend is not ready: the `vehicles`, `providers`, `locations` and `brands`
 * collections are superuser-only, and there is no bookings collection at all.
 *
 * Flip to `backend` once those rules are opened and the collection exists.
 * Authentication is unaffected either way — see src/api/index.ts.
 */
export const DATA_SOURCE: DataSource = 'fixtures';

/** Collection names, as verified against the running instance. */
export const COLLECTIONS = {
  users: 'users',
  vehicles: 'vehicles',
  // does not exist yet
  bookings: 'bookings',
} as const;
