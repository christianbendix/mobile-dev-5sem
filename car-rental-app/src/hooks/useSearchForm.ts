/* ___ useSearchForm hook _____________________________
    Holds the state of the search form on the home
    screen. Pick-up and drop-off are places chosen in
    the LocationPicker (with coordinates). `filters`
    is what the search button sends to SearchResults:
    "cars near the pick-up place". Dates and driver
    age are only displayed for now.
   ____________________________________________________*/

import { useState } from 'react';

import type { CarFilters } from '../api';
import type { SelectedPlace } from '../types/search';
import { filtersForPlace } from '../utils/places';

// Date `offsetDays` from today at 10:00, fx "Fri 2 Oct"
function dayFromToday(offsetDays: number) {
  const date = new Date();
  date.setDate(date.getDate() + offsetDays);
  return {
    day: date.toLocaleDateString('en-GB', { weekday: 'short', day: 'numeric', month: 'short' }),
    time: '10:00',
  };
}

export function useSearchForm() {
  const [pickupPlace, setPickupPlace] = useState<SelectedPlace | null>(null);
  const [dropoffPlace, setDropoffPlace] = useState<SelectedPlace | null>(null);
  const [sameLocation, setSameLocation] = useState(true);

  // no place chosen yet = search everywhere
  const filters: CarFilters = pickupPlace ? filtersForPlace(pickupPlace) : {};

  return {
    pickupPlace,
    setPickupPlace,
    dropoffPlace,
    setDropoffPlace,
    pickupDate: dayFromToday(1),
    returnDate: dayFromToday(4),
    driverAge: '26 – 65',
    sameLocation,
    toggleSameLocation: () => setSameLocation((v) => !v),
    filters,
  };
}
