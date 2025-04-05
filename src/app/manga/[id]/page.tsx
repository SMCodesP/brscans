import Manhwa from '@/services/actions/Manhwa';
import Image from 'next/image';
import Link from 'next/link';
import useSWR from 'swr';

async function Manga({
  params,
}: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const data = await new Manhwa().get(id);

  return (
    <div className="px-2 md:px-12">
      <div className="flex flex-col md:flex-row gap-8 items-center md:items-start">
        {data?.thumbnail?.original && (
          <div className="relative aspect-[7/10] w-64">
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
          <p>
            <strong>Descrição:</strong> {data?.description}
          </p>
        </div>
      </div>

      <div className="mt-8">
        <h2 className="text-2xl font-bold">Capítulos</h2>
        <ul className="grid grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4 mt-2">
          {data?.chapters.map((chapter) => (
            <Link
              href={`/manga/${data.id}/chapter/${chapter.id}/`}
              key={chapter.id}
            >
              <li
                key={chapter.id}
                className="text-center p-2 border border-primary/10 hover:bg-primary/10 hover:border-primary rounded-md transition-all"
              >
                <p>{chapter.title}</p>
              </li>
            </Link>
          ))}
        </ul>
      </div>
    </div>
  );
}

export const experimental_ppr = true;
export const revalidate = 120;

export default Manga;
