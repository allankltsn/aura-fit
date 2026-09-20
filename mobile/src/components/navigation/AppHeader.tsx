import { router } from 'expo-router';
import { Pressable, Text, View } from 'react-native';
import { Icon } from '@/components/icons';

export type AppHeaderProps = {
  title: string;
  subtitle?: string;
  onBack?: () => void;
  onMore?: () => void;
  showBack?: boolean;
};

/** Screen header with back/title/more — .ah in the kit, ~48px tall. */
export function AppHeader({ title, subtitle, onBack, onMore, showBack = true }: AppHeaderProps) {
  return (
    <View className="min-h-[48px] flex-row items-center gap-2 px-3 py-2">
      {showBack ? (
        <Pressable
          accessibilityLabel="Voltar"
          onPress={onBack ?? (() => router.back())}
          className="h-9 w-9 items-center justify-center rounded-sm active:bg-surface-2"
        >
          <Icon name="back" size={20} color="#1f1f1f" />
        </Pressable>
      ) : (
        <View className="w-9" />
      )}
      <View className="flex-1">
        <Text style={{ fontFamily: 'Inter_600SemiBold' }} className="text-[15px] text-text">
          {title}
        </Text>
        {subtitle ? <Text className="mt-px text-[11px] text-muted">{subtitle}</Text> : null}
      </View>
      {onMore ? (
        <Pressable
          accessibilityLabel="Mais"
          onPress={onMore}
          className="h-9 w-9 items-center justify-center rounded-sm active:bg-surface-2"
        >
          <Icon name="more" size={20} color="#1f1f1f" />
        </Pressable>
      ) : (
        <View className="w-9" />
      )}
    </View>
  );
}
