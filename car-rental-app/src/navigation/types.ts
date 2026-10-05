import type { CompositeNavigationProp, NavigatorScreenParams } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';

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

/** The Booking tab's own stack: the search form, then its results. */
export type HomeStackParamList = {
  Search: undefined;
  /**
   * Results are sorted nearest-first from `origin`, resolved on arrival.
   * `driverAge` is a hard filter: only providers accepting that age are listed.
   */
  SearchResults: { origin: SearchOrigin; driverAge?: number };
};

export type MainTabParamList = {
  Home: NavigatorScreenParams<HomeStackParamList> | undefined;
  Bookings: undefined;
  Account: undefined;
};

export type RootStackParamList = {
  Login: { redirectTo?: PendingRoute } | undefined;
  MainTabs: NavigatorScreenParams<MainTabParamList> | undefined;
  PreviewBooking: { car: Car };
  ActualBooking: { car: Car };
  BookingConfirmation: { booking: Booking };
};

/** For screens in the Booking tab: their own stack first, then the root stack (fx a car's details). */
export type HomeStackNavigation<T extends keyof HomeStackParamList> = CompositeNavigationProp<
  NativeStackNavigationProp<HomeStackParamList, T>,
  NativeStackNavigationProp<RootStackParamList>
>;
