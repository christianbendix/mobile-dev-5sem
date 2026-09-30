import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import { useEffect, useState } from 'react';
import { Button, Image, ScrollView, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { api, type CarDetails } from '../api';
import { OnlineStatusHeader } from '../components/OnlineStatusHeader';
import type { RootStackParamList } from '../navigation/types';

type Props = NativeStackScreenProps<RootStackParamList, 'PreviewBooking'>;

/**
 * Full-screen details for one listing: the car and its provider. The `car`
 * param is what the list already had, so it renders straight away; the rest
 * (specs, images, provider info) is fetched through api.cars.getById.
 */
export function PreviewBookingScreen({ navigation, route }: Props) {
  const { car } = route.params;

  const [details, setDetails] = useState<CarDetails | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // ignore the answer if the screen has closed in the meantime
    let isActive = true;

    api.cars
      .getById(car.id)
      .then((result) => {
        if (isActive) setDetails(result);
      })
      .catch((cause: unknown) => {
        if (isActive) setError(cause instanceof Error ? cause.message : 'Could not load the car.');
      });

    return () => {
      isActive = false;
    };
  }, [car.id]);

  const provider = details?.provider;

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <OnlineStatusHeader />
      <ScrollView contentContainerStyle={{ padding: 16 }}>
        <Button title="Close" onPress={() => navigation.goBack()} />

        {details?.imageUrl ? (
          <Image
            source={{ uri: details.imageUrl }}
            style={{ width: '100%', height: 200 }}
            resizeMode="contain"
            accessibilityLabel={car.name}
          />
        ) : null}

        <Text>{car.name}</Text>
        <Text>Type: {car.type}</Text>
        <Text>Price: {car.pricePerDay} kr / day</Text>
        <Text>Location: {car.location}</Text>
        {details?.address ? <Text>Address: {details.address}</Text> : null}

        {error ? <Text>{error}</Text> : null}
        {!details && !error ? <Text>Loading details…</Text> : null}

        {details ? (
          <View>
            {details.seats !== undefined ? <Text>Seats: {details.seats}</Text> : null}
            {details.doors !== undefined ? <Text>Doors: {details.doors}</Text> : null}
            {details.automatic !== undefined ? (
              <Text>Gearbox: {details.automatic ? 'Automatic' : 'Manual'}</Text>
            ) : null}
            {details.airconditioning !== undefined ? (
              <Text>Air conditioning: {details.airconditioning ? 'Yes' : 'No'}</Text>
            ) : null}
          </View>
        ) : null}

        <View style={{ height: 16 }} />

        <Text>Provider</Text>
        {provider?.logoUrl ? (
          <Image
            source={{ uri: provider.logoUrl }}
            style={{ width: 120, height: 60 }}
            resizeMode="contain"
            accessibilityLabel={`${provider.name} logo`}
          />
        ) : null}
        <Text>{provider?.name ?? car.vendorName}</Text>
        {provider?.rating !== undefined ? <Text>Rating: {provider.rating}</Text> : null}
        {provider?.minDriverAge !== undefined ? (
          <Text>Minimum driver age: {provider.minDriverAge}</Text>
        ) : null}
        {provider?.description ? <Text>{provider.description}</Text> : null}

        <View style={{ height: 16 }} />

        <Button title="Book" onPress={() => navigation.navigate('ActualBooking', { car })} />
      </ScrollView>
    </SafeAreaView>
  );
}
