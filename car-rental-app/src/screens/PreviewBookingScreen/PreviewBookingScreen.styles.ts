/* ___ PreviewBookingScreen styles ____________________
    The car details from the design: a grey hero with
    the photo and round back button, then on white the
    type pill, big name, grey spec tiles, the provider
    and pick-up cards, and a price bar with the orange
    Book button pinned to the bottom.
   ____________________________________________________*/

import { StyleSheet } from 'react-native';
import { colors, radius, spacing, typography } from '../../theme';

export const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: colors.surface },
  scroll: { paddingBottom: 130 },

  hero: {
    backgroundColor: colors.background,
    borderBottomLeftRadius: 36,
    borderBottomRightRadius: 36,
    paddingBottom: spacing.xxl,
  },
  heroTop: { paddingHorizontal: spacing.lg, flexDirection: 'row' },
  roundButton: {
    width: 46,
    height: 46,
    borderRadius: radius.pill,
    backgroundColor: colors.surface,
    alignItems: 'center',
    justifyContent: 'center',
    boxShadow: '0 2px 8px rgba(0,0,0,0.06)',
  },
  photo: {
    height: 190,
    marginTop: spacing.sm,
    marginHorizontal: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  image: { width: '100%', height: '100%' },

  body: { paddingHorizontal: 20, paddingTop: spacing.xxl },
  typePill: {
    alignSelf: 'flex-start',
    height: 26,
    paddingHorizontal: 10,
    borderRadius: radius.pill,
    backgroundColor: colors.primaryTint,
    justifyContent: 'center',
  },
  typeText: { fontSize: 12, fontWeight: '600', color: colors.primaryText },
  name: {
    fontSize: 30,
    lineHeight: 32,
    fontWeight: '700',
    letterSpacing: -0.9,
    color: colors.ink,
    marginTop: 10,
  },
  subtitle: { fontSize: 14, color: colors.textSubtle, marginTop: 6 },
  status: { ...typography.caption, marginTop: spacing.sm },
  error: { color: colors.primaryText, fontWeight: '600' },

  // Four grey tiles in a row
  specs: { flexDirection: 'row', gap: spacing.sm, marginTop: 20 },
  spec: {
    flex: 1,
    minWidth: 0,
    backgroundColor: colors.background,
    borderRadius: radius.md,
    paddingVertical: spacing.md,
    paddingHorizontal: 10,
    gap: spacing.sm,
  },
  specValue: { fontSize: 15, fontWeight: '600', color: colors.ink },
  specLabel: { fontSize: 11, color: colors.textSubtle },

  sectionTitle: {
    fontSize: 18,
    fontWeight: '700',
    letterSpacing: -0.2,
    color: colors.ink,
    marginTop: 28,
    marginBottom: spacing.md,
  },

  // Provider card
  provider: {
    borderRadius: radius.lg,
    borderWidth: 2,
    borderColor: colors.divider,
    padding: spacing.lg,
    gap: spacing.md,
  },
  providerTop: { flexDirection: 'row', alignItems: 'center', gap: spacing.md },
  providerText: { flex: 1, minWidth: 0 },
  providerNameRow: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  providerName: { fontSize: 16, fontWeight: '700', color: colors.ink, flexShrink: 1 },
  rating: {
    height: 20,
    paddingHorizontal: 6,
    borderRadius: 6,
    backgroundColor: colors.ink,
    justifyContent: 'center',
  },
  ratingText: { fontSize: 11, fontWeight: '600', color: colors.surface },
  providerMeta: { fontSize: 12, color: colors.textSubtle, marginTop: 3 },
  description: { fontSize: 13, lineHeight: 19, color: colors.textBody },

  // Pick-up card
  pickup: {
    borderRadius: 26,
    backgroundColor: colors.background,
    padding: spacing.lg,
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
  },
  pickupIcon: {
    width: 42,
    height: 42,
    borderRadius: 14,
    backgroundColor: colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  pickupText: { flex: 1, minWidth: 0 },
  pickupName: { fontSize: 15, fontWeight: '600', color: colors.ink },
  pickupAddress: { fontSize: 13, color: colors.textSubtle, marginTop: 3 },
  directions: {
    height: 38,
    paddingHorizontal: 14,
    borderRadius: radius.pill,
    backgroundColor: colors.surface,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  directionsText: { fontSize: 13, fontWeight: '600', color: colors.ink },

  // Price bar pinned to the bottom
  bar: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    paddingTop: 14,
    paddingHorizontal: spacing.xl,
    backgroundColor: colors.surface,
    borderTopWidth: 1,
    borderTopColor: colors.divider,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 14,
  },
  priceWrap: { flex: 1 },
  price: { fontSize: 22, fontWeight: '700', letterSpacing: -0.4, color: colors.ink },
  perDay: typography.caption,
  bookButton: {
    height: 56,
    paddingHorizontal: 34,
    borderRadius: radius.pill,
    backgroundColor: colors.primary,
    justifyContent: 'center',
  },
  bookPressed: { backgroundColor: colors.primaryPressed },
  bookText: { fontSize: 16, fontWeight: '600', color: colors.surface },
});
