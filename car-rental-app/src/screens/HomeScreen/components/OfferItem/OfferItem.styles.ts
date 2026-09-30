/* ___ OfferItem styles _______________________________
    Same white row as RecentSearchItem, but with the
    price on the right instead of a chevron.
   ____________________________________________________*/

import { StyleSheet } from 'react-native';
import { colors, radius, spacing, typography } from '../../../../theme';

export const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
    backgroundColor: colors.surface,
    borderRadius: radius.md,
    paddingVertical: spacing.md,
    paddingHorizontal: 14,
  },
  pressed: { opacity: 0.7 },
  iconBox: {
    width: 38,
    height: 38,
    borderRadius: radius.sm,
    backgroundColor: colors.background,
    alignItems: 'center',
    justifyContent: 'center',
  },
  textWrap: { flex: 1, minWidth: 0 },
  title: typography.itemTitle,
  subtitle: { fontSize: 13, color: colors.textSubtle },
  priceWrap: { alignItems: 'flex-end' },
  price: { fontSize: 16, fontWeight: '700', color: colors.ink },
  perDay: typography.caption,
});
