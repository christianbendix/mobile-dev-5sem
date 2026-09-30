/* ___ LocationRow styles _____________________________
    Same row look as the lists on the home screen,
    with a soft orange icon box.
   ____________________________________________________*/

import { StyleSheet } from 'react-native';
import { colors, radius, spacing, typography } from '../../theme';

export const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
    paddingVertical: 10,
    paddingHorizontal: spacing.xs,
    borderRadius: radius.md,
  },
  pressed: { backgroundColor: colors.surface },
  iconBox: {
    width: 38,
    height: 38,
    borderRadius: radius.sm,
    backgroundColor: colors.primarySoft,
    alignItems: 'center',
    justifyContent: 'center',
  },
  textWrap: { flex: 1, minWidth: 0 },
  title: typography.itemTitle,
  subtitle: { fontSize: 13, color: colors.textSubtle },
});
