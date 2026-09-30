import { useFocusEffect } from '@react-navigation/native';
import { useCallback, useState } from 'react';
import { FlatList, Text, View } from 'react-native';

import { LoginRequired } from '../components/LoginRequired';
import { Screen } from '../components/Screen';
import { useAuth } from '../context/AuthContext';
import { api, type Booking } from '../api';

function BookingSection({ title, bookings }: { title: string; bookings: Booking[] }) {
  return (
    <View style={{ paddingVertical: 8 }}>
      <Text>{title}</Text>
      <FlatList
        data={bookings}
        keyExtractor={(booking) => booking.id}
        ListEmptyComponent={<Text>None.</Text>}
        renderItem={({ item }) => (
          <View style={{ paddingVertical: 4 }}>
            <Text>{item.carName}</Text>
            <Text>{item.vendorName}</Text>
            <Text>
              {item.startDate} → {item.endDate} · {item.totalPrice} kr
            </Text>
          </View>
        )}
      />
    </View>
  );
}

export function BookingsScreen() {
  const { user } = useAuth();
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [error, setError] = useState<string | null>(null);

  // refetch each time the tab is focused, so a fresh booking shows up
  useFocusEffect(
    useCallback(() => {
      if (!user) return;
      let isActive = true;

      setError(null);
      api.bookings
        .listForUser(user.id)
        .then((result) => {
          if (isActive) setBookings(result);
        })
        .catch((cause: unknown) => {
          if (isActive) {
            setError(cause instanceof Error ? cause.message : 'Could not load bookings.');
          }
        });

      return () => {
        isActive = false;
      };
    }, [user]),
  );

  if (!user) return <LoginRequired message="Log in to see your bookings." />;

  return (
    <Screen>
      <Text>My bookings</Text>
      {error ? <Text>{error}</Text> : null}
      <BookingSection title="Active" bookings={bookings.filter((b) => b.status === 'active')} />
      <BookingSection
        title="Completed"
        bookings={bookings.filter((b) => b.status === 'completed')}
      />
    </Screen>
  );
}
