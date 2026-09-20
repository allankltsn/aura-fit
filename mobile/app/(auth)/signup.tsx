import { useState } from 'react';
import { Link } from 'expo-router';
import { KeyboardAvoidingView, Platform, Pressable, ScrollView, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Logo } from '@/components/brand';
import { Button, Checkbox, Input, Segmented } from '@/components/ui';
import { Icon } from '@/components/icons';
import { getFieldErrors, signupSchema } from '@/lib/validation';

const roles = ['Personal Trainer', 'Aluno', 'Admin'];

export default function SignupScreen() {
  const [role, setRole] = useState(roles[0]);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [acceptedTerms, setAcceptedTerms] = useState(false);
  const [errors, setErrors] = useState<Partial<Record<string, string>>>({});

  function clearError(field: string) {
    if (errors[field]) setErrors((e) => ({ ...e, [field]: undefined }));
  }

  function handleSubmit() {
    const fieldErrors = getFieldErrors(signupSchema, { name, email, phone, password, confirmPassword, acceptedTerms });
    setErrors(fieldErrors);
    if (Object.keys(fieldErrors).length > 0) return;
    // TODO: wire up to the auth API once it exists.
  }

  return (
    <SafeAreaView className="flex-1 bg-bg">
      <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : undefined} className="flex-1">
        <ScrollView contentContainerClassName="gap-6 px-6 pb-8 pt-4" keyboardShouldPersistTaps="handled">
          <Logo size={28} variant="on-light" />

          <View className="gap-1.5">
            <Text className="text-h2 text-text" style={{ fontFamily: 'Inter_600SemiBold' }}>
              Comece sua jornada com o aura-fit
            </Text>
            <Text className="text-[13px] text-muted">
              Crie sua conta e tenha acesso a todas as ferramentas para gerenciar seus alunos e potencializar
              resultados.
            </Text>
          </View>

          <Segmented options={roles} value={role} onChange={setRole} full />

          <View className="gap-4">
            <Input
              label="Nome completo"
              value={name}
              onChangeText={(v) => {
                setName(v);
                clearError('name');
              }}
              placeholder="Seu nome completo"
              autoComplete="name"
              status={errors.name ? 'error' : 'default'}
              hint={errors.name}
            />
            <Input
              label="E-mail"
              value={email}
              onChangeText={(v) => {
                setEmail(v);
                clearError('email');
              }}
              placeholder="seu@email.com"
              autoCapitalize="none"
              autoComplete="email"
              keyboardType="email-address"
              leading={<Icon name="mail" size={16} color="#8d8d8d" />}
              status={errors.email ? 'error' : 'default'}
              hint={errors.email}
            />
            <Input
              label="Telefone"
              value={phone}
              onChangeText={(v) => {
                setPhone(v);
                clearError('phone');
              }}
              placeholder="(XX) XXXXX-XXXX"
              keyboardType="phone-pad"
              autoComplete="tel"
              status={errors.phone ? 'error' : 'default'}
              hint={errors.phone}
            />
            <Input
              label="Senha"
              value={password}
              onChangeText={(v) => {
                setPassword(v);
                clearError('password');
              }}
              placeholder="Crie uma senha"
              secureTextEntry
              autoComplete="password-new"
              leading={<Icon name="lock" size={16} color="#8d8d8d" />}
              status={errors.password ? 'error' : 'default'}
              hint={errors.password ?? 'Mínimo de 8 caracteres, com letras e números.'}
            />
            <Input
              label="Confirmar senha"
              value={confirmPassword}
              onChangeText={(v) => {
                setConfirmPassword(v);
                clearError('confirmPassword');
              }}
              placeholder="Confirme sua senha"
              secureTextEntry
              autoComplete="password-new"
              leading={<Icon name="lock" size={16} color="#8d8d8d" />}
              status={errors.confirmPassword ? 'error' : 'default'}
              hint={errors.confirmPassword}
            />
          </View>

          <View className="gap-1.5">
            <Pressable className="flex-row items-start gap-2.5" onPress={() => setAcceptedTerms((v) => !v)}>
              <Checkbox checked={acceptedTerms} onChange={setAcceptedTerms} />
              <Text className="flex-1 text-xs text-muted">
                Li e aceito os{' '}
                <Link href="/(legal)/terms" asChild>
                  <Text className="font-semibold text-primary">Termos de Uso</Text>
                </Link>{' '}
                e a{' '}
                <Link href="/(legal)/privacy" asChild>
                  <Text className="font-semibold text-primary">Política de Privacidade</Text>
                </Link>
                .
              </Text>
            </Pressable>
            {errors.acceptedTerms ? <Text className="text-xs text-primary">{errors.acceptedTerms}</Text> : null}
          </View>

          <Button size="lg" block onPress={handleSubmit}>
            Criar conta
          </Button>

          <View className="flex-row justify-center gap-1.5">
            <Text className="text-[13px] text-muted">Já tem uma conta?</Text>
            <Link href="/(auth)/login" asChild>
              <Pressable hitSlop={8}>
                <Text className="font-semibold text-[13px] text-primary">Faça login</Text>
              </Pressable>
            </Link>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}
