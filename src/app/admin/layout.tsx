import type { Metadata } from 'next';
import { redirect } from 'next/navigation';

import { fetcher } from '@/services/api-server';

export const metadata: Metadata = { title: 'Painel' };

async function AdminLayout({
  children,
}: { children: React.ReactNode }) {
  // revalidate: 0 — o cache de fetch é por URL e não enxerga o cookie do
  // token; com cache, o /auth/me de um staff serviria para outra pessoa.
  const user = await fetcher<{ is_staff?: boolean }>(
    'auth/me',
    undefined,
    undefined,
    0
  ).catch(() => null);

  // A guarda real é do backend (IsAdminUser); isto só tira a tela de quem
  // não é staff, para não mostrar um painel que só daria 403.
  if (!user?.is_staff) redirect('/');

  return children;
}

export default AdminLayout;
