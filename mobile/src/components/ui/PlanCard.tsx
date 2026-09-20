import { Text, View } from 'react-native';
import { Button } from './Button';
import { Icon } from '@/components/icons';
import { Tag } from './StatusBadge';
import { cn } from '@/lib/cn';

export type PlanCardProps = {
  name: string;
  price: string;
  period: string;
  features: string[];
  /** "pop" adds the "Mais popular" tag + red border; "current" (dashed, disabled CTA) marks the active plan. */
  highlight?: 'none' | 'pop' | 'current';
  onSubscribe?: () => void;
};

/** Pricing tier card — .plan in the kit. */
export function PlanCard({ name, price, period, features, highlight = 'none', onSubscribe }: PlanCardProps) {
  return (
    <View
      className={cn(
        'relative gap-4 rounded-xl border p-5',
        highlight === 'pop' ? 'border-[1.5px] border-primary shadow-lg' : 'border-line bg-surface',
        highlight === 'current' && 'border-dashed bg-surface-2'
      )}
    >
      {highlight === 'pop' && (
        <View className="absolute -top-2.5 right-4">
          <Tag label="Mais popular" />
        </View>
      )}
      <Text className="text-sm font-semibold text-text">{name}</Text>
      <View className="flex-row items-baseline">
        <Text style={{ fontSize: 28, fontFamily: 'Inter_700Bold', letterSpacing: -0.6 }} className="text-text">
          {price}
        </Text>
        <Text className="ml-1 text-xs text-muted">{period}</Text>
      </View>
      <View className="gap-2">
        {features.map((f) => (
          <View key={f} className="flex-row items-center gap-2">
            <Icon name="check" size={16} color="#22a45d" />
            <Text className="text-[13px] text-muted">{f}</Text>
          </View>
        ))}
      </View>
      <Button
        variant={highlight === 'pop' ? 'primary' : 'secondary'}
        block
        disabled={highlight === 'current'}
        onPress={onSubscribe}
      >
        {highlight === 'current' ? 'Plano atual' : 'Assinar'}
      </Button>
    </View>
  );
}
