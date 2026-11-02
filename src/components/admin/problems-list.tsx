'use client';

import { Button } from '@/components/ui/button';
import {
  Admin,
  adminFetcher,
  adminKeys,
} from '@/services/actions/Admin';
import { Loader2 } from 'lucide-react';
import Link from 'next/link';
import { useState } from 'react';
import { toast } from 'sonner';
import useSWR from 'swr';

import { Pager } from './pager';

const REASON: Record<TProblemReason, string> = {
  sem_pages: 'Sem pages',
  sem_traducao: 'Sem tradução',
  erro_sync: 'Erro de sync',
};

function ProblemsList() {
  const admin = new Admin();
  const [page, setPage] = useState(1);
  const { data, error, mutate } = useSWR(
    adminKeys.problems(page),
    adminFetcher<TPagination<TAdminProblem>>
  );

  if (error)
    return <p className="text-sm text-red-400">Falha ao carregar.</p>;
  if (!data)
    return (
      <p className="text-sm text-muted-foreground">
        <Loader2 className="mr-2 inline h-4 w-4 animate-spin" />
        Carregando...
      </p>
    );
  if (data.results.length === 0)
    return (
      <p className="text-sm text-muted-foreground">
        Nenhum capítulo com problema.
      </p>
    );

  return (
    <>
      <ul className="divide-y divide-border/60 rounded-xl border border-border/60">
        {data.results.map((item) => (
          <li
            key={item.id}
            className="flex flex-col gap-2 p-3 sm:flex-row sm:items-center sm:justify-between"
          >
            <div className="min-w-0">
              <Link
                href={`/admin/${item.manhwa.id}`}
                className="block truncate text-xs text-muted-foreground hover:text-foreground"
              >
                {item.manhwa.title}
              </Link>
              <p className="truncate font-medium">{item.title}</p>
              <p className="flex flex-wrap items-center gap-2 text-xs text-muted-foreground">
                <span className="rounded bg-red-500/15 px-1.5 py-0.5 text-red-400">
                  {REASON[item.reason]}
                </span>
                <span>
                  {item.translated_count}/{item.pages_count}{' '}
                  traduzidas
                </span>
                {item.work_attempts > 0 && (
                  <span>{item.work_attempts} tentativas</span>
                )}
                {item.work_last_error && (
                  <span className="truncate">
                    {item.work_last_error}
                  </span>
                )}
              </p>
            </div>
            <Button
              variant="outline"
              size="sm"
              className="shrink-0 self-start"
              onClick={async () => {
                try {
                  await admin.fixChapter(item.id);
                  toast.success('Conserto enfileirado.');
                  mutate();
                } catch {
                  toast.error('Falha ao enfileirar.');
                }
              }}
            >
              Consertar
            </Button>
          </li>
        ))}
      </ul>
      <Pager
        page={page}
        total={data.total_pages}
        onChange={setPage}
      />
    </>
  );
}

export { ProblemsList };
