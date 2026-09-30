import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import { useEffect, useState } from 'react';
import { Alert, Button, Text, TextInput } from 'react-native';

import { api, estimateTotal, rentalDays } from '../api';
import { Screen } from '../components/Screen';
import { useAuth } from '../context/AuthContext';
import type { RootStackParamList } from '../navigation/types';

type Props = NativeStackScreenProps<RootStackParamList, 'ActualBooking'>;

function isoDate(offsetDays: number): string {
  const date = new Date();
  date.setDate(date.getDate() + offsetDays);
  return date.toISOString().slice(0, 10);
}

export function ActualBookingScreen({ navigation, route }: Props) {
  const { car } = route.params;
  const { user } = useAuth();

  const [startDate, setStartDate] = useState(isoDate(0));
  const [endDate, setEndDate] = useState(isoDate(1));
  const [fullName, setFullName] = useState(user?.name ?? '');
  const [phone, setPhone] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Login gate. Replace rather than push, so a cancelled login does not leave
  // an unusable booking form underneath; the redirect brings it back with the
  // same car once the login succeeds.
  useEffect(() => {
    if (!user) {
      navigation.replace('Login', { redirectTo: { screen: 'ActualBooking', params: { car } } });
    }
  }, [user, navigation, car]);

  if (!user) return null;

  async function handleConfirm() {
    setIsSubmitting(true);
    try {
      const booking = await api.bookings.create({
        carId: car.id,
        startDate,
        endDate,
        fullName,
        phone,
      });
      navigation.replace('BookingConfirmation', { booking });
    } catch (cause) {
      const message = cause instanceof Error ? cause.message : 'Booking failed.';
      // requirement: surface the failure, then drop the user back on Home
      Alert.alert('Booking failed', message, [
        { text: 'OK', onPress: () => navigation.navigate('MainTabs', { screen: 'Home' }) },
      ]);
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <Screen>
      <Text>Booking {car.name}</Text>
      <Text>{car.vendorName}</Text>

      <Text>Pickup date (YYYY-MM-DD)</Text>
      <TextInput
        value={startDate}
        onChangeText={setStartDate}
        style={{ borderWidth: 1, padding: 8 }}
      />

      <Text>Return date (YYYY-MM-DD)</Text>
      <TextInput value={endDate} onChangeText={setEndDate} style={{ borderWidth: 1, padding: 8 }} />

      <Text>Full name</Text>
      <TextInput
        value={fullName}
        onChangeText={setFullName}
        style={{ borderWidth: 1, padding: 8 }}
      />

      <Text>Phone</Text>
      <TextInput
        value={phone}
        onChangeText={setPhone}
        keyboardType="phone-pad"
        style={{ borderWidth: 1, padding: 8 }}
      />

      <Text>
        {rentalDays(startDate, endDate)} day(s) · {estimateTotal(car, startDate, endDate)} kr
      </Text>

      <Button
        title={isSubmitting ? 'Booking…' : 'Confirm booking'}
        onPress={handleConfirm}
        disabled={isSubmitting}
      />
    </Screen>
  );
}
