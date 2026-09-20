import { Stack } from 'expo-router';
import { ToastProvider } from '@/components/ui';

export default function AppLayout() {
  return (
    <ToastProvider>
      <Stack screenOptions={{ headerShown: false }}>
        <Stack.Screen name="(tabs)" />
        <Stack.Screen name="workout/[id]" options={{ presentation: 'card' }} />
        <Stack.Screen name="exercise/[id]" options={{ presentation: 'card' }} />
      </Stack>
    </ToastProvider>
  );
}
