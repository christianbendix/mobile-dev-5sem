/* ___ FilterPanel styles _____________________________
    White bottom sheet over a dimmed screen: drag
    handle, title with a round close button, the
    option rows, and Reset + Apply pinned at the
    bottom. Ticked boxes turn solid orange.
   ____________________________________________________*/

import { StyleSheet } from 'react-native';
import { colors, radius, spacing, typography } from '../../theme';

export const styles = StyleSheet.create({
  root: { flex: 1, justifyContent: 'flex-end' },
  backdrop: { ...StyleSheet.absoluteFill, backgroundColor: colors.overlay },
  sheet: {
    maxHeight: '82%',
    backgroundColor: colors.surface,
    borderTopLeftRadius: 34,
    borderTopRightRadius: 34,
  },
  handle: {
    width: 40,
    height: 5,
    borderRadius: 3,
    backgroundColor: colors.handle,
    alignSelf: 'center',
    marginTop: 10,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingTop: 10,
    paddingBottom: 6,
  },
  title: { fontSize: 20, fontWeight: '700', letterSpacing: -0.4, color: colors.ink },
  closeButton: {
    width: 38,
    height: 38,
    borderRadius: radius.pill,
    backgroundColor: colors.background,
    alignItems: 'center',
    justifyContent: 'center',
  },

  body: { paddingHorizontal: 20, paddingBottom: spacing.sm },
  section: { paddingTop: spacing.md },
  sectionTitle: { ...typography.section, paddingTop: 6, paddingBottom: 2 },
  sectionHint: { ...typography.caption, paddingTop: 2, paddingBottom: spacing.sm },

  // One tickable row: box/dot on the left, label filling the rest
  option: { flexDirection: 'row', alignItems: 'center', gap: 14, paddingVertical: 13 },
  optionLabel: { flex: 1, fontSize: 16, color: colors.ink },
  checkbox: {
    width: 24,
    height: 24,
    borderRadius: 8,
    borderWidth: 2,
    borderColor: colors.control,
    alignItems: 'center',
    justifyContent: 'center',
  },
  checkboxOn: { backgroundColor: colors.primary, borderColor: colors.primary },
  radio: {
    width: 24,
    height: 24,
    borderRadius: radius.pill,
    borderWidth: 2,
    borderColor: colors.control,
    alignItems: 'center',
    justifyContent: 'center',
  },
  radioOn: { borderColor: colors.primary },
  radioDot: { width: 12, height: 12, borderRadius: radius.pill, backgroundColor: colors.primary },

  priceRow: { flexDirection: 'row', gap: spacing.sm },
  priceCell: { flex: 1 },

  footer: {
    flexDirection: 'row',
    gap: spacing.sm,
    paddingHorizontal: 20,
    paddingTop: spacing.md,
    paddingBottom: spacing.md,
    borderTopWidth: 1,
    borderTopColor: colors.divider,
  },
  resetButton: {
    height: 54,
    paddingHorizontal: spacing.xxl,
    borderRadius: radius.pill,
    borderWidth: 1.5,
    borderColor: colors.border,
    alignItems: 'center',
    justifyContent: 'center',
  },
  resetText: { fontSize: 15, fontWeight: '600', color: colors.ink },
  applyButton: {
    flex: 1,
    height: 54,
    borderRadius: radius.pill,
    backgroundColor: colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  applyText: { fontSize: 15, fontWeight: '600', color: colors.surface },
  pressed: { opacity: 0.8 },
});
