/* ___ SearchCard styles ______________________________
    Styles for the search card. The card itself is
    white with a soft shadow; the rows inside use the
    grey background color like in the design.
   ____________________________________________________*/

import { StyleSheet } from 'react-native';
import { colors, radius, shadows, spacing, typography } from '../../../../theme';

export const styles = StyleSheet.create({
  card: {
    marginTop: spacing.xxl,
    backgroundColor: colors.surface,
    borderRadius: radius.xl,
    padding: 10,
    gap: spacing.sm,
    ...shadows.card,
  },

  // Rows with a label on the left and a control on the right
  toggleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: spacing.xs,
    paddingLeft: spacing.lg,
    paddingRight: 10,
  },
  rowLabel: typography.body,

  // Two date fields next to each other
  dateRow: { flexDirection: 'row', gap: spacing.sm },
  dateCell: { flex: 1 },

  // Driver age row
  ageRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: colors.background,
    borderRadius: radius.lg,
    paddingVertical: 14,
    paddingHorizontal: spacing.lg,
  },
  ageValue: { flexDirection: 'row', alignItems: 'center', gap: spacing.xs },
  ageText: { fontSize: 14, fontWeight: '600', color: colors.ink },
});
