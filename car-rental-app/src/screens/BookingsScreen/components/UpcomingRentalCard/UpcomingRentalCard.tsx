/* ___ UpcomingRentalCard component ___________________
    One upcoming (or running) rental. "Directions"
    opens maps to the pickup and "View car" the car's
    details; both need the booked listing, so they are
    left out when it is not viewable.
   ____________________________________________________*/

import { Car as CarIcon, Navigation } from 'lucide-react-native';
import { Image, Linking, Pressable, Text, View } from 'react-native';

import type { Booking, Car } from '../../../../api';
import { colors } from '../../../../theme';
import { directionsUrl, formatDateRange, rentalStatusLabel } from '../../../../utils/rentals';
import { styles } from './UpcomingRentalCard.styles';

type Props = {
  booking: Booking;
  /** YYYY-MM-DD, for the "in N days" pill */
  today: string;
  onViewCar: (car: Car) => void;
};

export function UpcomingRentalCard({ booking, today, onViewCar }: Props) {
  const { car } = booking;

  return (
    <View style={styles.card}>
      <View style={styles.top}>
        <View style={styles.topText}>
          <View style={styles.status}>
            <Text style={styles.statusText}>{rentalStatusLabel(booking, today)}</Text>
          </View>
          <Text style={styles.name} numberOfLines={1}>
            {booking.carName}
          </Text>
          <Text style={styles.meta} numberOfLines={1}>
            {formatDateRange(booking.startDate, booking.endDate)} · {booking.vendorName}
          </Text>
        </View>
        <View style={styles.photo}>
          {car?.imageUrl ? (
            <Image source={{ uri: car.imageUrl }} style={styles.image} resizeMode="contain" />
          ) : (
            <CarIcon size={28} color={colors.textMuted} strokeWidth={1.5} />
          )}
        </View>
      </View>

      <View style={styles.facts}>
        <View style={styles.fact}>
          <Text style={styles.factLabel}>Reference</Text>
          <Text style={[styles.factValue, styles.reference]} numberOfLines={1}>
            {booking.id}
          </Text>
        </View>
        <View style={styles.fact}>
          <Text style={styles.factLabel}>Total</Text>
          <Text style={styles.factValue}>{booking.totalPrice} kr</Text>
        </View>
      </View>

      {car ? (
        <View style={styles.actions}>
          <Pressable
            onPress={() => Linking.openURL(directionsUrl(car))}
            accessibilityRole="link"
            accessibilityLabel={`Directions to ${car.location}`}
            style={({ pressed }) => [styles.primaryAction, pressed && styles.pressed]}
          >
            <Navigation size={16} color={colors.ink} />
            <Text style={styles.primaryActionText}>Directions</Text>
          </Pressable>
          <Pressable
            onPress={() => onViewCar(car)}
            accessibilityRole="button"
            style={({ pressed }) => [styles.secondaryAction, pressed && styles.pressed]}
          >
            <Text style={styles.secondaryActionText}>View car</Text>
          </Pressable>
        </View>
      ) : null}
    </View>
  );
}
