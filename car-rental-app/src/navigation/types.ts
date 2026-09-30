import type { NavigatorScreenParams } from '@react-navigation/native';

import type { Booking, Car } from '../api';
import type { SearchOrigin } from '../types/search';

/**
 * Where to land after a successful login. Only the booking screen needs this
 * today, so it stays a narrow union rather than a generic route descriptor —
 * that keeps the params type-checked at every call site.
 */
export type PendingRoute = {
  screen: 'ActualBooking';
  params: { car: Car };
};

export type MainTabParamList = {
  Home: undefined;
  Bookings: undefined;
  Account: undefined;
};

export type RootStackParamList = {
  Login: { redirectTo?: PendingRoute } | undefined;
  MainTabs: NavigatorScreenParams<MainTabParamList> | undefined;
  /**
   * Results are sorted nearest-first from `origin`, resolved on arrival.
   * `driverAge` is a hard filter: only providers accepting that age are listed.
   */
  SearchResults: { origin: SearchOrigin; driverAge?: number };
  PreviewBooking: { car: Car };
  ActualBooking: { car: Car };
  BookingConfirmation: { booking: Booking };
};
