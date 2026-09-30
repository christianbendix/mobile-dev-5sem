import { Text, View } from 'react-native';

import { useIsOnline } from '../context/NetworkContext';

export function OnlineStatusHeader() {
  const isOnline = useIsOnline();

  return (
    <View style={{ padding: 8 }}>
      <Text>{isOnline ? 'Online' : 'Offline'}</Text>
    </View>
  );
}
