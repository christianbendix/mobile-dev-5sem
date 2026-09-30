/* ___ SearchCard component ___________________________
    The white card on the home screen: pick-up and
    drop-off location, dates, driver age and the
    "Search cars" button. All values come from the
    useSearchForm hook through the `form` prop.
    Tapping a location opens the LocationPicker.
   ____________________________________________________*/

import { ChevronDown, MapPin, Search } from 'lucide-react-native';
import { useState } from 'react';
import { Pressable, Text, View } from 'react-native';

import { InfoField } from '../../../../components/InfoField/InfoField';
import { LocationPicker } from '../../../../components/LocationPicker/LocationPicker';
import { PrimaryButton } from '../../../../components/PrimaryButton/PrimaryButton';
import { Toggle } from '../../../../components/Toggle/Toggle';
import { useSearchForm } from '../../../../hooks/useSearchForm';
import { colors } from '../../../../theme';
import { styles } from './SearchCard.styles';

type Props = {
  form: ReturnType<typeof useSearchForm>;
  onSearch: () => void;
};

// Which field the picker is open for - null when it is closed
type PickerTarget = 'pickup' | 'dropoff' | null;

export function SearchCard({ form, onSearch }: Props) {
  const [pickerTarget, setPickerTarget] = useState<PickerTarget>(null);

  return (
    <View style={styles.card}>
      <Pressable onPress={() => setPickerTarget('pickup')} accessibilityRole="button">
        <InfoField
          label="Pick-up location"
          value={form.pickupPlace?.label ?? ''}
          placeholder="Where do you want to pick up?"
          icon={<MapPin size={20} color={colors.primary} />}
        />
      </Pressable>

      {/* Return to same location - toggles the drop-off field */}
      <View style={styles.toggleRow}>
        <Text style={styles.rowLabel}>Return to same location</Text>
        <Toggle value={form.sameLocation} onChange={form.toggleSameLocation} />
      </View>

      {!form.sameLocation && (
        <Pressable onPress={() => setPickerTarget('dropoff')} accessibilityRole="button">
          <InfoField
            label="Drop-off location"
            value={form.dropoffPlace?.label ?? ''}
            placeholder="Where do you return the car?"
            icon={<MapPin size={20} color={colors.ink} />}
          />
        </Pressable>
      )}

      {/* Pick-up and return dates side by side */}
      <View style={styles.dateRow}>
        <View style={styles.dateCell}>
          <InfoField label="Pick-up" value={form.pickupDate.day} subValue={form.pickupDate.time} />
        </View>
        <View style={styles.dateCell}>
          <InfoField label="Return" value={form.returnDate.day} subValue={form.returnDate.time} />
        </View>
      </View>

      {/* Driver age - will open a picker later */}
      <Pressable style={styles.ageRow}>
        <Text style={styles.rowLabel}>Driver age</Text>
        <View style={styles.ageValue}>
          <Text style={styles.ageText}>{form.driverAge}</Text>
          <ChevronDown size={16} color={colors.ink} />
        </View>
      </Pressable>

      <PrimaryButton
        title="Search cars"
        onPress={onSearch}
        icon={<Search size={19} color={colors.surface} strokeWidth={2.2} />}
      />

      <LocationPicker
        visible={pickerTarget !== null}
        title={pickerTarget === 'dropoff' ? 'Drop-off location' : 'Pick-up location'}
        selected={pickerTarget === 'dropoff' ? form.dropoffPlace : form.pickupPlace}
        onSelect={(place) => {
          if (pickerTarget === 'dropoff') form.setDropoffPlace(place);
          else form.setPickupPlace(place);
          setPickerTarget(null);
        }}
        onClose={() => setPickerTarget(null)}
      />
    </View>
  );
}
