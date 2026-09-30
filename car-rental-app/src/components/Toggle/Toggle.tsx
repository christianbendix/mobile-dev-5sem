/* ___ Toggle component _______________________________
    On/off switch styled like the design. It holds no
    state itself - the parent passes `value` and gets
    told through `onChange` when it is pressed.
   ____________________________________________________*/

import { Pressable, View } from 'react-native';
import { styles } from './Toggle.styles';

type Props = { value: boolean; onChange: () => void };

export function Toggle({ value, onChange }: Props) {
  return (
    <Pressable
      onPress={onChange}
      style={[styles.track, value ? styles.trackOn : styles.trackOff]}
      accessibilityRole="switch"
      accessibilityState={{ checked: value }}
    >
      <View style={styles.thumb} />
    </Pressable>
  );
}
