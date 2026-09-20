/**
 * aura-fit design tokens.
 * Mirrors tailwind.config.js — use these only where NativeWind className
 * strings can't reach (dynamic shadow objects, SVG fills, chart math).
 */

export const color = {
  primary: {
    DEFAULT: '#b1111b',
    hover: '#960f17',
    press: '#7b0c13',
    soft: '#fbe8e9',
    softDark: 'rgba(177,17,27,0.26)',
    line: '#ecb4b8',
    lineDark: '#7a1a21',
    textDark: '#ff6f78',
  },
  redScale: [
    '#fdeced',
    '#fad3d5',
    '#f2a3a8',
    '#e6656d',
    '#d13a44',
    '#b1111b',
    '#960f17',
    '#7b0c13',
    '#5e090f',
    '#43060a',
  ],
  grayScale: [
    '#f5f5f5',
    '#ececec',
    '#e3e3e3',
    '#cfcfcf',
    '#b0b0b0',
    '#8d8d8d',
    '#666666',
    '#444444',
    '#2b2b2b',
    '#1f1f1f',
  ],
  gray: '#b0b0b0',
  dark: '#1f1f1f',
  light: '#f5f5f5',
  success: { DEFAULT: '#22a45d', bg: '#e3f5ea', text: '#137a3d', dark: '#52d88a', bgDark: 'rgba(34,164,93,0.16)' },
  warning: { DEFAULT: '#e2a400', bg: '#fdf0cc', text: '#855800', dark: '#f1b93a', bgDark: 'rgba(226,164,0,0.16)' },
  danger: { DEFAULT: '#b1111b', bg: '#fbe8e9', text: '#b1111b' },
  neutral: { DEFAULT: '#8d8d8d', bg: '#efefef', text: '#666666' },
} as const;

export const theme = {
  light: {
    bg: '#f5f5f5',
    surface: '#ffffff',
    surface2: '#efefef',
    line: '#e3e3e3',
    lineStrong: '#cfcfcf',
    text: '#1f1f1f',
    muted: '#666666',
    faint: '#8d8d8d',
    accentText: '#b1111b',
  },
  dark: {
    bg: '#141414',
    surface: '#1f1f1f',
    surface2: '#2a2a2a',
    line: '#333333',
    lineStrong: '#4a4a4a',
    text: '#f5f5f5',
    muted: '#b0b0b0',
    faint: '#858585',
    accentText: '#ff6f78',
  },
} as const;

export const space = { 0.5: 2, 1: 4, 2: 8, 3: 12, 4: 16, 6: 24, 8: 32, 12: 48, 16: 64 } as const;

export const radius = { xs: 4, sm: 8, md: 10, lg: 12, xl: 16, full: 999 } as const;

export const font = {
  h1: { fontSize: 32, lineHeight: 32, letterSpacing: -0.64, fontFamily: 'Inter_600SemiBold' },
  h2: { fontSize: 24, lineHeight: 24, letterSpacing: -0.36, fontFamily: 'Inter_600SemiBold' },
  h3: { fontSize: 20, lineHeight: 20, letterSpacing: -0.2, fontFamily: 'Inter_600SemiBold' },
  h4: { fontSize: 16, lineHeight: 16, fontFamily: 'Inter_600SemiBold' },
  body: { fontSize: 14, lineHeight: 20, fontFamily: 'Inter_400Regular' },
  small: { fontSize: 12, lineHeight: 16, fontFamily: 'Inter_400Regular' },
} as const;

/** Elevation ported from the web kit's --shadow-1/2/3, split for iOS (shadow*) and Android (elevation). */
export const shadow = {
  0: {},
  1: {
    shadowColor: '#1f1f1f',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.06,
    shadowRadius: 2,
    elevation: 1,
  },
  2: {
    shadowColor: '#1f1f1f',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.09,
    shadowRadius: 14,
    elevation: 4,
  },
  3: {
    shadowColor: '#1f1f1f',
    shadowOffset: { width: 0, height: 18 },
    shadowOpacity: 0.18,
    shadowRadius: 44,
    elevation: 12,
  },
} as const;

/** Four avatar background/foreground pairs, cycled by index — matches .av / .a2 / .a3 / .a4 in the kit. */
export const avatarTones = [
  { bg: '#1f1f1f', fg: '#ffffff' },
  { bg: '#b0b0b0', fg: '#1f1f1f' },
  { bg: '#fbe8e9', fg: '#b1111b' },
  { bg: '#b1111b', fg: '#ffffff' },
] as const;
