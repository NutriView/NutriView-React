import { useCallback } from 'react';
import { useAuth } from './AuthContext';
import { getUser } from './auth.api';

/** Re-fetches the current user from the API and updates the stored session. */
export function useRefreshUser() {
  const { user, setUser } = useAuth();
  return useCallback(async () => {
    if (!user) return;
    const fresh = await getUser(user.userId);
    setUser(fresh);
  }, [user, setUser]);
}
