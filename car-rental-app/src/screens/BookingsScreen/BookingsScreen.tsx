/* ___ BookingsScreen _________________________________
    The My Rentals tab: the user's upcoming rentals as
    dark cards (soonest first) and the finished ones
    in a list (newest first). From here the user can
    get directions to a pickup, open a booked car, or
    book a past car again. A guest gets the login gate.
   ____________________________________________________*/

import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { Pressable, ScrollView, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import type { Car } from '../../api';
import { LoginRequired } from '../../components/LoginRequired';
import { OnlineStatusHeader } from '../../components/OnlineStatusHeader';
import { useAuth } from '../../context/AuthContext';
import { useUserBookings } from '../../hooks/useUserBookings';
import type { RootStackParamList } from '../../navigation/types';
import { splitRentals, todayIso } from '../../utils/rentals';
import { PastRentalRow } from './components/PastRentalRow/PastRentalRow';
import { UpcomingRentalCard } from './components/UpcomingRentalCard/UpcomingRentalCard';
import { styles } from './BookingsScreen.styles';

export function BookingsScreen() {
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const { user } = useAuth();
  const { bookings, error, isLoading } = useUserBookings(user);

  if (!user) return <LoginRequired title="My Rentals" message="Log in to see your bookings." />;

  const { upcoming, past } = splitRentals(bookings);
  const today = todayIso();
  const openCar = (car: Car) => navigation.navigate('PreviewBooking', { car });

  return (
    <SafeAreaView style={styles.safeArea} edges={['top']}>
      <OnlineStatusHeader />
      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        <Text style={styles.title}>My Rentals</Text>

        {error ? <Text style={[styles.message, styles.error]}>{error}</Text> : null}
        {isLoading && !bookings.length ? (
          <Text style={styles.message}>Loading your rentals…</Text>
        ) : (
          <>
            <Text style={styles.sectionTitle}>Upcoming</Text>
            {upcoming.length ? (
              <View style={styles.cards}>
                {upcoming.map((booking) => (
                  <UpcomingRentalCard
                    key={booking.id}
                    booking={booking}
                    today={today}
                    onViewCar={openCar}
                  />
                ))}
              </View>
            ) : (
              <View style={styles.emptyCard}>
                <Text style={styles.emptyTitle}>No upcoming rentals</Text>
                <Text style={styles.emptyText}>Your next booking will show up here.</Text>
                <Pressable
                  onPress={() => navigation.navigate('MainTabs', { screen: 'Home' })}
                  accessibilityRole="button"
                  style={styles.findButton}
                >
                  <Text style={styles.findText}>Find a car</Text>
                </Pressable>
              </View>
            )}

            {past.length ? (
              <>
                <Text style={styles.sectionTitle}>Past</Text>
                <View style={styles.pastList}>
                  {past.map((booking, index) => (
                    <PastRentalRow
                      key={booking.id}
                      booking={booking}
                      last={index === past.length - 1}
                      onBookAgain={openCar}
                    />
                  ))}
                </View>
              </>
            ) : null}
          </>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}
