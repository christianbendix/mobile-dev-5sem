/* ___ PastRentalRow styles ___________________________
    A row in the white "Past" list: name and dates on
    the left, total and the orange "Book again" on the
    right, with a thin divider under all but the last.
   ____________________________________________________*/

import { StyleSheet } from 'react-native';
import { colors, spacing } from '../../../../theme';

export const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    gap: spacing.md,
    paddingVertical: 14,
  },
  divider: { borderBottomWidth: 1, borderBottomColor: colors.divider },
  text: { flex: 1, minWidth: 0 },
  name: { fontSize: 15, fontWeight: '600', color: colors.ink },
  meta: { fontSize: 13, color: colors.textSubtle, marginTop: 2 },
  right: { alignItems: 'flex-end' },
  total: { fontSize: 14, fontWeight: '600', color: colors.ink },
  again: { fontSize: 12, fontWeight: '600', color: colors.primaryText, marginTop: 2 },
});
