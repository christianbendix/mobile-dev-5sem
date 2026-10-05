/* ___ CarCard styles _________________________________
    The large result card from the design: name and
    price on top, the car photo in a grey well, grey
    spec pills, and the provider + location under a
    thin divider.
   ____________________________________________________*/

import { StyleSheet } from 'react-native';
import { colors, radius, shadows, spacing } from '../../../../theme';

export const styles = StyleSheet.create({
  card: {
    backgroundColor: colors.surface,
    borderRadius: radius.xl,
    paddingTop: spacing.xl,
    paddingHorizontal: spacing.xl,
    paddingBottom: spacing.lg,
    ...shadows.subtle,
  },
  pressed: { opacity: 0.85 },

  top: { flexDirection: 'row', justifyContent: 'space-between', gap: spacing.md },
  titleWrap: { flex: 1, minWidth: 0 },
  name: { fontSize: 18, fontWeight: '600', letterSpacing: -0.2, color: colors.ink },
  subtitle: { fontSize: 13, color: colors.textSubtle, marginTop: 2 },
  priceWrap: { alignItems: 'flex-end' },
  price: { fontSize: 20, fontWeight: '700', letterSpacing: -0.4, color: colors.ink },
  perDay: { fontSize: 12, color: colors.textSubtle },

  imageWell: {
    height: 150,
    marginTop: spacing.md,
    marginBottom: spacing.md,
    marginHorizontal: -spacing.xs,
    borderRadius: radius.lg,
    overflow: 'hidden',
    backgroundColor: colors.background,
    alignItems: 'center',
    justifyContent: 'center',
  },
  image: { width: '100%', height: '100%' },

  pills: { flexDirection: 'row', flexWrap: 'wrap', gap: 6 },
  pill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    height: 30,
    paddingHorizontal: 10,
    borderRadius: radius.pill,
    backgroundColor: colors.background,
  },
  pillText: { fontSize: 13, fontWeight: '500', color: colors.ink },

  footer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: spacing.md,
    marginTop: 14,
    paddingTop: spacing.md,
    borderTopWidth: 1,
    borderTopColor: colors.divider,
  },
  vendorWrap: { flexDirection: 'row', alignItems: 'center', gap: spacing.sm, flexShrink: 1 },
  vendor: { fontSize: 14, fontWeight: '700', letterSpacing: -0.1, color: colors.ink },
  locationWrap: { flexDirection: 'row', alignItems: 'center', gap: 4, flexShrink: 1 },
  location: { fontSize: 12, color: colors.textMuted, flexShrink: 1 },
});
