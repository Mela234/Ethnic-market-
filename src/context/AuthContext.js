import React, { createContext, useContext, useEffect, useState, useCallback } from 'react';
import * as api from '../api/client';
import { saveToken, loadToken, clearToken } from '../api/tokenStore';

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  // `booting` covers the one-time session restore on launch. Showing the auth
  // screen during it would flash it at users who are already signed in.
  const [booting, setBooting] = useState(true);
  // `guest` = tapped "Browse as guest". Lets them past the landing screen
  // without an account. Purely client-side — the server has no guest concept,
  // and checkout still demands a real token.
  const [guest, setGuest] = useState(false);

  useEffect(() => {
    let cancelled = false;

    (async () => {
      try {
        const token = await loadToken();
        if (!token) return;

        api.setToken(token);
        // A stored token proves nothing — it may be expired (they last 7 days)
        // or the account may be gone. /auth/me is the cheapest way to find out.
        const me = await api.fetchMe();
        if (!cancelled) setUser(me);
      } catch {
        // Bad or expired token: drop it so we don't retry with it forever.
        api.setToken(null);
        await clearToken();
      } finally {
        if (!cancelled) setBooting(false);
      }
    })();

    return () => { cancelled = true; };
  }, []);

  // Both register and login return only { access_token }, so fetch the user
  // afterwards to populate the profile.
  const establish = useCallback(async (accessToken) => {
    api.setToken(accessToken);
    await saveToken(accessToken);
    const me = await api.fetchMe();
    setUser(me);
    return me;
  }, []);

  const signIn = useCallback(async ({ phone, password }) => {
    const { access_token } = await api.login({ phone, password });
    return establish(access_token);
  }, [establish]);

  const signUp = useCallback(async ({ phone, password, name, email }) => {
    const { access_token } = await api.register({ phone, password, name, email });
    return establish(access_token);
  }, [establish]);

  const continueAsGuest = useCallback(() => setGuest(true), []);

  const signOut = useCallback(async () => {
    api.setToken(null);
    await clearToken();
    setUser(null);
    // Drop guest too, so signing out lands on the landing screen rather than
    // silently downgrading them to a browsing guest.
    setGuest(false);
  }, []);

  return (
    <AuthContext.Provider
      value={{
        user,
        booting,
        guest,
        signedIn: !!user,
        signIn,
        signUp,
        signOut,
        continueAsGuest,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
