import { Pressable, Text, View } from 'react-native';
import { Icon, type IconName } from '@/components/icons';
import { cn } from '@/lib/cn';

export type ExerciseRowStatus = 'default' | 'active' | 'done';

export type ExerciseRowProps = {
  name: string;
  meta: string;
  status?: ExerciseRowStatus;
  endIcon?: IconName;
  onPress?: () => void;
};

/** Exercise list item with default/active/done states — .ex in the kit. */
export function ExerciseRow({ name, meta, status = 'default', endIcon, onPress }: ExerciseRowProps) {
  const thumbIcon: IconName = status === 'done' ? 'check' : 'dumbbell';
  const resolvedEndIcon: IconName = endIcon ?? (status === 'active' ? 'play' : status === 'done' ? 'check' : 'timer');

  return (
    <Pressable
      onPress={onPress}
      className={cn(
        'flex-row items-center gap-3 rounded-lg border p-2.5',
        status === 'active' ? 'border-primary bg-primary-soft' : 'border-line bg-surface'
      )}
    >
      <View
        className={cn(
          'h-12 w-12 items-center justify-center rounded-md',
          status === 'done' ? 'bg-success-bg' : 'bg-dark'
        )}
      >
        <Icon name={thumbIcon} size={24} color={status === 'done' ? '#137a3d' : '#d6d6d6'} />
      </View>
      <View className="flex-1 gap-0.5">
        <Text className="text-[13px] font-semibold text-text">{name}</Text>
        <Text className="text-xs text-muted">{meta}</Text>
      </View>
      <Icon
        name={resolvedEndIcon}
        size={20}
        color={status === 'active' ? '#b1111b' : status === 'done' ? '#137a3d' : '#8d8d8d'}
      />
    </Pressable>
  );
}
