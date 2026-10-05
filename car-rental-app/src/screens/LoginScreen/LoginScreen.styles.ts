/* ___ LoginScreen styles _____________________________
    The CarBay mark at the top, the big title like on
    the home screen, then the same white card with
    grey fields and the orange button. "Continue as
    guest" is a plain text button under the card.
   ____________________________________________________*/

import { StyleSheet } from 'react-native';
import { colors, radius, shadows, spacing, typography } from '../../theme';

export const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: colors.background },
  flex: { flex: 1 },
  content: {
    flexGrow: 1,
    paddingHorizontal: spacing.xl,
    paddingTop: spacing.lg,
    paddingBottom: spacing.xl,
  },

  // Logo: orange rounded square with a car, and the name
  brand: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    paddingHorizontal: spacing.xs,
  },
  brandMark: {
    width: 34,
    height: 34,
    borderRadius: 11,
    backgroundColor: colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  brandName: { fontSize: 22, fontWeight: '700', letterSpacing: -0.4, color: colors.ink },

  header: { marginTop: 48, paddingHorizontal: spacing.xs },
  greeting: { fontSize: 14, fontWeight: '500', color: colors.textSubtle },
  title: { ...typography.display, marginTop: spacing.xs },

  // Shown when a guest was sent here from the booking flow
  notice: {
    alignSelf: 'flex-start',
    marginTop: spacing.lg,
    marginHorizontal: spacing.xs,
    paddingVertical: 6,
    paddingHorizontal: spacing.md,
    borderRadius: radius.pill,
    backgroundColor: colors.primaryTint,
  },
  noticeText: { fontSize: 13, fontWeight: '600', color: colors.primaryText },

  card: {
    marginTop: spacing.xxl,
    backgroundColor: colors.surface,
    borderRadius: radius.xl,
    padding: 10,
    gap: spacing.sm,
    ...shadows.card,
  },
  error: {
    ...typography.caption,
    color: colors.primaryText,
    fontWeight: '600',
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.xs,
  },

  spacer: { flex: 1, minHeight: spacing.xxl },

  guestButton: {
    height: 52,
    borderRadius: radius.pill,
    alignItems: 'center',
    justifyContent: 'center',
  },
  guestPressed: { backgroundColor: colors.divider },
  guestText: { fontSize: 15, fontWeight: '600', color: colors.ink },
  guestHint: { ...typography.caption, textAlign: 'center', marginTop: spacing.xs },
});
