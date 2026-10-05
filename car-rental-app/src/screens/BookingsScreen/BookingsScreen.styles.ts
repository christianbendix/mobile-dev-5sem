/* ___ BookingsScreen styles __________________________
    The My Rentals tab: big title, "Upcoming" with the
    dark cards, "Past" as one white list, and a white
    card with a button when nothing is coming up.
   ____________________________________________________*/

import { StyleSheet } from 'react-native';
import { TAB_BAR_SPACE } from '../../navigation/TabBar/TabBar.styles';
import { colors, radius, spacing, typography } from '../../theme';

export const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: colors.background },
  content: {
    paddingHorizontal: spacing.xl,
    paddingTop: spacing.md,
    paddingBottom: TAB_BAR_SPACE,
  },
  title: { ...typography.display, paddingHorizontal: spacing.xs },
  sectionTitle: {
    ...typography.section,
    marginTop: spacing.xxl,
    marginBottom: 10,
    marginHorizontal: spacing.xs,
  },
  cards: { gap: spacing.md },
  message: { ...typography.body, marginTop: spacing.lg, marginHorizontal: spacing.xs },
  error: { color: colors.primaryText, fontWeight: '600' },

  // Nothing coming up
  emptyCard: {
    backgroundColor: colors.surface,
    borderRadius: 28,
    paddingVertical: spacing.xxl,
    paddingHorizontal: spacing.xxl,
    gap: spacing.md,
    alignItems: 'flex-start',
  },
  emptyTitle: { fontSize: 17, fontWeight: '600', color: colors.ink },
  emptyText: { ...typography.body, color: colors.textSubtle },
  findButton: {
    height: 40,
    paddingHorizontal: spacing.lg,
    borderRadius: radius.pill,
    backgroundColor: colors.primaryTint,
    justifyContent: 'center',
  },
  findText: { fontSize: 14, fontWeight: '600', color: colors.primaryText },

  pastList: {
    backgroundColor: colors.surface,
    borderRadius: 26,
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.xs,
  },
});
