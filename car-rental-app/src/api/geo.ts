import type { Coordinates } from './contract';

const EARTH_RADIUS_KM = 6371;

function toRadians(degrees: number): number {
  return (degrees * Math.PI) / 180;
}

/**
 * Straight-line distance in km (haversine). Matches PocketBase's geoDistance(),
 * so the app can sort by, and display, the same distance the backend filtered on.
 */
export function distanceKm(a: Coordinates, b: Coordinates): number {
  const dLat = toRadians(b.lat - a.lat);
  const dLon = toRadians(b.lon - a.lon);
  const h =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(toRadians(a.lat)) * Math.cos(toRadians(b.lat)) * Math.sin(dLon / 2) ** 2;
  return 2 * EARTH_RADIUS_KM * Math.asin(Math.sqrt(h));
}

/**
 * Nearest first. Cars without coordinates cannot be placed, so they go last,
 * keeping their incoming (price) order.
 */
export function sortByDistance<T extends { coordinates?: Coordinates }>(
  items: T[],
  from: Coordinates,
): T[] {
  const distance = (item: T) =>
    item.coordinates ? distanceKm(from, item.coordinates) : Number.POSITIVE_INFINITY;
  return [...items].sort((a, b) => distance(a) - distance(b));
}
