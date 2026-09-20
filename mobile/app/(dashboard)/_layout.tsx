import { useState } from 'react';
import { router, Slot, usePathname } from 'expo-router';
import { Modal, Pressable, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Sidebar, TopBar } from '@/components/navigation';
import { Icon } from '@/components/icons';
import { dashboardKeyFromPathname, dashboardNavItems } from '@/lib/dashboardNav';
import { useResponsive } from '@/lib/useResponsive';
import { trainer } from '@/lib/mockData';

const routeByKey: Record<string, string> = {
  home: '/home',
  students: '/students',
  exercises: '/exercises',
  finance: '/finance',
  permissions: '/permissions',
};

/**
 * Responsive shell for the trainer-facing dashboard — a fixed Sidebar next
 * to the page content at tablet/desktop widths, a slide-in drawer behind a
 * menu button below that. One implementation, one nav source of truth
 * (`dashboardNavItems`), no separate "mobile dashboard".
 */
export default function DashboardLayout() {
  const { isWide } = useResponsive();
  const pathname = usePathname();
  const activeKey = dashboardKeyFromPathname(pathname);
  const [drawerOpen, setDrawerOpen] = useState(false);

  function goTo(key: string) {
    setDrawerOpen(false);
    router.push(routeByKey[key] as Parameters<typeof router.push>[0]);
  }

  const user = { name: trainer.name, role: trainer.role, avatar: { initials: trainer.initials, tone: 3 as const } };

  if (isWide) {
    return (
      <View className="flex-1 flex-row gap-4 bg-bg p-4">
        <Sidebar items={dashboardNavItems} activeKey={activeKey} onSelect={goTo} user={user} />
        <View className="flex-1 gap-4">
          <TopBar avatar={user.avatar} onSettingsPress={() => goTo('permissions')} />
          <View className="flex-1">
            <Slot />
          </View>
        </View>
      </View>
    );
  }

  return (
    <SafeAreaView className="flex-1 bg-bg" edges={['top']}>
      <View className="flex-row items-center gap-3 border-b border-line px-4 py-3">
        <Pressable
          accessibilityLabel="Abrir menu"
          onPress={() => setDrawerOpen(true)}
          className="h-9 w-9 items-center justify-center rounded-sm active:bg-surface-2"
        >
          <Icon name="more" size={20} color="#1f1f1f" />
        </Pressable>
        <View className="flex-1" />
      </View>
      <View className="flex-1 px-4 py-4">
        <Slot />
      </View>

      <Modal visible={drawerOpen} animationType="slide" transparent onRequestClose={() => setDrawerOpen(false)}>
        <Pressable className="flex-1 bg-dark/55" onPress={() => setDrawerOpen(false)}>
          <SafeAreaView className="h-full w-[280px] p-3">
            <Pressable onPress={(e) => e.stopPropagation()}>
              <Sidebar items={dashboardNavItems} activeKey={activeKey} onSelect={goTo} user={user} />
            </Pressable>
          </SafeAreaView>
        </Pressable>
      </Modal>
    </SafeAreaView>
  );
}
