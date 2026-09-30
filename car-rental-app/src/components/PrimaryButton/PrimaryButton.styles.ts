/* ___ PrimaryButton styles ___________________________
    Orange 58px high button. Gets a darker orange
    while it is being pressed.
   ____________________________________________________*/

import { StyleSheet } from 'react-native';
import { colors, radius } from '../../theme';

export const styles = StyleSheet.create({
  button: {
    height: 58,
    borderRadius: radius.lg,
    backgroundColor: colors.primary,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 10,
  },
  pressed: { backgroundColor: colors.primaryPressed },
  text: { color: '#fff', fontSize: 16, fontWeight: '600' },
});
