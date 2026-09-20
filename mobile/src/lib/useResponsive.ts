import { useWindowDimensions } from 'react-native';

/** Breakpoint the dashboard shell switches from a drawer to a fixed sidebar at. */
export const WIDE_BREAKPOINT = 880;

export function useResponsive() {
  const { width } = useWindowDimensions();
  return { width, isWide: width >= WIDE_BREAKPOINT };
}
