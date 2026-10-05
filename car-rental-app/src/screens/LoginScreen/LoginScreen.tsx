/* ___ LoginScreen ____________________________________
    First screen on every cold start: email and
    password, or continue as a guest. When a guest is
    sent here from the booking flow (`redirectTo`), a
    successful login goes straight back to it.
   ____________________________________________________*/

import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import { Car as CarIcon, Lock, Mail } from 'lucide-react-native';
import { useState } from 'react';
import { KeyboardAvoidingView, Platform, Pressable, ScrollView, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { OnlineStatusHeader } from '../../components/OnlineStatusHeader';
import { PrimaryButton } from '../../components/PrimaryButton/PrimaryButton';
import { TextField } from '../../components/TextField/TextField';
import { useAuth } from '../../context/AuthContext';
import type { RootStackParamList } from '../../navigation/types';
import { colors } from '../../theme';
import { styles } from './LoginScreen.styles';

type Props = NativeStackScreenProps<RootStackParamList, 'Login'>;

export function LoginScreen({ navigation, route }: Props) {
  const { login, continueAsGuest } = useAuth();
  const redirectTo = route.params?.redirectTo;

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Send the user on: back to whatever they were gated out of, or to the tabs.
  // `replace` keeps Login out of the back stack either way.
  function proceed() {
    if (redirectTo) {
      navigation.replace(redirectTo.screen, redirectTo.params);
    } else {
      navigation.replace('MainTabs');
    }
  }

  async function handleLogin() {
    setError(null);
    setIsSubmitting(true);
    try {
      await login(email, password);
      proceed();
    } catch (cause) {
      // stay on this screen and show why
      setError(cause instanceof Error ? cause.message : 'Login failed.');
    } finally {
      setIsSubmitting(false);
    }
  }

  function handleGuest() {
    continueAsGuest();
    // a guest cannot satisfy a login-gated redirect, so always land on the tabs
    navigation.replace('MainTabs');
  }

  return (
    <SafeAreaView style={styles.safeArea} edges={['top', 'bottom']}>
      <OnlineStatusHeader />
      <KeyboardAvoidingView
        style={styles.flex}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >
        <ScrollView
          contentContainerStyle={styles.content}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          <View style={styles.brand}>
            <View style={styles.brandMark}>
              <CarIcon size={18} color={colors.surface} strokeWidth={2.2} />
            </View>
            <Text style={styles.brandName}>CarBay</Text>
          </View>

          <View style={styles.header}>
            <Text style={styles.greeting}>Welcome</Text>
            <Text style={styles.title}>Let&apos;s get you{'\n'}on the road.</Text>
          </View>

          {redirectTo ? (
            <View style={styles.notice}>
              <Text style={styles.noticeText}>Log in to finish your booking.</Text>
            </View>
          ) : null}

          <View style={styles.card}>
            <TextField
              label="Email"
              icon={<Mail size={20} color={colors.primary} />}
              value={email}
              onChangeText={setEmail}
              placeholder="you@example.com"
              autoCapitalize="none"
              autoCorrect={false}
              keyboardType="email-address"
              textContentType="emailAddress"
              returnKeyType="next"
            />
            <TextField
              label="Password"
              icon={<Lock size={20} color={colors.primary} />}
              value={password}
              onChangeText={setPassword}
              placeholder="Password"
              autoCapitalize="none"
              autoCorrect={false}
              secureTextEntry
              textContentType="password"
              returnKeyType="go"
              onSubmitEditing={handleLogin}
            />

            {error ? (
              <Text style={styles.error} accessibilityRole="alert">
                {error}
              </Text>
            ) : null}

            <PrimaryButton
              title={isSubmitting ? 'Logging in…' : 'Log in'}
              onPress={handleLogin}
              disabled={isSubmitting}
            />
          </View>

          <View style={styles.spacer} />

          <Pressable
            onPress={handleGuest}
            disabled={isSubmitting}
            accessibilityRole="button"
            style={({ pressed }) => [styles.guestButton, pressed && styles.guestPressed]}
          >
            <Text style={styles.guestText}>Continue as guest</Text>
          </Pressable>
          <Text style={styles.guestHint}>
            Guests can search and browse. Booking needs an account.
          </Text>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}
