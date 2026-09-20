import { useState } from 'react';
import { router } from 'expo-router';
import { Pressable, ScrollView, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Button, Card, ProgressBar, Segmented } from '@/components/ui';
import { Icon } from '@/components/icons';
import { todayWorkout, upcomingWorkouts } from '@/lib/mockData';

const periods = ['Hoje', 'Semana', 'Todos'];

export default function WorkoutsScreen() {
  const [period, setPeriod] = useState(periods[0]);
  const progress = Math.round((todayWorkout.completed / todayWorkout.total) * 100);

  return (
    <SafeAreaView className="flex-1 bg-bg" edges={['top']}>
      <View className="px-4 pb-2 pt-3">
        <Text style={{ fontFamily: 'Inter_600SemiBold' }} className="text-h3 text-text">
          Treinos
        </Text>
      </View>
      <ScrollView contentContainerClassName="gap-5 px-4 pb-6">
        <Segmented options={periods} value={period} onChange={setPeriod} full />

        <Card className="gap-3">
          <View>
            <Text style={{ fontFamily: 'Inter_600SemiBold' }} className="text-[15px] text-text">
              {todayWorkout.name}
            </Text>
            <Text className="text-xs text-muted">{todayWorkout.tags}</Text>
          </View>
          <Button block onPress={() => router.push(`/(app)/workout/${todayWorkout.id}`)}>
            Iniciar treino
          </Button>
          <View className="gap-1.5">
            <ProgressBar value={progress} thickness="thin" />
            <Text className="text-xs text-muted">
              {todayWorkout.completed}/{todayWorkout.total} exercícios concluídos
            </Text>
          </View>
        </Card>

        <View className="gap-3">
          <Text className="text-xs font-semibold text-muted">Próximos treinos</Text>
          <View className="gap-2">
            {upcomingWorkouts.map((w) => (
              <Pressable key={w.id} onPress={() => router.push(`/(app)/workout/${w.id}`)} className="flex-row items-center gap-3">
                <View className="h-8 w-8 items-center justify-center rounded-sm bg-surface-2">
                  <Icon name="dumbbell" size={16} color="#666666" />
                </View>
                <View className="flex-1">
                  <Text className="text-[13px] font-semibold text-text">{w.name}</Text>
                  <Text className="text-xs text-muted">{w.when}</Text>
                </View>
                <Icon name="chevronRight" size={16} color="#8d8d8d" />
              </Pressable>
            ))}
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
