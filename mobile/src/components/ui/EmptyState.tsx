import { Text, View } from 'react-native';
import { Button } from './Button';
import { Icon, type IconName } from '@/components/icons';

export type EmptyStateProps = {
  icon: IconName;
  title: string;
  description: string;
  actionLabel?: string;
  onAction?: () => void;
};

/** No-results / no-data placeholder — .empty in the kit. */
export function EmptyState({ icon, title, description, actionLabel, onAction }: EmptyStateProps) {
  return (
    <View className="w-full items-center gap-2 px-3 py-6">
      <View className="mb-1 h-14 w-14 items-center justify-center rounded-full bg-surface-2">
        <Icon name={icon} size={24} color="#8d8d8d" />
      </View>
      <Text style={{ fontFamily: 'Inter_600SemiBold' }} className="text-base text-text">
        {title}
      </Text>
      <Text className="max-w-[32ch] text-center text-[13px] text-muted">{description}</Text>
      {actionLabel ? (
        <Button size="sm" onPress={onAction} icon={<Icon name="plus" size={16} color="#ffffff" />} className="mt-2">
          {actionLabel}
        </Button>
      ) : null}
    </View>
  );
}
