/* ___ HomeScreen _____________________________________
    The front page of the app ("Where are you driving
    next?"): greeting, the search card, the cheapest
    offers from the backend and recent searches.
    All data comes from hooks - the screen itself
    never calls the api or imports mock data.
   ____________________________________________________*/

import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { ScrollView, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { Avatar } from '../../components/Avatar/Avatar';
import { OnlineStatusHeader } from '../../components/OnlineStatusHeader';
import { useAuth } from '../../context/AuthContext';
import { useHighlightedCars } from '../../hooks/useHighlightedCars';
import { useRecentSearches } from '../../hooks/useRecentSearches';
import { useSearchForm } from '../../hooks/useSearchForm';
import type { RootStackParamList } from '../../navigation/types';
import { filtersForPlace } from '../../utils/places';
import { OfferItem } from './components/OfferItem/OfferItem';
import { RecentSearchItem } from './components/RecentSearchItem/RecentSearchItem';
import { SearchCard } from './components/SearchCard/SearchCard';
import { styles } from './HomeScreen.styles';

export function HomeScreen() {
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const { user } = useAuth();
  const form = useSearchForm();
  const { recentSearches } = useRecentSearches();
  const { cars, error, isLoading } = useHighlightedCars();

  // Guests have no name, so they get a generic greeting and no avatar
  const firstName = user?.name.split(' ')[0];

  return (
    <SafeAreaView style={styles.safeArea} edges={['top']}>
      <OnlineStatusHeader />
      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        <View style={styles.header}>
          <View>
            <Text style={styles.greeting}>{firstName ? `Hi ${firstName}` : 'Hi there'}</Text>
            <Text style={styles.title}>Where are you{'\n'}driving next?</Text>
          </View>
          {firstName ? <Avatar initial={firstName[0].toUpperCase()} /> : null}
        </View>

        <SearchCard
          form={form}
          onSearch={() =>
            navigation.navigate('SearchResults', {
              filters: form.filters,
              placeLabel: form.pickupPlace?.label,
            })
          }
        />

        {/* Cheapest offers, loaded from the backend */}
        <Text style={styles.sectionTitle}>Highlighted offers</Text>
        {error ? <Text style={styles.message}>{error}</Text> : null}
        {isLoading ? <Text style={styles.message}>Loading offers…</Text> : null}
        <View style={styles.list}>
          {cars.map((car) => (
            <OfferItem
              key={car.id}
              car={car}
              onPress={() => navigation.navigate('PreviewBooking', { car })}
            />
          ))}
        </View>

        <Text style={styles.sectionTitle}>Recent searches</Text>
        <View style={styles.list}>
          {recentSearches.map((s) => (
            <RecentSearchItem
              key={s.id}
              search={s}
              onPress={() =>
                navigation.navigate('SearchResults', {
                  filters: filtersForPlace(s.place),
                  placeLabel: s.place.label,
                })
              }
            />
          ))}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
