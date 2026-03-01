'use client';

import { useAuth } from '@/providers/auth-provider';
import { api } from '@/services/api';
import { BookOpen } from 'lucide-react';
import Link from 'next/link';
import * as React from 'react';
import useSWR from 'swr';

export default function ContinueReading() {
  const { user, token } = useAuth();
  const [mounted, setMounted] = React.useState(false);

  React.useEffect(() => {
    setMounted(true);
  }, []);

  const fetcher = (url: string) =>
    api
      .get(url, { headers: { Authorization: `Token ${token}` } })
      .json<any>();

  const { data: history, error } = useSWR(
    mounted && user && token ? `manhwas/reading-history/` : null,
    fetcher
  );

  if (!mounted || !user) return null;

  if (history && history.length === 0) {
    return null;
  }

  return (
    <section className="mb-8">
      <h2 className="section-header flex items-center gap-2 mb-5 text-xl font-bold">
        <BookOpen className="w-5 h-5 text-primary" />
        Continuar Lendo
      </h2>
      <div
        className="flex gap-4 overflow-x-auto pb-4 snap-x scrollbar-hide"
        style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
      >
        {history?.map((item: any) => (
          <Link
            key={item.manhwa.id}
            href={`/manga/${item.manhwa.id}/chapter/${item.chapter.id}/`}
            className="flex-shrink-0 w-[240px] flex items-center gap-3 bg-card p-3 rounded-xl border border-border/40 hover:border-primary/50 hover:bg-accent/50 transition-all snap-start shadow-sm"
          >
            {item.manhwa.thumbnail?.original ? (
              <img
                src={item.manhwa.thumbnail.original}
                alt={item.manhwa.title}
                className="w-14 h-20 object-cover rounded-md"
              />
            ) : (
              <div className="w-14 h-20 rounded-md bg-muted flex items-center justify-center">
                <BookOpen className="w-4 h-4 text-muted-foreground" />
              </div>
            )}
            <div className="flex flex-col justify-center overflow-hidden">
              <span
                className="font-semibold text-sm truncate"
                title={item.manhwa.title}
              >
                {item.manhwa.title}
              </span>
              <span className="text-xs text-muted-foreground mt-1 truncate">
                Cap. {item.chapter.title}
              </span>
              <span className="text-[10px] font-medium text-primary mt-1 bg-primary/10 w-fit px-1.5 py-0.5 rounded-sm">
                Pág. {item.page_number}
              </span>
            </div>
          </Link>
        ))}

        {!history && !error && (
          <div className="flex gap-4">
            {[1, 2, 3].map((i) => (
              <div
                key={i}
                className="flex-shrink-0 w-[240px] flex items-center gap-3 bg-card p-3 rounded-xl border border-border/40 animate-pulse"
              >
                <div className="w-14 h-20 rounded-md bg-muted flex-shrink-0" />
                <div className="flex flex-col gap-2 w-full pr-4 overflow-hidden">
                  <div className="h-4 bg-muted rounded w-full" />
                  <div className="h-3 bg-muted rounded w-2/3" />
                  <div className="h-3 bg-muted rounded w-1/3 mt-1" />
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
