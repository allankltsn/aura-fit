import { Linking } from 'react-native';

const ALLOWED_SCHEMES = ['https:', 'mailto:', 'tel:'];

/**
 * Opens a URL after checking its scheme against an allowlist. Use this
 * instead of calling `Linking.openURL` directly for any URL that isn't a
 * string literal you wrote — a `javascript:` or `data:` URL sourced from
 * user input, a chat message, or an API response is a classic web XSS
 * vector, and `Linking.openURL` on web is a thin wrapper around
 * `window.open`, which will happily execute one.
 *
 * Returns whether the URL was opened, so callers can show their own error
 * state instead of an unhandled rejection.
 */
export async function openExternalUrl(url: string): Promise<boolean> {
  let scheme: string;
  try {
    scheme = new URL(url).protocol;
  } catch {
    return false;
  }

  if (!ALLOWED_SCHEMES.includes(scheme)) {
    if (__DEV__) {
      console.warn(`openExternalUrl: blocked disallowed scheme "${scheme}" for "${url}"`);
    }
    return false;
  }

  const canOpen = await Linking.canOpenURL(url);
  if (!canOpen) return false;

  await Linking.openURL(url);
  return true;
}
