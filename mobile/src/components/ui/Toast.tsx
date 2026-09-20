import { createContext, useCallback, useContext, useRef, useState, type ReactNode } from 'react';
import { Pressable, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Icon, type IconName } from '@/components/icons';
import { cn } from '@/lib/cn';

export type ToastTone = 'success' | 'warn' | 'error';

export type ToastOptions = {
  title: string;
  description?: string;
  tone?: ToastTone;
  /** Ms before auto-dismiss; omit for a persistent toast (e.g. the error+retry case in the kit). */
  duration?: number;
  actionLabel?: string;
  onAction?: () => void;
};

type ToastState = ToastOptions & { id: number };

const ToastContext = createContext<{ show: (opts: ToastOptions) => void } | null>(null);

const toneIcon: Record<ToastTone, { name: IconName; bg: string }> = {
  success: { name: 'check', bg: 'bg-success' },
  warn: { name: 'alert', bg: 'bg-warning' },
  error: { name: 'x', bg: 'bg-primary' },
};

export function ToastProvider({ children }: { children: ReactNode }) {
  const [toast, setToast] = useState<ToastState | null>(null);
  const idRef = useRef(0);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const show = useCallback((opts: ToastOptions) => {
    if (timerRef.current) clearTimeout(timerRef.current);
    const id = ++idRef.current;
    setToast({ ...opts, id });
    if (opts.duration !== 0) {
      timerRef.current = setTimeout(() => {
        setToast((current) => (current?.id === id ? null : current));
      }, opts.duration ?? 3200);
    }
  }, []);

  return (
    <ToastContext.Provider value={{ show }}>
      {children}
      {toast && (
        <SafeAreaView pointerEvents="box-none" className="absolute inset-x-0 bottom-0 items-center px-4 pb-4">
          <ToastView {...toast} onClose={() => setToast(null)} />
        </SafeAreaView>
      )}
    </ToastContext.Provider>
  );
}

export function useToast() {
  const ctx = useContext(ToastContext);
  if (!ctx) throw new Error('useToast must be used within a ToastProvider');
  return ctx;
}

/** Bottom-anchored confirmation toast — .toast in the kit, dark surface, icon badge, optional inline action. */
function ToastView({
  title,
  description,
  tone = 'success',
  actionLabel,
  onAction,
  onClose,
}: ToastOptions & { onClose: () => void }) {
  const t = toneIcon[tone];

  return (
    <View className="w-full max-w-[380px] flex-row items-center gap-3 rounded-lg bg-dark p-3.5 shadow-xl">
      <View className={cn('h-7 w-7 items-center justify-center rounded-full', t.bg)}>
        <Icon name={t.name} size={16} color={tone === 'warn' ? '#1f1f1f' : '#ffffff'} strokeWidth={2.5} />
      </View>
      <View className="flex-1 gap-0.5">
        <Text className="text-[13px] font-semibold text-white">{title}</Text>
        {description ? <Text className="text-xs text-ink-400">{description}</Text> : null}
      </View>
      {actionLabel ? (
        <Pressable onPress={onAction}>
          <Text className="text-[13px] font-semibold text-white">{actionLabel}</Text>
        </Pressable>
      ) : (
        <Pressable accessibilityLabel="Fechar" onPress={onClose} hitSlop={8}>
          <Icon name="x" size={16} color="#b0b0b0" />
        </Pressable>
      )}
    </View>
  );
}
