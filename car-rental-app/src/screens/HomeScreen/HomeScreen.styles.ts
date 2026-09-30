/* ___ HomeScreen styles ______________________________
    Layout of the home (search) screen: page padding,
    the header with the big title and the lists
    below the search card.
   ____________________________________________________*/

import { StyleSheet } from 'react-native';
import { colors, spacing, typography } from '../../theme';

export const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: colors.background },
  content: { paddingHorizontal: spacing.xl, paddingTop: spacing.md, paddingBottom: 120 },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    paddingHorizontal: spacing.xs,
  },
  greeting: { fontSize: 14, fontWeight: '500', color: colors.textSubtle },
  title: { ...typography.display, marginTop: spacing.xs },
  sectionTitle: {
    ...typography.section,
    marginTop: 26,
    marginBottom: 10,
    marginHorizontal: spacing.xs,
  },
  list: { gap: spacing.sm },
  message: { ...typography.body, marginHorizontal: spacing.xs },
});
