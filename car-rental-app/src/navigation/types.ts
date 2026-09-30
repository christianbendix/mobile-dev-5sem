import type { NavigatorScreenParams } from '@react-navigation/native';

import type { Booking, Car, CarFilters } from '../api';

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
  SearchResults: { filters: CarFilters };
  PreviewBooking: { car: Car };
  ActualBooking: { car: Car };
  BookingConfirmation: { booking: Booking };
};
