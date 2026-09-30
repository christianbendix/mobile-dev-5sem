/* ___ LocationPicker styles __________________________
    The sheet: header with title and a round close
    button, a grey search field, and the sectioned
    list underneath.
   ____________________________________________________*/

import { StyleSheet } from 'react-native';
import { colors, radius, spacing, typography } from '../../theme';

export const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: spacing.xl,
    paddingTop: spacing.lg,
    paddingBottom: spacing.md,
  },
  title: { fontSize: 22, fontWeight: '700', letterSpacing: -0.5, color: colors.ink },
  closeButton: {
    width: 40,
    height: 40,
    borderRadius: radius.pill,
    backgroundColor: colors.surface,
    alignItems: 'center',
    justifyContent: 'center',
  },
  searchBox: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    marginHorizontal: spacing.xl,
    paddingHorizontal: spacing.lg,
    height: 52,
    borderRadius: radius.lg,
    backgroundColor: colors.surface,
    borderWidth: 1.5,
    borderColor: colors.border,
  },
  input: { flex: 1, fontSize: 16, color: colors.ink, padding: 0 },
  list: { paddingHorizontal: 14, paddingBottom: spacing.xxl },
  sectionTitle: {
    ...typography.section,
    marginTop: spacing.xl,
    marginBottom: spacing.xs,
    marginHorizontal: spacing.xs,
  },
  footer: { paddingTop: spacing.lg, gap: spacing.sm, paddingHorizontal: spacing.xs },
  status: typography.body,
});
