/* ___ useHighlightedCars hook ________________________
    Loads the cheapest offers from the backend through
    the api layer (api.cars.listHighlighted). Screens
    only see cars / error / isLoading - never the api
    call itself.
   ____________________________________________________*/

import { useEffect, useState } from 'react';

import { api, type Car } from '../api';

export function useHighlightedCars(limit = 3) {
  const [cars, setCars] = useState<Car[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // ignore the answer if the screen has unmounted in the meantime
    let isActive = true;

    api.cars
      .listHighlighted(limit)
      .then((result) => {
        if (isActive) setCars(result);
      })
      .catch((cause: unknown) => {
        if (isActive) setError(cause instanceof Error ? cause.message : 'Could not load offers.');
      })
      .finally(() => {
        if (isActive) setIsLoading(false);
      });

    return () => {
      isActive = false;
    };
  }, [limit]);

  return { cars, error, isLoading };
}
