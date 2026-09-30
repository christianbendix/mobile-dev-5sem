/* ___ Device location ________________________________
    The only place that talks to expo-location. Turns
    a SearchOrigin into coordinates: the phone's (or
    browser's) own position, or the coordinates an
    address or rental location already carries.
    Nothing here throws - when the position cannot be
    had, the answer says why, so the screen can too.
   ____________________________________________________*/

import * as Location from 'expo-location';
import { Platform } from 'react-native';

import type { Coordinates } from '../api';
import type { SearchOrigin } from '../types/search';

// a fix this recent is good enough, and much faster than asking for a new one
const LAST_KNOWN_MAX_AGE_MS = 5 * 60 * 1000;

export type Located = { coordinates: Coordinates } | { error: string };

function messageOf(cause: unknown): string {
  // browsers reject with a GeolocationPositionError: code 1 = denied, 2 = unavailable, 3 = timeout
  const code =
    typeof cause === 'object' && cause !== null && 'code' in cause ? cause.code : undefined;
  if (code === 1) return 'Location access is blocked for this site.';
  if (code === 2) return 'Your device could not determine its location.';
  if (code === 3) return 'Finding your location took too long.';
  return cause instanceof Error ? cause.message : 'Your location is unavailable.';
}

export async function getCurrentCoordinates(): Promise<Located> {
  // browsers only expose geolocation to https:// and http://localhost pages
  if (Platform.OS === 'web' && typeof window !== 'undefined' && !window.isSecureContext) {
    return { error: 'The browser only shares your location on https or localhost.' };
  }
  try {
    const { granted } = await Location.requestForegroundPermissionsAsync();
    if (!granted) return { error: 'Location permission was denied.' };

    if (!(await Location.hasServicesEnabledAsync())) {
      return { error: 'Location services are turned off on this device.' };
    }

    const position =
      (await Location.getLastKnownPositionAsync({ maxAge: LAST_KNOWN_MAX_AGE_MS })) ??
      (await Location.getCurrentPositionAsync({ accuracy: Location.Accuracy.Balanced }));
    return { coordinates: { lat: position.coords.latitude, lon: position.coords.longitude } };
  } catch (cause) {
    return { error: messageOf(cause) };
  }
}

/** The origin's name, as the pick-up field shows it. */
export function originLabel(origin: SearchOrigin): string {
  if (origin.kind === 'current') return 'Current location';
  if (origin.kind === 'address') return origin.label;
  return origin.place.label;
}

/** How the origin reads after "km from", fx "2.1 km from your current location". */
export function distanceReference(origin: SearchOrigin): string {
  return origin.kind === 'current' ? 'your current location' : originLabel(origin);
}

export async function resolveOrigin(origin: SearchOrigin): Promise<Located> {
  if (origin.kind === 'current') return getCurrentCoordinates();
  if (origin.kind === 'address') return { coordinates: origin.coordinates };
  return { coordinates: { lat: origin.place.lat, lon: origin.place.lon } };
}
