import { Pressable, Text, View } from 'react-native';
import { Icon } from '@/components/icons';

export type ExerciseLibraryCardProps = {
  name: string;
  muscle: string;
  level: string;
  onPress?: () => void;
};

/** Grid tile for the exercise library — media placeholder + name/muscle/level. */
export function ExerciseLibraryCard({ name, muscle, level, onPress }: ExerciseLibraryCardProps) {
  return (
    <Pressable
      onPress={onPress}
      className="w-[150px] gap-2 rounded-lg border border-line bg-surface p-2 active:border-line-strong"
    >
      <View className="aspect-square items-center justify-center rounded-md bg-dark">
        <Icon name="dumbbell" size={28} color="#4a4a4a" />
      </View>
      <View className="gap-0.5 px-1 pb-1">
        <Text numberOfLines={1} className="font-semibold text-[13px] text-text">
          {name}
        </Text>
        <Text className="text-[11px] text-muted">
          {muscle} • {level}
        </Text>
      </View>
    </Pressable>
  );
}
