import { useState } from 'react';
import { Link } from 'expo-router';
import { KeyboardAvoidingView, Platform, Pressable, ScrollView, Text, TextInput, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { AuthBackground, Logo } from '@/components/brand';
import { Button, Checkbox } from '@/components/ui';
import { AppleIcon, GoogleIcon, Icon } from '@/components/icons';

export default function LoginScreen() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [remember, setRemember] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  return (
    <AuthBackground>
      <SafeAreaView className="flex-1">
        <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : undefined} className="flex-1">
          <ScrollView contentContainerClassName="flex-grow justify-end gap-6 px-6 pb-8 pt-16" keyboardShouldPersistTaps="handled">
            <View className="gap-3">
              <Logo size={40} variant="on-dark" />
              <Text style={{ fontFamily: 'Inter_600SemiBold' }} className="text-h2 text-white">
                Treine. Evolua. Conquiste.
              </Text>
              <Text className="text-[13px] text-ink-400">Acesse sua conta para continuar.</Text>
            </View>

            <View className="gap-4">
              <View className="gap-1.5">
                <Text className="text-[13px] font-medium text-white">E-mail ou usuário</Text>
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

              <View className="gap-1.5">
                <Text className="text-[13px] font-medium text-white">Senha</Text>
                <View className="h-10 flex-row items-center gap-2 rounded-sm border border-white/15 bg-white/5 px-3">
                  <Icon name="lock" size={16} color="#b0b0b0" />
                  <TextInput
                    value={password}
                    onChangeText={setPassword}
                    placeholder="Digite sua senha"
                    placeholderTextColor="#858585"
                    secureTextEntry={!showPassword}
                    className="flex-1 text-sm text-white"
                    style={{ fontFamily: 'Inter_400Regular' }}
                  />
                  <Pressable onPress={() => setShowPassword((v) => !v)} hitSlop={8}>
                    <Text className="text-xs font-medium text-ink-400">{showPassword ? 'Ocultar' : 'Mostrar'}</Text>
                  </Pressable>
                </View>
              </View>

              <View className="flex-row items-center justify-between">
                <View className="flex-row items-center gap-2">
                  <Checkbox checked={remember} onChange={setRemember} />
                  <Text className="text-xs text-ink-400">Lembrar de mim</Text>
                </View>
                <Link href="/(auth)/forgot-password" asChild>
                  <Pressable hitSlop={8}>
                    <Text className="text-xs font-semibold text-white">Esqueceu sua senha?</Text>
                  </Pressable>
                </Link>
              </View>
            </View>

            <View className="gap-3">
              <Button size="lg" block>
                Entrar
              </Button>

              <View className="flex-row items-center gap-3">
                <View className="h-px flex-1 bg-white/15" />
                <Text className="text-xs text-ink-400">ou</Text>
                <View className="h-px flex-1 bg-white/15" />
              </View>

              <Button variant="outlineWhite" size="lg" block icon={<GoogleIcon size={18} />}>
                Continuar com Google
              </Button>
              <Button variant="outlineWhite" size="lg" block icon={<AppleIcon size={18} color="#ffffff" />}>
                Continuar com Apple
              </Button>
            </View>

            <View className="flex-row justify-center gap-1.5">
              <Text className="text-[13px] text-ink-400">Não tem uma conta?</Text>
              <Link href="/(auth)/signup" asChild>
                <Pressable hitSlop={8}>
                  <Text className="text-[13px] font-semibold text-white">Cadastre-se</Text>
                </Pressable>
              </Link>
            </View>
          </ScrollView>
        </KeyboardAvoidingView>
      </SafeAreaView>
    </AuthBackground>
  );
}
