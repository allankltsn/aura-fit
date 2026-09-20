import { View } from 'react-native';
import { cn } from '@/lib/cn';

export type ProgressBarProps = {
  /** 0–100 */
  value: number;
  tone?: 'success' | 'primary' | 'dark';
  thickness?: 'thin' | 'md' | 'thick';
};

const heightClass = { thin: 'h-[3px]', md: 'h-1.5', thick: 'h-2.5' };
const toneClass = { success: 'bg-success', primary: 'bg-primary', dark: 'bg-text' };

/** Linear progress — .bar in the kit. */
export function ProgressBar({ value, tone = 'success', thickness = 'md' }: ProgressBarProps) {
  const clamped = Math.max(0, Math.min(100, value));

  return (
    <View className={cn('w-full overflow-hidden rounded-full bg-surface-2', heightClass[thickness])}>
      <View style={{ width: `${clamped}%` }} className={cn('h-full rounded-full', toneClass[tone])} />
    </View>
  );
}
