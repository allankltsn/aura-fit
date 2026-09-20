import { ScrollView, Text, View, useWindowDimensions } from 'react-native';
import { Avatar, Card, KPICard, LineChart } from '@/components/ui';
import { financeSummary, revenueByMonth, transactions } from '@/lib/mockData';

export default function FinanceScreen() {
  const { width } = useWindowDimensions();
  const chartWidth = Math.min(560, width - 32 - 48);

  return (
    <ScrollView contentContainerClassName="gap-5 pb-6" showsVerticalScrollIndicator={false}>
      <View>
        <Text style={{ fontFamily: 'Inter_600SemiBold' }} className="text-h2 text-text">
          Financeiro
        </Text>
        <Text className="text-[13px] text-muted">Assinaturas ativas e cobranças.</Text>
      </View>

      <View className="flex-row flex-wrap gap-3">
        <KPICard label="Receita do Mês" value={financeSummary.monthRevenue} delta="+8% no mês" tone="hi" />
        <KPICard
          label="Assinaturas Ativas"
          value={String(financeSummary.activeSubscriptions)}
          delta="+10% no mês"
          tone="dark"
        />
        <KPICard label="Ticket Médio" value={financeSummary.averageTicket} delta="+8% no mês" />
      </View>

      <Card className="gap-3">
        <Text style={{ fontFamily: 'Inter_600SemiBold' }} className="text-sm text-text">
          Receitas
        </Text>
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
          Últimas Transações
        </Text>
        <View>
          {transactions.map((t, i) => (
            <View
              key={t.id}
              className={`flex-row items-center gap-3 py-2.5 ${i === transactions.length - 1 ? '' : 'border-b border-line'}`}
            >
              <Avatar initials={t.initials} tone={t.tone} size={36} />
              <View className="flex-1">
                <Text className="font-semibold text-[13px] text-text">{t.label}</Text>
                <Text className="text-xs text-muted">{t.student}</Text>
              </View>
              <View className="items-end">
                <Text className="font-semibold text-[13px] tabular-nums text-text">{t.amount}</Text>
                <Text className="text-[11px] text-muted">{t.date}</Text>
              </View>
            </View>
          ))}
        </View>
      </Card>
    </ScrollView>
  );
}
