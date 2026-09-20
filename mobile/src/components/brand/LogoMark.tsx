import { Text, View } from 'react-native';

export type LogoMarkProps = {
  /** Kit scale: 72 · 56 · 40 · 24 px, radius = 25% of side. */
  size?: 72 | 56 | 40 | 24 | number;
  background?: 'accent' | 'dark';
  /** Larger tiles read as "a-", small ones as just "a" — matches the kit's app-icon figure. */
  glyph?: 'a' | 'a-';
};

/** The compact square app-icon mark — sidebar rail, avatars, app.json icon source. */
export function LogoMark({ size = 40, background = 'accent', glyph = 'a' }: LogoMarkProps) {
  const bg = background === 'accent' ? '#b1111b' : '#1f1f1f';
  const fontSize = size * 0.54;

  return (
    <View
      style={{
        width: size,
        height: size,
        borderRadius: size * 0.25,
        backgroundColor: bg,
        alignItems: 'center',
        justifyContent: 'center',
      }}
    >
      <Text
        style={{
          fontFamily: 'Inter_700Bold',
          fontSize,
          lineHeight: fontSize * 1.05,
          letterSpacing: -fontSize * 0.06,
          color: '#ffffff',
        }}
      >
        {glyph === 'a-' ? (
          <>
            a<Text style={{ color: background === 'dark' ? '#b1111b' : '#ffffff' }}>-</Text>
          </>
        ) : (
          'a'
        )}
      </Text>
    </View>
  );
}
