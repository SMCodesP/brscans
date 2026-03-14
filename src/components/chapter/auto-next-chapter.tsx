'use client';

import { Loader } from 'lucide-react';
import { usePathname, useRouter } from 'next/navigation';
import { useEffect, useMemo, useRef, useState } from 'react';

type AutoNextChapterProps = {
  mangaId: string;
  nextChapterId?: number;
};

function AutoNextChapter({
  mangaId,
  nextChapterId,
}: AutoNextChapterProps) {
  const router = useRouter();
  const pathname = usePathname();
  const sentinelRef = useRef<HTMLDivElement | null>(null);
  const hasNavigatedRef = useRef(false);
  const [isNavigating, setIsNavigating] = useState(false);

  const nextUrl = useMemo(() => {
    if (!nextChapterId) {
      return null;
    }

    return `/manga/${mangaId}/chapter/${nextChapterId}`;
  }, [mangaId, nextChapterId]);

  useEffect(() => {
    hasNavigatedRef.current = false;
    setIsNavigating(false);
  }, [pathname, nextUrl]);

  useEffect(() => {
    if (!nextUrl) {
      return;
    }

    router.prefetch(nextUrl);
  }, [nextUrl, router]);

  useEffect(() => {
    if (!nextUrl || !sentinelRef.current) {
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        if (!entries[0]?.isIntersecting || hasNavigatedRef.current) {
          return;
        }

        hasNavigatedRef.current = true;
        setIsNavigating(true);
        router.push(nextUrl);
      },
      {
        root: null,
        rootMargin: '600px 0px',
        threshold: 0,
      }
    );

    observer.observe(sentinelRef.current);

    return () => {
      observer.disconnect();
    };
  }, [nextUrl, router]);

  if (!nextUrl) {
    return null;
  }

  return (
    <div
      ref={sentinelRef}
      className="flex w-full items-center justify-center py-10"
    >
      <div className="flex items-center gap-2 text-sm text-muted-foreground">
        <Loader className="h-4 w-4 animate-spin" />
        <span>
          {isNavigating
            ? 'Abrindo próximo capítulo...'
            : 'Preparando próximo capítulo...'}
        </span>
      </div>
    </div>
  );
}

export { AutoNextChapter };
