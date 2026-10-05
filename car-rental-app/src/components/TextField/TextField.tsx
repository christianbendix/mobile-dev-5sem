/* ___ TextField component ____________________________
    InfoField's editable sibling: a grey box with a
    small label, an optional icon and a text input.
    Every other prop goes straight to the TextInput.
   ____________________________________________________*/

import { ReactNode, useState } from 'react';
import { Text, TextInput, View, type TextInputProps } from 'react-native';

import { colors } from '../../theme';
import { styles } from './TextField.styles';

type Props = TextInputProps & { label: string; icon?: ReactNode };

export function TextField({ label, icon, onFocus, onBlur, ...inputProps }: Props) {
  const [focused, setFocused] = useState(false);

  return (
    <View style={[styles.container, focused && styles.focused]}>
      {icon}
      <View style={styles.textWrap}>
        <Text style={styles.label}>{label}</Text>
        <TextInput
          placeholderTextColor={colors.iconMuted}
          {...inputProps}
          style={styles.input}
          onFocus={(event) => {
            setFocused(true);
            onFocus?.(event);
          }}
          onBlur={(event) => {
            setFocused(false);
            onBlur?.(event);
          }}
        />
      </View>
    </View>
  );
}
