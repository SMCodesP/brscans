'use client';
import { Button } from '@/components/ui/button';
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from '@/components/ui/tabs';
import { Loader } from 'lucide-react';
import Link from 'next/link';
import { useEffect, useMemo, useState } from 'react';
import useSWR from 'swr';

function Chapter({ params }: { params: { id: string } }) {
  const [refreshInterval, setRefreshInterval] = useState(0);
  const { data, isLoading } = useSWR<TChapter>(
    `/chapters/${params.id}/`,
    {
      refreshInterval,
    }
  );
  const [type, setType] = useState<keyof TPage['images']>('original');

  const isTranslating = useMemo(() => {
    return data?.pages.some(
      (page) => page.images.translated === null
    );
  }, [data?.pages]);

  useEffect(() => {
    if (isTranslating) {
      setRefreshInterval(1000);
    } else {
      setRefreshInterval(0);
    }
  }, [isTranslating]);

  return (
    <div className="flex flex-col gap-8 py-4 items-center">
      <h1 className="text-2xl text-neutral-600 font-semibold">
        {data?.title}
      </h1>

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
            data?.pages.map((page) => (
              <img
                key={page.id}
                src={String(page.images[type])}
                alt=""
              />
            ))}
          {isLoading && (
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

      <Link href="/chapter">
        <Button>Traduzir outro</Button>
      </Link>
    </div>
  );
}

export default Chapter;
