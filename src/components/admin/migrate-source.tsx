'use client';

import { useDebounce } from 'ahooks';
import { Loader2, Search } from 'lucide-react';
import { useState } from 'react';
import { toast } from 'sonner';
import useSWR from 'swr';

import { Pager } from '@/components/admin/pager';
import { SourceBadge } from '@/components/admin/source-badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Admin,
  adminError,
  adminFetcher,
  adminKeys,
} from '@/services/actions/Admin';

const admin = new Admin();

function MigrateSource() {
  const [q, setQ] = useState('');
  const [page, setPage] = useState(1);
  const [selected, setSelected] = useState<TAdminManhwa | null>(null);

  const { data, mutate } = useSWR(
    `${adminKeys.manhwas(q, page)}&ordering=problems`,
    adminFetcher<TPagination<TAdminManhwa>>
  );

  if (selected)
    return (
      <MigrateSearch
        manhwa={selected}
        onBack={() => {
          setSelected(null);
          mutate();
        }}
      />
    );

  return (
    <div>
      <Input
        aria-label="Buscar manga"
        placeholder="Buscar por título..."
        value={q}
        onChange={(e) => {
          setQ(e.target.value);
          setPage(1);
        }}
        className="mb-4 max-w-sm"
      />

      {!data ? (
        <Busy />
      ) : (
        <ul className="divide-y divide-border/60 rounded-xl border border-border/60">
          {data.results.map((manhwa) => (
            <li
              key={manhwa.id}
              className="flex flex-col gap-2 p-3 sm:flex-row sm:items-center sm:justify-between"
            >
              <div className="min-w-0">
                <p className="truncate font-medium">{manhwa.title}</p>
                <p className="mt-0.5 flex flex-wrap items-center gap-2 text-xs text-muted-foreground">
                  <SourceBadge status={manhwa.source_status} />
                  <span>{manhwa.chapters_count} capítulos</span>
                  {manhwa.source_detail && (
                    <span className="truncate">
                      {manhwa.source_detail}
                    </span>
                  )}
                </p>
              </div>
              <Button
                size="sm"
                className="shrink-0 self-start"
                onClick={() => setSelected(manhwa)}
              >
                <Search className="mr-1 h-4 w-4" />
                Buscar equivalente
              </Button>
            </li>
          ))}
          {data.results.length === 0 && (
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
    </div>
  );
}

/** Migra a URL escolhida na busca, ou a colada à mão. */
async function migrate(
  manhwaId: number,
  url: string,
  onDone: () => void
) {
  try {
    const r = await admin.migrate(manhwaId, url);
    toast.success(
      `${r.matched} capítulos casados, ${r.created} novos.`
    );
    if (r.unmatched.length > 0)
      toast.warning(
        `Sem par na fonte nova (${r.unmatched.length}): ` +
          r.unmatched.join(', ')
      );
    onDone();
  } catch (err) {
    toast.error(await adminError(err, 'Falha ao migrar.'));
  }
}

function MigrateSearch({
  manhwa,
  onBack,
}: { manhwa: TAdminManhwa; onBack: () => void }) {
  const [title, setTitle] = useState(manhwa.title);
  const [chosen, setChosen] = useState<Set<string>>(new Set());
  const debounced = useDebounce(title, { wait: 400 });
  const { data: sources } = useSWR(
    adminKeys.sources(),
    adminFetcher<TAdminSource[]>
  );
  const active = sources?.filter((s) => chosen.has(s.name)) ?? [];

  return (
    <div>
      <div className="mb-4 flex flex-wrap items-center gap-3">
        <Button variant="outline" size="sm" onClick={onBack}>
          Voltar
        </Button>
        <SourceBadge status={manhwa.source_status} />
      </div>

      <Input
        aria-label="Título para buscar na fonte nova"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        className="mb-3 max-w-md"
      />

      <fieldset className="mb-4 flex flex-wrap gap-3 border-0">
        <legend className="mb-2 text-xs font-semibold uppercase text-muted-foreground">
          Fontes
        </legend>
        {sources?.map(({ name }) => (
          <label
            key={name}
            className="flex items-center gap-1 text-xs"
          >
            <input
              type="checkbox"
              checked={chosen.has(name)}
              onChange={(e) =>
                setChosen((prev) => {
                  const next = new Set(prev);
                  if (e.target.checked) next.add(name);
                  else next.delete(name);
                  return next;
                })
              }
            />
            {name}
          </label>
        ))}
      </fieldset>

      {!debounced ? (
        <p className="text-sm text-muted-foreground">
          Digite o título a buscar.
        </p>
      ) : active.length === 0 ? (
        <p className="text-sm text-muted-foreground">
          Marque pelo menos uma fonte.
        </p>
      ) : (
        <div className="grid gap-3 md:grid-cols-2">
          {active.map((source) => (
            <SourceResults
              key={source.name}
              manhwaId={manhwa.id}
              source={source}
              query={debounced}
              onMigrated={onBack}
            />
          ))}
        </div>
      )}

      <p className="mt-4 text-xs text-muted-foreground">
        Só a fonte muda: favoritos, comentários, notificações e
        páginas já traduzidas continuam iguais.
      </p>
    </div>
  );
}

/** Um useSWR por fonte marcada: cada painel preenche quando responde. */
function SourceResults({
  manhwaId,
  source,
  query,
  onMigrated,
}: {
  manhwaId: number;
  source: TAdminSource;
  query: string;
  onMigrated: () => void;
}) {
  const { data, error } = useSWR(
    adminKeys.sourceSearch(source.name, query),
    adminFetcher<TAdminSourceSearch>,
    { revalidateOnFocus: false }
  );

  return (
    <section className="rounded-xl border border-border/60 p-3">
      <h3 className="mb-2 text-xs font-semibold uppercase text-muted-foreground">
        {source.name}
      </h3>
      {error ? (
        <p className="text-xs text-orange-400">
          Fonte fora do ar ou bloqueada — sem resultados.
        </p>
      ) : !data ? (
        <Busy />
      ) : data.results.length === 0 ? (
        <p className="text-xs text-muted-foreground">
          Nenhum resultado.
        </p>
      ) : (
        <ul className="divide-y divide-border/60">
          {data.results.map((result) => (
            <li
              key={result.url}
              className="flex items-center gap-3 py-2"
            >
              {result.thumbnail && (
                <img
                  src={result.thumbnail}
                  alt=""
                  className="h-14 w-10 rounded object-cover"
                  loading="lazy"
                />
              )}
              <div className="min-w-0 flex-1">
                <p className="truncate text-sm">{result.title}</p>
                <p className="truncate text-xs text-muted-foreground">
                  {result.url}
                </p>
              </div>
              <Button
                size="sm"
                onClick={() =>
                  migrate(manhwaId, result.url, onMigrated)
                }
              >
                Migrar
              </Button>
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}

function Busy() {
  return (
    <p className="text-sm text-muted-foreground">
      <Loader2 className="mr-2 inline h-4 w-4 animate-spin" />
      Carregando...
    </p>
  );
}

export { MigrateSource };
