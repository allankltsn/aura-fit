import { Stack } from 'expo-router';

export default function AppLayout() {
  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="(tabs)" />
      <Stack.Screen name="workout/[id]" options={{ presentation: 'card' }} />
      <Stack.Screen name="exercise/[id]" options={{ presentation: 'card' }} />
    </Stack>
  );
}
