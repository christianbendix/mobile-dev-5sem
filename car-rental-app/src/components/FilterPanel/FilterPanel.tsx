/* ___ FilterPanel component __________________________
    The search filters as separate fields: tick lists
    for brand, vendor and car type (several can be
    ticked), transmission (one or any) and a price
    range. The options come from the api; nothing is
    applied until "Apply filters". Unstyled for now.
   ____________________________________________________*/

import { useState } from 'react';
import { Button, Pressable, Text, TextInput, View } from 'react-native';

import type { FilterOptions, Transmission } from '../../api';
import { EMPTY_SELECTION, toggle, type FilterSelection } from '../../utils/searchFilters';

type Props = {
  options: FilterOptions;
  applied: FilterSelection;
  onApply: (selection: FilterSelection) => void;
};

const TRANSMISSION_LABELS: Record<Transmission, string> = {
  automatic: 'Automatic',
  manual: 'Manual',
};

function CheckList({
  title,
  values,
  selected,
  onToggle,
}: {
  title: string;
  values: string[];
  selected: string[];
  onToggle: (value: string) => void;
}) {
  return (
    <View style={{ marginTop: 12 }}>
      <Text>{title}</Text>
      {values.map((value) => {
        const isSelected = selected.includes(value);
        return (
          <Pressable
            key={value}
            onPress={() => onToggle(value)}
            accessibilityRole="checkbox"
            accessibilityLabel={`${title}: ${value}`}
            accessibilityState={{ checked: isSelected }}
            style={{ paddingVertical: 4 }}
          >
            <Text>
              {isSelected ? '☑' : '☐'} {value}
            </Text>
          </Pressable>
        );
      })}
    </View>
  );
}

export function FilterPanel({ options, applied, onApply }: Props) {
  // edited here, handed over on apply
  const [draft, setDraft] = useState<FilterSelection>(applied);

  const transmissionChoices: { value?: Transmission; label: string }[] = [
    { label: 'Any' },
    ...options.transmissions.map((value) => ({ value, label: TRANSMISSION_LABELS[value] })),
  ];

  return (
    <View>
      <CheckList
        title="Brand"
        values={options.brands}
        selected={draft.brands}
        onToggle={(value) => setDraft((d) => ({ ...d, brands: toggle(d.brands, value) }))}
      />
      <CheckList
        title="Vendor"
        values={options.vendors}
        selected={draft.vendors}
        onToggle={(value) => setDraft((d) => ({ ...d, vendors: toggle(d.vendors, value) }))}
      />
      <CheckList
        title="Car type"
        values={options.carTypes}
        selected={draft.carTypes}
        onToggle={(value) => setDraft((d) => ({ ...d, carTypes: toggle(d.carTypes, value) }))}
      />

      <View style={{ marginTop: 12 }}>
        <Text>Transmission</Text>
        {transmissionChoices.map(({ value, label }) => {
          const isSelected = draft.transmission === value;
          return (
            <Pressable
              key={label}
              onPress={() => setDraft((d) => ({ ...d, transmission: value }))}
              accessibilityRole="radio"
              accessibilityLabel={`Transmission: ${label}`}
              accessibilityState={{ checked: isSelected }}
              style={{ paddingVertical: 4 }}
            >
              <Text>
                {isSelected ? '◉' : '○'} {label}
              </Text>
            </Pressable>
          );
        })}
      </View>

      <View style={{ marginTop: 12 }}>
        <Text>
          Price per day (kr)
          {options.priceRange
            ? ` · ${options.priceRange.min}–${options.priceRange.max} on offer`
            : ''}
        </Text>
        <View style={{ flexDirection: 'row', gap: 8 }}>
          <TextInput
            value={draft.minPrice}
            onChangeText={(minPrice) => setDraft((d) => ({ ...d, minPrice }))}
            placeholder={options.priceRange ? `Min ${options.priceRange.min}` : 'Min'}
            keyboardType="number-pad"
            accessibilityLabel="Minimum price per day"
            style={{ flex: 1, borderWidth: 1, padding: 8 }}
          />
          <TextInput
            value={draft.maxPrice}
            onChangeText={(maxPrice) => setDraft((d) => ({ ...d, maxPrice }))}
            placeholder={options.priceRange ? `Max ${options.priceRange.max}` : 'Max'}
            keyboardType="number-pad"
            accessibilityLabel="Maximum price per day"
            style={{ flex: 1, borderWidth: 1, padding: 8 }}
          />
        </View>
      </View>

      <View style={{ marginTop: 12, gap: 8 }}>
        <Button title="Apply filters" onPress={() => onApply(draft)} />
        <Button
          title="Clear filters"
          onPress={() => {
            setDraft(EMPTY_SELECTION);
            onApply(EMPTY_SELECTION);
          }}
        />
      </View>
    </View>
  );
}
