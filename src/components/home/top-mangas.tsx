import Image from 'next/image';
import Link from 'next/link';

import { Crown, Medal, Trophy } from 'lucide-react';

interface TopMangasProps {
  mangas: TManga[];
}

const rankIcons = [
  <Trophy key="1" className="w-5 h-5 text-yellow-400" />,
  <Medal key="2" className="w-5 h-5 text-gray-300" />,
  <Medal key="3" className="w-5 h-5 text-amber-600" />,
];

export default function TopMangas({ mangas }: TopMangasProps) {
  if (!mangas.length) return null;

  return (
    <section>
      <h2 className="section-header flex items-center gap-2 mb-5">
        <Crown className="w-5 h-5 text-yellow-400" />
        Top Mangás
      </h2>

      <div className="flex flex-col gap-2">
        {mangas.map((manga, index) => (
          <Link
            key={manga.id}
            href={`/manga/${manga.id}/`}
            className="group"
          >
            <div
              className={`flex items-center gap-4 p-3 rounded-xl transition-all duration-300 hover:bg-accent/50 ${
                index < 3
                  ? 'bg-accent/30 ring-1 ring-primary/10'
                  : 'hover:ring-1 hover:ring-border'
              }`}
            >
              {/* Rank number */}
              <div className="flex items-center justify-center w-8 flex-shrink-0">
                {index < 3 ? (
                  rankIcons[index]
                ) : (
                  <span className="text-lg font-bold text-muted-foreground">
                    {index + 1}
                  </span>
                )}
              </div>

              {/* Thumbnail */}
              <div className="relative w-12 h-16 rounded-lg overflow-hidden flex-shrink-0 ring-1 ring-border/50">
                {manga?.thumbnail?.original && (
                  <Image
                    src={String(manga.thumbnail.original)}
                    alt={manga.title}
                    fill
                    className="object-cover group-hover:scale-110 transition-transform duration-300"
                    unoptimized
                  />
                )}
              </div>

              {/* Info */}
              <div className="flex flex-col gap-0.5 min-w-0 flex-1">
                <h3 className="text-sm font-semibold text-foreground group-hover:text-primary transition-colors line-clamp-1">
                  {manga.title}
                </h3>
                <p className="text-xs text-muted-foreground line-clamp-1">
                  {manga.status}
                </p>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
}
