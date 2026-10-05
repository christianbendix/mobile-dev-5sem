/* ___ CarCard component ______________________________
    One search result. Takes a `Car` straight from the
    api layer; the pills only show what the listing
    actually says (seats, gearbox, minimum driver age)
    plus the distance when the search has an origin.
   ____________________________________________________*/

import { Car as CarIcon, Cog, MapPin, Navigation, UserCheck, Users } from 'lucide-react-native';
import type { ReactNode } from 'react';
import { Image, Pressable, Text, View } from 'react-native';

import type { Car } from '../../../../api';
import { VendorLogo } from '../../../../components/VendorLogo/VendorLogo';
import { colors } from '../../../../theme';
import { styles } from './CarCard.styles';

type Props = {
  car: Car;
  /** fx "2.3 km away"; left out when the search has no origin */
  distance?: string;
  onPress: () => void;
};

function Pill({ icon, label }: { icon: ReactNode; label: string }) {
  return (
    <View style={styles.pill}>
      {icon}
      <Text style={styles.pillText}>{label}</Text>
    </View>
  );
}

export function CarCard({ car, distance, onPress }: Props) {
  const iconProps = { size: 14, color: colors.ink };
  // "Toyota · Economy", skipping whichever is missing; the make is often
  // already in the name, so only the type is shown then
  const subtitle = [car.name.startsWith(car.make) ? '' : car.make, car.type]
    .filter(Boolean)
    .join(' · ');

  return (
    <Pressable
      onPress={onPress}
      accessibilityRole="button"
      style={({ pressed }) => [styles.card, pressed && styles.pressed]}
    >
      <View style={styles.top}>
        <View style={styles.titleWrap}>
          <Text style={styles.name} numberOfLines={1}>
            {car.name}
          </Text>
          <Text style={styles.subtitle} numberOfLines={1}>
            or similar{subtitle ? ` · ${subtitle}` : ''}
          </Text>
        </View>
        <View style={styles.priceWrap}>
          <Text style={styles.price}>{car.pricePerDay} kr</Text>
          <Text style={styles.perDay}>per day</Text>
        </View>
      </View>

      <View style={styles.imageWell}>
        {car.imageUrl ? (
          <Image source={{ uri: car.imageUrl }} style={styles.image} resizeMode="contain" />
        ) : (
          <CarIcon size={56} color={colors.iconMuted} strokeWidth={1.5} />
        )}
      </View>

      <View style={styles.pills}>
        {car.seats ? <Pill icon={<Users {...iconProps} />} label={`${car.seats}`} /> : null}
        {car.transmission ? (
          <Pill
            icon={<Cog {...iconProps} />}
            label={car.transmission === 'automatic' ? 'Auto' : 'Manual'}
          />
        ) : null}
        {car.minDriverAge ? (
          <Pill icon={<UserCheck {...iconProps} />} label={`Driver ${car.minDriverAge}+`} />
        ) : null}
        {distance ? <Pill icon={<Navigation {...iconProps} />} label={distance} /> : null}
      </View>

      <View style={styles.footer}>
        <View style={styles.vendorWrap}>
          <VendorLogo name={car.vendorName} logoUrl={car.vendorLogoUrl} />
          <Text style={styles.vendor} numberOfLines={1}>
            {car.vendorName}
          </Text>
        </View>
        <View style={styles.locationWrap}>
          <MapPin size={13} color={colors.textMuted} />
          <Text style={styles.location} numberOfLines={1} testID="car-location">
            {car.location}
          </Text>
        </View>
      </View>
    </Pressable>
  );
}
