import { Button, Text } from 'react-native';

import { LoginRequired } from '../components/LoginRequired';
import { Screen } from '../components/Screen';
import { useAuth } from '../context/AuthContext';

export function AccountScreen() {
  const { user, logout } = useAuth();

  if (!user) return <LoginRequired message="Log in to see your account." />;

  return (
    <Screen>
      <Text>Account</Text>
      <Text>Name: {user.name}</Text>
      <Text>Email: {user.email}</Text>
      <Text>User ID: {user.id}</Text>

      <Button title="Log out" onPress={logout} />
    </Screen>
  );
}
