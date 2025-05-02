import {
  Suspense,
  unstable_ViewTransition as ViewTransition,
} from 'react';

import Image from 'next/image';
import Link from 'next/link';

import { ChapterDescription } from '@/components/chapter/description';
import ContainerAnimation from '@/components/ui/container-animation';

import Manhwa from '@/services/actions/Manhwa';

async function Manga({
  params,
}: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const data = await new Manhwa().get(id);

  return (
    <main className="px-2 md:px-12 pb-16">
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
        </div>
      </div>

      <div className="mt-8">
        <h2 className="text-2xl font-bold">Capítulos</h2>
        <ul className="grid grid-cols-[repeat(auto-fill,minmax(180px,1fr))] gap-3 mt-2">
          {data?.chapters.map((chapter, index) => (
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
                <li
                  key={chapter.id}
                  className="text-center w-full p-2 border border-primary/10 hover:bg-primary/10 hover:border-primary rounded-md transition-all"
                >
                  <p className="!line-clamp-1 overflow-hidden text-ellipsis *:inline">
                    {chapter.title}
                  </p>
                </li>
              </ContainerAnimation>
            </Link>
          ))}
        </ul>
      </div>
    </main>
  );
}

export const experimental_ppr = true;
export const revalidate = 30;

export default Manga;
