/**
 * The API layer's public contract: the domain models the app consumes, and the
 * query surface it is allowed to call. Screens and contexts depend on these
 * types only — never on PocketBase records or the pocketbase SDK.
 */

export type Coordinates = { lat: number; lon: number };

export type Transmission = 'automatic' | 'manual';

export type Car = {
  id: string;
  name: string;
  /** the car brand, fx "Toyota" (the rental company is the vendor) */
  make: string;
  vendorName: string;
  /** the car type (category), fx "Economy" or "SUV" */
  type: string;
  /** missing when the vehicle does not say */
  transmission?: Transmission;
  pricePerDay: number;
  location: string;
  /** the provider's minimum driver age; missing when the provider sets none */
  minDriverAge?: number;
  /** where the car is picked up; missing when the location is not viewable */
  coordinates?: Coordinates;
};

/**
 * Everything the details screen shows about one listing: the car itself, the
 * vehicle's specs, the provider (rental company) and the pickup location.
 * Image URLs are absolute and missing when no file is uploaded.
 */
export type CarDetails = Car & {
  imageUrl?: string;
  seats?: number;
  doors?: number;
  automatic?: boolean;
  airconditioning?: boolean;
  provider: {
    name: string;
    description?: string;
    logoUrl?: string;
    rating?: number;
    minDriverAge?: number;
  };
  address?: string;
};

/** A place where cars can be picked up (a row in `locations`). */
export type RentalLocation = {
  id: string;
  name: string;
  city: string;
  coordinates: Coordinates;
};

/**
 * One autocomplete suggestion for the address search. A `street` has no
 * coordinates yet: picking it puts `completion` in the field so the user can
 * go on to type the house number. Only an `address` can be searched from.
 */
export type AddressSuggestion =
  | { kind: 'street'; label: string; completion: string }
  | { kind: 'address'; id: string; label: string; coordinates: Coordinates };

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

/**
 * Criteria for a car search. Every field is optional: {} means "everything".
 * A list matches any of its values; an empty list does not restrict.
 */
export type CarFilters = {
  /** free-text match against car name, vendor and type */
  query?: string;
  /** car brands, fx ["Toyota", "BMW"] */
  brands?: string[];
  /** rental companies, by name */
  vendors?: string[];
  /** car types (categories), fx ["Economy", "SUV"] */
  carTypes?: string[];
  transmission?: Transmission;
  minPricePerDay?: number;
  maxPricePerDay?: number;
  /** only cars whose provider accepts a driver of this age */
  driverAge?: number;
  /** sort results nearest-first from this point (cars without coordinates last) */
  near?: Coordinates;
  /** with `near`, also drop cars further away than this; no cut-off when unset */
  radiusKm?: number;
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

/** What the search filters can offer: the values that occur in the listings. */
export type FilterOptions = {
  brands: string[];
  vendors: string[];
  carTypes: string[];
  transmissions: Transmission[];
  /** cheapest and dearest daily price; null when there are no listings */
  priceRange: { min: number; max: number } | null;
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
  /** Every brand, vendor, car type, transmission and the price range on offer. */
  filterOptions(): Promise<FilterOptions>;
  /** Throws ApiError('not-found') when the listing does not exist. */
  getById(id: string): Promise<CarDetails>;
};

export type LocationsApi = {
  /** Every rental location, sorted by city then name. */
  list(): Promise<RentalLocation[]>;
};

export type AddressesApi = {
  /** Danish addresses and street names matching what the user has typed so far. */
  suggest(text: string): Promise<AddressSuggestion[]>;
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
  locations: LocationsApi;
  addresses: AddressesApi;
  bookings: BookingsApi;
};
