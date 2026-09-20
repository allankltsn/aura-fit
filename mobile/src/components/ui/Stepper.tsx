import { Pressable, Text, View } from 'react-native';
import { Icon } from '@/components/icons';

export type StepperProps = {
  label: string;
  value: number;
  step?: number;
  min?: number;
  onChange: (next: number) => void;
};

/** Increment/decrement control used for load (kg) and reps — .step in the kit. */
export function Stepper({ label, value, step = 1, min = 0, onChange }: StepperProps) {
  return (
    <View className="h-[44px] flex-1 flex-row items-center overflow-hidden rounded-md border border-line-strong bg-surface">
      <Pressable
        accessibilityLabel="Diminuir"
        onPress={() => onChange(Math.max(min, value - step))}
        className="h-11 w-11 items-center justify-center active:bg-primary-soft"
      >
        <Icon name="minus" size={16} color="#b1111b" />
      </Pressable>
      <View className="flex-1 items-center">
        <Text className="text-[10px] font-medium uppercase tracking-wide text-muted">{label}</Text>
        <Text style={{ fontFamily: 'Inter_600SemiBold' }} className="text-lg text-text">
          {value}
        </Text>
      </View>
      <Pressable
        accessibilityLabel="Aumentar"
        onPress={() => onChange(value + step)}
        className="h-11 w-11 items-center justify-center active:bg-primary-soft"
      >
        <Icon name="plus" size={16} color="#b1111b" />
      </Pressable>
    </View>
  );
}
