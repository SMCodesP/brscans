import { Suspense, ViewTransition } from 'react';

import Image from 'next/image';
import Link from 'next/link';

import { ChapterDescription } from '@/components/chapter/description';
import ContainerAnimation from '@/components/ui/container-animation';
import FavoriteButton from '@/components/ui/favorite-button';

import Manhwa from '@/services/actions/Manhwa';

async function Manga({
  params,
}: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const data = await new Manhwa().get(id);

  return (
    <main className="px-2 md:px-12 py-16">
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

      <div className="mt-8">
        <h2 className="text-2xl font-bold">Capítulos</h2>
        <ul className="grid grid-cols-[repeat(auto-fill,minmax(220px,1fr))] gap-3 mt-2">
          {data?.chapters.map((chapter, index) => {
            const chapterDate =
              chapter.created_at || chapter.release_date;
            const isRecent =
              chapterDate &&
              (() => {
                const diff =
                  (new Date().getTime() -
                    new Date(chapterDate).getTime()) /
                  (1000 * 60 * 60 * 24);
                return diff <= 3;
              })();

            return (
              <Link
                href={`/manga/${data.id}/chapter/${chapter.id}/`}
                key={chapter.id}
                prefetch={false}
                className="w-full"
              >
                <ContainerAnimation
                  delay={index * 0.01}
                  distance={[100, 0]}
                  className="w-full"
                >
                  <li className="flex items-center justify-between w-full p-2.5 border border-primary/10 hover:bg-primary/10 hover:border-primary rounded-md transition-all gap-2">
                    <p className="!line-clamp-1 overflow-hidden text-ellipsis text-sm font-medium">
                      {chapter.title}
                    </p>
                    <div className="flex items-center gap-1.5 flex-shrink-0">
                      {isRecent && (
                        <span className="px-1.5 py-0.5 text-[10px] font-bold uppercase bg-green-500 text-white rounded">
                          New
                        </span>
                      )}
                      {chapterDate && (
                        <span className="text-[10px] text-muted-foreground whitespace-nowrap">
                          {new Date(chapterDate).toLocaleDateString(
                            'pt-BR',
                            {
                              day: '2-digit',
                              month: 'short',
                            }
                          )}
                        </span>
                      )}
                    </div>
                  </li>
                </ContainerAnimation>
              </Link>
            );
          })}
        </ul>
      </div>
    </main>
  );
}

export const experimental_ppr = true;
export const revalidate = 30;

export default Manga;
