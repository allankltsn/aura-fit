import { Pressable, View, type ViewProps } from 'react-native';
import { cn } from '@/lib/cn';

export type CardProps = ViewProps & {
  /** "flat" drops the border for a subtle surface-2 fill (kit's .card.flat). */
  variant?: 'default' | 'flat';
  onPress?: () => void;
};

/** Base surface — 12px radius, 1px border, 16px padding. Shadow only appears on hover/press for interactive cards. */
export function Card({ variant = 'default', onPress, className, children, ...rest }: CardProps) {
  const base = cn(
    'rounded-lg p-4',
    variant === 'default' ? 'border border-line bg-surface' : 'border-0 bg-surface-2',
    className
  );

  if (onPress) {
    return (
      <Pressable onPress={onPress} className={cn(base, 'active:border-line-strong')} {...(rest as any)}>
        {children}
      </Pressable>
    );
  }

  return (
    <View className={base} {...rest}>
      {children}
    </View>
  );
}
