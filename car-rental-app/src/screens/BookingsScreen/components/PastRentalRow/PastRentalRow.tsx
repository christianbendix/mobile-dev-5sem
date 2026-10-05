/* ___ PastRentalRow component ________________________
    One finished rental. "Book again" opens the same
    listing's details, so it only shows when the
    listing is still viewable.
   ____________________________________________________*/

import { Pressable, Text, View } from 'react-native';

import type { Booking, Car } from '../../../../api';
import { formatDateRange } from '../../../../utils/rentals';
import { styles } from './PastRentalRow.styles';

type Props = { booking: Booking; last: boolean; onBookAgain: (car: Car) => void };

export function PastRentalRow({ booking, last, onBookAgain }: Props) {
  const { car } = booking;

  return (
    <View style={[styles.row, !last && styles.divider]}>
      <View style={styles.text}>
        <Text style={styles.name} numberOfLines={1}>
          {booking.carName}
        </Text>
        <Text style={styles.meta} numberOfLines={1}>
          {formatDateRange(booking.startDate, booking.endDate, true)} · {booking.vendorName}
        </Text>
      </View>
      <View style={styles.right}>
        <Text style={styles.total}>{booking.totalPrice} kr</Text>
        {car ? (
          <Pressable onPress={() => onBookAgain(car)} accessibilityRole="button" hitSlop={8}>
            <Text style={styles.again}>Book again</Text>
          </Pressable>
        ) : null}
      </View>
    </View>
  );
}
