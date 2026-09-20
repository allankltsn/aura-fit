import { Text, View } from 'react-native';
import { cn } from '@/lib/cn';

export type StatusTone = 'ok' | 'warn' | 'err' | 'neutral' | 'solid';

export type StatusBadgeProps = {
  label: string;
  tone?: StatusTone;
  size?: 'md' | 'sm';
  dot?: boolean;
};

const toneClass: Record<StatusTone, { bg: string; text: string; dot: string }> = {
  ok: { bg: 'bg-success-bg', text: 'text-success-text', dot: 'bg-success' },
  warn: { bg: 'bg-warning-bg', text: 'text-warning-text', dot: 'bg-warning' },
  err: { bg: 'bg-primary-soft', text: 'text-primary', dot: 'bg-primary' },
  neutral: { bg: 'bg-surface-2', text: 'text-muted', dot: 'bg-faint' },
  solid: { bg: 'bg-dark', text: 'text-white', dot: 'bg-white' },
};

/** Status pill — .st in the kit: dot + label, 24px (20px sm). */
export function StatusBadge({ label, tone = 'neutral', size = 'md', dot = true }: StatusBadgeProps) {
  const t = toneClass[tone];

  return (
    <View
      className={cn(
        'flex-row items-center gap-1.5 self-start rounded-full',
        size === 'sm' ? 'h-5 px-2' : 'h-6 px-2.5',
        t.bg
      )}
    >
      {dot && <View className={cn('h-1.5 w-1.5 rounded-full', t.dot)} />}
      <Text className={cn('font-medium text-[11px]', size === 'md' && 'text-xs', t.text)}>{label}</Text>
    </View>
  );
}

/** Small filled tag — .tag / .tag.o / .tag.d in the kit ("Mais popular", "Novo"). */
export function Tag({ label, tone = 'solid' }: { label: string; tone?: 'solid' | 'outline' | 'dark' }) {
  return (
    <View
      className={cn(
        'self-start rounded-md px-2 py-0.5',
        tone === 'solid' && 'bg-primary',
        tone === 'outline' && 'border border-primary-line bg-transparent',
        tone === 'dark' && 'bg-dark'
      )}
    >
      <Text
        className={cn(
          'font-semibold text-[11px]',
          tone === 'solid' && 'text-white',
          tone === 'outline' && 'text-primary',
          tone === 'dark' && 'text-white'
        )}
      >
        {label}
      </Text>
    </View>
  );
}

/** Numeric counter badge — .cnt in the kit (nav item unread counts). */
export function CountBadge({ count }: { count: number }) {
  return (
    <View className="h-[18px] min-w-[18px] items-center justify-center rounded-full bg-primary px-1">
      <Text className="font-semibold text-[11px] text-white">{count}</Text>
    </View>
  );
}
