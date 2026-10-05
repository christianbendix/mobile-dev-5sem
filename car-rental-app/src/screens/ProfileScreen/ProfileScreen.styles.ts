/* ___ ProfileScreen styles ___________________________
    Big "Profile" title, a white card with the avatar
    and name, two stat tiles side by side, a white
    list of rows split by thin dividers, and the
    orange text button to log out.
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

  // Name card
  userCard: {
    marginTop: 20,
    backgroundColor: colors.surface,
    borderRadius: 28,
    padding: spacing.xl,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 14,
  },
  avatar: {
    width: 60,
    height: 60,
    borderRadius: radius.pill,
    backgroundColor: colors.primarySoft,
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarInitial: { fontSize: 22, fontWeight: '600', color: colors.primaryText },
  userText: { flex: 1, minWidth: 0 },
  userName: { fontSize: 18, fontWeight: '600', color: colors.ink },
  userEmail: { fontSize: 13, color: colors.textSubtle, marginTop: 2 },

  // Two tiles with the rental counts
  tiles: { flexDirection: 'row', gap: spacing.md, marginTop: spacing.md },
  tile: {
    flex: 1,
    backgroundColor: colors.surface,
    borderRadius: 24,
    padding: spacing.lg,
  },
  tileLabel: typography.caption,
  tileValueRow: { flexDirection: 'row', alignItems: 'center', gap: 6, marginTop: spacing.xs },
  tileValue: { fontSize: 15, fontWeight: '600', color: colors.ink },

  // List of rows
  list: {
    marginTop: spacing.md,
    backgroundColor: colors.surface,
    borderRadius: 26,
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.xs,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: spacing.lg,
  },
  rowDivider: { borderBottomWidth: 1, borderBottomColor: colors.divider },
  rowLabel: { fontSize: 15, fontWeight: '500', color: colors.ink },
  rowRight: { flexDirection: 'row', alignItems: 'center', gap: 6, flexShrink: 1 },
  rowValue: { fontSize: 14, color: colors.textSubtle, flexShrink: 1 },

  // Personal details, shown under its row when opened
  details: { paddingBottom: spacing.md, gap: spacing.sm },
  detail: {
    backgroundColor: colors.background,
    borderRadius: radius.md,
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.lg,
  },
  detailLabel: typography.caption,
  detailValue: { ...typography.value, fontSize: 15, marginTop: 2 },

  error: { ...typography.caption, color: colors.primaryText, marginTop: spacing.sm },

  logout: {
    marginTop: spacing.lg,
    height: 52,
    borderRadius: radius.pill,
    alignItems: 'center',
    justifyContent: 'center',
  },
  logoutPressed: { backgroundColor: colors.divider },
  logoutText: { fontSize: 15, fontWeight: '600', color: colors.primaryText },
});
