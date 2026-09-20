import Svg, { Circle, Path, Rect } from 'react-native-svg';
import { iconPaths, iconShapes, type IconName } from './paths';

export type { IconName };

const SIZES = { 16: 16, 20: 20, 24: 24, 32: 32, 48: 48 } as const;

export type IconSize = keyof typeof SIZES | number;

export type IconProps = {
  name: IconName;
  size?: IconSize;
  color?: string;
  strokeWidth?: number;
  /** Fills the shape solid instead of stroking it (matches the kit's .i.fill, used for play/star). */
  filled?: boolean;
};

/**
 * Stroke icon matching the aura-fit kit spec: 1.75px stroke, round caps/joins,
 * 24px grid. react-native-svg doesn't resolve CSS `currentColor` on native, so
 * unlike the web kit's ".i { color: inherit }" trick, callers must pass an
 * explicit color (default: light-theme ink text) — pull it from theme.text/muted/etc.
 */
export function Icon({ name, size = 24, color = '#1f1f1f', strokeWidth = 1.75, filled = false }: IconProps) {
  const px = SIZES[size as keyof typeof SIZES] ?? (size as number);
  const paths = iconPaths[name];
  const shapes = iconShapes[name];

  return (
    <Svg width={px} height={px} viewBox="0 0 24 24" fill="none">
      {shapes?.map((shape, i) =>
        shape.type === 'circle' ? (
          <Circle
            key={i}
            cx={shape.cx}
            cy={shape.cy}
            r={shape.r}
            stroke={filled ? undefined : color}
            fill={filled ? color : 'none'}
            strokeWidth={strokeWidth}
          />
        ) : (
          <Rect
            key={i}
            x={shape.x}
            y={shape.y}
            width={shape.width}
            height={shape.height}
            rx={shape.rx}
            stroke={filled ? undefined : color}
            fill={filled ? color : 'none'}
            strokeWidth={strokeWidth}
          />
        )
      )}
      {paths.map((d, i) => (
        <Path
          key={i}
          d={d}
          stroke={filled ? undefined : color}
          fill={filled ? color : 'none'}
          strokeWidth={strokeWidth}
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      ))}
    </Svg>
  );
}
