import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import { useState } from 'react';
import { Button, Text, TextInput, View } from 'react-native';

import { Screen } from '../components/Screen';
import { useAuth } from '../context/AuthContext';
import type { RootStackParamList } from '../navigation/types';

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
    <Screen>
      <Text>Welcome</Text>
      {redirectTo ? <Text>Log in to finish your booking.</Text> : null}

      <Text>Email</Text>
      <TextInput
        value={email}
        onChangeText={setEmail}
        placeholder="you@example.com"
        autoCapitalize="none"
        autoCorrect={false}
        keyboardType="email-address"
        textContentType="emailAddress"
        style={{ borderWidth: 1, padding: 8 }}
      />

      <Text>Password</Text>
      <TextInput
        value={password}
        onChangeText={setPassword}
        placeholder="Password"
        autoCapitalize="none"
        autoCorrect={false}
        secureTextEntry
        textContentType="password"
        onSubmitEditing={handleLogin}
        style={{ borderWidth: 1, padding: 8 }}
      />

      {error ? <Text accessibilityRole="alert">{error}</Text> : null}

      <Button
        title={isSubmitting ? 'Logging in…' : 'Log in'}
        onPress={handleLogin}
        disabled={isSubmitting}
      />

      <View style={{ height: 16 }} />

      <Button title="Continue as guest" onPress={handleGuest} disabled={isSubmitting} />
    </Screen>
  );
}
