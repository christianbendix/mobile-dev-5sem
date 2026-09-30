/* ___ InfoField component ____________________________
    Grey box with a small label and a bold value,
    optionally an icon and a sub value. Reused for
    pick-up/drop-off location and the date fields.
    When `value` is empty the `placeholder` is shown
    in a muted color instead.
   ____________________________________________________*/

import { ReactNode } from 'react';
import { Text, View } from 'react-native';
import { styles } from './InfoField.styles';

type Props = {
  label: string;
  value: string;
  subValue?: string;
  icon?: ReactNode;
  placeholder?: string;
};

export function InfoField({ label, value, subValue, icon, placeholder }: Props) {
  return (
    <View style={styles.container}>
      {icon}
      <View style={styles.textWrap}>
        <Text style={styles.label}>{label}</Text>
        <Text style={[styles.value, !value && styles.placeholder]} numberOfLines={1}>
          {value || placeholder}
        </Text>
        {subValue && <Text style={styles.subValue}>{subValue}</Text>}
      </View>
    </View>
  );
}
