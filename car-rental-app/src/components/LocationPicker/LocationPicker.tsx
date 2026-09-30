/* ___ LocationPicker component _______________________
    Full-screen sheet for choosing where to search
    from: the user's current location, a Danish
    address (autocompleted as you type - pick a street,
    then a house number), or one of our rental
    locations. Typing also filters the rental
    locations locally, fx "arhus", "kbh" or "odense st".
    The parent decides what happens with the choice.
   ____________________________________________________*/

import { Search, X } from 'lucide-react-native';
import { useMemo, useState } from 'react';
import { FlatList, Modal, Pressable, Text, TextInput, View } from 'react-native';
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';

import { useAddressSuggestions } from '../../hooks/useAddressSuggestions';
import { useRentalLocations } from '../../hooks/useRentalLocations';
import { colors } from '../../theme';
import type { SearchOrigin } from '../../types/search';
import { matchesRentalLocation, rentalLocationToPlace } from '../../utils/places';
import { styles } from './LocationPicker.styles';
import { LocationRow } from './LocationRow';

type Props = {
  visible: boolean;
  title: string;
  selected: SearchOrigin | null;
  onSelect: (origin: SearchOrigin) => void;
  onClose: () => void;
};

export function LocationPicker({ visible, title, selected, onSelect, onClose }: Props) {
  const [query, setQuery] = useState('');
  const { locations, error, isLoading } = useRentalLocations();
  const addresses = useAddressSuggestions(query);

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

  function choose(origin: SearchOrigin) {
    setQuery('');
    onSelect(origin);
  }

  const selectedPlaceId = selected?.kind === 'place' ? selected.place.id : null;

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
              placeholder="Address, city, station or airport"
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
              <View>
                <Pressable onPress={() => choose({ kind: 'current' })} accessibilityRole="button">
                  <Text>Use my current location</Text>
                </Pressable>
                {addresses.suggestions.length > 0 ? <Text>Addresses</Text> : null}
                {addresses.suggestions.map((suggestion) =>
                  suggestion.kind === 'street' ? (
                    // a street has no position yet: fill it in and keep typing
                    <Pressable
                      key={`street-${suggestion.label}`}
                      onPress={() => setQuery(suggestion.completion)}
                      accessibilityRole="button"
                    >
                      <Text>{suggestion.label} …</Text>
                    </Pressable>
                  ) : (
                    <Pressable
                      key={suggestion.id}
                      onPress={() =>
                        choose({
                          kind: 'address',
                          label: suggestion.label,
                          coordinates: suggestion.coordinates,
                        })
                      }
                      accessibilityRole="button"
                    >
                      <Text>{suggestion.label}</Text>
                    </Pressable>
                  ),
                )}
                {addresses.error ? <Text>{addresses.error}</Text> : null}
                {places.length > 0 ? (
                  <Text style={styles.sectionTitle}>Our rental locations</Text>
                ) : null}
              </View>
            }
            renderItem={({ item }) => (
              <LocationRow
                place={item}
                selected={selectedPlaceId === item.id}
                onPress={() => choose({ kind: 'place', place: item })}
              />
            )}
            ListFooterComponent={
              <View style={styles.footer}>
                {isLoading ? <Text style={styles.status}>Loading rental locations…</Text> : null}
                {error ? <Text style={styles.status}>{error}</Text> : null}
              </View>
            }
          />
        </SafeAreaView>
      </SafeAreaProvider>
    </Modal>
  );
}
