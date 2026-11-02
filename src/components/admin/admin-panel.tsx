'use client';

import { Pager } from '@/components/admin/pager';
import { ProblemsList } from '@/components/admin/problems-list';
import { STATUS, SourceBadge } from '@/components/admin/source-badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from '@/components/ui/tabs';
import {
  Admin,
  adminError,
  adminFetcher,
  adminKeys,
} from '@/services/actions/Admin';
import { Loader2 } from 'lucide-react';
import Link from 'next/link';
import { useState } from 'react';
import { toast } from 'sonner';
import useSWR from 'swr';

function AdminPanel() {
  const [query, setQuery] = useState('');
  const [status, setStatus] = useState<TSourceStatus | ''>('');
  const [link, setLink] = useState('');
  const [limit, setLimit] = useState('5');
  const [busy, setBusy] = useState(false);
  const [page, setPage] = useState(1);
  const key = adminKeys.manhwas(query, page, status);
  const { data, mutate, isLoading } = useSWR(
    key,
    adminFetcher<TPagination<TAdminManhwa>>
  );
  const admin = new Admin();

  const run = async (action: () => Promise<unknown>, ok: string) => {
    setBusy(true);
    try {
      await action();
      toast.success(ok);
      mutate();
    } catch (err) {
      toast.error(await adminError(err, 'Falhou.'));
    } finally {
      setBusy(false);
    }
  };

  return (
    <main className="mx-auto max-w-7xl px-4 py-8 pb-16 sm:px-8">
      <h1 className="mb-6 text-3xl font-extrabold tracking-tight">
        Painel
      </h1>

      <Tabs defaultValue="mangas">
        <TabsList className="mb-4">
          <TabsTrigger value="mangas">Mangás</TabsTrigger>
          <TabsTrigger value="problemas">Com problema</TabsTrigger>
        </TabsList>

        <TabsContent value="mangas">
          <section
            className="mb-6 rounded-xl border border-border/60 p-4"
            aria-labelledby="add-title"
          >
            <h2
              id="add-title"
              className="mb-3 text-sm font-semibold uppercase"
            >
              Adicionar manga
            </h2>
            <form
              className="flex flex-col gap-2 sm:flex-row"
              onSubmit={(e) => {
                e.preventDefault();
                if (!link) return;
                run(
                  () =>
                    admin
                      .addManhwa(link, Number(limit) || undefined)
                      .then(() => setLink('')),
                  'Adicionando em segundo plano; o manga aparece na lista quando pronto.'
                );
              }}
            >
              <Input
                aria-label="URL da fonte"
                placeholder="https://fonte/manhwa/..."
                value={link}
                onChange={(e) => setLink(e.target.value)}
                className="flex-1"
              />
              <Input
                aria-label="Limite de capítulos"
                type="number"
                min={1}
                value={limit}
                onChange={(e) => setLimit(e.target.value)}
                className="sm:w-28"
              />
              <Button type="submit" disabled={busy || !link}>
                {busy && (
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                )}
                Adicionar
              </Button>
            </form>
          </section>

          <div className="mb-4 flex flex-col gap-2 sm:flex-row">
            <Input
              aria-label="Buscar manga"
              placeholder="Buscar por título..."
              value={query}
              onChange={(e) => {
                setQuery(e.target.value);
                setPage(1);
              }}
              className="max-w-sm"
            />
            <select
              aria-label="Filtrar por status da fonte"
              value={status}
              onChange={(e) => {
                setStatus(e.target.value as TSourceStatus | '');
                setPage(1);
              }}
              className="h-10 rounded-md border border-input bg-background px-3 text-sm"
            >
              <option value="">Todos os status</option>
              {Object.entries(STATUS).map(([value, { label }]) => (
                <option key={value} value={value}>
                  {label}
                </option>
              ))}
            </select>
          </div>

          {isLoading && !data ? (
            <p className="text-sm text-muted-foreground">
              Carregando...
            </p>
          ) : (
            <ul className="divide-y divide-border/60 rounded-xl border border-border/60">
              {data?.results?.map((manhwa) => (
                <li
                  key={manhwa.id}
                  className="flex flex-col gap-2 p-3 sm:flex-row sm:items-center sm:justify-between"
                >
                  <div className="min-w-0">
                    <a
                      href={manhwa.source ?? undefined}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="block truncate font-medium hover:underline"
                    >
                      {manhwa.title}
                    </a>
                    <p className="mt-0.5 flex flex-wrap items-center gap-2 text-xs text-muted-foreground">
                      <SourceBadge status={manhwa.source_status} />
                      <span>{manhwa.chapters_count} capítulos</span>
                      {manhwa.problem_pages > 0 && (
                        <span className="text-red-400">
                          {manhwa.problem_pages} pages com problema
                        </span>
                      )}
                      {manhwa.source_checked_at && (
                        <span title={manhwa.source_checked_at}>
                          checado{' '}
                          {new Date(
                            manhwa.source_checked_at
                          ).toLocaleString('pt-BR')}
                        </span>
                      )}
                      {manhwa.source_detail && (
                        <span className="truncate">
                          {manhwa.source_detail}
                        </span>
                      )}
                    </p>
                  </div>
                  <div className="flex shrink-0 gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      disabled={busy}
                      onClick={() =>
                        run(
                          () => admin.checkSource(manhwa.id),
                          'Checagem enfileirada.'
                        )
                      }
                    >
                      Checar fonte
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      disabled={busy}
                      onClick={() =>
                        run(
                          () => admin.sync(manhwa.id),
                          'Sincronização enfileirada.'
                        )
                      }
                    >
                      Sincronizar
                    </Button>
                    <Button size="sm" asChild>
                      <Link href={`/admin/${manhwa.id}`}>Abrir</Link>
                    </Button>
                  </div>
                </li>
              ))}
              {data?.results?.length === 0 && (
                <li className="p-4 text-sm text-muted-foreground">
                  Nenhum manga encontrado.
                </li>
              )}
            </ul>
          )}
          <Pager
            page={page}
            total={data?.total_pages ?? 1}
            onChange={setPage}
          />
        </TabsContent>

        <TabsContent value="problemas">
          <ProblemsList />
        </TabsContent>
      </Tabs>
    </main>
  );
}

export { AdminPanel };
