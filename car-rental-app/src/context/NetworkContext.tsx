import NetInfo from '@react-native-community/netinfo';
import { createContext, useContext, useEffect, useState, type ReactNode } from 'react';

const NetworkContext = createContext(true);

export function NetworkProvider({ children }: { children: ReactNode }) {
  const [isOnline, setIsOnline] = useState(true);

  useEffect(() => {
    // fires once with the current state, then on every change
    return NetInfo.addEventListener((state) => {
      setIsOnline(state.isConnected === true && state.isInternetReachable !== false);
    });
  }, []);

  return <NetworkContext.Provider value={isOnline}>{children}</NetworkContext.Provider>;
}

export function useIsOnline(): boolean {
  return useContext(NetworkContext);
}
