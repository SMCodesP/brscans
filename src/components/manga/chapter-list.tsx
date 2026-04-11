import ContainerAnimation from '@/components/ui/container-animation';
import { fetcher } from '@/services/api-server';
import { BookOpen, Check, Play } from 'lucide-react';
import Link from 'next/link';

interface ChapterListProps {
  manhwaId: number;
  chapters: any[];
}

export async function ChapterList({
  manhwaId,
  chapters,
}: ChapterListProps) {
  const [readChapters, readingHistory] = await Promise.all([
    fetcher<number[]>(`manhwas/${manhwaId}/read-chapters`),
    fetcher<any[]>(`manhwas/reading-history`),
  ]);

  const readSet = new Set((readChapters as number[]) || []);

  const currentProgress = readingHistory?.find(
    (h: any) => h.manhwa.id === manhwaId
  );
  const inProgressChapterId = currentProgress?.chapter?.id;

  const getChapterNumber = (ch: any) => {
    if (!ch?.slug) return ch?.id || 0;
    const match = ch.slug.match(/\d+/);
    return match ? parseInt(match[0], 10) : ch.id;
  };

  const sortedAscending = [...chapters].sort(
    (a, b) => getChapterNumber(a) - getChapterNumber(b)
  );

  // Encontra o "ponto de parada" do usuário (o progresso atual ou o último lido da lista cronológica)
  const anchorId =
    currentProgress?.chapter?.id ??
    sortedAscending.filter((ch) => readSet.has(ch.id)).pop()?.id;
  const anchorIdx = sortedAscending.findIndex(
    (ch) => ch.id === anchorId
  );
  const nextUnread = sortedAscending
    .slice(anchorIdx + 1)
    .find((ch) => !readSet.has(ch.id));

  // Acionador: se o ponto de parada já estiver lido, avança pro inédito. Senão, fica nele mesmo.
  const actionChapter =
    anchorIdx !== -1
      ? readSet.has(anchorId)
        ? nextUnread || sortedAscending[anchorIdx]
        : sortedAscending[anchorIdx]
      : sortedAscending[0] || null;

  const hasReadAny = readSet.size > 0 || !!currentProgress;

  return (
    <div className="mt-8">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-4">
        <h2 className="text-2xl font-bold">Capítulos</h2>
        <div className="flex items-center gap-2">
          {actionChapter && (
            <Link
              href={`/manga/${manhwaId}/chapter/${actionChapter.id}/`}
              className="flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground text-sm font-semibold rounded-lg hover:bg-primary/90 transition-colors"
            >
              {hasReadAny ? (
                <BookOpen className="w-4 h-4" />
              ) : (
                <Play className="w-4 h-4" />
              )}
              {hasReadAny ? 'Continuar Lendo' : 'Começar a Ler'}
            </Link>
          )}
        </div>
      </div>

      <ul className="grid grid-cols-[repeat(auto-fill,minmax(220px,1fr))] gap-3 mt-2">
        {chapters.reverse().map((chapter, index) => {
          const isRead = readSet.has(chapter.id);
          const chapterDate =
            chapter.created_at || chapter.release_date;
          const isRecent =
            chapterDate &&
            (() => {
              const diff =
                (new Date().getTime() -
                  new Date(chapterDate).getTime()) /
                (1000 * 60 * 60 * 24);
              return diff <= 3;
            })();

          return (
            <Link
              href={`/manga/${manhwaId}/chapter/${chapter.id}/`}
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
                  className={`flex flex-col justify-center w-full min-h-[72px] p-2.5 border rounded-md transition-all gap-1.5 ${
                    isRead
                      ? 'border-border/50 bg-muted/30 text-muted-foreground'
                      : inProgressChapterId === chapter.id
                        ? 'border-primary/50 bg-primary/5'
                        : 'border-primary/10 hover:bg-primary/10 hover:border-primary'
                  }`}
                >
                  {isRead ? (
                    <div className="flex items-center gap-2">
                      <Check className="size-3.5 text-primary flex-shrink-0" />
                      <p className="text-[10px] font-medium text-primary bg-primary/10 px-1.5 py-0.5 rounded-sm">
                        Lido
                      </p>
                    </div>
                  ) : (
                    inProgressChapterId === chapter.id && (
                      <div className="flex items-center gap-2">
                        <BookOpen className="size-3.5 text-primary flex-shrink-0" />

                        {inProgressChapterId === chapter.id &&
                          !isRead && (
                            <p className="text-[10px] font-medium text-primary bg-primary/10 px-1.5 py-0.5 rounded-sm">
                              Continuar lendo
                            </p>
                          )}
                      </div>
                    )
                  )}
                  <div className="flex items-center justify-between w-full gap-2">
                    <p className="!line-clamp-1 overflow-hidden text-ellipsis text-sm font-medium flex items-center gap-2">
                      <span className={isRead ? 'opacity-70' : ''}>
                        {chapter.title}
                      </span>
                    </p>
                    <div className="flex items-center gap-1.5 flex-shrink-0">
                      {isRecent && !isRead && (
                        <span className="px-1.5 py-0.5 text-[10px] font-bold uppercase bg-green-500 text-white rounded">
                          New
                        </span>
                      )}
                      {chapterDate && (
                        <span className="text-[10px] opacity-70 whitespace-nowrap">
                          {new Date(chapterDate).toLocaleDateString(
                            'pt-BR',
                            {
                              day: '2-digit',
                              month: 'short',
                            }
                          )}
                        </span>
                      )}
                    </div>
                  </div>
                </li>
              </ContainerAnimation>
            </Link>
          );
        })}
      </ul>
    </div>
  );
}
