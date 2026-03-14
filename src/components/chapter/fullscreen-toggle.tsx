'use client';

import { Button } from '@/components/ui/button';
import { Maximize, Minimize } from 'lucide-react';
import { useCallback, useEffect, useRef, useState } from 'react';

const AUTO_FULLSCREEN_KEY = 'brscans_auto_fullscreen';

function FullscreenToggle() {
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [isSupported, setIsSupported] = useState(false);
  const [isControlVisible, setIsControlVisible] = useState(true);
  const hideTimer = useRef<number | null>(null);

  const getFullscreenElement = useCallback(() => {
    const webkitFullscreenElement = (
      document as Document & {
        webkitFullscreenElement?: Element | null;
      }
    ).webkitFullscreenElement;

    return document.fullscreenElement || webkitFullscreenElement;
  }, []);

  const canRequestFullscreen = useCallback(() => {
    const root = document.documentElement as HTMLElement & {
      webkitRequestFullscreen?: () => Promise<void> | void;
    };

    return Boolean(
      root.requestFullscreen || root.webkitRequestFullscreen
    );
  }, []);

  const updateFullscreenState = useCallback(() => {
    setIsFullscreen(Boolean(getFullscreenElement()));
  }, [getFullscreenElement]);

  const requestFullscreen = useCallback(async () => {
    const root = document.documentElement as HTMLElement & {
      webkitRequestFullscreen?: () => Promise<void> | void;
    };

    if (getFullscreenElement()) {
      return;
    }

    try {
      if (root.requestFullscreen) {
        await root.requestFullscreen();
      } else if (root.webkitRequestFullscreen) {
        await root.webkitRequestFullscreen();
      } else {
        return;
      }

      localStorage.setItem(AUTO_FULLSCREEN_KEY, '1');
    } catch {
      // Ignore permission/user-gesture rejections.
    }
  }, [getFullscreenElement]);

  const exitFullscreen = useCallback(async () => {
    const webkitDocument = document as Document & {
      webkitExitFullscreen?: () => Promise<void> | void;
    };

    if (!getFullscreenElement()) {
      return;
    }

    try {
      if (document.exitFullscreen) {
        await document.exitFullscreen();
      } else if (webkitDocument.webkitExitFullscreen) {
        await webkitDocument.webkitExitFullscreen();
      }
    } catch {
      // Ignore failures from unsupported environments.
    }
  }, [getFullscreenElement]);

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
    const supported = canRequestFullscreen();
    setIsSupported(supported);
    updateFullscreenState();

    if (!supported) {
      return;
    }

    document.addEventListener(
      'fullscreenchange',
      updateFullscreenState
    );
    document.addEventListener(
      'webkitfullscreenchange',
      updateFullscreenState as EventListener
    );

    return () => {
      document.removeEventListener(
        'fullscreenchange',
        updateFullscreenState
      );
      document.removeEventListener(
        'webkitfullscreenchange',
        updateFullscreenState as EventListener
      );
    };
  }, [canRequestFullscreen, updateFullscreenState]);

  useEffect(() => {
    if (!isSupported) {
      return;
    }

    revealControl();

    const onTapLikeInteraction = () => {
      revealControl();
    };

    const onKeyDown = () => {
      revealControl();
    };

    window.addEventListener('click', onTapLikeInteraction, {
      passive: true,
    });
    window.addEventListener('touchend', onTapLikeInteraction, {
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

    if (autoEnabled && isMobileDevice && !getFullscreenElement()) {
      const autoEnter = () => {
        void requestFullscreen();
        window.removeEventListener('pointerdown', autoEnter, true);
        window.removeEventListener('touchstart', autoEnter, true);
        window.removeEventListener('click', autoEnter, true);
        window.removeEventListener('keydown', autoEnter, true);
      };

      window.addEventListener('pointerdown', autoEnter, {
        passive: true,
        capture: true,
      });
      window.addEventListener('touchstart', autoEnter, {
        passive: true,
        capture: true,
      });
      window.addEventListener('click', autoEnter, {
        passive: true,
        capture: true,
      });
      window.addEventListener('keydown', autoEnter, {
        capture: true,
      });

      cleanupAutoEnter = () => {
        window.removeEventListener('pointerdown', autoEnter, true);
        window.removeEventListener('touchstart', autoEnter, true);
        window.removeEventListener('click', autoEnter, true);
        window.removeEventListener('keydown', autoEnter, true);
      };
    }

    return () => {
      cleanupAutoEnter?.();
      window.removeEventListener('click', onTapLikeInteraction);
      window.removeEventListener('touchend', onTapLikeInteraction);
      window.removeEventListener('keydown', onKeyDown);

      if (hideTimer.current !== null) {
        window.clearTimeout(hideTimer.current);
        hideTimer.current = null;
      }
    };
  }, [
    getFullscreenElement,
    isSupported,
    requestFullscreen,
    revealControl,
  ]);

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
