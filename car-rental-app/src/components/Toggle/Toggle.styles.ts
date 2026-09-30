/* ___ Toggle styles __________________________________
    The track is orange when on and grey when off.
    The thumb moves by switching justifyContent
    between flex-end (on) and flex-start (off).
   ____________________________________________________*/

import { StyleSheet } from 'react-native';
import { colors, radius } from '../../theme';

export const styles = StyleSheet.create({
  track: {
    width: 48,
    height: 28,
    borderRadius: radius.pill,
    padding: 3,
    flexDirection: 'row',
  },
  trackOn: { backgroundColor: colors.primary, justifyContent: 'flex-end' },
  trackOff: { backgroundColor: colors.border, justifyContent: 'flex-start' },
  thumb: {
    width: 22,
    height: 22,
    borderRadius: radius.pill,
    backgroundColor: colors.surface,
    boxShadow: '0 1px 3px rgba(0,0,0,0.2)',
  },
});
