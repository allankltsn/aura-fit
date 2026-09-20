import { Link, Slot, usePathname } from 'expo-router';
import { Pressable, ScrollView, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { legalDocs } from '@/lib/legalDocs';
import { useResponsive } from '@/lib/useResponsive';
import { cn } from '@/lib/cn';

/**
 * Shell for legal/help docs — a section nav next to the content on wide
 * screens, a horizontal scrollable strip above it on narrow ones (mirrors
 * how the kit's own .toc collapses on mobile).
 */
export default function LegalLayout() {
  const { isWide } = useResponsive();
  const pathname = usePathname();

  const items = legalDocs.map((doc) => {
    const active = doc.route === pathname;
    if (!doc.route) {
      return (
        <Text key={doc.key} className="rounded-sm px-2.5 py-2 text-[13px] text-faint">
          {doc.label}
        </Text>
      );
    }
    return (
      <Link key={doc.key} href={doc.route as Parameters<typeof Link>[0]['href']} asChild>
        <Pressable
          className={cn('rounded-sm px-2.5 py-2', !isWide && 'border border-line-strong', active && 'bg-primary-soft')}
        >
          <Text className={cn('text-[13px]', active ? 'font-semibold text-primary' : 'text-muted')}>{doc.label}</Text>
        </Pressable>
      </Link>
    );
  });

  return (
    <SafeAreaView className="flex-1 bg-bg" edges={['top']}>
      <View className={cn('flex-1 gap-6 p-4', isWide && 'flex-row')}>
        {isWide ? (
          <View className="w-[220px] gap-1">{items}</View>
        ) : (
          <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerClassName="flex-row gap-2">
            {items}
          </ScrollView>
        )}
        <View className="flex-1">
          <Slot />
        </View>
      </View>
    </SafeAreaView>
  );
}
