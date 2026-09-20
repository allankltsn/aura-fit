import { ScrollView, Text, View, useWindowDimensions } from 'react-native';
import { Avatar, Card, KPICard, LineChart } from '@/components/ui';
import { Icon } from '@/components/icons';
import { dashboardKpis, revenueByMonth, students, trainer } from '@/lib/mockData';

const recentStudents = students.slice(0, 4);

export default function DashboardHomeScreen() {
  const { width } = useWindowDimensions();
  const chartWidth = Math.min(560, width - 32 - 48);

  return (
    <ScrollView contentContainerClassName="gap-5 pb-6" showsVerticalScrollIndicator={false}>
      <View>
        <Text style={{ fontFamily: 'Inter_600SemiBold' }} className="text-h2 text-text">
          Olá, {trainer.name.split(' ')[0]}
        </Text>
        <Text className="text-[13px] text-muted">Aqui está o resumo do seu negócio hoje.</Text>
      </View>

      <View className="flex-row flex-wrap gap-3">
        <KPICard
          label="Total de Alunos"
          value={String(dashboardKpis.totalStudents)}
          delta="+12% no mês"
          icon={<Icon name="users" size={16} color="#b1111b" />}
        />
        <KPICard
          label="Receita Recorrente"
          value={dashboardKpis.monthlyRevenue}
          delta="+8% no mês"
          icon={<Icon name="card" size={16} color="#b1111b" />}
        />
        <KPICard label="Assinaturas Ativas" value={String(dashboardKpis.activeSubscriptions)} delta="+10% no mês" />
        <KPICard label="Avaliação Média" value={`${dashboardKpis.averageRating} ★`} delta="+0,2 no mês" />
      </View>

      <Card className="gap-3">
        <View className="flex-row items-center justify-between">
          <View>
            <Text style={{ fontFamily: 'Inter_600SemiBold' }} className="text-sm text-text">
              Evolução da Receita
            </Text>
            <Text className="text-xs text-muted">Últimos 6 meses</Text>
          </View>
        </View>
        <LineChart
          data={revenueByMonth.values}
          labels={revenueByMonth.months}
          max={12000}
          ticks={[0, 3000, 6000, 9000, 12000]}
          formatValue={(v) => (v === 0 ? 'R$ 0' : `R$ ${(v / 1000).toLocaleString('pt-BR')}k`)}
          width={chartWidth}
        />
      </Card>

      <Card className="gap-3">
        <Text style={{ fontFamily: 'Inter_600SemiBold' }} className="text-sm text-text">
          Alunos Recentes
        </Text>
        <View className="gap-1">
          {recentStudents.map((s) => (
            <View key={s.id} className="flex-row items-center gap-3 py-2">
              <Avatar initials={s.initials} tone={s.tone} size={36} />
              <View className="flex-1">
                <Text className="font-semibold text-[13px] text-text">{s.name}</Text>
                <Text className="text-xs text-muted">{s.workout}</Text>
              </View>
              <Text className="text-[11px] text-muted">{s.last}</Text>
            </View>
          ))}
        </View>
      </Card>
    </ScrollView>
  );
}
