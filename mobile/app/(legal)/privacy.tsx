import { ScrollView, Text, View } from 'react-native';

const sections = [
  {
    title: '1. Dados Coletados',
    body: 'Coletamos nome, e-mail, telefone e dados de treino fornecidos por você ou pelo seu personal trainer para operar a plataforma.',
  },
  {
    title: '2. Uso dos Dados',
    body: 'Usamos seus dados para gerenciar sua conta, gerar prescrições de treino e processar pagamentos. Não vendemos seus dados a terceiros.',
  },
  {
    title: '3. Base Legal (LGPD)',
    body: 'O tratamento de dados segue a Lei Geral de Proteção de Dados (Lei nº 13.709/2018), com base no consentimento e na execução do contrato de uso da plataforma.',
  },
  {
    title: '4. Seus Direitos',
    body: 'Você pode solicitar acesso, correção ou exclusão dos seus dados a qualquer momento pelo painel de Configurações ou pelo nosso suporte.',
  },
  {
    title: '5. Segurança',
    body: 'Senhas e tokens de acesso são armazenados de forma criptografada. Nunca compartilhamos suas credenciais com terceiros.',
  },
];

/**
 * Placeholder legal copy for the design system — not reviewed legal text.
 * Swap for the real Privacy Policy (and a real DPO contact) before shipping.
 */
export default function PrivacyScreen() {
  return (
    <ScrollView contentContainerClassName="gap-5 pb-8" showsVerticalScrollIndicator={false}>
      <View>
        <Text style={{ fontFamily: 'Inter_600SemiBold' }} className="text-h2 text-text">
          Política de Privacidade
        </Text>
        <Text className="text-xs text-muted">Última atualização: 12 de abril de 2025</Text>
      </View>

      {sections.map((s) => (
        <View key={s.title} className="gap-1.5">
          <Text style={{ fontFamily: 'Inter_600SemiBold' }} className="text-base text-text">
            {s.title}
          </Text>
          <Text className="text-[13px] leading-5 text-muted">{s.body}</Text>
        </View>
      ))}
    </ScrollView>
  );
}
