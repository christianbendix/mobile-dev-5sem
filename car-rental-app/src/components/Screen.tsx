import type { ReactNode } from 'react';
import { View } from 'react-native';

import { OnlineStatusHeader } from './OnlineStatusHeader';

/** Every screen's shell: the online/offline header plus a flexed body. */
export function Screen({ children }: { children: ReactNode }) {
  return (
    <View style={{ flex: 1 }}>
      <OnlineStatusHeader />
      <View style={{ flex: 1, padding: 16 }}>{children}</View>
    </View>
  );
}
