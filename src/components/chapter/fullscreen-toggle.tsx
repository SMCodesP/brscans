'use client';

import { Button } from '@/components/ui/button';
import { Maximize, Minimize } from 'lucide-react';
import {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';

const AUTO_FULLSCREEN_KEY = 'brscans_auto_fullscreen';

function FullscreenToggle() {
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [isSupported, setIsSupported] = useState(false);
  const [isControlVisible, setIsControlVisible] = useState(true);
  const hideTimer = useRef<number | null>(null);
  const pointerStartX = useRef(0);
  const pointerStartY = useRef(0);

  const rootElement = useMemo(
    () => document.documentElement as HTMLElement,
    []
  );

  const updateFullscreenState = useCallback(() => {
    setIsFullscreen(Boolean(document.fullscreenElement));
  }, []);

  const requestFullscreen = useCallback(async () => {
    if (!document.fullscreenEnabled || document.fullscreenElement) {
      return;
    }

    try {
      await rootElement.requestFullscreen();
      localStorage.setItem(AUTO_FULLSCREEN_KEY, '1');
    } catch {
      // Ignore permission/user-gesture rejections.
    }
  }, [rootElement]);

  const exitFullscreen = useCallback(async () => {
    if (!document.fullscreenElement) {
      return;
    }

    try {
      await document.exitFullscreen();
    } catch {
      // Ignore failures from unsupported environments.
    }
  }, []);

  const toggleFullscreen = useCallback(() => {
    if (isFullscreen) {
      void exitFullscreen();
      return;
    }

    void requestFullscreen();
  }, [exitFullscreen, isFullscreen, requestFullscreen]);

  const scheduleHide = useCallback((delay = 2200) => {
    if (hideTimer.current !== null) {
      window.clearTimeout(hideTimer.current);
    }

    hideTimer.current = window.setTimeout(() => {
      setIsControlVisible(false);
    }, delay);
  }, []);

  const revealControl = useCallback(() => {
    setIsControlVisible(true);
    scheduleHide();
  }, [scheduleHide]);

  useEffect(() => {
    const supported = Boolean(document.fullscreenEnabled);
    setIsSupported(supported);
    updateFullscreenState();

    if (!supported) {
      return;
    }

    document.addEventListener(
      'fullscreenchange',
      updateFullscreenState
    );

    return () => {
      document.removeEventListener(
        'fullscreenchange',
        updateFullscreenState
      );
    };
  }, [updateFullscreenState]);

  useEffect(() => {
    if (!isSupported) {
      return;
    }

    revealControl();

    const onPointerDown = (event: PointerEvent) => {
      pointerStartX.current = event.clientX;
      pointerStartY.current = event.clientY;
    };

    const onPointerUp = (event: PointerEvent) => {
      const deltaX = Math.abs(event.clientX - pointerStartX.current);
      const deltaY = Math.abs(event.clientY - pointerStartY.current);

      // Ignore drag/scroll gestures and only react to tap-like interactions.
      if (deltaX < 10 && deltaY < 10) {
        revealControl();
      }
    };

    const onKeyDown = () => {
      revealControl();
    };

    window.addEventListener('pointerdown', onPointerDown, {
      passive: true,
    });
    window.addEventListener('pointerup', onPointerUp, {
      passive: true,
    });
    window.addEventListener('keydown', onKeyDown);

    const autoEnabled =
      localStorage.getItem(AUTO_FULLSCREEN_KEY) === '1';
    const isMobileDevice =
      typeof window.matchMedia === 'function' &&
      window.matchMedia('(hover: none) and (pointer: coarse)')
        .matches;
    let cleanupAutoEnter: (() => void) | null = null;

    if (
      autoEnabled &&
      isMobileDevice &&
      !document.fullscreenElement
    ) {
      const autoEnter = () => {
        void requestFullscreen();
        window.removeEventListener('pointerdown', autoEnter, true);
        window.removeEventListener('keydown', autoEnter, true);
      };

      window.addEventListener('pointerdown', autoEnter, {
        passive: true,
        capture: true,
      });
      window.addEventListener('keydown', autoEnter, {
        capture: true,
      });

      cleanupAutoEnter = () => {
        window.removeEventListener('pointerdown', autoEnter, true);
        window.removeEventListener('keydown', autoEnter, true);
      };
    }

    return () => {
      cleanupAutoEnter?.();
      window.removeEventListener('pointerdown', onPointerDown);
      window.removeEventListener('pointerup', onPointerUp);
      window.removeEventListener('keydown', onKeyDown);

      if (hideTimer.current !== null) {
        window.clearTimeout(hideTimer.current);
      }
    };
  }, [isSupported, requestFullscreen, revealControl]);

  if (!isSupported) {
    return null;
  }

  return (
    <div
      className={`fixed bottom-6 right-4 z-40 transition-all duration-200 md:right-6 ${
        isControlVisible
          ? 'translate-y-0 opacity-100'
          : 'pointer-events-none translate-y-2 opacity-0'
      }`}
    >
      <Button
        type="button"
        variant="secondary"
        className="shadow-lg gap-2"
        onClick={toggleFullscreen}
      >
        {isFullscreen ? (
          <>
            <Minimize className="size-4" />
            <span className="hidden sm:inline">
              Sair da tela cheia
            </span>
          </>
        ) : (
          <>
            <Maximize className="size-4" />
            <span className="hidden sm:inline">Tela cheia</span>
          </>
        )}
      </Button>
    </div>
  );
}

export { FullscreenToggle };
