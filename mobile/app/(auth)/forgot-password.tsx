import { useState } from 'react';
import { Link, router } from 'expo-router';
import { KeyboardAvoidingView, Platform, Pressable, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { AuthBackground, Logo } from '@/components/brand';
import { AuthField, Button } from '@/components/ui';
import { Icon } from '@/components/icons';
import { forgotPasswordSchema, getFieldErrors } from '@/lib/validation';

export default function ForgotPasswordScreen() {
  const [email, setEmail] = useState('');
  const [error, setError] = useState<string | undefined>();

  function handleSubmit() {
    const fieldErrors = getFieldErrors(forgotPasswordSchema, { email });
    setError(fieldErrors.email);
    if (fieldErrors.email) return;
    router.push('/(auth)/check-email');
  }

  return (
    <AuthBackground>
      <SafeAreaView className="flex-1">
        <KeyboardAvoidingView
          behavior={Platform.OS === 'ios' ? 'padding' : undefined}
          className="flex-1 justify-center gap-6 px-6"
        >
          <Logo size={28} variant="on-dark" />

          <View className="gap-1.5">
            <Text style={{ fontFamily: 'Inter_600SemiBold' }} className="text-h2 text-white">
              Recupere sua senha
            </Text>
            <Text className="text-[13px] text-ink-400">
              Informe seu e-mail e enviaremos um link para redefinir sua senha.
            </Text>
          </View>

          <AuthField
            label="E-mail"
            icon="mail"
            value={email}
            onChangeText={(v) => {
              setEmail(v);
              if (error) setError(undefined);
            }}
            placeholder="seu@email.com"
            autoCapitalize="none"
            autoComplete="email"
            keyboardType="email-address"
            error={error}
          />

          <Button size="lg" block onPress={handleSubmit}>
            Enviar link
          </Button>

          <Link href="/(auth)/login" asChild>
            <Pressable hitSlop={8} className="flex-row items-center justify-center gap-1.5">
              <Icon name="back" size={14} color="#b0b0b0" />
              <Text className="font-medium text-[13px] text-ink-400">Voltar para o login</Text>
            </Pressable>
          </Link>
        </KeyboardAvoidingView>
      </SafeAreaView>
    </AuthBackground>
  );
}
