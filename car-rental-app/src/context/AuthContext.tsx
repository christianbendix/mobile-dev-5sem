import { createContext, useCallback, useContext, useMemo, useState, type ReactNode } from 'react';

import { api, type AuthUser } from '../api';

type AuthContextValue = {
  user: AuthUser | null;
  isGuest: boolean;
  /** Rejects with an ApiError whose message is displayable as-is. */
  login: (identity: string, password: string) => Promise<void>;
  logout: () => void;
  continueAsGuest: () => void;
};

const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  // The API layer owns the token; this is the React-visible mirror of it. It
  // starts empty because the token store does not restore on a cold start.
  const [user, setUser] = useState<AuthUser | null>(null);
  const [isGuest, setIsGuest] = useState(false);

  const login = useCallback(async (identity: string, password: string) => {
    const authenticated = await api.auth.login(identity, password);
    setUser(authenticated);
    setIsGuest(false);
  }, []);

  const logout = useCallback(() => {
    api.auth.logout();
    setUser(null);
    setIsGuest(false);
  }, []);

  const continueAsGuest = useCallback(() => {
    api.auth.logout();
    setUser(null);
    setIsGuest(true);
  }, []);

  const value = useMemo<AuthContextValue>(
    () => ({ user, isGuest, login, logout, continueAsGuest }),
    [user, isGuest, login, logout, continueAsGuest],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth(): AuthContextValue {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used inside an AuthProvider');
  return context;
}
