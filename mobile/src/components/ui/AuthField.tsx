import { Text, TextInput, View, type TextInputProps } from 'react-native';
import { Icon, type IconName } from '@/components/icons';
import { cn } from '@/lib/cn';

export type AuthFieldProps = TextInputProps & {
  label: string;
  icon: IconName;
  error?: string;
  trailing?: React.ReactNode;
};

/**
 * Text field for dark hero screens (login, forgot-password) — same 40px/
 * icon/label contract as the light-theme `Input`, but themed for a
 * translucent-on-dark surface the shared `Input` doesn't support. Kept as
 * its own atom instead of duplicating this markup per screen.
 */
export function AuthField({ label, icon, error, trailing, className, ...inputProps }: AuthFieldProps) {
  return (
    <View className="gap-1.5">
      <Text className="font-medium text-[13px] text-white">{label}</Text>
      <View
        className={cn(
          'h-10 flex-row items-center gap-2 rounded-sm border bg-white/5 px-3',
          error ? 'border-primary-text-dark' : 'border-white/15',
          className
        )}
      >
        <Icon name={icon} size={16} color="#b0b0b0" />
        <TextInput
          placeholderTextColor="#858585"
          className="flex-1 text-sm text-white"
          style={{ fontFamily: 'Inter_400Regular' }}
          {...inputProps}
        />
        {trailing}
      </View>
      {error ? <Text className="text-xs text-primary-text-dark">{error}</Text> : null}
    </View>
  );
}
