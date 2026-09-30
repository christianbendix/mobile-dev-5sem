/* ___ Avatar styles __________________________________
    Styles for the Avatar component: a 44x44 soft
    orange circle with the initial centered.
   ____________________________________________________*/

import { StyleSheet } from 'react-native';
import { colors, radius } from '../../theme';

export const styles = StyleSheet.create({
  circle: {
    width: 44,
    height: 44,
    borderRadius: radius.pill,
    backgroundColor: colors.primarySoft,
    alignItems: 'center',
    justifyContent: 'center',
  },
  initial: { fontSize: 16, fontWeight: '600', color: colors.primaryText },
});
