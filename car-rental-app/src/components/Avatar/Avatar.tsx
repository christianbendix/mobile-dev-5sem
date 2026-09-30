/* ___ Avatar component _______________________________
    Round badge showing the user's initial. Used in
    the header of the search screen.
   ____________________________________________________*/

import { Text, View } from 'react-native';
import { styles } from './Avatar.styles';

type Props = { initial: string };

export function Avatar({ initial }: Props) {
  return (
    <View style={styles.circle}>
      <Text style={styles.initial}>{initial}</Text>
    </View>
  );
}
