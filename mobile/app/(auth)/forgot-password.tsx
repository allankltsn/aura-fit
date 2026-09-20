import { useState } from 'react';
import { Link, router } from 'expo-router';
import { KeyboardAvoidingView, Platform, Pressable, Text, TextInput, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { AuthBackground, Logo } from '@/components/brand';
import { Button } from '@/components/ui';
import { Icon } from '@/components/icons';

export default function ForgotPasswordScreen() {
  const [email, setEmail] = useState('');

  return (
    <AuthBackground>
      <SafeAreaView className="flex-1">
        <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : undefined} className="flex-1 justify-center gap-6 px-6">
          <Logo size={28} variant="on-dark" />

          <View className="gap-1.5">
            <Text style={{ fontFamily: 'Inter_600SemiBold' }} className="text-h2 text-white">
              Recupere sua senha
            </Text>
            <Text className="text-[13px] text-ink-400">Informe seu e-mail e enviaremos um link para redefinir sua senha.</Text>
          </View>

          <View className="gap-1.5">
            <Text className="text-[13px] font-medium text-white">E-mail</Text>
            <View className="h-10 flex-row items-center gap-2 rounded-sm border border-white/15 bg-white/5 px-3">
              <Icon name="mail" size={16} color="#b0b0b0" />
              <TextInput
                value={email}
                onChangeText={setEmail}
                placeholder="seu@email.com"
                placeholderTextColor="#858585"
                autoCapitalize="none"
                keyboardType="email-address"
                className="flex-1 text-sm text-white"
                style={{ fontFamily: 'Inter_400Regular' }}
              />
            </View>
          </View>

          <Button size="lg" block onPress={() => router.push('/(auth)/check-email')}>
            Enviar link
          </Button>

          <Link href="/(auth)/login" asChild>
            <Pressable hitSlop={8} className="flex-row items-center justify-center gap-1.5">
              <Icon name="back" size={14} color="#b0b0b0" />
              <Text className="text-[13px] font-medium text-ink-400">Voltar para o login</Text>
            </Pressable>
          </Link>
        </KeyboardAvoidingView>
      </SafeAreaView>
    </AuthBackground>
  );
}
