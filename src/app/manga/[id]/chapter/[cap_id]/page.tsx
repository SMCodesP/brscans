import { Metadata } from 'next';

import { Button } from '@/components/ui/button';

import { AutoNextChapter } from '@/components/chapter/auto-next-chapter';
import { Comments } from '@/components/chapter/comments';
import { FullscreenToggle } from '@/components/chapter/fullscreen-toggle';
import { ProgressTracker } from '@/components/chapter/progress-tracker';
import { ListPages } from '@/components/list-pages';
import { Link } from '@/components/ui/link';
import Chapter from '@/services/actions/Chapter';
import Manhwa from '@/services/actions/Manhwa';

type Props = {
  params: Promise<{ cap_id: string; id: string }>;
};

export async function generateMetadata({
  params,
}: Props): Promise<Metadata> {
  const { cap_id, id } = await params;
  const [chapter, manhwa] = await Promise.all([
    new Chapter().get(cap_id),
    new Manhwa().get(id),
  ]);

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
}: { params: Promise<{ cap_id: string; id: string }> }) {
  const { cap_id, id } = await params;
  const [data, manhwa] = await Promise.all([
    new Chapter().get(cap_id),
    new Manhwa().get(id),
  ]);

  return (
    <div className="flex flex-col gap-8 py-4 items-center max-w-[800px] mx-auto touch-manipulation">
      <FullscreenToggle />
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
      <AutoNextChapter mangaId={id} nextChapterId={data?.next?.id} />
      {data && manhwa && (
        <ProgressTracker
          manhwaId={manhwa.id}
          chapterId={data.id}
          totalPages={data.pages?.length || 0}
        />
      )}

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

      <div className="w-full mt-12 border-t border-border/50 pt-8">
        <Comments chapterId={data.id} />
      </div>
    </div>
  );
}

export const revalidate = 30;

export default ChapterPage;
