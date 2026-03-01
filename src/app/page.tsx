import { Metadata } from 'next';
import { Suspense } from 'react';

import { Sparkles } from 'lucide-react';

import ContinueReading from '@/components/home/continue-reading';
import HeroBanner from '@/components/home/hero-banner';
import MangaCard from '@/components/home/manga-card';
import RecentChapters from '@/components/home/recent-chapters';
import TopMangas from '@/components/home/top-mangas';
import Welcome from '@/components/welcome';

import { Button } from '@/components/ui/button';
import Manhwa from '@/services/actions/Manhwa';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'Página Inicial',
  description:
    'Seu portal para ler mangás e manhwas em português. Encontre lançamentos, clássicos e muito mais. Comece a ler agora!',
  openGraph: {
    title: 'Página Inicial',
    url: '/',
    description:
      'Seu portal para ler mangás e manhwas em português. Encontre lançamentos, clássicos e muito mais. Comece a ler agora!',
    locale: 'pt_BR',
  },
  twitter: {
    title: 'Página Inicial',
    description:
      'Seu portal para ler mangás e manhwas em português. Encontre lançamentos, clássicos e muito mais. Comece a ler agora!',
  },
  alternates: {
    canonical: '/',
  },
};

async function Home() {
  const manhwaService = new Manhwa();

  const [latestManhwas, recentChapters, topMangas] =
    await Promise.all([
      manhwaService.getLatest().catch(() => null),
      manhwaService
        .getRecentChapters(20)
        .catch(() => [] as TRecentChapter[]),
      manhwaService.getTopMangas(10).catch(() => [] as TManga[]),
    ]);

  const mangas = latestManhwas?.results || [];

  return (
    <main className="max-w-7xl mx-auto px-4 sm:px-8 pb-16">
      {/* Quote Banner */}
      <section className="mt-6">
        <Suspense>
          <Welcome />
        </Suspense>
      </section>

      {/* Hero Banner */}
      {mangas.length > 0 && (
        <section className="mt-8">
          <HeroBanner mangas={mangas} />
        </section>
      )}

      {/* Recent Chapters */}
      {recentChapters && recentChapters.length > 0 && (
        <section className="mt-12">
          <RecentChapters chapters={recentChapters} />
        </section>
      )}

      {/* Content grid: Top Mangas + Latest Added */}
      <div className="mt-12 grid grid-cols-1 lg:grid-cols-[1fr_340px] gap-10">
        <div className="flex flex-col min-w-0">
          {/* Continue Reading */}
          <ContinueReading />

          {/* Latest Mangas */}
          <section>
            <h2 className="section-header flex items-center gap-2 mb-5">
              <Sparkles className="w-5 h-5 text-primary" />
              Lançamento
            </h2>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {mangas.slice(0, 12).map((manga) => (
                <MangaCard key={manga.id} manga={manga} />
              ))}
            </div>
            <div className="flex justify-center mt-4">
              <Button>
                <Link href="/mangas">Ver todos os mangás</Link>
              </Button>
            </div>
          </section>
        </div>

        {/* Top Mangas sidebar */}
        {topMangas && topMangas.length > 0 && (
          <aside className="hidden lg:block">
            <TopMangas mangas={topMangas} />
          </aside>
        )}
      </div>

      {/* Top Mangas mobile (below content) */}
      {topMangas && topMangas.length > 0 && (
        <section className="mt-12 lg:hidden">
          <TopMangas mangas={topMangas} />
        </section>
      )}
    </main>
  );
}

export default Home;
