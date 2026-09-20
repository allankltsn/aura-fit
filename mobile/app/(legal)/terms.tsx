import { ScrollView, Text, View } from 'react-native';

const sections = [
  {
    title: '1. Aceitação dos Termos',
    body: 'Ao acessar e utilizar o aura-fit, você concorda em cumprir estes Termos de Uso e a nossa Política de Privacidade.',
  },
  {
    title: '2. Cadastro e Conta',
    body: 'Você é responsável por manter a confidencialidade das suas credenciais de acesso e por todas as atividades realizadas na sua conta.',
  },
  {
    title: '3. Uso da Plataforma',
    body: 'O aura-fit é destinado ao gerenciamento de alunos, treinos e assinaturas por personal trainers. É proibido usar a plataforma para fins ilícitos.',
  },
  {
    title: '4. Pagamentos e Assinaturas',
    body: 'Planos pagos são cobrados de forma recorrente conforme o ciclo escolhido. O cancelamento pode ser feito a qualquer momento pelo painel de Configurações.',
  },
  {
    title: '5. Responsabilidades',
    body: 'O aura-fit não substitui acompanhamento médico. Orientações geradas por IA devem ser revisadas por um profissional qualificado antes de serem aplicadas.',
  },
];

/**
 * Placeholder legal copy for the design system — not reviewed legal text.
 * Swap for the real Terms of Use before shipping.
 */
export default function TermsScreen() {
  return (
    <ScrollView contentContainerClassName="gap-5 pb-8" showsVerticalScrollIndicator={false}>
      <View>
        <Text style={{ fontFamily: 'Inter_600SemiBold' }} className="text-h2 text-text">
          Termos de Uso
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
