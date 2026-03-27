'use client';

import Image from 'next/image';
import Link from 'next/link';

import { Clock } from 'lucide-react';
import { useRef } from 'react';

function timeAgo(dateStr: string): string {
  const now = new Date();
  const date = new Date(dateStr);
  const diffMs = now.getTime() - date.getTime();
  const diffMins = Math.floor(diffMs / 60000);
  const diffHours = Math.floor(diffMins / 60);
  const diffDays = Math.floor(diffHours / 24);

  if (diffMins < 1) return 'agora';
  if (diffMins < 60) return `há ${diffMins}min`;
  if (diffHours < 24) return `há ${diffHours}h`;
  if (diffDays < 7) return `há ${diffDays}d`;
  return date.toLocaleDateString('pt-BR', {
    day: '2-digit',
    month: 'short',
  });
}

interface RecentChaptersProps {
  chapters: TRecentChapter[];
}

export default function RecentChapters({
  chapters,
}: RecentChaptersProps) {
  const scrollRef = useRef<HTMLDivElement>(null);

  if (!chapters.length) return null;

  return (
    <section>
      <div className="flex items-center justify-between mb-5">
        <h2 className="section-header flex items-center gap-2">
          <Clock className="w-5 h-5 text-primary" />
          Lançamentos Recentes
        </h2>
      </div>

      {/* Desktop: horizontal scroll / Mobile: 2-col grid */}
      <div
        ref={scrollRef}
        className="hidden sm:flex gap-4 overflow-x-auto pb-4 scroll-smooth snap-x snap-mandatory"
        style={{ scrollbarWidth: 'thin' }}
      >
        {chapters.map((chapter) => (
          <ChapterCard key={chapter.id} chapter={chapter} />
        ))}
      </div>

      {/* Mobile grid */}
      <div className="grid grid-cols-2 gap-3 sm:hidden">
        {chapters.slice(0, 12).map((chapter) => (
          <ChapterCard key={chapter.id} chapter={chapter} compact />
        ))}
      </div>
    </section>
  );
}

function ChapterCard({
  chapter,
  compact = false,
}: { chapter: TRecentChapter; compact?: boolean }) {
  return (
    <Link
      href={`/manga/${chapter.manhwa.id}/`}
      className={`group flex-shrink-0 snap-start ${
        compact ? 'w-full' : 'w-[200px]'
      }`}
    >
      <div className="relative aspect-[3/4] w-full rounded-xl overflow-hidden bg-card ring-1 ring-border/50">
        {chapter.manhwa?.thumbnail?.original && (
          <Image
            src={String(chapter.manhwa.thumbnail.original)}
            alt={chapter.manhwa.title}
            fill
            className="object-cover group-hover:scale-105 transition-transform duration-500"
            unoptimized
          />
        )}
        {/* Gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />

        {/* Chapter badge */}
        <div className="absolute top-2 left-2 px-2 py-0.5 bg-primary/90 backdrop-blur-sm text-primary-foreground text-xs font-bold rounded-md">
          {chapter.title}
        </div>

        {/* Time badge */}
        <div className="absolute top-2 right-2 px-2 py-0.5 bg-black/50 backdrop-blur-sm text-white/80 text-xs rounded-md flex items-center gap-1">
          <Clock className="w-3 h-3" />
          {timeAgo(chapter.release_date)}
        </div>

        {/* Bottom info */}
        <div className="absolute bottom-0 left-0 right-0 p-3">
          <h3 className="text-sm font-semibold text-white line-clamp-2 leading-tight">
            {chapter.manhwa.title}
          </h3>
        </div>
      </div>
    </Link>
  );
}
