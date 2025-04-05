import Link from 'next/link';

import { Button } from '@/components/ui/button';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import Chapter from '@/services/actions/Chapter';
import Manhwa from '@/services/actions/Manhwa';

import { ListPages } from '@/components/list-pages';
import { Loader } from 'lucide-react';
import { Suspense } from 'react';

async function ChapterPage({
  params,
}: { params: Promise<{ cap_id: string; id: string }> }) {
  const { cap_id, id } = await params;
  const data = await new Chapter().get(cap_id);
  const manhwa = await new Manhwa().get(id);

  return (
    <div className="flex flex-col gap-8 py-4 items-center max-w-[800px] mx-auto">
      <Link href={`/manga/${id}/`}>
        <h2 className="text-2xl text-neutral-500 font-semibold hover:underline hover:text-neutral-700 transition-all">
          {manhwa?.title}
        </h2>
      </Link>
      <div className="flex justify-between w-full">
        <Link href={`/manga/${id}/chapter/${data?.previous?.id}`}>
          <Button>Anterior</Button>
        </Link>
        <h2 className="text-2xl text-neutral-500 font-semibold">
          {data?.title}
        </h2>
        <Link href={`/manga/${id}/chapter/${data?.next?.id}`}>
          <Button>Próximo</Button>
        </Link>
      </div>

      <Suspense>
        <ListPages chapter={data} />
      </Suspense>

      <div className="flex justify-between w-full">
        <Link href={`/manga/${id}/chapter/${data?.previous?.id}`}>
          <Button>Anterior</Button>
        </Link>
        <Link href={`/manga/${id}/chapter/${data?.next?.id}`}>
          <Button>Próximo</Button>
        </Link>
      </div>
    </div>
  );
}

export const experimental_ppr = true;

export default ChapterPage;
