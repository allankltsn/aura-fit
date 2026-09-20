import { useState } from 'react';
import { Link } from 'expo-router';
import { KeyboardAvoidingView, Platform, Pressable, ScrollView, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Logo } from '@/components/brand';
import { Button, Checkbox, Input, Segmented } from '@/components/ui';
import { Icon } from '@/components/icons';

const roles = ['Personal Trainer', 'Aluno', 'Admin'];

export default function SignupScreen() {
  const [role, setRole] = useState(roles[0]);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [acceptedTerms, setAcceptedTerms] = useState(false);

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
              Crie sua conta e tenha acesso a todas as ferramentas para gerenciar seus alunos e potencializar resultados.
            </Text>
          </View>

          <Segmented options={roles} value={role} onChange={setRole} full />

          <View className="gap-4">
            <Input label="Nome completo" value={name} onChangeText={setName} placeholder="Seu nome completo" />
            <Input
              label="E-mail"
              value={email}
              onChangeText={setEmail}
              placeholder="seu@email.com"
              autoCapitalize="none"
              keyboardType="email-address"
              leading={<Icon name="mail" size={16} color="#8d8d8d" />}
            />
            <Input label="Telefone" value={phone} onChangeText={setPhone} placeholder="(XX) XXXXX-XXXX" keyboardType="phone-pad" />
            <Input
              label="Senha"
              value={password}
              onChangeText={setPassword}
              placeholder="Crie uma senha"
              secureTextEntry
              leading={<Icon name="lock" size={16} color="#8d8d8d" />}
            />
            <Input
              label="Confirmar senha"
              value={confirmPassword}
              onChangeText={setConfirmPassword}
              placeholder="Confirme sua senha"
              secureTextEntry
              leading={<Icon name="lock" size={16} color="#8d8d8d" />}
            />
          </View>

          <Pressable className="flex-row items-start gap-2.5" onPress={() => setAcceptedTerms((v) => !v)}>
            <Checkbox checked={acceptedTerms} onChange={setAcceptedTerms} />
            <Text className="flex-1 text-xs text-muted">
              Li e aceito os <Text className="font-semibold text-primary">Termos de Uso</Text> e a{' '}
              <Text className="font-semibold text-primary">Política de Privacidade</Text>.
            </Text>
          </Pressable>

          <Button size="lg" block disabled={!acceptedTerms}>
            Criar conta
          </Button>

          <View className="flex-row justify-center gap-1.5">
            <Text className="text-[13px] text-muted">Já tem uma conta?</Text>
            <Link href="/(auth)/login" asChild>
              <Pressable hitSlop={8}>
                <Text className="text-[13px] font-semibold text-primary">Faça login</Text>
              </Pressable>
            </Link>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}
