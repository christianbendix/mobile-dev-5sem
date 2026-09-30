import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import { useEffect, useState } from 'react';
import { Button, FlatList, Text, TextInput, View } from 'react-native';

import { Screen } from '../components/Screen';
import type { RootStackParamList } from '../navigation/types';
import { api, distanceKm, type Car, type CarFilters } from '../api';
import { formatDistance } from '../utils/places';

type Props = NativeStackScreenProps<RootStackParamList, 'SearchResults'>;

export function SearchResultsScreen({ navigation, route }: Props) {
  const initialFilters = route.params.filters;
  const placeLabel = route.params.placeLabel;

  const [query, setQuery] = useState(initialFilters.query ?? '');
  const [maxPrice, setMaxPrice] = useState('');
  const [type, setType] = useState('');

  // Bumping this re-runs the search effect. Keeping the trigger separate from
  // the input state is what makes filtering explicit rather than as-you-type.
  const [searchId, setSearchId] = useState(0);
  const [filters, setFilters] = useState<CarFilters>(initialFilters);

  const [cars, setCars] = useState<Car[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
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
      // keep the "near this place" part of the search
      near: filters.near,
      radiusKm: filters.radiusKm,
      query,
      type: type || undefined,
      maxPricePerDay: Number.isNaN(parsedMaxPrice) ? undefined : parsedMaxPrice,
    });
    setSearchId((id) => id + 1);
  }

  const near = filters.near;

  return (
    <Screen>
      <Text>Search</Text>
      {placeLabel && near ? (
        <Text>
          Cars within {filters.radiusKm} km of {placeLabel}
        </Text>
      ) : null}
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
      <Button title="Apply filters" onPress={handleApplyFilters} disabled={isLoading} />

      <View style={{ height: 16 }} />

      {error ? <Text>{error}</Text> : null}
      <FlatList
        data={cars}
        keyExtractor={(car) => car.id}
        ListEmptyComponent={
          isLoading ? <Text>Searching…</Text> : error ? null : <Text>No cars matched.</Text>
        }
        renderItem={({ item }) => (
          <View style={{ paddingVertical: 8 }}>
            <Text>{item.name}</Text>
            <Text>Vendor: {item.vendorName}</Text>
            <Text>
              {item.type} · {item.pricePerDay} kr / day
            </Text>
            {near && item.coordinates ? (
              <Text>
                {item.location} · {formatDistance(distanceKm(near, item.coordinates))} away
              </Text>
            ) : null}
            <Button
              title="Select"
              onPress={() => navigation.navigate('PreviewBooking', { car: item })}
            />
          </View>
        )}
      />
    </Screen>
  );
}
