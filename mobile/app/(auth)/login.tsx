import { useState } from 'react';
import { Link } from 'expo-router';
import { KeyboardAvoidingView, Platform, Pressable, ScrollView, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { AuthBackground, Logo } from '@/components/brand';
import { AuthField, Button, Checkbox } from '@/components/ui';
import { AppleIcon, GoogleIcon } from '@/components/icons';
import { getFieldErrors, loginSchema } from '@/lib/validation';

export default function LoginScreen() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [remember, setRemember] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState<Partial<Record<string, string>>>({});

  function handleSubmit() {
    const fieldErrors = getFieldErrors(loginSchema, { email, password });
    setErrors(fieldErrors);
    if (Object.keys(fieldErrors).length > 0) return;
    // TODO: wire up to the auth API once it exists.
  }

  return (
    <AuthBackground>
      <SafeAreaView className="flex-1">
        <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : undefined} className="flex-1">
          <ScrollView
            contentContainerClassName="flex-grow justify-end gap-6 px-6 pb-8 pt-16"
            keyboardShouldPersistTaps="handled"
          >
            <View className="gap-3">
              <Logo size={40} variant="on-dark" />
              <Text style={{ fontFamily: 'Inter_600SemiBold' }} className="text-h2 text-white">
                Treine. Evolua. Conquiste.
              </Text>
              <Text className="text-[13px] text-ink-400">Acesse sua conta para continuar.</Text>
            </View>

            <View className="gap-4">
              <AuthField
                label="E-mail ou usuário"
                icon="mail"
                value={email}
                onChangeText={(v) => {
                  setEmail(v);
                  if (errors.email) setErrors((e) => ({ ...e, email: undefined }));
                }}
                placeholder="seu@email.com"
                autoCapitalize="none"
                autoComplete="email"
                keyboardType="email-address"
                error={errors.email}
              />

              <AuthField
                label="Senha"
                icon="lock"
                value={password}
                onChangeText={(v) => {
                  setPassword(v);
                  if (errors.password) setErrors((e) => ({ ...e, password: undefined }));
                }}
                placeholder="Digite sua senha"
                autoComplete="password"
                secureTextEntry={!showPassword}
                error={errors.password}
                trailing={
                  <Pressable onPress={() => setShowPassword((v) => !v)} hitSlop={8}>
                    <Text className="font-medium text-xs text-ink-400">{showPassword ? 'Ocultar' : 'Mostrar'}</Text>
                  </Pressable>
                }
              />

              <View className="flex-row items-center justify-between">
                <View className="flex-row items-center gap-2">
                  <Checkbox checked={remember} onChange={setRemember} />
                  <Text className="text-xs text-ink-400">Lembrar de mim</Text>
                </View>
                <Link href="/(auth)/forgot-password" asChild>
                  <Pressable hitSlop={8}>
                    <Text className="font-semibold text-xs text-white">Esqueceu sua senha?</Text>
                  </Pressable>
                </Link>
              </View>
            </View>

            <View className="gap-3">
              <Button size="lg" block onPress={handleSubmit}>
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
                  <Text className="font-semibold text-[13px] text-white">Cadastre-se</Text>
                </Pressable>
              </Link>
            </View>
          </ScrollView>
        </KeyboardAvoidingView>
      </SafeAreaView>
    </AuthBackground>
  );
}
