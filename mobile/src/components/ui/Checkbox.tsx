import { Pressable, View } from 'react-native';
import { Icon } from '@/components/icons';
import { cn } from '@/lib/cn';

export type CheckboxProps = {
  checked: boolean;
  onChange?: (next: boolean) => void;
  disabled?: boolean;
  size?: 'md' | 'lg';
};

const sizePx = { md: 18, lg: 22 };

export function Checkbox({ checked, onChange, disabled = false, size = 'md' }: CheckboxProps) {
  const px = sizePx[size];

  return (
    <Pressable
      accessibilityRole="checkbox"
      accessibilityState={{ checked, disabled }}
      disabled={disabled}
      onPress={() => onChange?.(!checked)}
      hitSlop={8}
      style={{ width: px, height: px }}
      className={cn(
        'items-center justify-center rounded-[5px] border-[1.5px]',
        checked ? 'border-primary bg-primary' : 'border-gray bg-surface',
        disabled && 'opacity-45'
      )}
    >
      {checked && <Icon name="check" size={Math.round(px * 0.7)} color="#ffffff" strokeWidth={3} />}
    </Pressable>
  );
}

export type RadioProps = {
  selected: boolean;
  onPress?: () => void;
  disabled?: boolean;
  size?: 'md' | 'lg';
};

export function Radio({ selected, onPress, disabled = false, size = 'md' }: RadioProps) {
  const px = sizePx[size];

  return (
    <Pressable
      accessibilityRole="radio"
      accessibilityState={{ checked: selected, disabled }}
      disabled={disabled}
      onPress={onPress}
      hitSlop={8}
      style={{ width: px, height: px }}
      className={cn(
        'items-center justify-center rounded-full border-[1.5px]',
        selected ? 'border-primary bg-primary' : 'border-gray bg-surface',
        disabled && 'opacity-45'
      )}
    >
      {selected && <View style={{ width: px * 0.32, height: px * 0.32 }} className="rounded-full bg-white" />}
    </Pressable>
  );
}
