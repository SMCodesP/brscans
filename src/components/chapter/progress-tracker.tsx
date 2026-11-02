'use client';

import { useAuth } from '@/providers/auth-provider';
import { api } from '@/services/api';
import { useEventListener, useInterval, useUnmount } from 'ahooks';
import * as React from 'react';

interface ProgressTrackerProps {
  manhwaId: number;
  chapterId: number;
  totalPages: number;
}

export function ProgressTracker({
  manhwaId,
  chapterId,
  totalPages,
}: ProgressTrackerProps) {
  const { user, token } = useAuth();
  // página que o scroll viu por último; o intervalo grava daqui
  const lastPage = React.useRef<number | null>(null);
  const savedPage = React.useRef<number | null>(null);
  const markedRead = React.useRef(false);

  const saveNow = () => {
    if (!user || !token) return;
    const page = lastPage.current;
    if (page === null || page === savedPage.current) return;
    savedPage.current = page;
    api
      .post(`manhwas/${manhwaId}/progress/`, {
        headers: { Authorization: `Token ${token}` },
        json: { chapter_id: chapterId, page_number: page },
        // sobrevive ao fechamento da aba
        keepalive: true,
      })
      .catch((e) =>
        console.error('Failed to save reading progress', e)
      );

    if (page === totalPages && !markedRead.current) {
      api
        .post(`chapters/${chapterId}/mark-read/`, {
          headers: { Authorization: `Token ${token}` },
          keepalive: true,
        })
        .then(() => {
          markedRead.current = true;
        })
        .catch((e) =>
          console.error('Failed to mark chapter as read', e)
        );
    }
  };

  // Grava no máximo a cada 10 s e só quando a página mudou (antes: a cada
  // 400 ms de pausa no scroll); descarrega ao esconder a aba.
  useInterval(
    () => {
      if (!document.hidden) saveNow();
    },
    user && totalPages > 0 ? 10000 : -1
  );
  useEventListener('visibilitychange', saveNow, {
    target: () => document,
  });
  useEventListener('pagehide', saveNow);
  // navegar para o próximo capítulo no cliente não dispara pagehide
  useUnmount(saveNow);

  React.useEffect(() => {
    if (!user || totalPages === 0) return;

    let ticking = false;

    const handleScroll = () => {
      if (!ticking) {
        window.requestAnimationFrame(() => {
          const trackedPages = document.querySelectorAll(
            '.chapter-page[data-track-progress="true"]'
          );
          const pages =
            trackedPages.length > 0
              ? trackedPages
              : document.querySelectorAll('.chapter-page');
          if (pages.length === 0) {
            ticking = false;
            return;
          }

          let maxVisibleArea = 0;
          let activeIndex: string | null = null;
          const vh = window.innerHeight;

          pages.forEach((page) => {
            const rect = page.getBoundingClientRect();
            const visibleTop = Math.max(0, rect.top);
            const visibleBottom = Math.min(vh, rect.bottom);
            const visibleHeight = Math.max(
              0,
              visibleBottom - visibleTop
            );

            if (visibleHeight > maxVisibleArea) {
              maxVisibleArea = visibleHeight;
              activeIndex = page.getAttribute('data-page-index');
            }
          });

          if (activeIndex) {
            lastPage.current = parseInt(activeIndex, 10);
          }

          ticking = false;
        });
        ticking = true;
      }
    };

    window.addEventListener('scroll', handleScroll, {
      passive: true,
    });
    // Run once on mount in case they start at the top
    handleScroll();

    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, [user, totalPages]);

  return null;
}
