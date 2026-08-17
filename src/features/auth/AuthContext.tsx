import { createContext, useContext, useEffect, useMemo, useState } from 'react';
import type { ReactNode } from 'react';
import type { AuthResponse, UserResponse } from '../../api/types';
import {
  clearSession,
  readSession,
  SESSION_STORAGE_KEY,
  writeSession,
  type Session,
} from '../../api/session';
import { setUnauthorizedHandler } from '../../api/http';

interface AuthContextValue {
  user: UserResponse | null;
  /** Store the token + user returned by login or register. */
  setSession: (auth: AuthResponse) => void;
  /** Replace just the cached user, keeping the current token. */
  setUser: (user: UserResponse) => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [session, setSessionState] = useState<Session | null>(() => readSession());

  // Keep other tabs in sync (login/logout in one tab reflects in others).
  useEffect(() => {
    function onStorage(e: StorageEvent) {
      if (e.key === SESSION_STORAGE_KEY) setSessionState(readSession());
    }
    window.addEventListener('storage', onStorage);
    return () => window.removeEventListener('storage', onStorage);
  }, []);

  // A token the API rejects is dead: drop it so RequireAuth sends the user to /login.
  useEffect(() => {
    setUnauthorizedHandler(() => {
      clearSession();
      setSessionState(null);
    });
    return () => setUnauthorizedHandler(null);
  }, []);

  const value = useMemo<AuthContextValue>(
    () => ({
      user: session?.user ?? null,
      setSession: (auth: AuthResponse) => {
        const next: Session = {
          token: auth.token,
          expiresAt: auth.expiresAt,
          user: auth.user,
        };
        writeSession(next);
        setSessionState(next);
      },
      setUser: (user: UserResponse) => {
        if (!session) return;
        const next: Session = { ...session, user };
        writeSession(next);
        setSessionState(next);
      },
      logout: () => {
        clearSession();
        setSessionState(null);
      },
    }),
    [session],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth(): AuthContextValue {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within an AuthProvider');
  return ctx;
}

/**
 * The current user's id, used to scope cached queries. The API no longer takes
 * it in URLs — it reads the caller from the token.
 */
export function useCurrentUserId(): string {
  const { user } = useAuth();
  if (!user) throw new Error('No authenticated user');
  return user.userId;
}
