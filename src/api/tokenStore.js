import { Platform } from 'react-native';
import * as SecureStore from 'expo-secure-store';

/**
 * Where the JWT lives between app launches.
 *
 * expo-secure-store uses the iOS Keychain / Android Keystore. It has no web
 * implementation, so on web we fall back to memory (token dies on refresh)
 * rather than throwing. Don't swap this for AsyncStorage — that's plain,
 * unencrypted text on disk, which is the wrong place for a credential.
 */

const KEY = 'bazaar.auth.token';
const isWeb = Platform.OS === 'web';

let memoryToken = null;

export async function saveToken(token) {
  if (isWeb) {
    memoryToken = token;
    return;
  }
  await SecureStore.setItemAsync(KEY, token);
}

export async function loadToken() {
  if (isWeb) return memoryToken;
  try {
    return await SecureStore.getItemAsync(KEY);
  } catch {
    // Keychain read can fail (e.g. device locked). Treat as signed out.
    return null;
  }
}

export async function clearToken() {
  if (isWeb) {
    memoryToken = null;
    return;
  }
  try {
    await SecureStore.deleteItemAsync(KEY);
  } catch {
    // Already gone. Nothing to do.
  }
}
