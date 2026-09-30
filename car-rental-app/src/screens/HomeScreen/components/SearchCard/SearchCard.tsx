/* ___ SearchCard component ___________________________
    The white card on the home screen: pick-up and
    drop-off location, dates and times, driver age and
    the "Search cars" button. All values come from the
    useSearchForm hook through the `form` prop.
    Tapping a location opens the LocationPicker, and
    a date the DateRangePicker (dates and times).
   ____________________________________________________*/

import { CalendarDays, MapPin, Search } from 'lucide-react-native';
import { useState } from 'react';
import { Pressable, Text, TextInput, View } from 'react-native';

import { DateRangePicker } from '../../../../components/DateRangePicker/DateRangePicker';
import { InfoField } from '../../../../components/InfoField/InfoField';
import { LocationPicker } from '../../../../components/LocationPicker/LocationPicker';
import { PrimaryButton } from '../../../../components/PrimaryButton/PrimaryButton';
import { Toggle } from '../../../../components/Toggle/Toggle';
import { useSearchForm } from '../../../../hooks/useSearchForm';
import { colors } from '../../../../theme';
import { originLabel } from '../../../../utils/deviceLocation';
import { formatDay, MAX_DRIVER_AGE, MIN_DRIVER_AGE } from '../../../../utils/searchInput';
import { styles } from './SearchCard.styles';

type Props = {
  form: ReturnType<typeof useSearchForm>;
  onSearch: () => void;
};

// Which field the picker is open for - null when it is closed
type PickerTarget = 'pickup' | 'dropoff' | null;

export function SearchCard({ form, onSearch }: Props) {
  const [pickerTarget, setPickerTarget] = useState<PickerTarget>(null);
  const [calendarOpen, setCalendarOpen] = useState(false);

  return (
    <View style={styles.card}>
      <Pressable onPress={() => setPickerTarget('pickup')} accessibilityRole="button">
        <InfoField
          label="Pick-up location"
          value={originLabel(form.pickup)}
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
            value={form.dropoff ? originLabel(form.dropoff) : ''}
            placeholder="Where do you return the car?"
            icon={<MapPin size={20} color={colors.ink} />}
          />
        </Pressable>
      )}

      {/* Pick-up and return side by side - both open the calendar, where the
          times are chosen too */}
      <View style={styles.dateRow}>
        <Pressable
          style={styles.dateCell}
          onPress={() => setCalendarOpen(true)}
          accessibilityRole="button"
          accessibilityLabel="Pick-up date"
        >
          <InfoField
            label="Pick-up"
            value={formatDay(form.period.pickupDate)}
            subValue={form.period.pickupTime}
            icon={<CalendarDays size={20} color={colors.primary} />}
          />
        </Pressable>
        <Pressable
          style={styles.dateCell}
          onPress={() => setCalendarOpen(true)}
          accessibilityRole="button"
          accessibilityLabel="Return date"
        >
          <InfoField
            label="Return"
            value={formatDay(form.period.returnDate)}
            subValue={form.period.returnTime}
            icon={<CalendarDays size={20} color={colors.ink} />}
          />
        </Pressable>
      </View>

      {/* Driver age - only cars whose provider accepts it are searched */}
      <View style={[styles.ageRow, form.driverAge === null && styles.ageRowInvalid]}>
        <Text style={styles.rowLabel}>Driver age</Text>
        <TextInput
          value={form.driverAgeText}
          onChangeText={form.setDriverAgeText}
          keyboardType="number-pad"
          maxLength={2}
          selectTextOnFocus
          accessibilityLabel="Driver age"
          placeholder="Age"
          placeholderTextColor={colors.iconMuted}
          style={styles.ageInput}
        />
      </View>
      {form.driverAge === null ? (
        <Text style={styles.fieldError}>
          Enter a driver age between {MIN_DRIVER_AGE} and {MAX_DRIVER_AGE}.
        </Text>
      ) : null}

      <PrimaryButton
        title="Search cars"
        onPress={onSearch}
        disabled={form.driverAge === null}
        icon={<Search size={19} color={colors.surface} strokeWidth={2.2} />}
      />

      <LocationPicker
        visible={pickerTarget !== null}
        title={pickerTarget === 'dropoff' ? 'Drop-off location' : 'Pick-up location'}
        selected={pickerTarget === 'dropoff' ? form.dropoff : form.pickup}
        onSelect={(origin) => {
          if (pickerTarget === 'dropoff') form.setDropoff(origin);
          else form.setPickup(origin);
          setPickerTarget(null);
        }}
        onClose={() => setPickerTarget(null)}
      />

      <DateRangePicker
        visible={calendarOpen}
        period={form.period}
        onConfirm={(period) => {
          form.setPeriod(period);
          setCalendarOpen(false);
        }}
        onClose={() => setCalendarOpen(false)}
      />
    </View>
  );
}
