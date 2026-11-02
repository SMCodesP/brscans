'use client';

import { Input } from '@/components/ui/input';
import {
  Admin,
  adminError,
  adminFetcher,
  adminKeys,
} from '@/services/actions/Admin';
import { Loader2 } from 'lucide-react';
import { useState } from 'react';
import { toast } from 'sonner';
import useSWR from 'swr';

const FIELDS = ['raw', 'original', 'translated'] as const;
type Field = (typeof FIELDS)[number];

function PageEditor({
  page,
  onSaved,
}: { page: TAdminPage; onSaved: () => void }) {
  const admin = new Admin();
  const [values, setValues] = useState<
    Partial<Record<Field, string>>
  >({});
  const [saving, setSaving] = useState(false);
  const images = page.images;

  const pathOf = (field: Field) =>
    images[`${field}_path` as const] ?? '';

  const value = (field: Field) => values[field] ?? pathOf(field);

  const save = async () => {
    const changed = Object.fromEntries(
      FIELDS.filter(
        (f) => values[f] !== undefined && values[f] !== pathOf(f)
      ).map((f) => [f, values[f]])
    );
    if (Object.keys(changed).length === 0) return;

    setSaving(true);
    try {
      await admin.patchImage(images.id, changed);
      toast.success('Page atualizada.');
      setValues({});
      onSaved();
    } catch (err) {
      toast.error(await adminError(err, 'Falha ao salvar a page.'));
    } finally {
      setSaving(false);
    }
  };

  const useOriginal = async () => {
    setSaving(true);
    try {
      await admin.useOriginal(images.id);
      toast.success('Translated agora é cópia do original.');
      setValues({});
      onSaved();
    } catch {
      toast.error('Falha ao copiar o original.');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="flex flex-col gap-3 p-3 lg:flex-row lg:items-start">
      <div className="flex gap-2">
        {FIELDS.map((field) => (
          <figure key={field} className="text-center">
            <figcaption className="mb-1 text-[10px] uppercase text-muted-foreground">
              {field}
            </figcaption>
            {images[field] ? (
              <img
                src={images[field] ?? undefined}
                alt={`${field} da page ${page.order}`}
                loading="lazy"
                className="h-24 w-16 rounded border border-border/50 bg-muted object-cover"
              />
            ) : (
              <div className="h-24 w-16 rounded border border-dashed border-border/50" />
            )}
          </figure>
        ))}
      </div>

      <div className="min-w-0 flex-1 space-y-1.5">
        <p className="text-xs text-muted-foreground">
          Page {page.order}
          {page.manual_translated && (
            <span className="ml-2 rounded bg-amber-500/15 px-1.5 py-0.5 text-amber-400">
              translated manual
            </span>
          )}
        </p>
        {FIELDS.map((field) => (
          <label key={field} className="block text-xs">
            <span className="text-muted-foreground">{field}</span>
            <Input
              value={value(field)}
              onChange={(e) =>
                setValues((v) => ({ ...v, [field]: e.target.value }))
              }
              className="mt-0.5 h-8 font-mono text-[11px]"
            />
          </label>
        ))}
      </div>

      <div className="flex shrink-0 gap-3 lg:flex-col">
        <button
          type="button"
          className="text-xs text-primary hover:underline disabled:opacity-50"
          onClick={useOriginal}
          disabled={saving || !images.original}
        >
          Usar original como translated
        </button>
        <button
          type="button"
          className="text-xs font-medium text-primary hover:underline disabled:opacity-50"
          onClick={save}
          disabled={saving}
        >
          {saving ? 'Salvando...' : 'Salvar'}
        </button>
      </div>
    </div>
  );
}

function ChapterPages({ chapterId }: { chapterId: number }) {
  const { data, error, mutate } = useSWR(
    adminKeys.chapterPages(chapterId),
    adminFetcher<TPagination<TAdminPage>>
  );

  if (error)
    return (
      <p className="p-3 text-sm text-red-400">
        Falha ao abrir as pages.
      </p>
    );
  if (!data)
    return (
      <p className="p-3 text-sm text-muted-foreground">
        <Loader2 className="mr-2 inline h-4 w-4 animate-spin" />
        Carregando pages...
      </p>
    );
  if (!data.results?.length)
    return (
      <p className="p-3 text-sm text-muted-foreground">Sem pages.</p>
    );

  return (
    <div className="divide-y divide-border/40 bg-muted/20">
      {data.results.map((page) => (
        <PageEditor key={page.id} page={page} onSaved={mutate} />
      ))}
    </div>
  );
}

export { ChapterPages };
