/* ___ PrimaryButton component ________________________
    The big orange call-to-action button, fx "Search
    cars". Takes a title, an optional icon, onPress and
    whether it is disabled.
   ____________________________________________________*/

import { ReactNode } from 'react';
import { Pressable, Text } from 'react-native';
import { styles } from './PrimaryButton.styles';

type Props = { title: string; onPress: () => void; icon?: ReactNode; disabled?: boolean };

export function PrimaryButton({ title, onPress, icon, disabled = false }: Props) {
  return (
    <Pressable
      onPress={onPress}
      disabled={disabled}
      accessibilityRole="button"
      accessibilityState={{ disabled }}
      style={({ pressed }) => [styles.button, (pressed || disabled) && styles.pressed]}
    >
      {icon}
      <Text style={styles.text}>{title}</Text>
    </Pressable>
  );
}
