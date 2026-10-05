/* ___ UpcomingRentalCard styles ______________________
    The dark card from the design: orange status
    pill, car name and dates in white, a small photo
    well, reference + total under a dark divider, and
    a white and an outlined button.
   ____________________________________________________*/

import { StyleSheet } from 'react-native';
import { colors, monoFont, radius, spacing } from '../../../../theme';

export const styles = StyleSheet.create({
  card: {
    backgroundColor: colors.ink,
    borderRadius: radius.xl,
    padding: spacing.xl,
    gap: 14,
  },
  top: { flexDirection: 'row', justifyContent: 'space-between', gap: 10 },
  topText: { flex: 1, minWidth: 0 },
  status: {
    alignSelf: 'flex-start',
    height: 24,
    paddingHorizontal: 9,
    borderRadius: radius.pill,
    backgroundColor: colors.primary,
    justifyContent: 'center',
  },
  statusText: { fontSize: 11, fontWeight: '600', color: colors.surface },
  name: {
    fontSize: 21,
    fontWeight: '600',
    letterSpacing: -0.2,
    color: colors.surface,
    marginTop: 10,
  },
  meta: { fontSize: 13, color: colors.inkMuted, marginTop: 3 },
  photo: {
    width: 92,
    height: 64,
    borderRadius: radius.lg - 6,
    overflow: 'hidden',
    backgroundColor: colors.inkSurface,
    alignItems: 'center',
    justifyContent: 'center',
  },
  image: { width: '100%', height: '100%' },

  facts: {
    flexDirection: 'row',
    gap: 10,
    paddingTop: 14,
    borderTopWidth: 1,
    borderTopColor: colors.inkBorder,
  },
  fact: { flex: 1, minWidth: 0 },
  factLabel: { fontSize: 11, color: colors.inkMuted },
  factValue: { fontSize: 15, fontWeight: '600', color: colors.surface, marginTop: 2 },
  reference: { fontFamily: monoFont, fontSize: 13 },

  actions: { flexDirection: 'row', gap: spacing.sm },
  primaryAction: {
    flex: 1,
    height: 46,
    borderRadius: radius.pill,
    backgroundColor: colors.surface,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: spacing.sm,
  },
  primaryActionText: { fontSize: 14, fontWeight: '600', color: colors.ink },
  secondaryAction: {
    flex: 1,
    height: 46,
    borderRadius: radius.pill,
    borderWidth: 1.5,
    borderColor: colors.textBody,
    alignItems: 'center',
    justifyContent: 'center',
  },
  secondaryActionText: { fontSize: 14, fontWeight: '600', color: colors.surface },
  pressed: { opacity: 0.75 },
});
