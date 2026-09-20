import { ActivityIndicator, Pressable, Text, type PressableProps } from 'react-native';
import { cn } from '@/lib/cn';

export type ButtonVariant = 'primary' | 'secondary' | 'text' | 'ghost' | 'dark' | 'outlineWhite' | 'inverse';
export type ButtonSize = 'sm' | 'md' | 'lg';

export type ButtonProps = Omit<PressableProps, 'children'> & {
  children: string;
  variant?: ButtonVariant;
  size?: ButtonSize;
  /** Full circle/square, icon-only — pass no children, use `icon` instead. */
  square?: boolean;
  pill?: boolean;
  block?: boolean;
  loading?: boolean;
  icon?: React.ReactNode;
  iconPosition?: 'left' | 'right';
};

const sizeClass: Record<ButtonSize, string> = {
  sm: 'h-8 px-3',
  md: 'h-10 px-[18px]',
  lg: 'h-12 px-6',
};

const squareSizeClass: Record<ButtonSize, string> = {
  sm: 'h-8 w-8',
  md: 'h-10 w-10',
  lg: 'h-12 w-12',
};

const radiusClass: Record<ButtonSize, string> = {
  sm: 'rounded-sm',
  md: 'rounded-sm',
  lg: 'rounded-md',
};

const textSizeClass: Record<ButtonSize, string> = {
  sm: 'text-[13px]',
  md: 'text-sm',
  lg: 'text-[15px]',
};

const variantClass: Record<ButtonVariant, { container: string; pressed: string; text: string; disabled: string }> = {
  primary: {
    container: 'bg-primary',
    pressed: 'active:bg-primary-press',
    text: 'text-white',
    disabled: 'bg-surface-2',
  },
  secondary: {
    container: 'bg-transparent border-[1.5px] border-primary',
    pressed: 'active:bg-primary-line active:border-primary-press',
    text: 'text-primary',
    disabled: 'bg-transparent border-line-strong',
  },
  text: {
    container: 'bg-transparent px-2.5',
    pressed: 'active:bg-primary-soft',
    text: 'text-primary',
    disabled: 'bg-transparent',
  },
  ghost: {
    container: 'bg-surface-2',
    pressed: 'active:bg-line-strong',
    text: 'text-text',
    disabled: 'bg-surface-2',
  },
  dark: {
    container: 'bg-text',
    pressed: 'active:bg-faint',
    text: 'text-surface',
    disabled: 'bg-surface-2',
  },
  outlineWhite: {
    container: 'bg-transparent border-[1.5px] border-white/70',
    pressed: 'active:bg-white/10',
    text: 'text-white',
    disabled: 'bg-transparent border-white/30',
  },
  inverse: {
    container: 'bg-white',
    pressed: 'active:bg-ink-100',
    text: 'text-primary',
    disabled: 'bg-white/60',
  },
};

const spinnerColor: Record<ButtonVariant, string> = {
  primary: '#ffffff',
  secondary: '#b1111b',
  text: '#b1111b',
  ghost: '#1f1f1f',
  dark: '#ffffff',
  outlineWhite: '#ffffff',
  inverse: '#b1111b',
};

/**
 * Buttons — 7 variants (kit's primary/secondary/text/ghost/solid-dark plus
 * out-w and inv for dark/red backgrounds), 3 heights (32/40/48), pill and
 * icon-only shapes, block width, loading + disabled states.
 */
export function Button({
  children,
  variant = 'primary',
  size = 'md',
  square = false,
  pill = false,
  block = false,
  loading = false,
  icon,
  iconPosition = 'left',
  disabled,
  className,
  ...pressableProps
}: ButtonProps) {
  const v = variantClass[variant];
  const isDisabled = disabled || loading;

  return (
    <Pressable
      accessibilityRole="button"
      accessibilityState={{ disabled: isDisabled }}
      disabled={isDisabled}
      className={cn(
        'flex-row items-center justify-center gap-2',
        square ? squareSizeClass[size] : sizeClass[size],
        pill ? 'rounded-full' : radiusClass[size],
        block && !square && 'w-full',
        v.container,
        !isDisabled && v.pressed,
        isDisabled && v.disabled,
        className
      )}
      {...pressableProps}
    >
      {loading ? (
        <ActivityIndicator size="small" color={isDisabled ? '#8d8d8d' : spinnerColor[variant]} />
      ) : square ? (
        icon
      ) : (
        <>
          {icon && iconPosition === 'left' ? icon : null}
          <Text
            className={cn('font-semibold', textSizeClass[size], isDisabled ? 'text-faint' : v.text)}
            style={{ fontFamily: 'Inter_600SemiBold' }}
          >
            {children}
          </Text>
          {icon && iconPosition === 'right' ? icon : null}
        </>
      )}
    </Pressable>
  );
}
