import { Text, View } from 'react-native';
import { Icon, type IconName } from '@/components/icons';
import { cn } from '@/lib/cn';

export type AlertTone = 'ok' | 'warn' | 'err' | 'info';

export type AlertProps = {
  title: string;
  description?: string;
  tone?: AlertTone;
};

const toneConfig: Record<AlertTone, { bg: string; text: string; border: string; icon: IconName; iconColor: string }> = {
  ok: { bg: 'bg-success-bg', text: 'text-success-text', border: 'border-transparent', icon: 'check', iconColor: '#137a3d' },
  warn: { bg: 'bg-warning-bg', text: 'text-warning-text', border: 'border-transparent', icon: 'alert', iconColor: '#855800' },
  err: { bg: 'bg-primary-soft', text: 'text-primary', border: 'border-primary-line', icon: 'alert', iconColor: '#b1111b' },
  info: { bg: 'bg-surface-2', text: 'text-text', border: 'border-line', icon: 'info', iconColor: '#1f1f1f' },
};

/** Inline banner for page-level context — .al in the kit. */
export function Alert({ title, description, tone = 'info' }: AlertProps) {
  const c = toneConfig[tone];

  return (
    <View className={cn('w-full flex-row items-start gap-2.5 rounded-md border p-3.5', c.bg, c.border)}>
      <Icon name={c.icon} size={20} color={c.iconColor} />
      <View className="flex-1 gap-0.5">
        <Text className={cn('text-[13px] font-semibold', c.text)}>{title}</Text>
        {description ? <Text className={cn('text-[13px] opacity-90', c.text)}>{description}</Text> : null}
      </View>
    </View>
  );
}
