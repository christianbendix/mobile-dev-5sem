/* ___ useSearchForm hook _____________________________
    Holds the state of the search form on the home
    screen. Pick-up defaults to the user's current
    location; the LocationPicker can swap it for a
    typed address or one of our rental locations.
    `pickup` and `driverAge` are what the search
    button sends to SearchResults - the age is a hard
    filter on the providers, so no search runs without
    a valid one. Dates and times can be picked but are
    only displayed for now - a rental counts in whole
    days whatever the times.
   ____________________________________________________*/

import { useState } from 'react';

import type { RentalPeriod, SearchOrigin } from '../types/search';
import { addDays, parseDriverAge } from '../utils/searchInput';

const DEFAULT_DRIVER_AGE = '25';
const DEFAULT_TIME = '10:00';

export function useSearchForm() {
  const [pickup, setPickup] = useState<SearchOrigin>({ kind: 'current' });
  const [dropoff, setDropoff] = useState<SearchOrigin | null>(null);
  const [sameLocation, setSameLocation] = useState(true);
  const [period, setPeriod] = useState<RentalPeriod>(() => ({
    pickupDate: addDays(new Date(), 1),
    pickupTime: DEFAULT_TIME,
    returnDate: addDays(new Date(), 4),
    returnTime: DEFAULT_TIME,
  }));
  const [driverAgeText, setDriverAgeText] = useState(DEFAULT_DRIVER_AGE);

  return {
    pickup,
    setPickup,
    dropoff,
    setDropoff,
    /** set as a whole by the calendar, which keeps the dates in order */
    period,
    setPeriod,
    driverAgeText,
    setDriverAgeText,
    /** null while the typed age is not a valid one */
    driverAge: parseDriverAge(driverAgeText),
    sameLocation,
    toggleSameLocation: () => setSameLocation((v) => !v),
  };
}
