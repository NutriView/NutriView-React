import type { UserResponse } from './types';

export const SESSION_STORAGE_KEY = 'nutriview.auth';

// The pre-JWT build stored the bare user here. It is never read again, so drop it
// once instead of leaving a stale copy of the profile in every existing browser.
try {
  localStorage.removeItem('nutriview.user');
} catch {
  // localStorage can be unavailable (private mode); nothing to clean up then.
}

/** What the app persists between reloads: the access token and who it belongs to. */
export interface Session {
  token: string;
  expiresAt: string;
  user: UserResponse;
}

export function readSession(): Session | null {
  try {
    const raw = localStorage.getItem(SESSION_STORAGE_KEY);
    if (!raw) return null;

    const session = JSON.parse(raw) as Session;

    // A token past its expiry is worth no more than no token at all: the API
    // would reject it anyway, so treat it as signed out up front.
    if (!session.token || Date.parse(session.expiresAt) <= Date.now()) return null;

    return session;
  } catch {
    return null;
  }
}

export function writeSession(session: Session): void {
  localStorage.setItem(SESSION_STORAGE_KEY, JSON.stringify(session));
}

export function clearSession(): void {
  localStorage.removeItem(SESSION_STORAGE_KEY);
}
