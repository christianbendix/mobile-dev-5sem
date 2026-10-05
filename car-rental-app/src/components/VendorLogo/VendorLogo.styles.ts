/* ___ VendorLogo styles ______________________________
    A small white tile with a hairline border holding
    the company logo. Without a logo it becomes a dark
    tile with the company's first letter.
   ____________________________________________________*/

import { StyleSheet } from 'react-native';
import { colors } from '../../theme';

export const styles = StyleSheet.create({
  tile: {
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.divider,
  },
  image: { width: '82%', height: '82%' },
  fallback: { backgroundColor: colors.ink, borderColor: colors.ink },
  initial: { fontWeight: '700', color: colors.surface },
});
