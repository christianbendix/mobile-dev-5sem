import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import { Button, Text } from 'react-native';

import { Screen } from '../components/Screen';
import type { RootStackParamList } from '../navigation/types';

type Props = NativeStackScreenProps<RootStackParamList, 'BookingConfirmation'>;

export function BookingConfirmationScreen({ navigation, route }: Props) {
  const { booking } = route.params;

  return (
    <Screen>
      <Text>Booking confirmed</Text>
      <Text>Reference: {booking.id}</Text>
      <Text>Car: {booking.carName}</Text>
      <Text>Vendor: {booking.vendorName}</Text>
      <Text>
        {booking.startDate} → {booking.endDate}
      </Text>
      <Text>Total: {booking.totalPrice} kr</Text>
      <Text>Status: {booking.status}</Text>

      <Button
        title="Go to my bookings"
        onPress={() => navigation.replace('MainTabs', { screen: 'Bookings' })}
      />
    </Screen>
  );
}
