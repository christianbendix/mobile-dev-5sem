import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { Button, Text } from 'react-native';

import type { RootStackParamList } from '../navigation/types';
import { Screen } from './Screen';

/** Gate shown in place of a tab screen when nobody is logged in. */
export function LoginRequired({ message }: { message: string }) {
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();

  return (
    <Screen>
      <Text>{message}</Text>
      <Button title="Go to login" onPress={() => navigation.navigate('Login')} />
    </Screen>
  );
}
