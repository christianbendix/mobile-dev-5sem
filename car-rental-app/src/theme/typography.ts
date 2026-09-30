/* ___ Typography sheet _______________________________
    This file is were We declare Typographu, so that 
    we dont have to recreate text styles throughout the
    application.
   ____________________________________________________*/

import { TextStyle } from 'react-native';
import { colors } from './colors';

export const typography = {
  display: {
    fontSize: 32,
    lineHeight: 35,
    fontWeight: '700',
    letterSpacing: -1,
    color: colors.ink,
  },
  value: { fontSize: 16, fontWeight: '600', color: colors.ink },
  itemTitle: { fontSize: 15, fontWeight: '600', color: colors.ink },
  body: { fontSize: 14, color: colors.textBody },
  caption: { fontSize: 12, color: colors.textSubtle },
  section: { fontSize: 13, fontWeight: '600', color: colors.textSubtle },
} satisfies Record<string, TextStyle>;
