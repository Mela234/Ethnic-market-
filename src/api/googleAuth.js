import { useEffect } from "react";
import * as WebBrowser from "expo-web-browser";
import * as Google from "expo-auth-session/providers/google";
import { BASE_URL } from "./client";

// redirects back into the app.
WebBrowser.maybeCompleteAuthSession();

/**
 * Your three Google OAuth client IDs, from Google Cloud Console.
 * Fill these in. Missing an ID just means that platform can't do Google
 * sign-in — it won't crash the others.
 *
 * On a standalone EAS build, iOS/Android use their own IDs. In Expo Go and on
 * web, the web ID carries the flow.
 */
const GOOGLE_CLIENT_IDS = {
  webClientId:
    "1024542944483-fliasic13uec0lhtkl2gr7nuaumt1sbi.apps.googleusercontent.com",
  iosClientId:
    "http://1024542944483-0bumtuf57mujkiln6or9gmss592od2pv.apps.googleusercontent.com",
  androidClientId:
    "http://1024542944483-n7oobtvmq7mpdcfir71kijkg9u75o22h.apps.googleusercontent.com",
};

/**
 * Hook that exposes a `promptGoogle()` function plus loading/ready state.
 *
 * Flow: prompt opens Google -> user picks account -> we get an ID token ->
 * POST it to /auth/google -> backend verifies it and returns OUR JWT ->
 * onToken(access_token) hands that back to AuthContext, same as phone login.
 */
export function useGoogleSignIn({ onToken, onError }) {
  const [request, response, promptAsync] =
    Google.useIdTokenAuthRequest(GOOGLE_CLIENT_IDS);

  useEffect(() => {
    if (!response) return;

    if (response.type === "success") {
      const idToken = response.params?.id_token;
      if (!idToken) {
        onError?.("Google did not return a token");
        return;
      }
      exchangeWithBackend(idToken)
        .then(onToken)
        .catch((e) => onError?.(e.message));
    } else if (response.type === "error") {
      onError?.(response.error?.message || "Google sign-in failed");
    }
  }, [response]);

  return {
    promptGoogle: () => promptAsync(),
    googleReady: !!request,
  };
}

async function exchangeWithBackend(idToken) {
  let res;
  try {
    res = await fetch(`${BASE_URL}/auth/google`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id_token: idToken }),
    });
  } catch {
    throw new Error(`Can't reach the server at ${BASE_URL}`);
  }

  const data = await res.json().catch(() => null);
  if (!res.ok) {
    throw new Error(data?.detail || `Google sign-in failed (${res.status})`);
  }
  return data.access_token;
}
