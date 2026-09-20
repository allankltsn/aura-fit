import { Text, View } from 'react-native';
import { Card } from './Card';
import { cn } from '@/lib/cn';

export type KPICardProps = {
  label: string;
  value: string;
  delta?: string;
  deltaNegative?: boolean;
  icon?: React.ReactNode;
  /** "hi" = red highlight card, "dark" = ink card — matches .kpi.hi / .kpi.dkc. */
  tone?: 'default' | 'hi' | 'dark';
};

/** Dashboard metric tile — .card.kpi in the kit. */
export function KPICard({ label, value, delta, deltaNegative = false, icon, tone = 'default' }: KPICardProps) {
  const onTint = tone !== 'default';

  return (
    <Card
      className={cn(
        'gap-2',
        tone === 'hi' && 'border-primary bg-primary',
        tone === 'dark' && 'border-dark bg-dark'
      )}
    >
      <View className="flex-row items-center justify-between">
        <Text className={cn('text-xs font-medium', onTint ? 'text-white/85' : 'text-muted')}>{label}</Text>
        {icon}
      </View>
      <Text
        className={cn('font-semibold', onTint ? 'text-white' : 'text-text')}
        style={{ fontSize: 24, fontFamily: 'Inter_600SemiBold', letterSpacing: -0.4 }}
      >
        {value}
      </Text>
      {delta ? (
        <View className="flex-row items-center gap-1.5">
          <View
            className={cn('h-[5px] w-[5px] rounded-full', deltaNegative ? 'bg-primary' : onTint ? 'bg-white' : 'bg-success')}
          />
          <Text className={cn('text-[11px] font-medium', onTint ? 'text-white/85' : 'text-muted')}>{delta}</Text>
        </View>
      ) : null}
    </Card>
  );
}
