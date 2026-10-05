/* ___ FilterBar styles _______________________________
    Horizontally scrolling pill chips. White with a
    grey outline when unused, solid ink when a filter
    is in use. The round "all filters" button carries
    an orange count badge.
   ____________________________________________________*/

import { StyleSheet } from 'react-native';
import { colors, radius, spacing } from '../../../../theme';

export const styles = StyleSheet.create({
  // bleeds to the screen edges so chips scroll under the page padding
  scroll: { marginHorizontal: -spacing.lg },
  row: { gap: spacing.sm, paddingHorizontal: spacing.lg },

  chip: {
    height: 40,
    paddingLeft: spacing.lg,
    paddingRight: 14,
    borderRadius: radius.pill,
    borderWidth: 1.5,
    borderColor: colors.border,
    backgroundColor: colors.surface,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  chipOn: { backgroundColor: colors.ink, borderColor: colors.ink },
  chipPlain: { paddingRight: spacing.lg },
  chipText: { fontSize: 14, fontWeight: '500', color: colors.ink },
  chipTextOn: { color: colors.surface },
  disabled: { opacity: 0.5 },

  allButton: {
    width: 44,
    height: 40,
    paddingLeft: 0,
    paddingRight: 0,
    justifyContent: 'center',
  },
  badge: {
    position: 'absolute',
    top: -4,
    right: -4,
    minWidth: 20,
    height: 20,
    paddingHorizontal: 4,
    borderRadius: 10,
    borderWidth: 2,
    borderColor: colors.background,
    backgroundColor: colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  badgeText: { fontSize: 11, fontWeight: '700', color: colors.surface },
});
