/* ___ useFilterOptions hook __________________________
    Loads what the search filters can offer (brands,
    vendors, car types, transmissions, price range)
    through the api layer (api.cars.filterOptions).
   ____________________________________________________*/

import { useEffect, useState } from 'react';

import { api, type FilterOptions } from '../api';

export function useFilterOptions() {
  const [options, setOptions] = useState<FilterOptions | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // ignore the answer if the screen has unmounted in the meantime
    let isActive = true;

    api.cars
      .filterOptions()
      .then((result) => {
        if (isActive) setOptions(result);
      })
      .catch((cause: unknown) => {
        if (isActive)
          setError(cause instanceof Error ? cause.message : 'Could not load the filters.');
      });

    return () => {
      isActive = false;
    };
  }, []);

  return { options, error };
}
