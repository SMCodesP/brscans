import Link from 'next/link';

import { ChapterDescription } from '@/components/chapter/description';
import ContainerAnimation from '@/components/ui/container-animation';
import Manhwa from '@/services/actions/Manhwa';
import Image from 'next/image';
import { Suspense } from 'react';

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
            <Image
              src={data?.thumbnail?.original}
              alt="Image thumbnail manga"
              className="w-full rounded-xl"
              fill
              unoptimized
            />
          </div>
        )}
        <div className="p-2 flex flex-1 flex-col gap-3">
          <p className="tracking-widest font-medium text-sm uppercase">
            LEIA A {data?.title}
          </p>
          <h1 className="text-4xl font-bold">{data?.title}</h1>
          <Suspense>
            <ChapterDescription manga={data} />
          </Suspense>
        </div>
      </div>

      <div className="mt-8">
        <h2 className="text-2xl font-bold">Capítulos</h2>
        <ul className="flex flex-wrap gap-4 mt-2">
          {data?.chapters.map((chapter, index) => (
            <Link
              href={`/manga/${data.id}/chapter/${chapter.id}/`}
              key={chapter.id}
              prefetch={false}
            >
              <ContainerAnimation
                delay={index * 0.01}
                distance={[100, 0]}
              >
                <li
                  key={chapter.id}
                  className="text-center w-72 p-2 border border-primary/10 hover:bg-primary/10 hover:border-primary rounded-md transition-all"
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
export const revalidate = 36000;

export default Manga;
