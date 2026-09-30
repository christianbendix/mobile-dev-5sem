/* ___ OfferItem component ____________________________
    One row in the "Highlighted offers" list: car
    icon, car name, vendor + location and the daily
    price. Takes a `Car` straight from the api layer.
   ____________________________________________________*/

import { Car as CarIcon } from 'lucide-react-native';
import { Pressable, Text, View } from 'react-native';

import type { Car } from '../../../../api';
import { colors } from '../../../../theme';
import { styles } from './OfferItem.styles';

type Props = { car: Car; onPress: () => void };

export function OfferItem({ car, onPress }: Props) {
  return (
    <Pressable onPress={onPress} style={({ pressed }) => [styles.row, pressed && styles.pressed]}>
      <View style={styles.iconBox}>
        <CarIcon size={18} color={colors.primary} />
      </View>
      <View style={styles.textWrap}>
        <Text style={styles.title}>{car.name}</Text>
        <Text style={styles.subtitle} numberOfLines={1}>
          {car.vendorName} · {car.location}
        </Text>
      </View>
      <View style={styles.priceWrap}>
        <Text style={styles.price}>{car.pricePerDay} kr</Text>
        <Text style={styles.perDay}>/day</Text>
      </View>
    </Pressable>
  );
}
