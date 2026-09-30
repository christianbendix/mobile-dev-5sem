/* ___ RecentSearchItem component _____________________
    One row in the "Recent searches" list: clock icon,
    location, dates + car size and a chevron. Pressing
    it should redo the search (onPress).
   ____________________________________________________*/

import { Pressable, Text, View } from 'react-native';
import { ChevronRight, Clock } from 'lucide-react-native';
import { RecentSearch } from '../../../../types/search';
import { colors } from '../../../../theme';
import { styles } from './RecentSearchItem.styles';

type Props = { search: RecentSearch; onPress: () => void };

export function RecentSearchItem({ search, onPress }: Props) {
  return (
    <Pressable onPress={onPress} style={({ pressed }) => [styles.row, pressed && styles.pressed]}>
      <View style={styles.iconBox}>
        <Clock size={18} color={colors.textMuted} />
      </View>
      <View style={styles.textWrap}>
        <Text style={styles.title}>{search.place.label}</Text>
        <Text style={styles.subtitle}>
          {search.dateRange} · {search.carSize}
        </Text>
      </View>
      <ChevronRight size={18} color={colors.iconMuted} />
    </Pressable>
  );
}
