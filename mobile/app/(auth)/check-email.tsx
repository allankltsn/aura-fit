import { Link, useLocalSearchParams } from 'expo-router';
import { Pressable, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { AuthBackground } from '@/components/brand';
import { Button } from '@/components/ui';
import { Icon } from '@/components/icons';

/** Matches the kit's two confirmation screens — "Link enviado" and "Verifique seu e-mail". */
export default function CheckEmailScreen() {
  const { mode } = useLocalSearchParams<{ mode?: 'reset' | 'verify' }>();
  const isVerify = mode === 'verify';

  return (
    <AuthBackground>
      <SafeAreaView className="flex-1 items-center justify-center gap-5 px-6">
        <View className={isVerify ? 'h-16 w-16 items-center justify-center rounded-full bg-primary-soft' : 'h-16 w-16 items-center justify-center rounded-full bg-success-bg'}>
          <Icon name={isVerify ? 'mail' : 'check'} size={28} color={isVerify ? '#b1111b' : '#22a45d'} />
        </View>

        <View className="items-center gap-1.5">
          <Text style={{ fontFamily: 'Inter_600SemiBold' }} className="text-h3 text-white">
            {isVerify ? 'Verifique seu e-mail' : 'Link enviado!'}
          </Text>
          <Text className="max-w-[32ch] text-center text-[13px] text-ink-400">
            {isVerify
              ? 'Enviamos um link de verificação para seu endereço de e-mail. Clique no link para ativar sua conta.'
              : 'Enviamos um link de recuperação de senha para o e-mail cadastrado.'}
          </Text>
          {!isVerify && <Text className="text-xs text-ink-500">O link expira em 15 minutos</Text>}
        </View>

        <Button size="lg" block>
          {isVerify ? 'Reenviar e-mail' : 'Voltar para o login'}
        </Button>

        {isVerify && (
          <Link href="/(auth)/login" asChild>
            <Pressable hitSlop={8}>
              <Text className="text-[13px] font-medium text-ink-400">Voltar para o login</Text>
            </Pressable>
          </Link>
        )}
      </SafeAreaView>
    </AuthBackground>
  );
}
