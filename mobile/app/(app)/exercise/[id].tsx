import { useEffect, useState } from 'react';
import { useLocalSearchParams } from 'expo-router';
import { Pressable, ScrollView, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { AppHeader } from '@/components/navigation';
import { Button, StatusBadge, Stepper, useToast } from '@/components/ui';
import { Icon } from '@/components/icons';
import { workoutExercises } from '@/lib/mockData';

function formatTime(totalSeconds: number) {
  const m = Math.floor(totalSeconds / 60);
  const s = totalSeconds % 60;
  return `${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`;
}

export default function ExerciseExecutionScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const exercise = workoutExercises.find((e) => e.id === id) ?? workoutExercises[0];

  const [set, setSet] = useState(1);
  const [load, setLoad] = useState(70);
  const [reps, setReps] = useState(12);
  const [resting, setResting] = useState(false);
  const [secondsLeft, setSecondsLeft] = useState(90);
  const { show } = useToast();

  useEffect(() => {
    if (!resting) return;
    if (secondsLeft <= 0) {
      setResting(false);
      return;
    }
    const timer = setTimeout(() => setSecondsLeft((s) => s - 1), 1000);
    return () => clearTimeout(timer);
  }, [resting, secondsLeft]);

  function registerSet() {
    show({ title: 'Série registrada', description: `${exercise.name} · ${load} kg × ${reps}`, tone: 'success' });
    setSet((s) => Math.min(4, s + 1));
    setSecondsLeft(90);
    setResting(true);
  }

  return (
    <SafeAreaView className="flex-1 bg-bg" edges={['top']}>
      <AppHeader title={exercise.name} subtitle={exercise.muscle} onMore={() => {}} />
      <ScrollView contentContainerClassName="gap-4 px-4 py-2">
        <View className="aspect-[16/10] items-center justify-center overflow-hidden rounded-lg bg-dark">
          <View className="absolute left-2.5 top-2.5 rounded-full bg-black/50 px-2 py-1">
            <Text className="text-[11px] text-white">Vídeo · 0:42</Text>
          </View>
          <Pressable className="h-14 w-14 items-center justify-center rounded-full border border-white/30 bg-white/15">
            <Icon name="play" size={24} color="#ffffff" filled />
          </Pressable>
        </View>

        <View className="flex-row items-center justify-between">
          <Text style={{ fontFamily: 'Inter_600SemiBold' }} className="text-sm text-text">
            Série {set}/4
          </Text>
          <StatusBadge label={resting ? 'Descansando' : 'Em andamento'} tone="ok" />
        </View>

        <View className="flex-row gap-2">
          <Stepper label="Carga (kg)" value={load} onChange={setLoad} />
          <Stepper label="Repetições" value={reps} onChange={setReps} />
        </View>

        <Button size="lg" block onPress={registerSet}>
          Registrar série
        </Button>

        <View className="flex-row items-center justify-between rounded-lg bg-surface-2 p-3.5">
          <View>
            <Text className="text-[11px] text-muted">Descanso</Text>
            <Text style={{ fontFamily: 'Inter_600SemiBold' }} className="text-[26px] text-text">
              {formatTime(secondsLeft)}
            </Text>
          </View>
          <Pressable
            accessibilityLabel={resting ? 'Pausar' : 'Iniciar descanso'}
            onPress={() => setResting((r) => !r)}
            className="h-11 w-11 items-center justify-center rounded-full bg-primary active:bg-primary-press"
          >
            <Icon name={resting ? 'pause' : 'play'} size={18} color="#ffffff" filled />
          </Pressable>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
