'use client';

import { Tag } from 'lucide-react';

interface GenreFilterProps {
  genres: TGenre[];
  selected?: string | null;
  onSelect?: (slug: string | null) => void;
}

export default function GenreFilter({
  genres,
  selected,
  onSelect,
}: GenreFilterProps) {
  if (!genres.length) return null;

  return (
    <section>
      <h2 className="section-header flex items-center gap-2 mb-5">
        <Tag className="w-5 h-5 text-primary" />
        Gêneros
      </h2>

      <div className="flex flex-wrap gap-2">
        <button
          onClick={() => onSelect?.(null)}
          className={`px-4 py-2 text-xs font-semibold rounded-full transition-all duration-200 ${
            !selected
              ? 'bg-primary text-primary-foreground shadow-md shadow-primary/25'
              : 'bg-secondary text-secondary-foreground hover:bg-accent hover:text-accent-foreground'
          }`}
        >
          Todos
        </button>
        {genres.map((genre) => (
          <button
            key={genre.id}
            onClick={() =>
              onSelect?.(genre.slug === selected ? null : genre.slug)
            }
            className={`px-4 py-2 text-xs font-semibold rounded-full transition-all duration-200 ${
              selected === genre.slug
                ? 'bg-primary text-primary-foreground shadow-md shadow-primary/25'
                : 'bg-secondary text-secondary-foreground hover:bg-accent hover:text-accent-foreground'
            }`}
          >
            {genre.name}
          </button>
        ))}
      </div>
    </section>
  );
}
