import { Text, View } from 'react-native';
import Svg, { Circle } from 'react-native-svg';

export type ProgressRingProps = {
  /** 0–100 */
  value: number;
  size?: 64 | 96 | number;
  strokeWidth?: number;
  color?: string;
  label?: string;
};

/** Donut progress indicator — .ring / .ring.lg in the kit (44px viewBox scaled up). */
export function ProgressRing({ value, size = 64, strokeWidth = 5, color = '#b1111b', label }: ProgressRingProps) {
  const r = 18;
  const circumference = 2 * Math.PI * r;
  const clamped = Math.max(0, Math.min(100, value));
  const dash = (clamped / 100) * circumference;

  return (
    <View style={{ width: size, height: size }} className="items-center justify-center">
      <Svg width={size} height={size} viewBox="0 0 44 44" style={{ transform: [{ rotate: '-90deg' }] }}>
        <Circle cx={22} cy={22} r={r} fill="none" stroke="#efefef" strokeWidth={strokeWidth} />
        <Circle
          cx={22}
          cy={22}
          r={r}
          fill="none"
          stroke={color}
          strokeWidth={strokeWidth}
          strokeLinecap="round"
          strokeDasharray={`${dash} ${circumference}`}
        />
      </Svg>
      <Text
        style={{ position: 'absolute', fontFamily: 'Inter_600SemiBold', fontSize: size >= 96 ? 20 : 14 }}
        className="text-text"
      >
        {label ?? `${Math.round(clamped)}%`}
      </Text>
    </View>
  );
}
