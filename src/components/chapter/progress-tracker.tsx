'use client';

import { useAuth } from '@/providers/auth-provider';
import { api } from '@/services/api';
import { useDebounceFn } from 'ahooks';
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
  const [markedRead, setMarkedRead] = React.useState(false);

  const saveProgress = async (pageNumber: number) => {
    if (!user || !token) return;
    try {
      await api.post(`manhwas/${manhwaId}/progress/`, {
        headers: { Authorization: `Token ${token}` },
        json: { chapter_id: chapterId, page_number: pageNumber },
      });
    } catch (e) {
      console.error('Failed to save reading progress', e);
    }
  };

  const markChapterAsRead = async () => {
    if (!user || !token || markedRead) return;
    try {
      await api.post(`chapters/${chapterId}/mark-read/`, {
        headers: { Authorization: `Token ${token}` },
      });
      setMarkedRead(true);
    } catch (e) {
      console.error('Failed to mark chapter as read', e);
    }
  };

  const { run: debouncedSaveProgress } = useDebounceFn(
    (pageNumber: number) => {
      console.log('Saving progress for page', pageNumber);
      saveProgress(pageNumber);
      if (pageNumber === totalPages && totalPages > 0) {
        markChapterAsRead();
      }
    },
    { wait: 400 }
  );

  React.useEffect(() => {
    if (!user || totalPages === 0) return;

    let ticking = false;

    const handleScroll = () => {
      if (!ticking) {
        window.requestAnimationFrame(() => {
          const pages = document.querySelectorAll('.chapter-page');
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
            debouncedSaveProgress(parseInt(activeIndex, 10));
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
  }, [user, totalPages, debouncedSaveProgress]);

  return null;
}
