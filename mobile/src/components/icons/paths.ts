/**
 * Path data ported 1:1 from the aura-fit UI kit artifact's <symbol> defs.
 * 24x24 viewBox, meant to be stroked at 1.75 (see Icon.tsx defaults).
 */
export const iconPaths = {
  home: ['M3 10.5 12 3l9 7.5V20a1 1 0 0 1-1 1h-5v-6H9v6H4a1 1 0 0 1-1-1z'],
  users: ['M2.5 20c0-3.6 2.9-6 6.5-6s6.5 2.4 6.5 6', 'M17 14.2c2.6.2 4.5 2 4.5 5.3'],
  dumbbell: ['M6.5 6.5v11M17.5 6.5v11M3.5 9v6M20.5 9v6M6.5 12h11'],
  chart: ['M4 4v16h16M8 16v-4M12 16V8M16 16v-6'],
  settings: [
    'M12.22 2h-.44a2 2 0 0 0-2 2v.18a2 2 0 0 1-1 1.73l-.43.25a2 2 0 0 1-2 0l-.15-.08a2 2 0 0 0-2.73.73l-.22.38a2 2 0 0 0 .73 2.73l.15.1a2 2 0 0 1 1 1.72v.51a2 2 0 0 1-1 1.74l-.15.09a2 2 0 0 0-.73 2.73l.22.38a2 2 0 0 0 2.73.73l.15-.08a2 2 0 0 1 2 0l.43.25a2 2 0 0 1 1 1.73V20a2 2 0 0 0 2 2h.44a2 2 0 0 0 2-2v-.18a2 2 0 0 1 1-1.73l.43-.25a2 2 0 0 1 2 0l.15.08a2 2 0 0 0 2.73-.73l.22-.39a2 2 0 0 0-.73-2.73l-.15-.08a2 2 0 0 1-1-1.74v-.5a2 2 0 0 1 1-1.74l.15-.09a2 2 0 0 0 .73-2.73l-.22-.38a2 2 0 0 0-2.73-.73l-.15.08a2 2 0 0 1-2 0l-.43-.25a2 2 0 0 1-1-1.73V4a2 2 0 0 0-2-2z',
  ],
  cart: ['M2 3h3l2.7 12.4a1 1 0 0 0 1 .8h9a1 1 0 0 0 1-.8L21 7H6'],
  box: [] as string[],
  search: ['m20 20-4.2-4.2'],
  bell: ['M6 16v-5a6 6 0 1 1 12 0v5l1.5 2h-15z', 'M10 21h4'],
  plus: ['M12 5v14M5 12h14'],
  minus: ['M5 12h14'],
  chevronRight: ['m9 6 6 6-6 6'],
  chevronDown: ['m6 9 6 6 6-6'],
  back: ['m15 6-6 6 6 6'],
  check: ['m5 12.5 4.5 4.5L19 7.5'],
  x: ['M6 6l12 12M18 6 6 18'],
  chat: ['M4 5h16v11H9l-5 4z'],
  spark: ['M11 3l1.9 5.1L18 10l-5.1 1.9L11 17l-1.9-5.1L4 10l5.1-1.9z', 'M19 15v5M16.5 17.5h5'],
  card: ['M3 10h18M7 15h3'],
  file: ['M6 3h8l4 4v14H6z', 'M14 3v4h4M9 13h6M9 17h6'],
  play: ['M8 5v14l11-7z'],
  pause: ['M8 5v14M16 5v14'],
  send: ['M4 12 20 4l-4 16-4-6z'],
  more: [] as string[],
  timer: ['M12 9v4l2.5 2M9.5 2.5h5'],
  trend: ['m3 17 6-6 4 4 8-8M15 7h6v6'],
  star: ['m12 3.5 2.6 5.3 5.9.9-4.3 4.1 1 5.8L12 16.9 6.8 19.6l1-5.8L3.5 9.7l5.9-.9z'],
  alert: ['M12 4 2.8 19.5h18.4z', 'M12 10v4.5M12 17.2v.1'],
  info: ['M12 11v5M12 7.8v.1'],
  sort: ['m8 10 4-4 4 4M8 14l4 4 4-4'],
  trash: ['M4 7h16M9 7V4h6v3M6 7l1 13h10l1-13'],
  cal: ['M3.5 10h17M8 3v4M16 3v4'],
  lock: ['M8 10.5V8a4 4 0 0 1 8 0v2.5'],
  mail: ['m4 8 8 5.5L20 8'],
} satisfies Record<string, string[]>;

type Circle = { type: 'circle'; cx: number; cy: number; r: number };
type Rect = { type: 'rect'; x: number; y: number; width: number; height: number; rx: number };

/** Circle/rect primitives layered under an icon's stroked paths. */
export const iconShapes: Partial<Record<keyof typeof iconPaths, (Circle | Rect)[]>> = {
  users: [
    { type: 'circle', cx: 9, cy: 8, r: 3.5 },
    { type: 'circle', cx: 17.5, cy: 9, r: 2.5 },
  ],
  cart: [
    { type: 'circle', cx: 9, cy: 20, r: 1.5 },
    { type: 'circle', cx: 18, cy: 20, r: 1.5 },
  ],
  box: [{ type: 'rect', x: 4, y: 4, width: 16, height: 16, rx: 3 }],
  search: [{ type: 'circle', cx: 11, cy: 11, r: 6.5 }],
  settings: [{ type: 'circle', cx: 12, cy: 12, r: 3 }],
  card: [{ type: 'rect', x: 3, y: 5, width: 18, height: 14, rx: 2.5 }],
  more: [
    { type: 'circle', cx: 5, cy: 12, r: 1.2 },
    { type: 'circle', cx: 12, cy: 12, r: 1.2 },
    { type: 'circle', cx: 19, cy: 12, r: 1.2 },
  ],
  timer: [{ type: 'circle', cx: 12, cy: 13, r: 7.5 }],
  info: [{ type: 'circle', cx: 12, cy: 12, r: 9 }],
  cal: [{ type: 'rect', x: 3.5, y: 5, width: 17, height: 15.5, rx: 2.5 }],
  lock: [{ type: 'rect', x: 5, y: 10.5, width: 14, height: 10, rx: 2.5 }],
  mail: [{ type: 'rect', x: 3, y: 5.5, width: 18, height: 13, rx: 2.5 }],
};

export type IconName = keyof typeof iconPaths;
