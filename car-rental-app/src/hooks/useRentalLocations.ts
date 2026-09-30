/* ___ useRentalLocations hook ________________________
    Loads our own rental locations from the backend
    (api.locations.list). They almost never change, so
    the first answer is kept in memory and every later
    use of the hook gets it instantly.
   ____________________________________________________*/

import { useEffect, useState } from 'react';

import { api, type RentalLocation } from '../api';

let cache: RentalLocation[] | null = null;

export function useRentalLocations() {
  const [locations, setLocations] = useState<RentalLocation[]>(cache ?? []);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(cache === null);

  useEffect(() => {
    if (cache) return;
    let isActive = true;

    api.locations
      .list()
      .then((result) => {
        cache = result;
        if (isActive) setLocations(result);
      })
      .catch((cause: unknown) => {
        if (isActive) {
          setError(cause instanceof Error ? cause.message : 'Could not load locations.');
        }
      })
      .finally(() => {
        if (isActive) setIsLoading(false);
      });

    return () => {
      isActive = false;
    };
  }, []);

  return { locations, error, isLoading };
}
