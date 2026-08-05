import { createContext, useContext, useEffect, useMemo, useState } from 'react';
import type { ReactNode } from 'react';
import type { UserResponse } from '../../api/types';

const STORAGE_KEY = 'nutriview.user';

interface AuthContextValue {
  user: UserResponse | null;
  setUser: (user: UserResponse) => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

function readStoredUser(): UserResponse | null {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? (JSON.parse(raw) as UserResponse) : null;
  } catch {
    return null;
  }
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUserState] = useState<UserResponse | null>(() => readStoredUser());

  // Keep other tabs in sync (login/logout in one tab reflects in others).
  useEffect(() => {
    function onStorage(e: StorageEvent) {
      if (e.key === STORAGE_KEY) setUserState(readStoredUser());
    }
    window.addEventListener('storage', onStorage);
    return () => window.removeEventListener('storage', onStorage);
  }, []);

  const value = useMemo<AuthContextValue>(
    () => ({
      user,
      setUser: (u: UserResponse) => {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(u));
        setUserState(u);
      },
      logout: () => {
        localStorage.removeItem(STORAGE_KEY);
        setUserState(null);
      },
    }),
    [user],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth(): AuthContextValue {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within an AuthProvider');
  return ctx;
}

/** The current user's id; throws if unauthenticated (only call under RequireAuth). */
export function useCurrentUserId(): string {
  const { user } = useAuth();
  if (!user) throw new Error('No authenticated user');
  return user.userId;
}
