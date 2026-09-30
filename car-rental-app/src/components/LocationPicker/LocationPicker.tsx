/* ___ LocationPicker component _______________________
    Full-screen sheet for choosing one of our rental
    locations (from the backend). With an empty search
    field it lists them all; typing filters the list
    locally, fx "arhus", "kbh" or "odense st".
    The parent decides what happens with the choice.
   ____________________________________________________*/

import { Search, X } from 'lucide-react-native';
import { useMemo, useState } from 'react';
import { FlatList, Modal, Pressable, Text, TextInput, View } from 'react-native';
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';

import { useRentalLocations } from '../../hooks/useRentalLocations';
import { colors } from '../../theme';
import type { SelectedPlace } from '../../types/search';
import { matchesRentalLocation, rentalLocationToPlace } from '../../utils/places';
import { styles } from './LocationPicker.styles';
import { LocationRow } from './LocationRow';

type Props = {
  visible: boolean;
  title: string;
  selected: SelectedPlace | null;
  onSelect: (place: SelectedPlace) => void;
  onClose: () => void;
};

export function LocationPicker({ visible, title, selected, onSelect, onClose }: Props) {
  const [query, setQuery] = useState('');
  const { locations, error, isLoading } = useRentalLocations();

  const places = useMemo(
    () =>
      locations
        .filter((location) => matchesRentalLocation(location, query))
        .map(rentalLocationToPlace)
        .sort((a, b) => a.label.localeCompare(b.label)),
    [locations, query],
  );

  function close() {
    setQuery('');
    onClose();
  }

  function choose(place: SelectedPlace) {
    setQuery('');
    onSelect(place);
  }

  const nothingFound = !isLoading && !error && query.trim() !== '' && places.length === 0;

  return (
    <Modal
      visible={visible}
      animationType="slide"
      presentationStyle="pageSheet"
      onRequestClose={close}
    >
      {/* a Modal is outside the app's SafeAreaProvider, so it needs its own */}
      <SafeAreaProvider>
        <SafeAreaView style={styles.container} edges={['top', 'bottom']}>
          <View style={styles.header}>
            <Text style={styles.title}>{title}</Text>
            <Pressable
              onPress={close}
              style={styles.closeButton}
              accessibilityRole="button"
              accessibilityLabel="Close"
            >
              <X size={20} color={colors.ink} />
            </Pressable>
          </View>

          <View style={styles.searchBox}>
            <Search size={18} color={colors.textSubtle} />
            <TextInput
              value={query}
              onChangeText={setQuery}
              placeholder="City, station or airport"
              placeholderTextColor={colors.iconMuted}
              autoFocus
              autoCorrect={false}
              returnKeyType="search"
              style={styles.input}
            />
            {query ? (
              <Pressable onPress={() => setQuery('')} accessibilityLabel="Clear search">
                <X size={16} color={colors.textSubtle} />
              </Pressable>
            ) : null}
          </View>

          <FlatList
            data={places}
            keyExtractor={(place) => place.id}
            keyboardShouldPersistTaps="handled"
            contentContainerStyle={styles.list}
            ListHeaderComponent={
              places.length > 0 ? (
                <Text style={styles.sectionTitle}>Our rental locations</Text>
              ) : null
            }
            renderItem={({ item }) => (
              <LocationRow
                place={item}
                selected={selected?.id === item.id}
                onPress={() => choose(item)}
              />
            )}
            ListFooterComponent={
              <View style={styles.footer}>
                {isLoading ? <Text style={styles.status}>Loading rental locations…</Text> : null}
                {error ? <Text style={styles.status}>{error}</Text> : null}
                {nothingFound ? (
                  <Text style={styles.status}>
                    We have no rental location matching “{query.trim()}”.
                  </Text>
                ) : null}
              </View>
            }
          />
        </SafeAreaView>
      </SafeAreaProvider>
    </Modal>
  );
}
