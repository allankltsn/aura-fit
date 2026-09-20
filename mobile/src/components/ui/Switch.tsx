import { Pressable } from 'react-native';
import Animated, { useAnimatedStyle, withTiming } from 'react-native-reanimated';
import { cn } from '@/lib/cn';

export type SwitchProps = {
  value: boolean;
  onChange?: (next: boolean) => void;
  disabled?: boolean;
  size?: 'md' | 'sm';
};

const dims = {
  md: { w: 40, h: 22, knob: 18 },
  sm: { w: 32, h: 18, knob: 14 },
};

/** On/off toggle — matches the kit's .sw (40x22, 32x18 small), 150ms slide. */
export function Switch({ value, onChange, disabled = false, size = 'md' }: SwitchProps) {
  const { w, h, knob } = dims[size];
  const pad = (h - knob) / 2;

  const knobStyle = useAnimatedStyle(() => ({
    transform: [{ translateX: withTiming(value ? w - knob - pad : pad, { duration: 150 }) }],
  }));

  return (
    <Pressable
      accessibilityRole="switch"
      accessibilityState={{ checked: value, disabled }}
      disabled={disabled}
      onPress={() => onChange?.(!value)}
      hitSlop={8}
      style={{ width: w, height: h }}
      className={cn('justify-center rounded-full', value ? 'bg-primary' : 'bg-line-strong', disabled && 'opacity-45')}
    >
      <Animated.View
        style={[{ width: knob, height: knob, borderRadius: knob / 2, backgroundColor: '#fff' }, knobStyle]}
        className="shadow-sm"
      />
    </Pressable>
  );
}
