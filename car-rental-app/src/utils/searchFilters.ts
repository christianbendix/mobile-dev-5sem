/* ___ Search filter helpers __________________________
    What the user has ticked in the filter panel, and
    how that becomes the api's CarFilters.
   ____________________________________________________*/

import type { CarFilters, Transmission } from '../api';

export type FilterSelection = {
  brands: string[];
  vendors: string[];
  carTypes: string[];
  /** undefined = any */
  transmission?: Transmission;
  /** as typed; blank = no limit */
  minPrice: string;
  maxPrice: string;
};

export const EMPTY_SELECTION: FilterSelection = {
  brands: [],
  vendors: [],
  carTypes: [],
  minPrice: '',
  maxPrice: '',
};

/** Adds `value` to the list, or removes it when it is already there. */
export function toggle(list: string[], value: string): string[] {
  return list.includes(value) ? list.filter((item) => item !== value) : [...list, value];
}

/** A whole, non-negative number of kroner, or undefined for blank/invalid input. */
function parsePrice(text: string): number | undefined {
  const trimmed = text.trim();
  return /^\d+$/.test(trimmed) ? Number(trimmed) : undefined;
}

/** The api filters for a selection. Empty lists and blank prices restrict nothing. */
export function selectionToFilters(selection: FilterSelection): CarFilters {
  const filters: CarFilters = {};
  if (selection.brands.length) filters.brands = selection.brands;
  if (selection.vendors.length) filters.vendors = selection.vendors;
  if (selection.carTypes.length) filters.carTypes = selection.carTypes;
  if (selection.transmission) filters.transmission = selection.transmission;
  const min = parsePrice(selection.minPrice);
  const max = parsePrice(selection.maxPrice);
  if (min !== undefined) filters.minPricePerDay = min;
  if (max !== undefined) filters.maxPricePerDay = max;
  return filters;
}

/** How many filter fields are in use, fx for "Filters (2)". */
export function activeFilterCount(selection: FilterSelection): number {
  const filters = selectionToFilters(selection);
  return [
    filters.brands,
    filters.vendors,
    filters.carTypes,
    filters.transmission,
    filters.minPricePerDay !== undefined || filters.maxPricePerDay !== undefined || undefined,
  ].filter(Boolean).length;
}
