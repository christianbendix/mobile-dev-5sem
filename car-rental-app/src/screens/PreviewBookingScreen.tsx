import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import { Button, Text } from 'react-native';

import { Screen } from '../components/Screen';
import type { RootStackParamList } from '../navigation/types';

type Props = NativeStackScreenProps<RootStackParamList, 'PreviewBooking'>;

export function PreviewBookingScreen({ navigation, route }: Props) {
  const { car } = route.params;

  return (
    <Screen>
      <Text>{car.name}</Text>
      <Text>Vendor: {car.vendorName}</Text>
      <Text>Type: {car.type}</Text>
      <Text>Price: {car.pricePerDay} kr / day</Text>
      <Text>Location: {car.location}</Text>

      <Button title="Book" onPress={() => navigation.navigate('ActualBooking', { car })} />
    </Screen>
  );
}
