/* ___ Place helpers __________________________________
    Small pure functions for the location search:
    turning a picked location into backend filters,
    and matching typed text against our locations
    (so "arhus st" finds "Aarhus Central Station").
   ____________________________________________________*/

import type { CarFilters, RentalLocation } from '../api';
import type { SelectedPlace } from '../types/search';

// Cars this close to the picked location are included too, so fx
// Copenhagen Central Station also shows the cars at City Centre next door
export const SEARCH_RADIUS_KM = 3;

export function filtersForPlace(place: SelectedPlace): CarFilters {
  return { near: { lat: place.lat, lon: place.lon }, radiusKm: SEARCH_RADIUS_KM };
}

export function rentalLocationToPlace(location: RentalLocation): SelectedPlace {
  return {
    id: location.id,
    label: location.name,
    subtitle: location.city,
    lat: location.coordinates.lat,
    lon: location.coordinates.lon,
  };
}

/**
 * Lowercase, strip accents and fold Danish spellings, so "Århus", "Aarhus"
 * and "Arhus" all become "arhus".
 */
export function normalize(text: string): string {
  return text
    .toLowerCase()
    .replace(/æ/g, 'ae')
    .replace(/ø/g, 'o')
    .replace(/å/g, 'a')
    .replace(/aa/g, 'a')
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '');
}

// Short forms and Danish words people type, mapped to how our locations are named
const ABBREVIATIONS: Record<string, string> = {
  kbh: 'København',
  cph: 'Copenhagen',
  lufthavn: 'Airport',
  banegård: 'Station',
  banegard: 'Station',
};

/** "kbh h" -> "København h". Only whole words are replaced. */
export function expandAbbreviations(query: string): string {
  return query
    .split(/(\s+)/)
    .map((word) => ABBREVIATIONS[word.toLowerCase()] ?? word)
    .join('');
}

/** Every typed word must be the start of a word in the location's name or city. */
export function matchesRentalLocation(location: RentalLocation, query: string): boolean {
  const words = normalize(`${location.name} ${location.city}`).split(/\s+/);
  return normalize(expandAbbreviations(query))
    .split(/\s+/)
    .filter(Boolean)
    .every((typed) => words.some((word) => word.startsWith(typed)));
}

export function formatDistance(km: number): string {
  return km < 10 ? `${km.toFixed(1)} km` : `${Math.round(km)} km`;
}
