/* ___ DateRangePicker styles _________________________
    Same sheet as the LocationPicker (header with a
    round close button on the grey background), with
    white month cards, a Monday-first day grid, the
    chosen range in the soft primary color and its
    ends in solid primary. The time slots reuse the
    day look in a four-column grid.
   ____________________________________________________*/

import { StyleSheet } from 'react-native';
import { colors, radius, shadows, spacing, typography } from '../../theme';

const DAY_SIZE = 40;

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

  // "Pick-up / Return" summary under the header: each date with its time
  summaryRow: {
    flexDirection: 'row',
    gap: spacing.sm,
    marginHorizontal: spacing.xl,
    marginBottom: spacing.sm,
  },
  summaryDate: { flex: 3 },
  summaryTime: { flex: 2 },
  summaryCell: {
    backgroundColor: colors.surface,
    borderRadius: radius.lg,
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.lg,
    borderWidth: 1.5,
    borderColor: colors.surface,
  },
  // what the next tap will set: a calendar date, or the time being edited
  summaryCellActive: { borderColor: colors.primary },
  summaryLabel: typography.caption,
  summaryValue: { ...typography.value, marginTop: 2 },
  summaryPlaceholder: { color: colors.iconMuted },

  weekdayRow: {
    flexDirection: 'row',
    marginHorizontal: spacing.xl,
    marginTop: spacing.sm,
    paddingHorizontal: spacing.md,
  },
  weekday: { ...typography.caption, flex: 1, textAlign: 'center' },

  list: { paddingHorizontal: 14, paddingBottom: spacing.xxl, gap: spacing.md },
  month: {
    backgroundColor: colors.surface,
    borderRadius: radius.lg,
    padding: spacing.md,
    marginTop: spacing.sm,
  },
  monthTitle: { ...typography.itemTitle, marginBottom: spacing.sm, marginLeft: spacing.xs },
  week: { flexDirection: 'row' },

  // Each cell spans its column; the band behind it draws the range
  dayCell: { flex: 1, height: DAY_SIZE, alignItems: 'center', justifyContent: 'center' },
  inRange: { backgroundColor: colors.primarySoft },
  rangeStart: {
    backgroundColor: colors.primarySoft,
    borderTopLeftRadius: DAY_SIZE / 2,
    borderBottomLeftRadius: DAY_SIZE / 2,
  },
  rangeEnd: {
    backgroundColor: colors.primarySoft,
    borderTopRightRadius: DAY_SIZE / 2,
    borderBottomRightRadius: DAY_SIZE / 2,
  },
  day: {
    width: DAY_SIZE,
    height: DAY_SIZE,
    borderRadius: radius.pill,
    alignItems: 'center',
    justifyContent: 'center',
  },
  dayToday: { borderWidth: 1.5, borderColor: colors.border },
  daySelected: { backgroundColor: colors.primary },
  dayText: { fontSize: 15, fontWeight: '500', color: colors.ink },
  dayTextSelected: { color: colors.surface, fontWeight: '700' },
  dayTextDisabled: { color: colors.iconMuted, fontWeight: '400' },

  // Time slots: four per row, same round look as the days
  slotCard: {
    backgroundColor: colors.surface,
    borderRadius: radius.lg,
    padding: spacing.md,
    marginTop: spacing.sm,
  },
  slotGrid: { flexDirection: 'row', flexWrap: 'wrap' },
  slotCell: { width: '25%', padding: spacing.xs },
  slot: {
    height: 44,
    borderRadius: radius.sm,
    backgroundColor: colors.background,
    alignItems: 'center',
    justifyContent: 'center',
  },
  slotPressed: { backgroundColor: colors.primarySoft },

  footer: {
    backgroundColor: colors.surface,
    paddingHorizontal: spacing.xl,
    paddingTop: spacing.md,
    gap: spacing.sm,
    ...shadows.card,
  },
  footerText: { ...typography.body, textAlign: 'center' },
  footerWarning: { ...typography.caption, color: colors.primaryText, textAlign: 'center' },
});
