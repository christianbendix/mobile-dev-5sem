/* ___ PreviewBookingScreen ___________________________
    Full-screen details for one listing: the car, its
    specs, the provider and where it is picked up, and
    the price bar with "Book". The `car` param is what
    the list already had, so it renders straight away;
    the rest (specs, provider info, address) is fetched
    through api.cars.getById.
   ____________________________________________________*/

import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import {
  Car as CarIcon,
  ChevronLeft,
  Cog,
  DoorOpen,
  MapPin,
  Navigation,
  Snowflake,
  Users,
  type LucideIcon,
} from 'lucide-react-native';
import { useEffect, useState } from 'react';
import { Image, Linking, Pressable, ScrollView, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { api, type Car, type CarDetails } from '../../api';
import { OnlineStatusHeader } from '../../components/OnlineStatusHeader';
import { VendorLogo } from '../../components/VendorLogo/VendorLogo';
import type { RootStackParamList } from '../../navigation/types';
import { colors } from '../../theme';
import { directionsUrl } from '../../utils/rentals';
import { styles } from './PreviewBookingScreen.styles';

type Props = NativeStackScreenProps<RootStackParamList, 'PreviewBooking'>;

type Spec = { icon: LucideIcon; value: string; label: string };

/** The tiles worth showing: only what the listing actually says. */
function specsFor(car: Car & Partial<CarDetails>): Spec[] {
  const specs: Spec[] = [];
  if (car.seats) specs.push({ icon: Users, value: `${car.seats}`, label: 'Seats' });
  if (car.doors) specs.push({ icon: DoorOpen, value: `${car.doors}`, label: 'Doors' });
  if (car.transmission) {
    specs.push({
      icon: Cog,
      value: car.transmission === 'automatic' ? 'Auto' : 'Manual',
      label: 'Gearbox',
    });
  }
  if (car.airconditioning !== undefined) {
    specs.push({
      icon: Snowflake,
      value: car.airconditioning ? 'Yes' : 'No',
      label: 'Air con',
    });
  }
  return specs;
}

export function PreviewBookingScreen({ navigation, route }: Props) {
  const { car } = route.params;
  const insets = useSafeAreaInsets();

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

  // what the list had until the details arrive
  const shown = details ?? car;
  const provider = details?.provider;
  const imageUrl = shown.imageUrl;
  const specs = specsFor(shown);
  const minDriverAge = provider?.minDriverAge ?? car.minDriverAge;

  return (
    <View style={styles.screen}>
      <ScrollView contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false}>
        <View style={[styles.hero, { paddingTop: insets.top }]}>
          <OnlineStatusHeader />
          <View style={styles.heroTop}>
            <Pressable
              onPress={() => navigation.goBack()}
              style={styles.roundButton}
              accessibilityRole="button"
              accessibilityLabel="Close"
            >
              <ChevronLeft size={20} color={colors.ink} />
            </Pressable>
          </View>
          <View style={styles.photo}>
            {imageUrl ? (
              <Image
                source={{ uri: imageUrl }}
                style={styles.image}
                resizeMode="contain"
                accessibilityLabel={car.name}
              />
            ) : (
              <CarIcon size={88} color={colors.iconMuted} strokeWidth={1.2} />
            )}
          </View>
        </View>

        <View style={styles.body}>
          {car.type ? (
            <View style={styles.typePill}>
              <Text style={styles.typeText}>{car.type}</Text>
            </View>
          ) : null}
          <Text style={styles.name}>{car.name}</Text>
          <Text style={styles.subtitle}>or similar · {car.location}</Text>
          {error ? <Text style={[styles.status, styles.error]}>{error}</Text> : null}
          {!details && !error ? <Text style={styles.status}>Loading details…</Text> : null}

          {specs.length ? (
            <View style={styles.specs}>
              {specs.map(({ icon: Icon, value, label }) => (
                <View key={label} style={styles.spec}>
                  <Icon size={18} color={colors.primary} />
                  <View>
                    <Text style={styles.specValue} numberOfLines={1}>
                      {value}
                    </Text>
                    <Text style={styles.specLabel}>{label}</Text>
                  </View>
                </View>
              ))}
            </View>
          ) : null}

          <Text style={styles.sectionTitle}>Provider</Text>
          <View style={styles.provider}>
            <View style={styles.providerTop}>
              <VendorLogo
                name={car.vendorName}
                logoUrl={provider?.logoUrl ?? car.vendorLogoUrl}
                size={44}
              />
              <View style={styles.providerText}>
                <View style={styles.providerNameRow}>
                  <Text style={styles.providerName} numberOfLines={1}>
                    {provider?.name ?? car.vendorName}
                  </Text>
                  {provider?.rating !== undefined ? (
                    <View style={styles.rating} accessibilityLabel={`Rating ${provider.rating}`}>
                      <Text style={styles.ratingText}>{provider.rating}</Text>
                    </View>
                  ) : null}
                </View>
                {minDriverAge !== undefined ? (
                  <Text style={styles.providerMeta}>Drivers aged {minDriverAge}+</Text>
                ) : null}
              </View>
            </View>
            {provider?.description ? (
              <Text style={styles.description}>{provider.description}</Text>
            ) : null}
          </View>

          <Text style={styles.sectionTitle}>Pick-up &amp; return</Text>
          <View style={styles.pickup}>
            <View style={styles.pickupIcon}>
              <MapPin size={20} color={colors.surface} />
            </View>
            <View style={styles.pickupText}>
              <Text style={styles.pickupName} numberOfLines={1}>
                {car.location}
              </Text>
              {details?.address ? (
                <Text style={styles.pickupAddress} numberOfLines={2}>
                  {details.address}
                </Text>
              ) : null}
            </View>
            <Pressable
              onPress={() => Linking.openURL(directionsUrl(car))}
              accessibilityRole="link"
              accessibilityLabel={`Directions to ${car.location}`}
              style={styles.directions}
            >
              <Navigation size={14} color={colors.ink} />
              <Text style={styles.directionsText}>Directions</Text>
            </Pressable>
          </View>
        </View>
      </ScrollView>

      <View style={[styles.bar, { paddingBottom: Math.max(insets.bottom, 16) + 8 }]}>
        <View style={styles.priceWrap} accessibilityLabel={`${car.pricePerDay} kr per day`}>
          <Text style={styles.price}>{car.pricePerDay} kr</Text>
          <Text style={styles.perDay}>per day</Text>
        </View>
        <Pressable
          onPress={() => navigation.navigate('ActualBooking', { car })}
          accessibilityRole="button"
          style={({ pressed }) => [styles.bookButton, pressed && styles.bookPressed]}
        >
          <Text style={styles.bookText}>Book</Text>
        </Pressable>
      </View>
    </View>
  );
}
