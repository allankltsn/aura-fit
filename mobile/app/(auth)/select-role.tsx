import { useState } from 'react';
import { Pressable, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Logo } from '@/components/brand';
import { Button, Radio } from '@/components/ui';
import { Icon, type IconName } from '@/components/icons';
import { cn } from '@/lib/cn';

const roleOptions: { key: string; label: string; description: string; icon: IconName }[] = [
  {
    key: 'trainer',
    label: 'Personal Trainer',
    description: 'Gerencie seus alunos, treinos e finanças.',
    icon: 'dumbbell',
  },
  { key: 'student', label: 'Aluno', description: 'Acesse seus treinos, progresso e informações.', icon: 'users' },
  {
    key: 'admin',
    label: 'Administrador',
    description: 'Gerencie a plataforma, usuários e configurações.',
    icon: 'settings',
  },
];

/** Shown when an account has more than one profile — kit's "Selecione seu perfil". */
export default function SelectRoleScreen() {
  const [selected, setSelected] = useState(roleOptions[0].key);

  return (
    <SafeAreaView className="flex-1 justify-center gap-6 bg-bg px-6">
      <Logo size={28} variant="on-light" />

      <View className="gap-1.5">
        <Text style={{ fontFamily: 'Inter_600SemiBold' }} className="text-h2 text-text">
          Selecione seu perfil
        </Text>
        <Text className="text-[13px] text-muted">
          Você possui mais de um perfil de acesso. Escolha com qual deseja continuar.
        </Text>
      </View>

      <View className="gap-3">
        {roleOptions.map((role) => {
          const active = role.key === selected;
          return (
            <Pressable
              key={role.key}
              onPress={() => setSelected(role.key)}
              className={cn(
                'flex-row items-center gap-3 rounded-lg border p-4',
                active ? 'border-primary bg-primary-soft' : 'border-line bg-surface'
              )}
            >
              <View
                className={cn(
                  'h-11 w-11 items-center justify-center rounded-md',
                  active ? 'bg-primary' : 'bg-surface-2'
                )}
              >
                <Icon name={role.icon} size={22} color={active ? '#ffffff' : '#666666'} />
              </View>
              <View className="flex-1 gap-0.5">
                <Text style={{ fontFamily: 'Inter_600SemiBold' }} className="text-sm text-text">
                  {role.label}
                </Text>
                <Text className="text-xs text-muted">{role.description}</Text>
              </View>
              <Radio selected={active} onPress={() => setSelected(role.key)} />
            </Pressable>
          );
        })}
      </View>

      <Button size="lg" block>
        Continuar
      </Button>
    </SafeAreaView>
  );
}
