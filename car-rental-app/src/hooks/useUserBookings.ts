/* ___ useUserBookings hook ___________________________
    The logged-in user's bookings through the api
    layer (api.bookings.listForUser). Refetches each
    time the screen is focused, so a fresh booking
    shows up. Empty, and no request, for a guest.
   ____________________________________________________*/

import { useFocusEffect } from '@react-navigation/native';
import { useCallback, useState } from 'react';

import { api, type AuthUser, type Booking } from '../api';

export function useUserBookings(user: AuthUser | null) {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useFocusEffect(
    useCallback(() => {
      if (!user) return;
      let isActive = true;

      setError(null);
      api.bookings
        .listForUser(user.id)
        .then((result) => {
          if (isActive) setBookings(result);
        })
        .catch((cause: unknown) => {
          if (isActive) {
            setError(cause instanceof Error ? cause.message : 'Could not load bookings.');
          }
        })
        .finally(() => {
          if (isActive) setIsLoading(false);
        });

      return () => {
        isActive = false;
      };
    }, [user]),
  );

  return { bookings, error, isLoading };
}
