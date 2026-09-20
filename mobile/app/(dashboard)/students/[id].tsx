import { useState } from 'react';
import { router, useLocalSearchParams } from 'expo-router';
import { ScrollView, Text, View } from 'react-native';
import { Avatar, Button, EmptyState, LineChart, StatusBadge, Tabs } from '@/components/ui';
import { Breadcrumb } from '@/components/navigation';
import { students, todayWorkout } from '@/lib/mockData';

const tabs = ['Visão geral', 'Treinos', 'Financeiro', 'Configurações'];

export default function StudentDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const student = students.find((s) => s.id === id) ?? students[0];
  const [tab, setTab] = useState(tabs[0]);

  return (
    <ScrollView contentContainerClassName="gap-5 pb-6" showsVerticalScrollIndicator={false}>
      <Breadcrumb items={['Alunos', student.name]} />

      <View className="flex-row flex-wrap items-center gap-4">
        <Avatar initials={student.initials} tone={student.tone} size={56} />
        <View className="flex-1 gap-1">
          <Text style={{ fontFamily: 'Inter_600SemiBold' }} className="text-h3 text-text">
            {student.name}
          </Text>
          <Text className="text-xs text-muted">{student.email}</Text>
        </View>
        <StatusBadge label={student.statusLabel} tone={student.status} />
        <Button variant="secondary" onPress={() => router.push(`/(dashboard)/students/new?id=${student.id}`)}>
          Editar
        </Button>
      </View>

      <Tabs options={tabs} value={tab} onChange={setTab} />

      {tab === 'Visão geral' && (
        <View className="gap-5">
          <View className="flex-row flex-wrap gap-3">
            <View className="min-w-[140px] flex-1 gap-1 rounded-lg border border-line bg-surface p-3.5">
              <Text className="text-xs text-muted">Treino atual</Text>
              <Text style={{ fontFamily: 'Inter_600SemiBold' }} className="text-base text-text">
                {student.workout}
              </Text>
            </View>
            <View className="min-w-[140px] flex-1 gap-1 rounded-lg border border-line bg-surface p-3.5">
              <Text className="text-xs text-muted">Último treino</Text>
              <Text style={{ fontFamily: 'Inter_600SemiBold' }} className="text-base text-text">
                {student.last}
              </Text>
            </View>
            <View className="min-w-[140px] flex-1 gap-1 rounded-lg border border-line bg-surface p-3.5">
              <Text className="text-xs text-muted">Evolução</Text>
              <Text style={{ fontFamily: 'Inter_600SemiBold' }} className="text-base text-success">
                +4,8%
              </Text>
            </View>
          </View>

          <View className="gap-3 rounded-lg border border-line bg-surface p-4">
            <Text style={{ fontFamily: 'Inter_600SemiBold' }} className="text-sm text-text">
              Evolução de Carga
            </Text>
            <LineChart
              data={[40, 52, 55, 58, 70, 88]}
              labels={['Jan', 'Fev', 'Mar', 'Abr', 'Mai', 'Jun']}
              max={120}
              ticks={[0, 30, 60, 90, 120]}
              formatValue={(v) => `${v} kg`}
              width={520}
            />
          </View>
        </View>
      )}

      {tab === 'Treinos' && (
        <View className="gap-2 rounded-lg border border-line bg-surface p-3.5">
          <Text style={{ fontFamily: 'Inter_600SemiBold' }} className="text-sm text-text">
            {todayWorkout.name}
          </Text>
          <Text className="text-xs text-muted">{todayWorkout.tags}</Text>
        </View>
      )}

      {tab === 'Financeiro' && (
        <EmptyState
          icon="card"
          title="Sem cobranças recentes"
          description="O histórico de pagamentos deste aluno aparecerá aqui assim que o financeiro for integrado."
        />
      )}

      {tab === 'Configurações' && (
        <EmptyState
          icon="settings"
          title="Configurações do aluno"
          description="Preferências de notificação, acesso ao app e outras configurações ficarão aqui."
        />
      )}
    </ScrollView>
  );
}
