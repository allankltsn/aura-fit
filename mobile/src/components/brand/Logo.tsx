import { Text, View } from 'react-native';

export type LogoVariant = 'on-dark' | 'on-red' | 'on-light';

export type LogoProps = {
  /** Font size in px — the kit's logo scale is 64 / 40 / 28 / 20, with 20px as the minimum readable size. */
  size?: 64 | 40 | 28 | 20 | number;
  variant?: LogoVariant;
};

const wordmarkColor: Record<LogoVariant, string> = {
  'on-dark': '#ffffff',
  'on-red': '#ffffff',
  'on-light': '#1f1f1f',
};

const hyphenColor: Record<LogoVariant, string> = {
  'on-dark': '#b1111b',
  'on-red': '#ffffff',
  'on-light': '#b1111b',
};

/**
 * The aura-fit wordmark: lowercase, weight 700, tight tracking. The hyphen is
 * the only red element, except on a red background where the whole mark goes
 * white (kit rule: "o hífen é o único elemento vermelho quando o fundo permite").
 */
export function Logo({ size = 28, variant = 'on-light' }: LogoProps) {
  return (
    <View className="flex-row items-baseline">
      <Text
        style={{
          fontFamily: 'Inter_700Bold',
          fontSize: size,
          lineHeight: size * 1.05,
          letterSpacing: -size * 0.045,
          color: wordmarkColor[variant],
        }}
      >
        aura
      </Text>
      <Text
        style={{
          fontFamily: 'Inter_700Bold',
          fontSize: size,
          lineHeight: size * 1.05,
          color: hyphenColor[variant],
        }}
      >
        -
      </Text>
      <Text
        style={{
          fontFamily: 'Inter_700Bold',
          fontSize: size,
          lineHeight: size * 1.05,
          letterSpacing: -size * 0.045,
          color: wordmarkColor[variant],
        }}
      >
        fit
      </Text>
    </View>
  );
}
