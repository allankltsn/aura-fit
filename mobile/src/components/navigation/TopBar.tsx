import { Pressable, TextInput, View } from 'react-native';
import { Avatar, type AvatarProps } from '@/components/ui/Avatar';
import { Icon } from '@/components/icons';

export type TopBarProps = {
  searchPlaceholder?: string;
  onSearchChange?: (text: string) => void;
  onNotificationsPress?: () => void;
  onSettingsPress?: () => void;
  hasUnreadNotifications?: boolean;
  avatar: Pick<AvatarProps, 'initials' | 'photoUrl' | 'tone'>;
};

/** Dashboard top bar — .topbar in the kit: search, notifications, settings, avatar. Web/tablet shell. */
export function TopBar({
  searchPlaceholder = 'Buscar alunos, treinos...',
  onSearchChange,
  onNotificationsPress,
  onSettingsPress,
  hasUnreadNotifications,
  avatar,
}: TopBarProps) {
  return (
    <View className="w-full flex-row items-center gap-3 rounded-lg border border-line bg-surface p-3">
      <View className="h-8 max-w-[420px] flex-1 flex-row items-center gap-2 rounded-sm border border-line-strong px-2.5">
        <Icon name="search" size={16} color="#8d8d8d" />
        <TextInput
          placeholder={searchPlaceholder}
          placeholderTextColor="#8d8d8d"
          onChangeText={onSearchChange}
          className="flex-1 text-[13px] text-text"
          style={{ fontFamily: 'Inter_400Regular' }}
        />
      </View>
      <View className="flex-1" />
      <Pressable
        accessibilityLabel="Notificações"
        onPress={onNotificationsPress}
        className="h-9 w-9 items-center justify-center rounded-sm active:bg-surface-2"
      >
        <View>
          <Icon name="bell" size={20} color="#666666" />
          {hasUnreadNotifications && (
            <View className="absolute -right-0.5 -top-0.5 h-2 w-2 rounded-full border-2 border-surface bg-primary" />
          )}
        </View>
      </Pressable>
      <Pressable
        accessibilityLabel="Configurações"
        onPress={onSettingsPress}
        className="h-9 w-9 items-center justify-center rounded-sm active:bg-surface-2"
      >
        <Icon name="settings" size={20} color="#666666" />
      </Pressable>
      <Avatar {...avatar} size={32} />
    </View>
  );
}
