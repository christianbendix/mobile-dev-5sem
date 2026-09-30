/* ___ PrimaryButton component ________________________
    The big orange call-to-action button, fx "Search
    cars". Takes a title, an optional icon and onPress.
   ____________________________________________________*/

import { ReactNode } from 'react';
import { Pressable, Text } from 'react-native';
import { styles } from './PrimaryButton.styles';

type Props = { title: string; onPress: () => void; icon?: ReactNode };

export function PrimaryButton({ title, onPress, icon }: Props) {
  return (
    <Pressable
      onPress={onPress}
      style={({ pressed }) => [styles.button, pressed && styles.pressed]}
    >
      {icon}
      <Text style={styles.text}>{title}</Text>
    </Pressable>
  );
}
