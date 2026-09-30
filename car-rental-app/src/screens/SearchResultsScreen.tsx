import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import { useEffect, useState } from 'react';
import { Button, FlatList, Pressable, Text, View } from 'react-native';

import { FilterPanel } from '../components/FilterPanel/FilterPanel';
import { Screen } from '../components/Screen';
import { useFilterOptions } from '../hooks/useFilterOptions';
import type { RootStackParamList } from '../navigation/types';
import { api, distanceKm, type Car, type CarFilters } from '../api';
import { distanceReference, resolveOrigin } from '../utils/deviceLocation';
import { formatDistance } from '../utils/places';
import {
  activeFilterCount,
  EMPTY_SELECTION,
  selectionToFilters,
  type FilterSelection,
} from '../utils/searchFilters';

type Props = NativeStackScreenProps<RootStackParamList, 'SearchResults'>;

export function SearchResultsScreen({ navigation, route }: Props) {
  const { origin, driverAge } = route.params;
  const reference = distanceReference(origin);

  // The search is the located origin + driver age (fixed for this screen) plus
  // the filters last applied in the panel. Applying replaces `selection`, which
  // re-runs the search, so filtering is explicit rather than as-you-type.
  // `base` is null until the origin is located; no search runs before that.
  const [base, setBase] = useState<CarFilters | null>(null);
  const [selection, setSelection] = useState<FilterSelection>(EMPTY_SELECTION);
  const [showFilters, setShowFilters] = useState(false);
  const filterOptions = useFilterOptions();

  const [cars, setCars] = useState<Car[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Locate the origin once (only the current location needs a lookup). If that
  // fails, `near` stays unset, every car is listed, and the reason is shown.
  const [locateError, setLocateError] = useState<string | null>(null);

  useEffect(() => {
    let isActive = true;

    resolveOrigin(origin).then((located) => {
      if (!isActive) return;
      if ('coordinates' in located) {
        setBase({ near: located.coordinates, driverAge });
      } else {
        setLocateError(located.error);
        setBase({ driverAge });
      }
    });

    return () => {
      isActive = false;
    };
  }, [origin, driverAge]);

  useEffect(() => {
    if (!base) return;
    let isActive = true;

    api.cars
      .search({ ...base, ...selectionToFilters(selection) })
      .then((results) => {
        if (!isActive) return;
        setCars(results);
        setError(null);
      })
      .catch((cause: unknown) => {
        if (!isActive) return;
        setError(cause instanceof Error ? cause.message : 'Search failed.');
        setCars([]);
      })
      .finally(() => {
        if (isActive) setIsLoading(false);
      });

    return () => {
      isActive = false;
    };
  }, [base, selection]);

  function handleApplyFilters(next: FilterSelection) {
    setIsLoading(true);
    setSelection(next);
    setShowFilters(false);
  }

  const near = base?.near;
  const filterCount = activeFilterCount(selection);

  const header = (
    <View style={{ paddingBottom: 16 }}>
      <Text>Search</Text>
      {!base ? <Text>Finding {reference}…</Text> : null}
      {base && near ? <Text>Closest to {reference}</Text> : null}
      {locateError ? <Text>{locateError} Showing all cars.</Text> : null}
      {driverAge !== undefined ? <Text>Providers accepting a driver aged {driverAge}</Text> : null}

      <Button
        title={`${showFilters ? 'Hide' : 'Show'} filters${filterCount ? ` (${filterCount})` : ''}`}
        onPress={() => setShowFilters((shown) => !shown)}
        disabled={!base}
      />
      {showFilters && filterOptions.options ? (
        <FilterPanel
          options={filterOptions.options}
          applied={selection}
          onApply={handleApplyFilters}
        />
      ) : null}
      {showFilters && !filterOptions.options ? (
        <Text>{filterOptions.error ?? 'Loading filters…'}</Text>
      ) : null}

      {error ? <Text>{error}</Text> : null}
    </View>
  );

  return (
    <Screen>
      <FlatList
        data={cars}
        keyExtractor={(car) => car.id}
        keyboardShouldPersistTaps="handled"
        ListHeaderComponent={header}
        ListEmptyComponent={
          isLoading ? <Text>Searching…</Text> : error ? null : <Text>No cars matched.</Text>
        }
        renderItem={({ item }) => (
          <Pressable
            style={{ paddingVertical: 8 }}
            onPress={() => navigation.navigate('PreviewBooking', { car: item })}
          >
            <Text>{item.name}</Text>
            <Text>Vendor: {item.vendorName}</Text>
            <Text>
              {item.type}
              {item.transmission
                ? ` · ${item.transmission === 'automatic' ? 'Automatic' : 'Manual'}`
                : ''}
              {' · '}
              {item.pricePerDay} kr / day
            </Text>
            <Text>Location: {item.location}</Text>
            {item.minDriverAge ? <Text>Min. driver age: {item.minDriverAge}</Text> : null}
            {near ? (
              <Text>
                {item.coordinates
                  ? `${formatDistance(distanceKm(near, item.coordinates))} from ${reference}`
                  : `Distance from ${reference} unknown`}
              </Text>
            ) : null}
          </Pressable>
        )}
      />
    </Screen>
  );
}
