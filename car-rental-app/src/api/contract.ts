/**
 * The API layer's public contract: the domain models the app consumes, and the
 * query surface it is allowed to call. Screens and contexts depend on these
 * types only — never on PocketBase records or the pocketbase SDK.
 */

export type Car = {
  id: string;
  name: string;
  vendorName: string;
  type: string;
  pricePerDay: number;
  location: string;
};

export type BookingStatus = 'active' | 'completed';

export type Booking = {
  id: string;
  carId: string;
  carName: string;
  vendorName: string;
  startDate: string;
  endDate: string;
  totalPrice: number;
  status: BookingStatus;
};

export type AuthUser = {
  id: string;
  name: string;
  email: string;
};

/** Criteria for a car search. Every field is optional: {} means "everything". */
export type CarFilters = {
  /** free-text match against car name, vendor and type */
  query?: string;
  maxPricePerDay?: number;
  type?: string;
};

export type NewBooking = {
  carId: string;
  /** ISO date, YYYY-MM-DD */
  startDate: string;
  /** ISO date, YYYY-MM-DD */
  endDate: string;
  fullName: string;
  phone: string;
};

export type AuthApi = {
  /** Throws ApiError('unauthorized') when the credentials are refused. */
  login(identity: string, password: string): Promise<AuthUser>;
  logout(): void;
  /** The session restored from the token store, if any. */
  currentUser(): AuthUser | null;
};

export type CarsApi = {
  listHighlighted(limit?: number): Promise<Car[]>;
  search(filters: CarFilters): Promise<Car[]>;
};

export type BookingsApi = {
  listForUser(userId: string): Promise<Booking[]>;
  /** Resolves pricing itself, so callers pass only what the user chose. */
  create(input: NewBooking): Promise<Booking>;
};

export type Api = {
  /** True when the backend answers its health check. */
  isReachable(): Promise<boolean>;
  auth: AuthApi;
  cars: CarsApi;
  bookings: BookingsApi;
};
