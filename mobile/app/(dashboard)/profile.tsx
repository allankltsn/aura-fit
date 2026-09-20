import { useState } from 'react';
import { ScrollView, Text, View } from 'react-native';
import { Avatar, Button, EmptyState, Input, Switch, Tabs, useToast } from '@/components/ui';
import { trainer } from '@/lib/mockData';

const tabs = ['Perfil', 'Segurança', 'Notificações'];

export default function ProfileScreen() {
  const [tab, setTab] = useState(tabs[0]);
  const [name, setName] = useState(trainer.name);
  const [email, setEmail] = useState('rafael@email.com');
  const [phone, setPhone] = useState('(11) 98765-4321');
  const [bio, setBio] = useState('Personal trainer com foco em hipertrofia e condicionamento.');
  const [emailNotifications, setEmailNotifications] = useState(true);
  const [pushNotifications, setPushNotifications] = useState(true);
  const { show } = useToast();

  return (
    <ScrollView contentContainerClassName="gap-6 pb-8" showsVerticalScrollIndicator={false}>
      <View>
        <Text style={{ fontFamily: 'Inter_600SemiBold' }} className="text-h2 text-text">
          Meu Perfil
        </Text>
        <Text className="text-[13px] text-muted">Gerencie suas informações pessoais.</Text>
      </View>

      <Tabs options={tabs} value={tab} onChange={setTab} />

      {tab === 'Perfil' && (
        <View className="gap-5">
          <View className="flex-row items-center gap-4">
            <Avatar initials={trainer.initials} tone={3} size={64} />
            <Button variant="secondary" size="sm">
              Alterar foto
            </Button>
          </View>
          <Input label="Nome completo" value={name} onChangeText={setName} />
          <Input
            label="E-mail"
            value={email}
            onChangeText={setEmail}
            autoCapitalize="none"
            keyboardType="email-address"
          />
          <Input label="Telefone" value={phone} onChangeText={setPhone} keyboardType="phone-pad" />
          <Input label="Bio" value={bio} onChangeText={setBio} multiline />
          <Button block onPress={() => show({ title: 'Perfil atualizado', tone: 'success' })}>
            Salvar alterações
          </Button>
        </View>
      )}

      {tab === 'Segurança' && (
        <EmptyState
          icon="lock"
          title="Segurança da conta"
          description="Troca de senha e autenticação em dois fatores ficarão disponíveis aqui assim que o backend de auth estiver integrado."
        />
      )}

      {tab === 'Notificações' && (
        <View className="gap-3">
          <View className="flex-row items-center justify-between rounded-lg border border-line bg-surface p-3.5">
            <View>
              <Text className="font-medium text-[13px] text-text">Notificações por e-mail</Text>
              <Text className="text-xs text-muted">Resumo semanal e cobranças</Text>
            </View>
            <Switch value={emailNotifications} onChange={setEmailNotifications} />
          </View>
          <View className="flex-row items-center justify-between rounded-lg border border-line bg-surface p-3.5">
            <View>
              <Text className="font-medium text-[13px] text-text">Notificações push</Text>
              <Text className="text-xs text-muted">Mensagens de alunos e lembretes</Text>
            </View>
            <Switch value={pushNotifications} onChange={setPushNotifications} />
          </View>
        </View>
      )}
    </ScrollView>
  );
}
