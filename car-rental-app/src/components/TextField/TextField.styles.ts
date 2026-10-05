/* ___ TextField styles _______________________________
    Same grey box as InfoField, but the value line is
    a text input. Gets an orange outline while focused.
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
    paddingVertical: 10,
    paddingHorizontal: spacing.lg,
    borderWidth: 1.5,
    borderColor: colors.background,
  },
  focused: { borderColor: colors.primary },
  textWrap: { flex: 1, minWidth: 0 },
  label: typography.caption,
  input: { ...typography.value, paddingVertical: 2, marginTop: 2 },
});
