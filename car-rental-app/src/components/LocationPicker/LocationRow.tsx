/* ___ LocationRow component __________________________
    One row in the LocationPicker: an icon (plane for
    airports, train for stations, pin for the rest),
    the location name and its city. A check mark shows
    the currently selected location.
   ____________________________________________________*/

import { Check, MapPin, Plane, TrainFront } from 'lucide-react-native';
import { Pressable, Text, View } from 'react-native';

import { colors } from '../../theme';
import type { SelectedPlace } from '../../types/search';
import { styles } from './LocationRow.styles';

type Props = {
  place: SelectedPlace;
  selected: boolean;
  onPress: () => void;
};

function PlaceIcon({ label }: { label: string }) {
  if (label.includes('Airport')) return <Plane size={18} color={colors.primary} />;
  if (label.includes('Station')) return <TrainFront size={18} color={colors.primary} />;
  return <MapPin size={18} color={colors.primary} />;
}

export function LocationRow({ place, selected, onPress }: Props) {
  return (
    <Pressable onPress={onPress} style={({ pressed }) => [styles.row, pressed && styles.pressed]}>
      <View style={styles.iconBox}>
        <PlaceIcon label={place.label} />
      </View>
      <View style={styles.textWrap}>
        <Text style={styles.title} numberOfLines={1}>
          {place.label}
        </Text>
        <Text style={styles.subtitle} numberOfLines={1}>
          {place.subtitle}
        </Text>
      </View>
      {selected ? <Check size={18} color={colors.primary} /> : null}
    </Pressable>
  );
}
