import { Tabs } from 'expo-router';
import type { ColorValue } from 'react-native';
import { Icon, type IconName } from '@/components/icons';

function TabBarIcon({ name, color }: { name: IconName; color: ColorValue }) {
  return <Icon name={name} size={22} color={color as string} />;
}

/**
 * Bottom tab bar — 4 destinations matching the kit's .tabbar (10px labels,
 * active in primary red). Using Expo Router's built-in Tabs (native
 * bottom-tab behavior) instead of a hand-rolled bar keeps safe-area and
 * platform gesture handling correct for free.
 */
export default function TabsLayout() {
  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: '#b1111b',
        tabBarInactiveTintColor: '#8d8d8d',
        tabBarLabelStyle: { fontSize: 10, fontFamily: 'Inter_500Medium' },
        tabBarStyle: { borderTopColor: '#e3e3e3', height: 58, paddingTop: 6, paddingBottom: 8 },
      }}
    >
      <Tabs.Screen
        name="index"
        options={{ title: 'Início', tabBarIcon: ({ color }) => <TabBarIcon name="home" color={color} /> }}
      />
      <Tabs.Screen
        name="workouts"
        options={{ title: 'Treinos', tabBarIcon: ({ color }) => <TabBarIcon name="dumbbell" color={color} /> }}
      />
      <Tabs.Screen
        name="progress"
        options={{ title: 'Progresso', tabBarIcon: ({ color }) => <TabBarIcon name="chart" color={color} /> }}
      />
      <Tabs.Screen
        name="chat"
        options={{ title: 'Chat', tabBarIcon: ({ color }) => <TabBarIcon name="chat" color={color} /> }}
      />
    </Tabs>
  );
}
