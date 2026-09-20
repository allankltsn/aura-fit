import { Pressable, Text, View } from 'react-native';
import { cn } from '@/lib/cn';

export type SegmentedProps = {
  options: string[];
  value: string;
  onChange: (next: string) => void;
  size?: 'md' | 'sm';
  full?: boolean;
};

/** Segmented control — .seg in the kit, pill track with a raised active pill. */
export function Segmented({ options, value, onChange, size = 'md', full = false }: SegmentedProps) {
  return (
    <View className={cn('flex-row gap-0.5 rounded-md bg-surface-2 p-[3px]', full && 'w-full')}>
      {options.map((opt) => {
        const active = opt === value;
        return (
          <Pressable
            key={opt}
            onPress={() => onChange(opt)}
            className={cn(
              'items-center justify-center rounded-sm px-4',
              size === 'sm' ? 'h-[26px]' : 'h-8',
              full && 'flex-1',
              active && 'bg-surface shadow-sm'
            )}
          >
            <Text className={cn('font-medium', size === 'sm' ? 'text-xs' : 'text-[13px]', active ? 'text-primary font-semibold' : 'text-muted')}>
              {opt}
            </Text>
          </Pressable>
        );
      })}
    </View>
  );
}
