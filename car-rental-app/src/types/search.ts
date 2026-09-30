/* ___ Search types ___________________________________
    Types for the search flow: the rental location a
    user picks in the LocationPicker, and recent
    searches.
   ____________________________________________________*/

/** A rental location picked in the LocationPicker. */
export type SelectedPlace = {
  id: string;
  label: string;
  /** second line in lists - the city, fx "Aarhus C" */
  subtitle: string;
  lat: number;
  lon: number;
};

export type RecentSearch = {
  id: string;
  place: SelectedPlace;
  dateRange: string;
  carSize: string;
};
