import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import { useEffect, useState } from 'react';
import { Button, FlatList, Pressable, Text, TextInput, View } from 'react-native';

import { Screen } from '../components/Screen';
import type { RootStackParamList } from '../navigation/types';
import { api, distanceKm, type Car, type CarFilters } from '../api';
import { distanceReference, resolveOrigin } from '../utils/deviceLocation';
import { formatDistance } from '../utils/places';

type Props = NativeStackScreenProps<RootStackParamList, 'SearchResults'>;

export function SearchResultsScreen({ navigation, route }: Props) {
  const { origin, driverAge } = route.params;
  const reference = distanceReference(origin);

  const [query, setQuery] = useState('');
  const [maxPrice, setMaxPrice] = useState('');
  const [type, setType] = useState('');

  // Bumping this re-runs the search effect. Keeping the trigger separate from
  // the input state is what makes filtering explicit rather than as-you-type.
  const [searchId, setSearchId] = useState(0);
  // null until the origin is located; no search runs before that
  const [filters, setFilters] = useState<CarFilters | null>(null);

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
        setFilters({ near: located.coordinates, driverAge });
      } else {
        setLocateError(located.error);
        setFilters({ driverAge });
      }
    });

    return () => {
      isActive = false;
    };
  }, [origin, driverAge]);

  useEffect(() => {
    if (!filters) return;
    let isActive = true;

    api.cars
      .search(filters)
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
  }, [filters, searchId]);

  function handleApplyFilters() {
    const parsedMaxPrice = Number.parseInt(maxPrice, 10);
    setIsLoading(true);
    setFilters({
      // keep the "nearest to this place" and driver age parts of the search
      near: filters?.near,
      driverAge,
      query,
      type: type || undefined,
      maxPricePerDay: Number.isNaN(parsedMaxPrice) ? undefined : parsedMaxPrice,
    });
    setSearchId((id) => id + 1);
  }

  const near = filters?.near;

  return (
    <Screen>
      <Text>Search</Text>
      {!filters ? <Text>Finding {reference}…</Text> : null}
      {filters && near ? <Text>Closest to {reference}</Text> : null}
      {locateError ? <Text>{locateError} Showing all cars.</Text> : null}
      {driverAge !== undefined ? <Text>Providers accepting a driver aged {driverAge}</Text> : null}
      <TextInput
        value={query}
        onChangeText={setQuery}
        placeholder="Brand, vendor or type"
        autoCapitalize="none"
        style={{ borderWidth: 1, padding: 8 }}
      />
      <TextInput
        value={maxPrice}
        onChangeText={setMaxPrice}
        placeholder="Max price per day"
        keyboardType="number-pad"
        style={{ borderWidth: 1, padding: 8 }}
      />
      <TextInput
        value={type}
        onChangeText={setType}
        placeholder="Car type (e.g. SUV)"
        autoCapitalize="none"
        style={{ borderWidth: 1, padding: 8 }}
      />
      <Button title="Apply filters" onPress={handleApplyFilters} disabled={isLoading || !filters} />

      <View style={{ height: 16 }} />

      {error ? <Text>{error}</Text> : null}
      <FlatList
        data={cars}
        keyExtractor={(car) => car.id}
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
              {item.type} · {item.pricePerDay} kr / day
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
