import { Suspense, ViewTransition } from 'react';

import Image from 'next/image';
import Link from 'next/link';

import { ChapterDescription } from '@/components/chapter/description';
import { ChapterList } from '@/components/manga/chapter-list';
import ContainerAnimation from '@/components/ui/container-animation';
import FavoriteButton from '@/components/ui/favorite-button';

import Manhwa from '@/services/actions/Manhwa';

async function Manga({
  params,
}: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const data = await new Manhwa().get(id);

  return (
    <main className="relative min-h-screen">
      {/* Background Blur */}
      {data?.thumbnail?.original && (
        <div
          className="absolute inset-x-0 top-0 h-[400px] w-full -z-10 opacity-20 dark:opacity-15 pointer-events-none"
          style={{
            backgroundImage: `url(${data.thumbnail.original})`,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            filter: 'blur(40px)',
            maskImage:
              'linear-gradient(to bottom, black 50%, transparent 100%)',
            WebkitMaskImage:
              'linear-gradient(to bottom, black 50%, transparent 100%)',
          }}
        />
      )}

      <div className="px-2 md:px-12 py-16 max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row gap-8 items-center md:items-start">
          {data?.thumbnail?.original && (
            <div className="relative aspect-7/10 w-64">
              <ViewTransition name={`manhwa-${data.id}`}>
                <Image
                  src={data?.thumbnail?.original}
                  alt="Image thumbnail manga"
                  className="w-full rounded-xl"
                  fill
                  unoptimized
                />
              </ViewTransition>
            </div>
          )}
          <div className="p-2 flex flex-1 flex-col gap-3">
            <p className="tracking-widest font-medium text-sm uppercase">
              LEIA A {data?.title}
            </p>
            <ViewTransition name={`manhwa-title-${data.id}`}>
              <h1 className="text-4xl font-bold">{data?.title}</h1>
            </ViewTransition>
            {data?.original_title &&
              data.original_title !== data.title && (
                <p className="text-lg text-foreground/50 font-medium -mt-1">
                  {data.original_title}
                </p>
              )}

            {/* Genre Pills */}
            {data?.genres && data.genres.length > 0 && (
              <div className="flex flex-wrap gap-2 mt-2 mb-1">
                {data.genres.map((genre) => (
                  <span
                    key={genre.id}
                    className="text-[11px] font-bold tracking-wide uppercase px-2.5 py-1 bg-primary/10 text-primary hover:bg-primary/20 transition-colors rounded-md cursor-default"
                  >
                    {genre.name}
                  </span>
                ))}
              </div>
            )}

            <Suspense>
              <ChapterDescription manga={data} />
            </Suspense>
            <div className="flex items-center gap-2 mt-1 flex-wrap">
              {data?.source && (
                <a
                  href={data.source}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 w-fit px-4 py-2 text-sm font-medium rounded-lg bg-secondary hover:bg-secondary/80 text-foreground/80 hover:text-foreground transition-colors"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="16"
                    height="16"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" />
                    <polyline points="15 3 21 3 21 9" />
                    <line x1="10" y1="14" x2="21" y2="3" />
                  </svg>
                  Scan Original
                </a>
              )}
              <FavoriteButton manhwaId={data.id} />
            </div>
          </div>
        </div>

        <ChapterList
          manhwaId={data.id}
          chapters={data?.chapters || []}
        />
      </div>
    </main>
  );
}

export default Manga;
