'use client';

import Image from 'next/image';
import useSWR from 'swr';

function Manga({ params }: { params: { id: string } }) {
  const { data, isLoading: isFetching } = useSWR<TManga>(
    `/manhwas/${params.id}/`
  );

  return (
    <div className="px-16">
      <div className="flex gap-8">
        {data?.thumbnail.original && (
          <div className="relative aspect-[7/10] w-64">
            <Image
              src={data?.thumbnail.original}
              alt="Image thumbnail manga"
              className="w-full rounded-xl"
              fill
              unoptimized
            />
          </div>
        )}
        <div className="p-2 flex flex-col gap-3">
          <p className="tracking-widest font-medium text-sm uppercase">
            LEIA A {data?.title}
          </p>
          <h1 className="text-4xl font-bold">{data?.title}</h1>
        </div>
      </div>
    </div>
  );
}

export const revalidate = 30;

export default Manga;
