'use client';
import { Button } from '@/components/ui/button';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Loader } from 'lucide-react';
import Link from 'next/link';
import { useEffect, useMemo, useState } from 'react';
import useSWR from 'swr';

function Chapter({
  params,
}: { params: { cap_id: string; id: string } }) {
  const [refreshInterval, setRefreshInterval] = useState(0);
  const { data, isLoading: isFetching } = useSWR<TChapter>(
    `/chapters/${params.cap_id}/`,
    {
      refreshInterval,
    }
  );
  const { data: manhwa } = useSWR<TManga>(`/manhwas/${params.id}/`);
  const [type, setType] = useState<keyof TPage['images']>('original');

  const isTranslating = useMemo(() => {
    return data?.pages?.some(
      (page) => page.images.translated === null
    );
  }, [data?.pages]);

  const isLoading = useMemo(() => {
    return data?.pages?.some((page) => page.images.original === null);
  }, [data?.pages]);

  useEffect(() => {
    if (isTranslating || isLoading || data?.pages?.length === 0) {
      setRefreshInterval(1000);
    } else {
      setRefreshInterval(0);
    }
  }, [isTranslating, isLoading, data?.pages]);

  return (
    <div className="flex flex-col gap-8 py-4 items-center max-w-[800px] mx-auto">
      <Link href={`/manga/${params.id}/`}>
        <h2 className="text-2xl text-neutral-500 font-semibold hover:underline hover:text-neutral-700 transition-all">
          {manhwa?.title}
        </h2>
      </Link>
      <div className="flex justify-between w-full">
        <Link
          href={`/manga/${params.id}/chapter/${data?.previous?.id}`}
        >
          <Button>Anterior</Button>
        </Link>
        <h2 className="text-2xl text-neutral-500 font-semibold">
          {data?.title}
        </h2>
        <Link href={`/manga/${params.id}/chapter/${data?.next?.id}`}>
          <Button>Próximo</Button>
        </Link>
      </div>

      <Tabs
        defaultValue="original"
        className="relative flex flex-col"
        onValueChange={setType as any}
        value={type}
      >
        <TabsList className="sticky top-4 w-full">
          <TabsTrigger className="flex-1" value="original">
            Original
          </TabsTrigger>
          <TabsTrigger className="flex-1" value="translated">
            {isTranslating ? 'Traduzindo...' : 'Português (Brazil)'}
          </TabsTrigger>
        </TabsList>
        <div>
          {((!isTranslating && type === 'translated') ||
            type !== 'translated') &&
            data?.pages?.map((page) => (
              <img
                key={page.id}
                src={String(page.images[type])}
                alt=""
              />
            ))}
          {(isLoading || isFetching || data?.pages?.length === 0) && (
            <div className="flex flex-col gap-4 mt-20 items-center justify-center w-full">
              <Loader className="w-8 h-8 animate-spin" />
              <div>
                <h2 className="text-xl text-center text-neutral-600 font-semibold">
                  Carregando...
                </h2>
                <h3 className="text-neutral-600">
                  Aguarde um momento.
                </h3>
              </div>
            </div>
          )}
          {isTranslating && type === 'translated' && (
            <div className="flex flex-col gap-4 mt-20 items-center justify-center w-full">
              <Loader className="w-8 h-8 animate-spin" />
              <div>
                <h2 className="text-xl text-center text-neutral-600 font-semibold">
                  Traduzindo...
                </h2>
                <h3 className="text-neutral-600">
                  Aguarde um momento.
                </h3>
              </div>
            </div>
          )}
        </div>
      </Tabs>

      <div className="flex justify-between w-full">
        <Link
          href={`/manga/${params.id}/chapter/${data?.previous?.id}`}
        >
          <Button>Anterior</Button>
        </Link>
        <Link href={`/manga/${params.id}/chapter/${data?.next?.id}`}>
          <Button>Próximo</Button>
        </Link>
      </div>
    </div>
  );
}

export default Chapter;
