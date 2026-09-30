/* ___ RecentSearchItem styles ________________________
    White rounded row with a grey 38x38 icon box on
    the left. Slightly dimmed while pressed.
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
  textWrap: { flex: 1 },
  title: typography.itemTitle,
  subtitle: { fontSize: 13, color: colors.textSubtle },
});
