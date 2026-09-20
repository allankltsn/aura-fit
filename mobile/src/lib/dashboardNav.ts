import type { SidebarItem } from '@/components/navigation';

/** Single source of truth for the trainer dashboard's primary navigation. */
export const dashboardNavItems: SidebarItem[] = [
  { key: 'home', label: 'Início', icon: 'home' },
  { key: 'students', label: 'Alunos', icon: 'users' },
  { key: 'exercises', label: 'Treinos', icon: 'dumbbell' },
  { key: 'finance', label: 'Financeiro', icon: 'card' },
  { key: 'permissions', label: 'Permissões', icon: 'settings' },
];

/**
 * Maps the current pathname to a nav item key, or '' when the current
 * screen (e.g. /profile) isn't one of the primary sections — the sidebar
 * then correctly shows no item as active instead of guessing. Route
 * groups like `(dashboard)` never appear in `usePathname()` output — only
 * the segment after that matters here.
 */
export function dashboardKeyFromPathname(pathname: string): string {
  const segment = pathname.split('/').filter(Boolean)[0] ?? '';
  if (segment === '' || segment === 'home') return 'home';
  if (segment === 'students') return 'students';
  if (segment === 'exercises') return 'exercises';
  if (segment === 'finance') return 'finance';
  if (segment === 'permissions') return 'permissions';
  return '';
}
