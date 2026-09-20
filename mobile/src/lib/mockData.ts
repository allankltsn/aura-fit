/** Placeholder content mirroring the UI kit artifact's mock data — swap for real API data. */

export type Exercise = {
  id: string;
  name: string;
  muscle: string;
  sets: string;
  status: 'default' | 'active' | 'done';
};

export const todayWorkout = {
  id: 'a',
  name: 'Treino A – Superior',
  tags: 'Peito • Costas • Ombro',
  durationLabel: '4 exercícios • 45min',
  completed: 3,
  total: 4,
};

export const workoutExercises: Exercise[] = [
  { id: '1', name: 'Supino Reto', muscle: 'Peito', sets: '3 × 8–12', status: 'done' },
  { id: '2', name: 'Remada Curvada', muscle: 'Costas', sets: '3 × 8–12', status: 'done' },
  { id: '3', name: 'Desenvolvimento', muscle: 'Ombro', sets: '3 × 8–12', status: 'active' },
  { id: '4', name: 'Rosca Direta', muscle: 'Bíceps', sets: '3 × 8–12', status: 'default' },
];

export const upcomingWorkouts = [
  { id: 'b', name: 'Treino B – Inferior', when: 'Seg • 02/06' },
  { id: 'c', name: 'Treino C – Full Body', when: 'Qua • 04/06' },
];

export const chatMessages = [
  {
    id: 1,
    from: 'trainer' as const,
    text: 'Como está o treino de hoje? Conseguiu completar todos os exercícios?',
    time: '10:20',
  },
  { id: 2, from: 'me' as const, text: 'Sim! Finalizei tudo. Consegui aumentar a carga no supino.', time: '10:22' },
  {
    id: 3,
    from: 'trainer' as const,
    text: 'Ótimo! Amanhã vamos trabalhar o posterior de coxa. Qualquer dúvida, me avise!',
    time: '10:24',
  },
];

export const trainer = { name: 'Rafael Silva', role: 'Personal Trainer', initials: 'RS' as const };

export const plans = [
  { name: 'Mensal', price: 'R$ 197', period: '/mês', features: ['Até 5 alunos', 'Suporte básico', 'Acesso à IA'] },
  {
    name: 'Trimestral',
    price: 'R$ 547',
    period: '/3 meses',
    features: ['Até 20 alunos', 'Suporte prioritário', 'Acesso à IA'],
    highlight: 'pop' as const,
  },
  {
    name: 'Anual',
    price: 'R$ 1.897',
    period: '/ano',
    features: ['Alunos ilimitados', 'Suporte prioritário', 'Acesso à IA'],
  },
];

export const dashboardKpis = {
  totalStudents: 48,
  monthlyRevenue: 'R$ 8.450',
  activeSubscriptions: 42,
  averageRating: '4,9',
};

export const revenueByMonth = {
  months: ['Jan', 'Fev', 'Mar', 'Abr', 'Mai', 'Jun'],
  values: [3200, 3900, 4700, 6300, 7600, 8450],
};

export const transactions = [
  {
    id: '1',
    label: 'Assinatura Mensal',
    student: 'Lucas Ferreira',
    initials: 'LF',
    amount: 'R$ 197,00',
    date: '02/06/2025',
    tone: 0 as const,
  },
  {
    id: '2',
    label: 'Assinatura Trimestral',
    student: 'Gabriela Santos',
    initials: 'GS',
    amount: 'R$ 547,00',
    date: '01/06/2025',
    tone: 1 as const,
  },
  {
    id: '3',
    label: 'Plano Anual',
    student: 'Bruno Oliveira',
    initials: 'BO',
    amount: 'R$ 1.897,00',
    date: '31/05/2025',
    tone: 2 as const,
  },
  {
    id: '4',
    label: 'Assinatura Mensal',
    student: 'Juliana Costa',
    initials: 'JC',
    amount: 'R$ 197,00',
    date: '30/05/2025',
    tone: 3 as const,
  },
];

export const financeSummary = { monthRevenue: 'R$ 8.450', activeSubscriptions: 42, averageTicket: 'R$ 201' };

export const exerciseLibrary = [
  { id: '1', name: 'Supino Reto', muscle: 'Peito', level: 'Intermediário' },
  { id: '2', name: 'Agachamento Livre', muscle: 'Pernas', level: 'Intermediário' },
  { id: '3', name: 'Remada Curvada', muscle: 'Costas', level: 'Intermediário' },
  { id: '4', name: 'Desenvolvimento', muscle: 'Ombros', level: 'Intermediário' },
  { id: '5', name: 'Rosca Direta', muscle: 'Bíceps', level: 'Iniciante' },
  { id: '6', name: 'Tríceps na Polia', muscle: 'Tríceps', level: 'Iniciante' },
];

export const permissionRoles = [
  { id: '1', name: 'Personal Trainer', description: 'Acesso completo aos recursos do tenant', status: 'ok' as const },
  { id: '2', name: 'Aluno', description: 'Acesso limitado aos próprios dados', status: 'ok' as const },
  { id: '3', name: 'Administrador', description: 'Acesso total à plataforma', status: 'ok' as const },
];

export const students = [
  {
    id: '1',
    name: 'Lucas Ferreira',
    initials: 'LF',
    email: 'lucas@email.com',
    workout: 'Treino A',
    last: 'Hoje, 10:24',
    status: 'ok' as const,
    statusLabel: 'Ativo',
    tone: 0 as const,
  },
  {
    id: '2',
    name: 'Gabriela Santos',
    initials: 'GS',
    email: 'gabriela@email.com',
    workout: 'Treino B',
    last: 'Ontem, 18:32',
    status: 'ok' as const,
    statusLabel: 'Ativo',
    tone: 1 as const,
  },
  {
    id: '3',
    name: 'Bruno Oliveira',
    initials: 'BO',
    email: 'bruno@email.com',
    workout: 'Treino A',
    last: 'Ontem, 16:17',
    status: 'ok' as const,
    statusLabel: 'Ativo',
    tone: 2 as const,
  },
  {
    id: '4',
    name: 'Juliana Costa',
    initials: 'JC',
    email: 'juliana@email.com',
    workout: 'Treino C',
    last: '30/05/2025',
    status: 'warn' as const,
    statusLabel: 'Pendente',
    tone: 3 as const,
  },
  {
    id: '5',
    name: 'Felipe Almeida',
    initials: 'FA',
    email: 'felipe@email.com',
    workout: 'Treino B',
    last: '29/05/2025',
    status: 'neutral' as const,
    statusLabel: 'Inativo',
    tone: 0 as const,
  },
];
