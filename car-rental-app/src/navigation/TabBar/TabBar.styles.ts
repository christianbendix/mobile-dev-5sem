/* ___ TabBar styles __________________________________
    The floating white pill at the bottom of the tabs.
    The active tab fills with orange; the others stay
    transparent with muted icon and label.
   ____________________________________________________*/

import { StyleSheet } from 'react-native';
import { colors, radius, spacing } from '../../theme';

/** how much room screens leave at the bottom so the bar never covers content */
export const TAB_BAR_SPACE = 120;

export const styles = StyleSheet.create({
  bar: {
    position: 'absolute',
    left: 14,
    right: 14,
    height: 70,
    flexDirection: 'row',
    gap: spacing.xs,
    padding: 6,
    borderRadius: radius.pill,
    backgroundColor: colors.surface,
    boxShadow: '0 1px 2px rgba(0,0,0,0.05), 0 16px 40px -10px rgba(0,0,0,0.18)',
  },
  tab: {
    flex: 1,
    borderRadius: radius.pill,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 3,
  },
  tabActive: { backgroundColor: colors.primary },
  tabPressed: { backgroundColor: colors.background },
  label: { fontSize: 12, fontWeight: '600', color: colors.textMuted },
  labelActive: { color: colors.surface },
});
