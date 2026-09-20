import { useState } from 'react';
import { Text, TextInput, View, type TextInputProps } from 'react-native';
import { cn } from '@/lib/cn';

export type InputSize = 'sm' | 'md' | 'lg';

export type InputProps = TextInputProps & {
  label?: string;
  hint?: string;
  status?: 'default' | 'error' | 'ok';
  size?: InputSize;
  leading?: React.ReactNode;
  trailing?: React.ReactNode;
  disabled?: boolean;
};

const heightClass: Record<InputSize, string> = { sm: 'h-8', md: 'h-10', lg: 'h-12' };
const radiusClass: Record<InputSize, string> = { sm: 'rounded-sm', md: 'rounded-sm', lg: 'rounded-md' };
const textSizeClass: Record<InputSize, string> = { sm: 'text-[13px]', md: 'text-sm', lg: 'text-[15px]' };

/**
 * Text field — label always visible above, 3 heights, leading/trailing
 * adornment slots, focus/error/ok/disabled states matching the kit's .inp.
 */
export function Input({
  label,
  hint,
  status = 'default',
  size = 'md',
  leading,
  trailing,
  disabled = false,
  className,
  onFocus,
  onBlur,
  style,
  ...inputProps
}: InputProps) {
  const [focused, setFocused] = useState(false);

  const borderClass = disabled
    ? 'border-line'
    : focused
      ? 'border-primary'
      : status === 'error'
        ? 'border-primary'
        : status === 'ok'
          ? 'border-success'
          : 'border-line-strong';

  return (
    <View className="gap-1.5">
      {label ? <Text className="font-medium text-[13px] text-text">{label}</Text> : null}
      <View
        className={cn(
          'flex-row items-center gap-2 border bg-surface px-3',
          heightClass[size],
          radiusClass[size],
          borderClass,
          disabled && 'bg-surface-2',
          className
        )}
      >
        {leading}
        <TextInput
          editable={!disabled}
          placeholderTextColor="#8d8d8d"
          className={cn('flex-1 text-text', textSizeClass[size])}
          style={[{ fontFamily: 'Inter_400Regular' }, style]}
          onFocus={(e) => {
            setFocused(true);
            onFocus?.(e);
          }}
          onBlur={(e) => {
            setFocused(false);
            onBlur?.(e);
          }}
          {...inputProps}
        />
        {trailing}
      </View>
      {hint ? (
        <Text
          className={cn(
            'text-xs',
            status === 'error' ? 'text-primary' : status === 'ok' ? 'text-success' : 'text-muted'
          )}
        >
          {hint}
        </Text>
      ) : null}
    </View>
  );
}
