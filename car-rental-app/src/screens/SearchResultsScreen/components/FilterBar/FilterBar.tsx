/* ___ FilterBar component ____________________________
    The chip row above the results. The round button
    opens every filter; the chips with a caret open
    the sheet on just their section, and "Automatic"
    toggles straight away. Disabled until the filter
    options have loaded.
   ____________________________________________________*/

import { ChevronDown, SlidersHorizontal } from 'lucide-react-native';
import { Pressable, ScrollView, Text, View } from 'react-native';

import { SECTION_TITLES, type FilterSection } from '../../../../components/FilterPanel/FilterPanel';
import { colors } from '../../../../theme';
import {
  activeFilterCount,
  selectionToFilters,
  type FilterSelection,
} from '../../../../utils/searchFilters';
import { styles } from './FilterBar.styles';

type Props = {
  selection: FilterSelection;
  /** false while the filter options are loading */
  enabled: boolean;
  /** whether any listing is automatic, so the quick chip is worth showing */
  offersAutomatic: boolean;
  onOpen: (section?: FilterSection) => void;
  onToggleAutomatic: () => void;
};

function priceLabel(selection: FilterSelection): string | null {
  const { minPricePerDay: min, maxPricePerDay: max } = selectionToFilters(selection);
  if (min !== undefined && max !== undefined) return `${min}–${max} kr`;
  if (max !== undefined) return `Up to ${max} kr`;
  if (min !== undefined) return `From ${min} kr`;
  return null;
}

export function FilterBar({
  selection,
  enabled,
  offersAutomatic,
  onOpen,
  onToggleAutomatic,
}: Props) {
  const count = activeFilterCount(selection);

  // "Car type" or "Car type · 2" when two are ticked
  const listChip = (section: 'carTypes' | 'brands' | 'vendors') => {
    const ticked = selection[section].length;
    return {
      section,
      label: ticked ? `${SECTION_TITLES[section]} · ${ticked}` : SECTION_TITLES[section],
      on: ticked > 0,
    };
  };
  const price = priceLabel(selection);
  const chips: { section: FilterSection; label: string; on: boolean }[] = [
    listChip('carTypes'),
    listChip('vendors'),
    listChip('brands'),
    { section: 'price', label: price ?? 'Price', on: price !== null },
  ];
  const automaticOn = selection.transmission === 'automatic';

  return (
    <ScrollView
      horizontal
      showsHorizontalScrollIndicator={false}
      style={styles.scroll}
      contentContainerStyle={styles.row}
    >
      <Pressable
        onPress={() => onOpen()}
        disabled={!enabled}
        accessibilityRole="button"
        accessibilityLabel={count ? `Filters, ${count} in use` : 'Filters'}
        style={[
          styles.chip,
          styles.allButton,
          count > 0 && styles.chipOn,
          !enabled && styles.disabled,
        ]}
      >
        <SlidersHorizontal size={17} color={count ? colors.surface : colors.ink} />
        {count ? (
          <View style={styles.badge}>
            <Text style={styles.badgeText}>{count}</Text>
          </View>
        ) : null}
      </Pressable>

      {chips.slice(0, 2).map((chip) => (
        <Chip key={chip.section} {...chip} enabled={enabled} onPress={() => onOpen(chip.section)} />
      ))}
      {offersAutomatic ? (
        <Pressable
          onPress={onToggleAutomatic}
          disabled={!enabled}
          accessibilityRole="switch"
          accessibilityState={{ checked: automaticOn }}
          style={[
            styles.chip,
            styles.chipPlain,
            automaticOn && styles.chipOn,
            !enabled && styles.disabled,
          ]}
        >
          <Text style={[styles.chipText, automaticOn && styles.chipTextOn]}>Automatic</Text>
        </Pressable>
      ) : null}
      {chips.slice(2).map((chip) => (
        <Chip key={chip.section} {...chip} enabled={enabled} onPress={() => onOpen(chip.section)} />
      ))}
    </ScrollView>
  );
}

function Chip({
  label,
  on,
  enabled,
  onPress,
}: {
  label: string;
  on: boolean;
  enabled: boolean;
  onPress: () => void;
}) {
  return (
    <Pressable
      onPress={onPress}
      disabled={!enabled}
      accessibilityRole="button"
      style={[styles.chip, on && styles.chipOn, !enabled && styles.disabled]}
    >
      <Text style={[styles.chipText, on && styles.chipTextOn]}>{label}</Text>
      <ChevronDown size={15} color={on ? colors.surface : colors.ink} />
    </Pressable>
  );
}
