import { Pressable, Text, View } from 'react-native';
import { cn } from '@/lib/cn';

export type TabsProps = {
  options: string[];
  value: string;
  onChange: (next: string) => void;
  fill?: boolean;
};

/** Underlined tabs — .tabs in the kit, 2px active border. */
export function Tabs({ options, value, onChange, fill = false }: TabsProps) {
  return (
    <View className="w-full flex-row gap-6 border-b border-line">
      {options.map((opt) => {
        const active = opt === value;
        return (
          <Pressable
            key={opt}
            onPress={() => onChange(opt)}
            className={cn('border-b-2 py-2.5', fill && 'flex-1 items-center', active ? 'border-primary' : 'border-transparent')}
          >
            <Text className={cn('text-sm', active ? 'font-semibold text-primary' : 'font-medium text-muted')}>{opt}</Text>
          </Pressable>
        );
      })}
    </View>
  );
}
