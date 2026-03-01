import { ViewTransition } from 'react';

import Image from 'next/image';
import Link from 'next/link';

interface MangaCardProps {
  manga: TManga;
}

function shortDate(dateStr: string): string {
  const date = new Date(dateStr);
  return date.toLocaleDateString('pt-BR', {
    day: '2-digit',
    month: 'short',
  });
}

function isNew(dateStr: string): boolean {
  const diff = (Date.now() - new Date(dateStr).getTime()) / 86400000;
  return diff <= 3;
}

export default function MangaCard({ manga }: MangaCardProps) {
  const chapters = manga.latest_chapters || [];

  return (
    <div className="flex flex-col overflow-hidden rounded-xl bg-card ring-1 ring-border/40 transition-all duration-300 hover:ring-primary/40 hover:shadow-lg hover:shadow-primary/5 group">
      {/* Cover */}
      <Link href={`/manga/${manga.id}/`} className="block">
        <div className="relative aspect-[3/4] w-full overflow-hidden">
          <ViewTransition name={`manhwa-${manga.id}`}>
            {manga?.thumbnail?.original && (
              <Image
                src={String(manga.thumbnail.original)}
                alt={manga.title}
                fill
                className="object-cover group-hover:scale-105 transition-transform duration-500"
                unoptimized
              />
            )}
          </ViewTransition>
        </div>
      </Link>

      {/* Info */}
      <div className="p-3 flex flex-col gap-2">
        {/* Title */}
        <Link href={`/manga/${manga.id}/`}>
          <ViewTransition name={`manhwa-title-${manga.id}`}>
            <h3 className="text-sm font-bold text-foreground line-clamp-1 group-hover:text-primary transition-colors">
              {manga.title}
            </h3>
          </ViewTransition>
        </Link>

        {/* Latest chapters */}
        {chapters.length > 0 && (
          <div className="flex flex-col gap-1">
            {chapters.map((chapter) => (
              <Link
                key={chapter.id}
                href={`/manga/${manga.id}/chapter/${chapter.id}/`}
                className="flex items-center gap-1.5 px-2 py-1 rounded-md bg-secondary/60 hover:bg-secondary transition-colors"
              >
                <span className="text-[11px] font-semibold text-foreground/80 truncate flex-1 min-w-0">
                  {chapter.title}
                </span>
                {chapter.created_at && isNew(chapter.created_at) && (
                  <span className="px-1 py-px text-[9px] font-bold uppercase bg-green-500 text-white rounded flex-shrink-0">
                    New
                  </span>
                )}
                {chapter.created_at && (
                  <span className="text-[9px] text-muted-foreground flex-shrink-0">
                    {shortDate(chapter.created_at)}
                  </span>
                )}
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
