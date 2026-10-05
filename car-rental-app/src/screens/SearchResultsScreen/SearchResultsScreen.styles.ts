/* ___ SearchResultsScreen styles _____________________
    Grey page with a top bar (round back button and a
    white pill summing up the search), the filter
    chips under it, then the list of result cards.
   ____________________________________________________*/

import { StyleSheet } from 'react-native';
import { TAB_BAR_SPACE } from '../../navigation/TabBar/TabBar.styles';
import { colors, radius, shadows, spacing, typography } from '../../theme';

export const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: colors.background },

  top: {
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.sm,
    paddingBottom: spacing.md,
    gap: spacing.md,
  },
  topRow: { flexDirection: 'row', alignItems: 'center', gap: spacing.sm },
  backButton: {
    width: 46,
    height: 46,
    borderRadius: radius.pill,
    backgroundColor: colors.surface,
    alignItems: 'center',
    justifyContent: 'center',
    ...shadows.subtle,
  },
  summary: {
    flex: 1,
    minWidth: 0,
    height: 46,
    borderRadius: radius.pill,
    backgroundColor: colors.surface,
    justifyContent: 'center',
    paddingHorizontal: spacing.xl,
    ...shadows.subtle,
  },
  summaryTitle: { fontSize: 14, fontWeight: '600', color: colors.ink },
  summarySubtitle: typography.caption,

  // room for the floating tab bar
  list: { paddingHorizontal: spacing.lg, paddingTop: 2, paddingBottom: TAB_BAR_SPACE },
  separator: { height: spacing.md },

  listHeader: { paddingHorizontal: spacing.xs, paddingTop: spacing.xs, paddingBottom: spacing.md },
  countRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  count: { fontSize: 15, fontWeight: '600', color: colors.ink },
  sortButton: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  sortText: { fontSize: 13, color: colors.textMuted },
  note: { ...typography.caption, marginTop: spacing.xs },
  error: { ...typography.caption, color: colors.primaryText, fontWeight: '600', marginTop: 6 },

  // Shown when the search came back empty
  emptyCard: {
    backgroundColor: colors.surface,
    borderRadius: 28,
    paddingVertical: 28,
    paddingHorizontal: spacing.xxl,
    gap: spacing.md,
    alignItems: 'flex-start',
  },
  emptyTitle: { fontSize: 17, fontWeight: '600', color: colors.ink },
  clearButton: {
    height: 40,
    paddingHorizontal: spacing.lg,
    borderRadius: radius.pill,
    backgroundColor: colors.primaryTint,
    justifyContent: 'center',
  },
  clearText: { fontSize: 14, fontWeight: '600', color: colors.primaryText },
  loading: { ...typography.body, paddingHorizontal: spacing.xs },
});
