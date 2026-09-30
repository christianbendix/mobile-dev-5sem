import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useNavigation } from '@react-navigation/native';
import { useEffect, useState } from 'react';
import { Button, FlatList, Text, TextInput, View } from 'react-native';

import { Screen } from '../components/Screen';
import { api, type Car } from '../api';
import type { RootStackParamList } from '../navigation/types';

export function HomeScreen() {
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();

  const [query, setQuery] = useState('');
  const [offers, setOffers] = useState<Car[]>([]);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let isActive = true;

    api.cars
      .listHighlighted()
      .then((cars) => {
        if (isActive) setOffers(cars);
      })
      .catch((cause: unknown) => {
        if (isActive) setError(cause instanceof Error ? cause.message : 'Could not load offers.');
      });

    return () => {
      isActive = false;
    };
  }, []);

  return (
    <Screen>
      <Text>Find a car</Text>
      <TextInput
        value={query}
        onChangeText={setQuery}
        placeholder="Brand, vendor or type"
        autoCapitalize="none"
        onSubmitEditing={() => navigation.navigate('SearchResults', { filters: { query } })}
        style={{ borderWidth: 1, padding: 8 }}
      />
      <Button
        title="Search"
        onPress={() => navigation.navigate('SearchResults', { filters: { query } })}
      />

      <View style={{ height: 24 }} />

      <Text>Highlighted offers</Text>
      {error ? <Text>{error}</Text> : null}
      <FlatList
        data={offers}
        keyExtractor={(car) => car.id}
        ListEmptyComponent={error ? null : <Text>No offers.</Text>}
        renderItem={({ item }) => (
          <View style={{ paddingVertical: 8 }}>
            <Text>{item.name}</Text>
            <Text>{item.vendorName}</Text>
            <Text>{item.pricePerDay} kr / day</Text>
            <Button
              title="View"
              onPress={() => navigation.navigate('PreviewBooking', { car: item })}
            />
          </View>
        )}
      />
    </Screen>
  );
}
