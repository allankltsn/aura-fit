import { useColorScheme } from 'nativewind';
import { theme } from './tokens';

/** Resolves the active NativeWind color scheme to this project's token set. */
export function useAppColorScheme() {
  const { colorScheme } = useColorScheme();
  const scheme = colorScheme ?? 'light';
  return { scheme, tokens: theme[scheme] };
}
