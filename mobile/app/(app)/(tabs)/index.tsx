import { router } from 'expo-router';
import { ScrollView, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Avatar, Button, Card, ProgressBar, ProgressRing } from '@/components/ui';
import { todayWorkout, trainer } from '@/lib/mockData';

export default function HomeScreen() {
  const progress = Math.round((todayWorkout.completed / todayWorkout.total) * 100);

  return (
    <SafeAreaView className="flex-1 bg-bg" edges={['top']}>
      <ScrollView contentContainerClassName="gap-5 px-4 pb-6 pt-4">
        <View className="flex-row items-center justify-between">
          <View>
            <Text style={{ fontFamily: 'Inter_600SemiBold' }} className="text-h2 text-text">
              Olá, Ana
            </Text>
            <Text className="text-[13px] text-muted">Vamos treinar hoje?</Text>
          </View>
          <Avatar initials="AF" tone={3} size={44} />
        </View>

        <Card className="flex-row items-center gap-4">
          <ProgressRing value={progress} size={64} />
          <View className="flex-1 gap-1">
            <Text style={{ fontFamily: 'Inter_600SemiBold' }} className="text-sm text-text">
              {todayWorkout.name}
            </Text>
            <Text className="text-xs text-muted">{todayWorkout.tags}</Text>
            <ProgressBar value={progress} thickness="thin" />
          </View>
        </Card>

        <Button block onPress={() => router.push(`/(app)/workout/${todayWorkout.id}`)}>
          Continuar treino
        </Button>

        <Card className="flex-row items-center gap-3">
          <Avatar initials={trainer.initials} tone={3} size={40} />
          <View className="flex-1">
            <Text className="text-[13px] font-semibold text-text">{trainer.name}</Text>
            <Text className="text-xs text-muted">{trainer.role} • online</Text>
          </View>
          <Button size="sm" variant="secondary" onPress={() => router.push('/(app)/(tabs)/chat')}>
            Chat
          </Button>
        </Card>
      </ScrollView>
    </SafeAreaView>
  );
}
