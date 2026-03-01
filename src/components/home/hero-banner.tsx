'use client';

import Image from 'next/image';
import Link from 'next/link';

import { ChevronLeft, ChevronRight, Flame } from 'lucide-react';
import { AnimatePresence, motion } from 'motion/react';
import { useCallback, useEffect, useState } from 'react';

interface HeroBannerProps {
  mangas: TManga[];
}

export default function HeroBanner({ mangas }: HeroBannerProps) {
  const [current, setCurrent] = useState(0);
  const featured = mangas.slice(0, 5);

  const next = useCallback(() => {
    setCurrent((prev) => (prev + 1) % featured.length);
  }, [featured.length]);

  const prev = useCallback(() => {
    setCurrent((prev) => (prev - 1 + featured.length) % featured.length);
  }, [featured.length]);

  useEffect(() => {
    const interval = setInterval(next, 6000);
    return () => clearInterval(interval);
  }, [next]);

  if (!featured.length) return null;

  const manga = featured[current];

  return (
    <section className="relative w-full h-[420px] sm:h-[480px] rounded-2xl overflow-hidden group">
      {/* Background blur image */}
      <AnimatePresence mode="wait">
        <motion.div
          key={manga.id}
          initial={{ opacity: 0, scale: 1.05 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.6 }}
          className="absolute inset-0"
        >
          {manga?.thumbnail?.original && (
            <Image
              src={String(manga.thumbnail.original)}
              alt=""
              fill
              className="object-cover blur-sm brightness-[0.3] scale-110"
              unoptimized
              priority
            />
          )}
        </motion.div>
      </AnimatePresence>

      {/* Gradient overlays */}
      <div className="absolute inset-0 bg-gradient-to-r from-background/95 via-background/60 to-transparent z-[1]" />
      <div className="absolute inset-0 bg-gradient-to-t from-background/90 via-transparent to-transparent z-[1]" />

      {/* Content */}
      <div className="relative z-[2] h-full flex items-center px-6 sm:px-12">
        <div className="flex items-center gap-8 sm:gap-12 w-full max-w-5xl">
          {/* Cover art */}
          <AnimatePresence mode="wait">
            <motion.div
              key={manga.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.4 }}
            >
              <Link href={`/manga/${manga.id}/`}>
                <div className="relative aspect-[3/4] w-40 sm:w-52 rounded-xl overflow-hidden shadow-2xl shadow-primary/20 ring-1 ring-white/10 flex-shrink-0 hover:ring-primary/50 transition-all duration-300">
                  {manga?.thumbnail?.original && (
                    <Image
                      src={String(manga.thumbnail.original)}
                      alt={manga.title}
                      fill
                      className="object-cover"
                      unoptimized
                      priority
                    />
                  )}
                </div>
              </Link>
            </motion.div>
          </AnimatePresence>

          {/* Info */}
          <AnimatePresence mode="wait">
            <motion.div
              key={manga.id}
              initial={{ opacity: 0, x: 30 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -30 }}
              transition={{ duration: 0.4, delay: 0.1 }}
              className="flex flex-col gap-3 sm:gap-4 min-w-0"
            >
              <div className="flex items-center gap-2">
                <Flame className="w-4 h-4 text-orange-400" />
                <span className="text-xs font-semibold uppercase tracking-widest text-orange-400">
                  Em destaque
                </span>
              </div>
              <h2 className="text-2xl sm:text-4xl font-extrabold text-white leading-tight line-clamp-2">
                {manga.title}
              </h2>
              {manga.description && (
                <p className="text-sm sm:text-base text-white/60 line-clamp-3 max-w-lg">
                  {manga.description}
                </p>
              )}
              <div className="flex gap-3 mt-2">
                <Link
                  href={`/manga/${manga.id}/`}
                  className="inline-flex items-center px-5 py-2.5 bg-primary hover:bg-primary/90 text-primary-foreground text-sm font-semibold rounded-lg transition-colors shadow-lg shadow-primary/25"
                >
                  Ler Agora
                </Link>
              </div>
            </motion.div>
          </AnimatePresence>
        </div>
      </div>

      {/* Navigation arrows */}
      <button
        onClick={prev}
        className="absolute left-3 top-1/2 -translate-y-1/2 z-[3] p-2 rounded-full bg-black/40 backdrop-blur-sm text-white/70 hover:text-white hover:bg-black/60 transition-all opacity-0 group-hover:opacity-100"
        aria-label="Anterior"
      >
        <ChevronLeft className="w-5 h-5" />
      </button>
      <button
        onClick={next}
        className="absolute right-3 top-1/2 -translate-y-1/2 z-[3] p-2 rounded-full bg-black/40 backdrop-blur-sm text-white/70 hover:text-white hover:bg-black/60 transition-all opacity-0 group-hover:opacity-100"
        aria-label="Próximo"
      >
        <ChevronRight className="w-5 h-5" />
      </button>

      {/* Dots */}
      <div className="absolute bottom-4 left-1/2 -translate-x-1/2 z-[3] flex gap-2">
        {featured.map((_, i) => (
          <button
            key={_.id}
            onClick={() => setCurrent(i)}
            className={`h-1.5 rounded-full transition-all duration-300 ${
              i === current
                ? 'w-8 bg-primary'
                : 'w-1.5 bg-white/30 hover:bg-white/50'
            }`}
            aria-label={`Slide ${i + 1}`}
          />
        ))}
      </div>
    </section>
  );
}
