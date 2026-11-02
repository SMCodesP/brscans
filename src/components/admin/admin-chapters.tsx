'use client';

import { Button } from '@/components/ui/button';
import {
  Admin,
  adminFetcher,
  adminKeys,
} from '@/services/actions/Admin';
import { Eye, Loader2, Wrench } from 'lucide-react';
import { useState } from 'react';
import { toast } from 'sonner';
import useSWR from 'swr';

import { ChapterPages } from './chapter-pages';
import { Pager } from './pager';

function AdminChapters({ manhwaId }: { manhwaId: number }) {
  const [open, setOpen] = useState<number | null>(null);
  const [page, setPage] = useState(1);
  const { data, error } = useSWR(
    adminKeys.chapters(manhwaId, page),
    adminFetcher<TPagination<TAdminChapter>>
  );
  const admin = new Admin();

  const fix = async (id: number) => {
    try {
      await admin.fixChapter(id);
      toast.success('Conserto enfileirado.');
    } catch {
      toast.error('Falha ao enfileirar o conserto.');
    }
  };

  if (error) {
    return (
      <p className="text-sm text-red-400">
        Não foi possível carregar os capítulos.
      </p>
    );
  }
  if (!data) {
    return (
      <p className="text-sm text-muted-foreground">
        <Loader2 className="mr-2 inline h-4 w-4 animate-spin" />
        Carregando capítulos...
      </p>
    );
  }

  return (
    <section aria-labelledby="chapters-title">
      <h1 id="chapters-title" className="mb-4 text-2xl font-bold">
        Capítulos ({data.count})
      </h1>
      <ul className="divide-y divide-border/60 rounded-xl border border-border/60">
        {data.results.map((chapter) => (
          <li key={chapter.id}>
            <div className="flex flex-col gap-2 p-3 sm:flex-row sm:items-center sm:justify-between">
              <div className="min-w-0">
                <p className="truncate font-medium">
                  {chapter.title}
                </p>
                <p className="text-xs text-muted-foreground">
                  {chapter.translated_count}/{chapter.pages_count}{' '}
                  traduzidas
                  {chapter.problem_pages > 0 && (
                    <span className="ml-2 text-red-400">
                      {chapter.problem_pages} com problema
                    </span>
                  )}
                </p>
              </div>
              <div className="flex shrink-0 gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() =>
                    setOpen(open === chapter.id ? null : chapter.id)
                  }
                  aria-expanded={open === chapter.id}
                >
                  <Eye className="h-4 w-4" />
                  Pages
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => fix(chapter.id)}
                >
                  <Wrench className="h-4 w-4" />
                  Consertar
                </Button>
              </div>
            </div>
            {open === chapter.id && (
              <ChapterPages chapterId={chapter.id} />
            )}
          </li>
        ))}
      </ul>
      <Pager
        page={page}
        total={data.total_pages}
        onChange={setPage}
      />
    </section>
  );
}

export { AdminChapters };
