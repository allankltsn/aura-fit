export type LegalDocKey = 'terms' | 'privacy' | 'lgpd' | 'platform-use' | 'payments' | 'help';

/**
 * Nav entries for the legal/help section — matches the brainstorm mockup's
 * sidebar. Only `terms` and `privacy` have real content; the rest are
 * listed but disabled rather than silently routing somewhere wrong.
 */
export const legalDocs: { key: LegalDocKey; label: string; route?: string }[] = [
  { key: 'terms', label: 'Termos de Uso', route: '/terms' },
  { key: 'privacy', label: 'Política de Privacidade', route: '/privacy' },
  { key: 'lgpd', label: 'LGPD' },
  { key: 'platform-use', label: 'Uso da Plataforma' },
  { key: 'payments', label: 'Pagamentos' },
  { key: 'help', label: 'Ajuda' },
];
