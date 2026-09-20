import { useMemo, useState } from 'react';
import { ScrollView, Text, View } from 'react-native';
import { Button, Chip, ExerciseLibraryCard, Input } from '@/components/ui';
import { Icon } from '@/components/icons';
import { exerciseLibrary } from '@/lib/mockData';

const muscleGroups = ['Todos', 'Peito', 'Costas', 'Pernas', 'Ombros', 'Bíceps', 'Tríceps'];

export default function ExerciseLibraryScreen() {
  const [query, setQuery] = useState('');
  const [muscle, setMuscle] = useState(muscleGroups[0]);

  const filtered = useMemo(
    () =>
      exerciseLibrary.filter((e) => {
        const matchesQuery = query.trim() === '' || e.name.toLowerCase().includes(query.trim().toLowerCase());
        const matchesMuscle = muscle === 'Todos' || e.muscle === muscle;
        return matchesQuery && matchesMuscle;
      }),
    [query, muscle]
  );

  return (
    <ScrollView contentContainerClassName="gap-5 pb-6" showsVerticalScrollIndicator={false}>
      <View className="flex-row flex-wrap items-center justify-between gap-3">
        <View>
          <Text style={{ fontFamily: 'Inter_600SemiBold' }} className="text-h2 text-text">
            Biblioteca de Exercícios
          </Text>
          <Text className="text-[13px] text-muted">Gerencie e explore a base de exercícios para montar treinos.</Text>
        </View>
        <Button icon={<Icon name="plus" size={16} color="#ffffff" />}>Novo exercício</Button>
      </View>

      <Input
        placeholder="Buscar exercício..."
        value={query}
        onChangeText={setQuery}
        leading={<Icon name="search" size={16} color="#8d8d8d" />}
      />

      <View className="flex-row flex-wrap gap-2">
        {muscleGroups.map((m) => (
          <Chip key={m} label={m} tone="soft" selected={muscle === m} onPress={() => setMuscle(m)} />
        ))}
      </View>

      <View className="flex-row flex-wrap gap-3">
        {filtered.map((e) => (
          <ExerciseLibraryCard key={e.id} name={e.name} muscle={e.muscle} level={e.level} />
        ))}
      </View>
    </ScrollView>
  );
}
