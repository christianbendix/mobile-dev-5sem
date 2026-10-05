/* ___ FilterPanel component __________________________
    The search filters as a bottom sheet: tick lists
    for car type, brand and provider (several can be
    ticked), transmission (one or any) and a price
    range. The options come from the api; nothing is
    applied until "Apply filters". With `only` set the
    sheet shows just that one section (opened from a
    filter chip); without it, every section.
   ____________________________________________________*/

import { Check, X } from 'lucide-react-native';
import { useState } from 'react';
import {
  KeyboardAvoidingView,
  Modal,
  Platform,
  Pressable,
  ScrollView,
  Text,
  View,
} from 'react-native';
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';

import type { FilterOptions, Transmission } from '../../api';
import { colors } from '../../theme';
import { EMPTY_SELECTION, toggle, type FilterSelection } from '../../utils/searchFilters';
import { TextField } from '../TextField/TextField';
import { styles } from './FilterPanel.styles';

export type FilterSection = 'carTypes' | 'brands' | 'vendors' | 'transmission' | 'price';

export const SECTION_TITLES: Record<FilterSection, string> = {
  carTypes: 'Car type',
  brands: 'Brand',
  vendors: 'Provider',
  transmission: 'Transmission',
  price: 'Price per day',
};

const ALL_SECTIONS: FilterSection[] = ['carTypes', 'brands', 'vendors', 'transmission', 'price'];

const TRANSMISSION_LABELS: Record<Transmission, string> = {
  automatic: 'Automatic',
  manual: 'Manual',
};

type Props = {
  options: FilterOptions;
  applied: FilterSelection;
  onApply: (selection: FilterSelection) => void;
  onClose: () => void;
  only?: FilterSection;
};

function OptionRow({
  label,
  accessibilityLabel,
  checked,
  kind,
  onPress,
}: {
  label: string;
  accessibilityLabel: string;
  checked: boolean;
  kind: 'checkbox' | 'radio';
  onPress: () => void;
}) {
  return (
    <Pressable
      onPress={onPress}
      accessibilityRole={kind}
      accessibilityLabel={accessibilityLabel}
      accessibilityState={{ checked }}
      style={styles.option}
    >
      {kind === 'checkbox' ? (
        <View style={[styles.checkbox, checked && styles.checkboxOn]}>
          {checked ? <Check size={14} color={colors.surface} strokeWidth={3} /> : null}
        </View>
      ) : (
        <View style={[styles.radio, checked && styles.radioOn]}>
          {checked ? <View style={styles.radioDot} /> : null}
        </View>
      )}
      <Text style={styles.optionLabel}>{label}</Text>
    </Pressable>
  );
}

export function FilterPanel({ options, applied, onApply, onClose, only }: Props) {
  // edited here, handed over on apply
  const [draft, setDraft] = useState<FilterSelection>(applied);
  const sections = only ? [only] : ALL_SECTIONS;
  const showTitles = !only;

  function checkList(section: 'carTypes' | 'brands' | 'vendors', values: string[]) {
    const title = SECTION_TITLES[section];
    return values.map((value) => (
      <OptionRow
        key={value}
        kind="checkbox"
        label={value}
        accessibilityLabel={`${title}: ${value}`}
        checked={draft[section].includes(value)}
        onPress={() => setDraft((d) => ({ ...d, [section]: toggle(d[section], value) }))}
      />
    ));
  }

  function renderSection(section: FilterSection) {
    switch (section) {
      case 'carTypes':
        return checkList('carTypes', options.carTypes);
      case 'brands':
        return checkList('brands', options.brands);
      case 'vendors':
        return checkList('vendors', options.vendors);
      case 'transmission':
        return [
          { label: 'Any' } as { value?: Transmission; label: string },
          ...options.transmissions.map((value) => ({ value, label: TRANSMISSION_LABELS[value] })),
        ].map(({ value, label }) => (
          <OptionRow
            key={label}
            kind="radio"
            label={label}
            accessibilityLabel={`Transmission: ${label}`}
            checked={draft.transmission === value}
            onPress={() => setDraft((d) => ({ ...d, transmission: value }))}
          />
        ));
      case 'price':
        return (
          <>
            {options.priceRange ? (
              <Text style={styles.sectionHint}>
                {options.priceRange.min}–{options.priceRange.max} kr on offer
              </Text>
            ) : null}
            <View style={styles.priceRow}>
              <View style={styles.priceCell}>
                <TextField
                  label="Min (kr)"
                  value={draft.minPrice}
                  onChangeText={(minPrice) => setDraft((d) => ({ ...d, minPrice }))}
                  placeholder={options.priceRange ? `${options.priceRange.min}` : 'No limit'}
                  keyboardType="number-pad"
                  accessibilityLabel="Minimum price per day"
                />
              </View>
              <View style={styles.priceCell}>
                <TextField
                  label="Max (kr)"
                  value={draft.maxPrice}
                  onChangeText={(maxPrice) => setDraft((d) => ({ ...d, maxPrice }))}
                  placeholder={options.priceRange ? `${options.priceRange.max}` : 'No limit'}
                  keyboardType="number-pad"
                  accessibilityLabel="Maximum price per day"
                />
              </View>
            </View>
          </>
        );
    }
  }

  return (
    <Modal visible transparent animationType="slide" onRequestClose={onClose}>
      {/* a Modal is outside the app's SafeAreaProvider, so it needs its own */}
      <SafeAreaProvider>
        <KeyboardAvoidingView
          style={styles.root}
          behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        >
          <Pressable
            style={styles.backdrop}
            onPress={onClose}
            accessibilityRole="button"
            accessibilityLabel="Close filters"
          />
          <SafeAreaView style={styles.sheet} edges={['bottom']}>
            <View style={styles.handle} />
            <View style={styles.header}>
              <Text style={styles.title}>{only ? SECTION_TITLES[only] : 'Filters'}</Text>
              <Pressable
                onPress={onClose}
                style={styles.closeButton}
                accessibilityRole="button"
                accessibilityLabel="Close"
              >
                <X size={18} color={colors.ink} />
              </Pressable>
            </View>

            <ScrollView
              contentContainerStyle={styles.body}
              keyboardShouldPersistTaps="handled"
              showsVerticalScrollIndicator={false}
            >
              {sections.map((section) => (
                <View key={section} style={styles.section}>
                  {showTitles ? (
                    <Text style={styles.sectionTitle}>{SECTION_TITLES[section]}</Text>
                  ) : null}
                  {renderSection(section)}
                </View>
              ))}
            </ScrollView>

            <View style={styles.footer}>
              <Pressable
                onPress={() => onApply(EMPTY_SELECTION)}
                accessibilityRole="button"
                style={({ pressed }) => [styles.resetButton, pressed && styles.pressed]}
              >
                <Text style={styles.resetText}>Reset</Text>
              </Pressable>
              <Pressable
                onPress={() => onApply(draft)}
                accessibilityRole="button"
                style={({ pressed }) => [styles.applyButton, pressed && styles.pressed]}
              >
                <Text style={styles.applyText}>Apply filters</Text>
              </Pressable>
            </View>
          </SafeAreaView>
        </KeyboardAvoidingView>
      </SafeAreaProvider>
    </Modal>
  );
}
