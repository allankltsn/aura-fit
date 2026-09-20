import { Pressable, Text } from 'react-native';
import { Icon } from '@/components/icons';
import { cn } from '@/lib/cn';

export type ChipProps = {
  label: string;
  selected?: boolean;
  onPress?: () => void;
  /** "solid" fills red when selected (filter chips); "soft" uses the tinted red (kit's .chip.soft). */
  tone?: 'solid' | 'soft';
  size?: 'md' | 'lg';
  onRemove?: () => void;
};

/** Filter/selection pill — .chip in the kit, 28px tall (34px lg). */
export function Chip({ label, selected = false, onPress, tone = 'solid', size = 'md', onRemove }: ChipProps) {
  return (
    <Pressable
      accessibilityRole="button"
      accessibilityState={{ selected }}
      onPress={onPress}
      className={cn(
        'flex-row items-center gap-1.5 rounded-full border',
        size === 'lg' ? 'h-[34px] px-4' : 'h-7 px-3',
        selected
          ? tone === 'solid'
            ? 'border-primary bg-primary'
            : 'border-primary-line bg-primary-soft'
          : 'border-line-strong bg-transparent'
      )}
    >
      <Text
        className={cn(
          'font-medium text-xs',
          selected ? (tone === 'solid' ? 'text-white' : 'text-primary') : 'text-muted'
        )}
      >
        {label}
      </Text>
      {onRemove && (
        <Pressable onPress={onRemove} hitSlop={6}>
          <Icon name="x" size={14} color={selected && tone === 'solid' ? '#ffffff' : '#666666'} />
        </Pressable>
      )}
    </Pressable>
  );
}
