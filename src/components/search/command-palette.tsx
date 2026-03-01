'use client';

import { useDebounce } from 'ahooks';
import { useRouter } from 'next/navigation';
import * as React from 'react';

import {
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from '@/components/ui/command';
import { api } from '@/services/api';
import { Search } from 'lucide-react';

interface CommandPaletteProps {
  open: boolean;
  setOpen: (open: boolean) => void;
}

export function CommandPalette({
  open,
  setOpen,
}: CommandPaletteProps) {
  const [query, setQuery] = React.useState('');
  const [results, setResults] = React.useState<TManga[]>([]);
  const [loading, setLoading] = React.useState(false);
  const router = useRouter();

  const debouncedQuery = useDebounce(query, { wait: 300 });

  React.useEffect(() => {
    if (!debouncedQuery) {
      setResults([]);
      return;
    }

    let active = true;
    const fetchResults = async () => {
      setLoading(true);
      try {
        const response = await api.get(`manhwas/search/`, {
          searchParams: { query: debouncedQuery },
        });
        const data = await response.json<TManga[]>();
        if (active) {
          setResults(data);
        }
      } catch (error) {
        console.error('Error fetching search results:', error);
      } finally {
        if (active) {
          setLoading(false);
        }
      }
    };

    fetchResults();

    return () => {
      active = false;
    };
  }, [debouncedQuery]);

  const handleSelect = (slug: string) => {
    setOpen(false);
    router.push(`/manga/${slug}`);
  };

  return (
    <CommandDialog open={open} onOpenChange={setOpen}>
      <CommandInput
        placeholder="Buscar mangás por título, autor ou gênero..."
        value={query}
        onValueChange={setQuery}
      />
      <CommandList>
        {loading && (
          <div className="p-6 text-center text-sm text-muted-foreground">
            Buscando...
          </div>
        )}
        {!loading && query && results.length === 0 && (
          <CommandEmpty>Nenhum resultado encontrado.</CommandEmpty>
        )}
        {!loading && results.length > 0 && (
          <CommandGroup heading="Mangás encontrados">
            {results.map((manga) => (
              <CommandItem
                key={manga.id}
                value={manga.title}
                onSelect={() => handleSelect(manga.slug!)}
                className="flex items-center gap-3 cursor-pointer py-2"
              >
                {manga.thumbnail?.original ? (
                  <img
                    src={manga.thumbnail.original}
                    alt={manga.title}
                    className="w-10 h-14 object-cover rounded-md"
                  />
                ) : (
                  <div className="w-10 h-14 rounded-md bg-muted flex flex-shrink-0 items-center justify-center">
                    <Search className="w-4 h-4 text-muted-foreground" />
                  </div>
                )}
                <div className="flex flex-col overflow-hidden">
                  <span className="font-medium truncate">
                    {manga.title}
                  </span>
                  <div className="flex items-center gap-2 mt-1">
                    <span className="text-xs text-muted-foreground truncate max-w-[150px]">
                      {manga.author || 'Autor desconhecido'}
                    </span>
                    <span className="text-xs bg-accent text-accent-foreground px-1.5 py-0.5 rounded">
                      {manga.status}
                    </span>
                  </div>
                </div>
              </CommandItem>
            ))}
          </CommandGroup>
        )}
      </CommandList>
    </CommandDialog>
  );
}
