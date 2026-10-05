/* ___ SearchResultsScreen ____________________________
    The cars for a search: a summary pill of where the
    search is from, the filter chips (each opens the
    filter sheet), a sort toggle and the result cards.
    Results come from api.cars.search, nearest first
    when the origin could be located.
   ____________________________________________________*/

import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import { ArrowDownUp, ChevronLeft } from 'lucide-react-native';
import { useEffect, useMemo, useState } from 'react';
import { FlatList, Pressable, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { api, distanceKm, type Car, type CarFilters } from '../../api';
import { FilterPanel, type FilterSection } from '../../components/FilterPanel/FilterPanel';
import { OnlineStatusHeader } from '../../components/OnlineStatusHeader';
import { useFilterOptions } from '../../hooks/useFilterOptions';
import type { HomeStackNavigation, HomeStackParamList } from '../../navigation/types';
import { colors } from '../../theme';
import { distanceReference, originLabel, resolveOrigin } from '../../utils/deviceLocation';
import { formatDistance } from '../../utils/places';
import {
  activeFilterCount,
  EMPTY_SELECTION,
  selectionToFilters,
  type FilterSelection,
} from '../../utils/searchFilters';
import { CarCard } from './components/CarCard/CarCard';
import { FilterBar } from './components/FilterBar/FilterBar';
import { styles } from './SearchResultsScreen.styles';

type Props = Omit<NativeStackScreenProps<HomeStackParamList, 'SearchResults'>, 'navigation'> & {
  navigation: HomeStackNavigation<'SearchResults'>;
};

type SortKey = 'nearest' | 'cheapest' | 'priciest';

const SORT_LABELS: Record<SortKey, string> = {
  nearest: 'Nearest',
  cheapest: 'Cheapest',
  priciest: 'Highest price',
};

// which sheet is open: every section, just one, or none (null)
type SheetState = { section?: FilterSection } | null;

export function SearchResultsScreen({ navigation, route }: Props) {
  const { origin, driverAge } = route.params;
  const reference = distanceReference(origin);

  // The search is the located origin + driver age (fixed for this screen) plus
  // the filters last applied in the sheet. Applying replaces `selection`, which
  // re-runs the search, so filtering is explicit rather than as-you-type.
  // `base` is null until the origin is located; no search runs before that.
  const [base, setBase] = useState<CarFilters | null>(null);
  const [selection, setSelection] = useState<FilterSelection>(EMPTY_SELECTION);
  const [sheet, setSheet] = useState<SheetState>(null);
  const [sortIndex, setSortIndex] = useState(0);
  const filterOptions = useFilterOptions();

  const [cars, setCars] = useState<Car[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Locate the origin once (only the current location needs a lookup). If that
  // fails, `near` stays unset, every car is listed, and the reason is shown.
  const [locateError, setLocateError] = useState<string | null>(null);

  useEffect(() => {
    let isActive = true;

    resolveOrigin(origin).then((located) => {
      if (!isActive) return;
      if ('coordinates' in located) {
        setBase({ near: located.coordinates, driverAge });
      } else {
        setLocateError(located.error);
        setBase({ driverAge });
      }
    });

    return () => {
      isActive = false;
    };
  }, [origin, driverAge]);

  useEffect(() => {
    if (!base) return;
    let isActive = true;

    api.cars
      .search({ ...base, ...selectionToFilters(selection) })
      .then((results) => {
        if (!isActive) return;
        setCars(results);
        setError(null);
      })
      .catch((cause: unknown) => {
        if (!isActive) return;
        setError(cause instanceof Error ? cause.message : 'Search failed.');
        setCars([]);
      })
      .finally(() => {
        if (isActive) setIsLoading(false);
      });

    return () => {
      isActive = false;
    };
  }, [base, selection]);

  function applyFilters(next: FilterSelection) {
    setIsLoading(true);
    setSelection(next);
    setSheet(null);
  }

  const near = base?.near;
  const filterCount = activeFilterCount(selection);

  // The api already returns nearest first (or cheapest first without an
  // origin), so only the other orders need sorting here.
  const sorts: SortKey[] = near ? ['nearest', 'cheapest', 'priciest'] : ['cheapest', 'priciest'];
  const sort = sorts[sortIndex % sorts.length];
  const sortedCars = useMemo(() => {
    if (sort === 'cheapest') return [...cars].sort((a, b) => a.pricePerDay - b.pricePerDay);
    if (sort === 'priciest') return [...cars].sort((a, b) => b.pricePerDay - a.pricePerDay);
    return cars;
  }, [cars, sort]);

  const status = !base
    ? `Finding ${reference}…`
    : near
      ? `Closest to ${reference}`
      : 'All locations';

  const listHeader =
    isLoading && !cars.length ? null : (
      <View style={styles.listHeader}>
        <View style={styles.countRow}>
          <Text style={styles.count}>
            {cars.length} {cars.length === 1 ? 'car' : 'cars'} available
          </Text>
          {cars.length > 1 ? (
            <Pressable
              onPress={() => setSortIndex((i) => (i + 1) % sorts.length)}
              accessibilityRole="button"
              accessibilityLabel={`Sort: ${SORT_LABELS[sort]}`}
              style={styles.sortButton}
            >
              <ArrowDownUp size={14} color={colors.textMuted} />
              <Text style={styles.sortText}>{SORT_LABELS[sort]}</Text>
            </Pressable>
          ) : null}
        </View>
        {locateError ? <Text style={styles.note}>{locateError} Showing all cars.</Text> : null}
        {driverAge !== undefined ? (
          <Text style={styles.note}>Providers accepting a driver aged {driverAge}</Text>
        ) : null}
        {filterOptions.error ? <Text style={styles.error}>{filterOptions.error}</Text> : null}
        {error ? <Text style={styles.error}>{error}</Text> : null}
      </View>
    );

  const empty = isLoading ? (
    <Text style={styles.loading}>Searching…</Text>
  ) : error ? null : (
    <View style={styles.emptyCard}>
      <Text style={styles.emptyTitle}>
        {filterCount ? 'No cars match these filters' : 'No cars matched.'}
      </Text>
      {filterCount ? (
        <Pressable
          onPress={() => applyFilters(EMPTY_SELECTION)}
          accessibilityRole="button"
          style={styles.clearButton}
        >
          <Text style={styles.clearText}>Clear filters</Text>
        </Pressable>
      ) : null}
    </View>
  );

  return (
    <SafeAreaView style={styles.safeArea} edges={['top']}>
      <OnlineStatusHeader />

      <View style={styles.top}>
        <View style={styles.topRow}>
          <Pressable
            onPress={() => navigation.goBack()}
            style={styles.backButton}
            accessibilityRole="button"
            accessibilityLabel="Back"
          >
            <ChevronLeft size={20} color={colors.ink} />
          </Pressable>
          <Pressable
            onPress={() => navigation.goBack()}
            style={styles.summary}
            accessibilityRole="button"
            accessibilityLabel="Change search"
          >
            <Text style={styles.summaryTitle} numberOfLines={1}>
              {originLabel(origin)}
            </Text>
            <Text style={styles.summarySubtitle} numberOfLines={1}>
              {status}
            </Text>
          </Pressable>
        </View>

        <FilterBar
          selection={selection}
          enabled={!!base && !!filterOptions.options}
          offersAutomatic={!!filterOptions.options?.transmissions.includes('automatic')}
          onOpen={(section) => setSheet({ section })}
          onToggleAutomatic={() =>
            applyFilters({
              ...selection,
              transmission: selection.transmission === 'automatic' ? undefined : 'automatic',
            })
          }
        />
      </View>

      <FlatList
        data={sortedCars}
        keyExtractor={(car) => car.id}
        contentContainerStyle={styles.list}
        showsVerticalScrollIndicator={false}
        ListHeaderComponent={listHeader}
        ListEmptyComponent={empty}
        ItemSeparatorComponent={() => <View style={styles.separator} />}
        renderItem={({ item }) => (
          <CarCard
            car={item}
            distance={
              near && item.coordinates
                ? `${formatDistance(distanceKm(near, item.coordinates))} away`
                : undefined
            }
            onPress={() => navigation.navigate('PreviewBooking', { car: item })}
          />
        )}
      />

      {sheet && filterOptions.options ? (
        <FilterPanel
          options={filterOptions.options}
          applied={selection}
          only={sheet.section}
          onApply={applyFilters}
          onClose={() => setSheet(null)}
        />
      ) : null}
    </SafeAreaView>
  );
}
