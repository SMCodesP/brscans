import type { Metadata } from 'next';
import Link from 'next/link';

import { AdminChapters } from '@/components/admin/admin-chapters';

export const metadata: Metadata = { title: 'Manga - Painel' };

async function AdminMangaPage({
  params,
}: { params: Promise<{ id: string }> }) {
  const { id } = await params;

  return (
    <main className="mx-auto max-w-7xl px-4 py-8 pb-16 sm:px-8">
      <Link
        href="/admin"
        className="mb-4 inline-block text-sm text-muted-foreground hover:text-foreground"
      >
        ← Voltar ao painel
      </Link>
      <AdminChapters manhwaId={Number(id)} />
    </main>
  );
}

export default AdminMangaPage;
