/* ___ InfoField styles _______________________________
    Grey rounded box, icon on the left and the text
    stacked on the right (label, value, sub value).
   ____________________________________________________*/

import { StyleSheet } from 'react-native';
import { colors, radius, spacing, typography } from '../../theme';

export const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
    backgroundColor: colors.background,
    borderRadius: radius.lg,
    paddingVertical: 14,
    paddingHorizontal: spacing.lg,
  },
  textWrap: { flex: 1, minWidth: 0 },
  label: typography.caption,
  value: { ...typography.value, marginTop: 2 },
  placeholder: { color: colors.iconMuted },
  subValue: { fontSize: 13, color: colors.textMuted, marginTop: 2 },
});
