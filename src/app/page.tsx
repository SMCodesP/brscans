import { unstable_ViewTransition as ViewTransition } from 'react';

import Image from 'next/image';
import Link from 'next/link';

import Welcome from '@/components/Welcome';

import Manhwa from '@/services/actions/Manhwa';

async function Home() {
  const latestManhwas = await new Manhwa().getLatest();

  return (
    <main className="px-2 sm:px-12">
      <div className="grid grid-cols-3 gap-12">
        <div className="col-span-3 sm:col-span-2">
          <Welcome />
        </div>
        {/* <div>
          <h2 className="text-2xl font-bold mb-4">Últimos lidos</h2>
          <ul>
            <li>

            </li>
          </ul>
        </div> */}
      </div>

      <div className="mt-12">
        <h2 className="text-2xl font-bold mb-4 text-center sm:text-start">
          Últimos mangas adicionados
        </h2>
        <ul className="grid grid-cols-[repeat(auto-fill,minmax(200px,1fr))] gap-6">
          {latestManhwas?.results?.map((manhwa) => (
            <Link href={`/manga/${manhwa.id}/`} key={manhwa.id}>
              <li className="flex flex-col gap-1 group w-full">
                <div className="aspect-6/8 w-full overflow-hidden rounded-lg">
                  <ViewTransition name={`manhwa-${manhwa.id}`}>
                    <Image
                      src={String(manhwa?.thumbnail?.original)}
                      width={200}
                      height={300}
                      alt={manhwa.title}
                      className="bg-gray-200 dark:bg-gray-800 group-hover:brightness-75 group-hover:scale-105 transition-all w-full duration-500"
                      unoptimized
                    />
                  </ViewTransition>
                </div>
                <ViewTransition name={`manhwa-title-${manhwa.id}`}>
                  <h3 className="text-base text-slate-500 font-semibold">
                    {manhwa.title}
                  </h3>
                </ViewTransition>
              </li>
            </Link>
          ))}
        </ul>
      </div>
    </main>
  );
}

export const revalidate = 120;

export default Home;
