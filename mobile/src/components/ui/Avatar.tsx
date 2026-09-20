import { Image, Text, View } from 'react-native';
import { avatarTones } from '@/theme/tokens';
import { cn } from '@/lib/cn';

export type AvatarProps = {
  /** Two-letter initials, used when no photo is provided. */
  initials: string;
  photoUrl?: string;
  size?: number;
  /** Cycles through the kit's 4 tones (dark / gray / soft-red / red) — pass a stable index per person. */
  tone?: 0 | 1 | 2 | 3;
  presence?: 'online' | 'offline';
};

/** Student/trainer avatar — photo when available, initials in one of 4 palette tones otherwise. */
export function Avatar({ initials, photoUrl, size = 40, tone = 0, presence }: AvatarProps) {
  const { bg, fg } = avatarTones[tone];

  return (
    <View style={{ width: size, height: size }}>
      {photoUrl ? (
        <Image source={{ uri: photoUrl }} style={{ width: size, height: size, borderRadius: size / 2 }} />
      ) : (
        <View
          style={{ width: size, height: size, borderRadius: size / 2, backgroundColor: bg }}
          className="items-center justify-center"
        >
          <Text style={{ fontSize: size * 0.36, fontFamily: 'Inter_600SemiBold', color: fg, letterSpacing: 0.2 }}>
            {initials}
          </Text>
        </View>
      )}
      {presence && (
        <View
          style={{
            position: 'absolute',
            right: 0,
            bottom: 0,
            width: Math.max(8, size * 0.26),
            height: Math.max(8, size * 0.26),
            borderRadius: 999,
            borderWidth: 2,
            borderColor: '#ffffff',
          }}
          className={presence === 'online' ? 'bg-success' : 'bg-gray'}
        />
      )}
    </View>
  );
}

export type AvatarGroupProps = { avatars: Pick<AvatarProps, 'initials' | 'photoUrl' | 'tone'>[]; size?: number; max?: number };

/** Overlapping avatar stack — .avs in the kit, -10px overlap, "+N" overflow chip. */
export function AvatarGroup({ avatars, size = 32, max = 4 }: AvatarGroupProps) {
  const shown = avatars.slice(0, max);
  const overflow = avatars.length - shown.length;

  return (
    <View className="flex-row">
      {shown.map((a, i) => (
        <View key={i} style={{ marginLeft: i === 0 ? 0 : -10 }} className="rounded-full border-2 border-surface">
          <Avatar {...a} size={size} />
        </View>
      ))}
      {overflow > 0 && (
        <View
          style={{ width: size, height: size, marginLeft: -10, borderRadius: size / 2 }}
          className={cn('items-center justify-center border-2 border-surface bg-surface-2')}
        >
          <Text style={{ fontSize: size * 0.32, fontFamily: 'Inter_600SemiBold' }} className="text-muted">
            +{overflow}
          </Text>
        </View>
      )}
    </View>
  );
}
