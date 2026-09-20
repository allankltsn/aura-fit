import { useState } from 'react';
import { ScrollView, Text, View, useWindowDimensions } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Card, LineChart, Segmented } from '@/components/ui';

const metrics = ['Força', 'Volume', 'Peso'];
const months = ['Jan', 'Fev', 'Mar', 'Abr', 'Mai', 'Jun'];
const load = [40, 52, 55, 58, 70, 88];

const stats = [
  { label: 'Peso atual', value: '82', unit: 'kg', delta: '−2% no mês' },
  { label: 'Cintura', value: '84', unit: 'cm', delta: '−1% no mês' },
  { label: 'BF (estimado)', value: '12', unit: '%', delta: '−1% no mês' },
];

export default function ProgressScreen() {
  const [metric, setMetric] = useState(metrics[0]);
  const { width } = useWindowDimensions();
  const chartWidth = Math.min(340, width - 32 - 32);

  return (
    <SafeAreaView className="flex-1 bg-bg" edges={['top']}>
      <View className="px-4 pb-2 pt-3">
        <Text style={{ fontFamily: 'Inter_600SemiBold' }} className="text-h3 text-text">
          Progresso
        </Text>
      </View>
      <ScrollView contentContainerClassName="gap-5 px-4 pb-6">
        <Card className="gap-3">
          <View className="flex-row items-center justify-between">
            <Text style={{ fontFamily: 'Inter_600SemiBold' }} className="text-sm text-text">
              Progresso do Aluno
            </Text>
            <Segmented options={metrics} value={metric} onChange={setMetric} size="sm" />
          </View>
          <LineChart
            data={load}
            labels={months}
            max={120}
            ticks={[0, 30, 60, 90, 120]}
            formatValue={(v) => `${v} kg`}
            width={chartWidth}
          />
        </Card>

        <View className="flex-row flex-wrap gap-3">
          {stats.map((s) => (
            <Card key={s.label} className="min-w-[104px] flex-1 gap-1">
              <Text className="text-[11px] text-muted">{s.label}</Text>
              <Text style={{ fontFamily: 'Inter_600SemiBold' }} className="text-[22px] text-text">
                {s.value}
                <Text className="font-medium text-xs text-muted"> {s.unit}</Text>
              </Text>
              <Text className="text-[11px] text-success">{s.delta}</Text>
            </Card>
          ))}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
