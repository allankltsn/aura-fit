import { Pressable, Text, View } from 'react-native';
import { Avatar, type AvatarProps } from '@/components/ui/Avatar';
import { CountBadge } from '@/components/ui/StatusBadge';
import { Icon, type IconName } from '@/components/icons';
import { Logo, LogoMark } from '@/components/brand';
import { cn } from '@/lib/cn';

export type SidebarItem = { key: string; label: string; icon: IconName; count?: number };

export type SidebarProps = {
  items: SidebarItem[];
  activeKey: string;
  onSelect: (key: string) => void;
  user: { name: string; role: string; avatar: Pick<AvatarProps, 'initials' | 'photoUrl' | 'tone'> };
  /** Collapsed to a 64px icon rail — kit's second sidebar example. */
  rail?: boolean;
};

/** Dark dashboard sidebar — .sb / .sb.rail in the kit. Web/tablet shell for the trainer dashboard. */
export function Sidebar({ items, activeKey, onSelect, user, rail = false }: SidebarProps) {
  return (
    <View
      style={{ width: rail ? 64 : 232 }}
      className={cn('gap-5 rounded-xl bg-dark py-4', rail ? 'items-center px-2' : 'px-3')}
    >
      {rail ? <LogoMark size={24} background="accent" /> : <Logo size={22} variant="on-dark" />}

      <View className="w-full flex-1 gap-0.5">
        {items.map((item) => {
          const active = item.key === activeKey;
          return (
            <Pressable
              key={item.key}
              onPress={() => onSelect(item.key)}
              accessibilityLabel={rail ? item.label : undefined}
              className={cn(
                'h-10 flex-row items-center gap-3 rounded-sm px-3',
                rail && 'w-11 justify-center px-0',
                active ? 'bg-primary' : 'active:bg-white/10'
              )}
            >
              <Icon name={item.icon} size={20} color={active ? '#ffffff' : '#b0b0b0'} />
              {!rail && (
                <Text
                  className={cn('flex-1 text-[13px]', active ? 'font-semibold text-white' : 'font-medium text-ink-400')}
                >
                  {item.label}
                </Text>
              )}
              {!rail && item.count ? <CountBadge count={item.count} /> : null}
            </Pressable>
          );
        })}
      </View>

      <View
        className={cn(
          'w-full flex-row items-center gap-2.5 border-t border-line-dark pt-3',
          rail && 'justify-center px-0'
        )}
      >
        <Avatar {...user.avatar} size={32} />
        {!rail && (
          <View>
            <Text className="font-semibold text-xs text-white">{user.name}</Text>
            <Text className="text-[11px] text-ink-400">{user.role}</Text>
          </View>
        )}
      </View>
    </View>
  );
}
