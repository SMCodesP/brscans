import { Metadata } from 'next';

import { ListPages } from '@/components/list-pages';
import { Button } from '@/components/ui/button';

import { Link } from '@/components/ui/link';
import Chapter from '@/services/actions/Chapter';
import Manhwa from '@/services/actions/Manhwa';

type Props = {
  params: { cap_id: string; id: string };
};

export async function generateMetadata({
  params,
}: Props): Promise<Metadata> {
  const { cap_id, id } = params;
  const chapter = await new Chapter().get(cap_id);
  const manhwa = await new Manhwa().get(id);

  if (!chapter || !manhwa) {
    return {
      title: 'Capítulo não encontrado',
    };
  }

  const title = `${manhwa.title} - ${chapter.title}`;
  const description = `Leia o ${chapter.title} de ${manhwa.title} online em português. Descubra o que acontece neste capítulo emocionante.`;

  return {
    title,
    description,
    alternates: {
      canonical: `/manga/${id}/chapter/${cap_id}`,
    },
  };
}

async function ChapterPage({
  params,
}: { params: { cap_id: string; id: string } }) {
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
        <Link
          href={`/manga/${id}/chapter/${data?.previous?.id}`}
          disabled={!data?.previous}
        >
          <Button disabled={!data?.previous}>Anterior</Button>
        </Link>
        <h2 className="text-2xl text-neutral-500 font-semibold">
          {data?.title}
        </h2>
        <Link
          href={`/manga/${id}/chapter/${data?.next?.id}`}
          disabled={!data?.next}
        >
          <Button disabled={!data?.next}>Próximo</Button>
        </Link>
      </div>

      <ListPages chapter={data} />

      <div className="flex justify-between w-full">
        <Link
          href={`/manga/${id}/chapter/${data?.previous?.id}`}
          disabled={!data?.previous}
        >
          <Button disabled={!data?.previous}>Anterior</Button>
        </Link>
        <Link
          href={`/manga/${id}/chapter/${data?.next?.id}`}
          disabled={!data?.next}
        >
          <Button disabled={!data?.next}>Próximo</Button>
        </Link>
      </div>
    </div>
  );
}

export const experimental_ppr = true;
export const revalidate = 30;

export default ChapterPage;
