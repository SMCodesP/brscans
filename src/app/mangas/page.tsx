import { Metadata } from 'next';

import { BookOpen } from 'lucide-react';

import MangaCard from '@/components/home/MangaCard';
import Manhwa from '@/services/actions/Manhwa';

export const metadata: Metadata = {
  title: 'Todos os Mangás',
  description:
    'Navegue por todos os mangás e manhwas disponíveis na BRScans. Encontre sua próxima leitura.',
  openGraph: {
    title: 'Todos os Mangás',
    url: '/mangas',
    description:
      'Navegue por todos os mangás e manhwas disponíveis na BRScans.',
    locale: 'pt_BR',
  },
  alternates: {
    canonical: '/mangas',
  },
};

async function MangasPage() {
  const manhwaService = new Manhwa();
  const data = await manhwaService.getLatest();
  const mangas = data?.results || [];

  return (
    <main className="max-w-7xl mx-auto px-4 sm:px-8 py-8 pb-16">
      {/* Header */}
      <div className="flex items-center gap-3 mb-8">
        <BookOpen className="w-7 h-7 text-primary" />
        <h1 className="text-3xl font-extrabold tracking-tight">
          Todos os Mangás
        </h1>
      </div>

      {/* Grid */}
      {mangas.length > 0 ? (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
          {mangas.map((manga) => (
            <MangaCard key={manga.id} manga={manga} />
          ))}
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center py-20 text-muted-foreground">
          <BookOpen className="w-12 h-12 mb-4 opacity-50" />
          <p className="text-lg font-medium">
            Nenhum mangá encontrado
          </p>
        </div>
      )}
    </main>
  );
}

export const revalidate = 120;

export default MangasPage;
