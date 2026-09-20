import { useState } from 'react';
import { router, useLocalSearchParams } from 'expo-router';
import { ScrollView, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { AppHeader } from '@/components/navigation';
import { Button, ExerciseRow, Tabs } from '@/components/ui';
import { todayWorkout, workoutExercises } from '@/lib/mockData';

const tabs = ['Exercícios', 'Detalhes'];

export default function WorkoutDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const [tab, setTab] = useState(tabs[0]);

  return (
    <SafeAreaView className="flex-1 bg-bg" edges={['top']}>
      <AppHeader title={todayWorkout.name} subtitle={`4 exercícios • 45min`} onMore={() => {}} />
      <View className="px-4">
        <Tabs options={tabs} value={tab} onChange={setTab} />
      </View>

      {tab === 'Exercícios' ? (
        <ScrollView contentContainerClassName="gap-2 px-4 py-4">
          {workoutExercises.map((ex) => (
            <ExerciseRow
              key={ex.id}
              name={ex.name}
              meta={`${ex.sets} · ${ex.muscle}`}
              status={ex.status}
              onPress={() => router.push(`/(app)/exercise/${ex.id}`)}
            />
          ))}
        </ScrollView>
      ) : (
        <View className="gap-3 px-4 py-4">
          <Text className="text-sm text-muted">Grupos musculares: {todayWorkout.tags}</Text>
          <Text className="text-sm text-muted">Duração estimada: 45 minutos</Text>
          <Text className="text-sm text-muted">ID do treino: {id}</Text>
        </View>
      )}

      <View className="border-t border-line px-4 py-3">
        <Button size="lg" block>
          Finalizar treino
        </Button>
      </View>
    </SafeAreaView>
  );
}
