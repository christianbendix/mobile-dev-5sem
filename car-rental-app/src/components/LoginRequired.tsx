/* ___ LoginRequired component ________________________
    Shown in place of a tab screen when nobody is
    logged in: the tab's big title, a white card
    saying why, and the orange button to the login.
   ____________________________________________________*/

import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { Lock } from 'lucide-react-native';
import { StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import type { RootStackParamList } from '../navigation/types';
import { colors, radius, shadows, spacing, typography } from '../theme';
import { OnlineStatusHeader } from './OnlineStatusHeader';
import { PrimaryButton } from './PrimaryButton/PrimaryButton';

type Props = { title: string; message: string };

export function LoginRequired({ title, message }: Props) {
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();

  return (
    <SafeAreaView style={styles.safeArea} edges={['top']}>
      <OnlineStatusHeader />
      <View style={styles.content}>
        <Text style={styles.title}>{title}</Text>
        <View style={styles.card}>
          <View style={styles.iconCircle}>
            <Lock size={22} color={colors.primaryText} />
          </View>
          <Text style={styles.message}>{message}</Text>
          <Text style={styles.hint}>You are browsing as a guest.</Text>
          <View style={styles.button}>
            <PrimaryButton title="Go to login" onPress={() => navigation.navigate('Login')} />
          </View>
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: colors.background },
  content: { paddingHorizontal: spacing.xl, paddingTop: spacing.md },
  title: { ...typography.display, paddingHorizontal: spacing.xs },
  card: {
    marginTop: spacing.xxl,
    backgroundColor: colors.surface,
    borderRadius: 28,
    padding: spacing.xxl,
    alignItems: 'flex-start',
    ...shadows.card,
  },
  iconCircle: {
    width: 48,
    height: 48,
    borderRadius: radius.pill,
    backgroundColor: colors.primarySoft,
    alignItems: 'center',
    justifyContent: 'center',
  },
  message: { fontSize: 17, fontWeight: '600', color: colors.ink, marginTop: spacing.lg },
  hint: { ...typography.body, color: colors.textSubtle, marginTop: spacing.xs },
  button: { alignSelf: 'stretch', marginTop: spacing.xl },
});
