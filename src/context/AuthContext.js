import React, {
  createContext,
  useContext,
  useEffect,
  useState,
  useCallback,
} from "react";
import * as api from "../api/client";
import { saveToken, loadToken, clearToken } from "../api/tokenStore";

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  // One-time session restore on launch; screens wait on this instead of
  // flashing the auth screen at an already-signed-in user.
  const [booting, setBooting] = useState(true);
  // Client-side only: tapped "Browse as guest". The server has no guest
  // concept, and checkout still requires a real token.
  const [guest, setGuest] = useState(false);

  useEffect(() => {
    let cancelled = false;

    (async () => {
      try {
        const token = await loadToken();
        if (!token) return;

        api.setToken(token);
        // The token may be expired or the account gone; /auth/me confirms it.
        const me = await api.fetchMe();
        if (!cancelled) setUser(me);
      } catch {
        api.setToken(null);
        await clearToken();
      } finally {
        if (!cancelled) setBooting(false);
      }
    })();

    return () => {
      cancelled = true;
    };
  }, []);

  // Persists the token and loads the user. Shared by every sign-in path.
  const establish = useCallback(async (accessToken) => {
    api.setToken(accessToken);
    await saveToken(accessToken);
    const me = await api.fetchMe();
    setUser(me);
    return me;
  }, []);

  const signIn = useCallback(
    async ({ phone, password }) => {
      const { access_token } = await api.login({ phone, password });
      return establish(access_token);
    },
    [establish],
  );

  const signUp = useCallback(
    async ({ phone, password, name, email }) => {
      const { access_token } = await api.register({
        phone,
        password,
        name,
        email,
      });
      return establish(access_token);
    },
    [establish],
  );

  // Google already has our JWT from POST /auth/google, so it skips credentials.
  const signInWithToken = useCallback(
    async (accessToken) => {
      return establish(accessToken);
    },
    [establish],
  );

  const continueAsGuest = useCallback(() => setGuest(true), []);

  const signOut = useCallback(async () => {
    api.setToken(null);
    await clearToken();
    setUser(null);
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
        signInWithToken,
        signOut,
        continueAsGuest,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
