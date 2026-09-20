import { Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { AuthBackground, Logo } from '@/components/brand';
import { Icon } from '@/components/icons';

const countdown = [
  { value: '02', label: 'Dias' },
  { value: '14', label: 'Horas' },
  { value: '36', label: 'Minutos' },
  { value: '22', label: 'Segundos' },
];

export default function MaintenanceScreen() {
  return (
    <AuthBackground>
      <SafeAreaView className="flex-1 justify-between px-6 py-6">
        <View className="flex-1 items-center justify-center gap-4">
          <View className="h-16 w-16 items-center justify-center rounded-full bg-primary-soft">
            <Icon name="timer" size={28} color="#b1111b" />
          </View>
          <View className="items-center gap-1.5">
            <Text style={{ fontFamily: 'Inter_600SemiBold' }} className="text-h3 text-white">
              Estamos em manutenção
            </Text>
            <Text className="max-w-[34ch] text-center text-[13px] text-ink-400">
              Voltaremos em breve. Enquanto isso, acompanhe nossas redes sociais para novidades.
            </Text>
          </View>
          <View className="flex-row gap-4">
            {countdown.map((c) => (
              <View key={c.label} className="items-center gap-1">
                <Text style={{ fontFamily: 'Inter_700Bold' }} className="text-2xl text-white">
                  {c.value}
                </Text>
                <Text className="text-[10px] uppercase tracking-wide text-ink-500">{c.label}</Text>
              </View>
            ))}
          </View>
        </View>
        <View className="items-center gap-3">
          <Logo size={20} variant="on-dark" />
          <Text className="text-[11px] text-ink-500">Equipe aura-fit</Text>
        </View>
      </SafeAreaView>
    </AuthBackground>
  );
}
