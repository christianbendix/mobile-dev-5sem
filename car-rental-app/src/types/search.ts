/* ___ Search types ___________________________________
    Types for the search flow: where a search is made
    from, the rental location a user picks in the
    LocationPicker, the rental period, and recent
    searches.
   ____________________________________________________*/

import type { Coordinates } from '../api';

/** A rental location picked in the LocationPicker. */
export type SelectedPlace = {
  id: string;
  label: string;
  /** second line in lists - the city, fx "Aarhus C" */
  subtitle: string;
  lat: number;
  lon: number;
};

/**
 * Where a search is made from. Results are sorted nearest-first from it.
 * `current` (the device's position) is the default and is located when the
 * search runs; an `address` is an autocomplete pick, so it is already located.
 */
export type SearchOrigin =
  | { kind: 'current' }
  | { kind: 'address'; label: string; coordinates: Coordinates }
  | { kind: 'place'; place: SelectedPlace };

/** The rental period chosen in the calendar. Times are display only. */
export type RentalPeriod = {
  /** YYYY-MM-DD */
  pickupDate: string;
  /** HH:MM */
  pickupTime: string;
  returnDate: string;
  returnTime: string;
};

export type RecentSearch = {
  id: string;
  place: SelectedPlace;
  dateRange: string;
  carSize: string;
};
