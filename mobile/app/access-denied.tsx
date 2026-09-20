import { Link } from 'expo-router';
import { Text } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { AuthBackground } from '@/components/brand';
import { Button } from '@/components/ui';
import { Icon } from '@/components/icons';

export default function AccessDeniedScreen() {
  return (
    <AuthBackground>
      <SafeAreaView className="flex-1 items-center justify-center gap-4 px-6">
        <Icon name="lock" size={48} color="#b0b0b0" />
        <Text style={{ fontFamily: 'Inter_600SemiBold' }} className="text-h3 text-white">
          Acesso negado
        </Text>
        <Text className="max-w-[34ch] text-center text-[13px] text-ink-400">
          Você não tem permissão para acessar esta área do sistema.
        </Text>
        <Link href="/" asChild>
          <Button className="mt-2">Voltar para o início</Button>
        </Link>
      </SafeAreaView>
    </AuthBackground>
  );
}
