import { useState } from 'react';
import { router, useLocalSearchParams } from 'expo-router';
import { ScrollView, Text, View } from 'react-native';
import { Button, Input, Radio, Segmented, Switch, useToast } from '@/components/ui';
import { Icon } from '@/components/icons';
import { plans } from '@/lib/mockData';
import { getFieldErrors, nameSchema, emailSchema, phoneSchema } from '@/lib/validation';
import { z } from 'zod';

const steps = ['Dados pessoais', 'Plano e assinatura', 'Configurações'];

const personalInfoSchema = z.object({ name: nameSchema, email: emailSchema, phone: phoneSchema });

export default function StudentFormScreen() {
  const { id } = useLocalSearchParams<{ id?: string }>();
  const isEditing = Boolean(id);
  const { show } = useToast();

  const [step, setStep] = useState(0);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [height, setHeight] = useState('');
  const [weight, setWeight] = useState('');
  const [level, setLevel] = useState('Iniciante');
  const [errors, setErrors] = useState<Partial<Record<string, string>>>({});

  const [selectedPlan, setSelectedPlan] = useState(plans[1].name);

  const [emailNotifications, setEmailNotifications] = useState(true);
  const [appNotifications, setAppNotifications] = useState(true);
  const [notes, setNotes] = useState('');

  function goNext() {
    if (step === 0) {
      const fieldErrors = getFieldErrors(personalInfoSchema, { name, email, phone });
      setErrors(fieldErrors);
      if (Object.keys(fieldErrors).length > 0) return;
    }
    if (step < steps.length - 1) setStep((s) => s + 1);
  }

  function handleSave() {
    show({
      title: isEditing ? 'Aluno atualizado' : 'Aluno cadastrado',
      description: name || undefined,
      tone: 'success',
    });
    router.back();
  }

  return (
    <ScrollView contentContainerClassName="gap-6 pb-8" showsVerticalScrollIndicator={false}>
      <View>
        <Text style={{ fontFamily: 'Inter_600SemiBold' }} className="text-h2 text-text">
          {isEditing ? 'Editar Aluno' : 'Cadastrar Aluno'}
        </Text>
        <Text className="text-[13px] text-muted">Preencha os dados e o plano do aluno.</Text>
      </View>

      <View className="flex-row gap-2">
        {steps.map((label, i) => (
          <View key={label} className="flex-1 gap-1.5">
            <View className={`h-1 rounded-full ${i <= step ? 'bg-primary' : 'bg-surface-2'}`} />
            <Text className={`font-medium text-[11px] ${i === step ? 'text-primary' : 'text-muted'}`}>
              {i + 1}. {label}
            </Text>
          </View>
        ))}
      </View>

      {step === 0 && (
        <View className="gap-4">
          <Input
            label="Nome completo *"
            value={name}
            onChangeText={(v) => {
              setName(v);
              if (errors.name) setErrors((e) => ({ ...e, name: undefined }));
            }}
            placeholder="Nome completo do aluno"
            status={errors.name ? 'error' : 'default'}
            hint={errors.name}
          />
          <Input
            label="E-mail *"
            value={email}
            onChangeText={(v) => {
              setEmail(v);
              if (errors.email) setErrors((e) => ({ ...e, email: undefined }));
            }}
            placeholder="seu@email.com"
            autoCapitalize="none"
            keyboardType="email-address"
            leading={<Icon name="mail" size={16} color="#8d8d8d" />}
            status={errors.email ? 'error' : 'default'}
            hint={errors.email}
          />
          <Input
            label="Telefone *"
            value={phone}
            onChangeText={(v) => {
              setPhone(v);
              if (errors.phone) setErrors((e) => ({ ...e, phone: undefined }));
            }}
            placeholder="(XX) XXXXX-XXXX"
            keyboardType="phone-pad"
            status={errors.phone ? 'error' : 'default'}
            hint={errors.phone}
          />
          <View className="flex-row gap-4">
            <View className="flex-1">
              <Input
                label="Altura (cm)"
                value={height}
                onChangeText={setHeight}
                keyboardType="numeric"
                placeholder="180"
              />
            </View>
            <View className="flex-1">
              <Input
                label="Peso (kg)"
                value={weight}
                onChangeText={setWeight}
                keyboardType="numeric"
                placeholder="82"
              />
            </View>
          </View>
          <View className="gap-1.5">
            <Text className="font-medium text-[13px] text-text">Nível de experiência</Text>
            <Segmented options={['Iniciante', 'Intermediário', 'Avançado']} value={level} onChange={setLevel} full />
          </View>
        </View>
      )}

      {step === 1 && (
        <View className="gap-3">
          {plans.map((p) => (
            <View
              key={p.name}
              className={`flex-row items-center gap-3 rounded-lg border p-4 ${selectedPlan === p.name ? 'border-primary bg-primary-soft' : 'border-line-strong bg-surface'}`}
            >
              <Radio selected={selectedPlan === p.name} onPress={() => setSelectedPlan(p.name)} />
              <View className="flex-1">
                <Text style={{ fontFamily: 'Inter_600SemiBold' }} className="text-sm text-text">
                  {p.name}
                </Text>
                <Text className="text-xs text-muted">{p.features.join(' · ')}</Text>
              </View>
              <Text style={{ fontFamily: 'Inter_600SemiBold' }} className="text-sm tabular-nums text-text">
                {p.price}
                <Text className="text-xs font-normal text-muted">{p.period}</Text>
              </Text>
            </View>
          ))}
        </View>
      )}

      {step === 2 && (
        <View className="gap-4">
          <View className="flex-row items-center justify-between rounded-lg border border-line bg-surface p-3.5">
            <View>
              <Text className="font-medium text-[13px] text-text">Notificações por e-mail</Text>
              <Text className="text-xs text-muted">Enviar lembretes de treino e cobrança</Text>
            </View>
            <Switch value={emailNotifications} onChange={setEmailNotifications} />
          </View>
          <View className="flex-row items-center justify-between rounded-lg border border-line bg-surface p-3.5">
            <View>
              <Text className="font-medium text-[13px] text-text">Notificações no app</Text>
              <Text className="text-xs text-muted">Avisos de novos treinos e mensagens</Text>
            </View>
            <Switch value={appNotifications} onChange={setAppNotifications} />
          </View>
          <Input
            label="Observações"
            value={notes}
            onChangeText={setNotes}
            placeholder="Ex.: lesão no ombro, restrições..."
            multiline
          />
        </View>
      )}

      <View className="flex-row justify-end gap-2">
        <Button variant="ghost" onPress={() => (step === 0 ? router.back() : setStep((s) => s - 1))}>
          {step === 0 ? 'Cancelar' : 'Voltar'}
        </Button>
        {step < steps.length - 1 ? (
          <Button onPress={goNext} icon={<Icon name="chevronRight" size={16} color="#ffffff" />} iconPosition="right">
            Próximo
          </Button>
        ) : (
          <Button onPress={handleSave}>Salvar</Button>
        )}
      </View>
    </ScrollView>
  );
}
