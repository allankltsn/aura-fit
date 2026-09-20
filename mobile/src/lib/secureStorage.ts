import { Platform } from 'react-native';
import * as SecureStore from 'expo-secure-store';

/**
 * Storage for auth tokens (access/refresh) and any other secret the app
 * needs to hold client-side.
 *
 * - Native (iOS/Android): backed by expo-secure-store — the OS Keychain /
 *   Keystore, encrypted at rest and outside the JS sandbox.
 * - Web: **in-memory only, cleared on reload.** `localStorage`/
 *   `sessionStorage` are readable by any script that runs on the page, so a
 *   single XSS bug anywhere (a dependency, a misconfigured CSP) turns into a
 *   stolen session. That's a strictly worse trade than "the user is logged
 *   out on refresh."
 *
 * The real fix for persistent web sessions is a backend that sets the
 * refresh token as an httpOnly, Secure, SameSite=Strict cookie — the
 * browser attaches it automatically and no client-side JS (trusted or
 * injected) can read it. Wire that up on the API side rather than reaching
 * for localStorage here. See CLAUDE.md: "Never log access tokens, refresh
 * tokens, Cognito tokens, API keys, or passwords" — the same rule extends
 * to not persisting them in the DOM's readable storage.
 */

const memoryStore = new Map<string, string>();

export const secureStorage = {
  async getItem(key: string): Promise<string | null> {
    if (Platform.OS === 'web') return memoryStore.get(key) ?? null;
    return SecureStore.getItemAsync(key);
  },

  async setItem(key: string, value: string): Promise<void> {
    if (Platform.OS === 'web') {
      memoryStore.set(key, value);
      return;
    }
    await SecureStore.setItemAsync(key, value);
  },

  async removeItem(key: string): Promise<void> {
    if (Platform.OS === 'web') {
      memoryStore.delete(key);
      return;
    }
    await SecureStore.deleteItemAsync(key);
  },
};
