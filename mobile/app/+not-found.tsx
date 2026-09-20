import { Link } from 'expo-router';
import { Text } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { AuthBackground } from '@/components/brand';
import { Button } from '@/components/ui';

export default function NotFoundScreen() {
  return (
    <AuthBackground>
      <SafeAreaView className="flex-1 items-center justify-center gap-3 px-6">
        <Text style={{ fontFamily: 'Inter_700Bold' }} className="text-[64px] leading-[64px] text-primary">
          404
        </Text>
        <Text style={{ fontFamily: 'Inter_600SemiBold' }} className="text-h3 text-white">
          Página não encontrada
        </Text>
        <Text className="max-w-[34ch] text-center text-[13px] text-ink-400">
          A página que você está procurando não existe ou foi removida.
        </Text>
        <Link href="/" asChild>
          <Button variant="outlineWhite" className="mt-2">
            Voltar para o início
          </Button>
        </Link>
      </SafeAreaView>
    </AuthBackground>
  );
}
