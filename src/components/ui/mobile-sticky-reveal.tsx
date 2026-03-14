'use client';

import { useEffect, useRef, useState } from 'react';

import { cn } from '@/lib/utils';

type MobileStickyRevealProps = {
  children: React.ReactNode;
  className?: string;
};

function MobileStickyReveal({
  children,
  className,
}: MobileStickyRevealProps) {
  const [isHidden, setIsHidden] = useState(false);
  const lastScrollY = useRef(0);
  const ticking = useRef(false);

  useEffect(() => {
    const onScroll = () => {
      if (ticking.current) return;

      ticking.current = true;

      requestAnimationFrame(() => {
        const currentScrollY = window.scrollY;
        const delta = currentScrollY - lastScrollY.current;

        if (currentScrollY < 48) {
          setIsHidden(false);
        } else if (Math.abs(delta) > 6) {
          setIsHidden(delta > 0);
        }

        lastScrollY.current = currentScrollY;
        ticking.current = false;
      });
    };

    window.addEventListener('scroll', onScroll, { passive: true });

    return () => {
      window.removeEventListener('scroll', onScroll);
    };
  }, []);

  return (
    <div
      className={cn(
        'sticky z-30 transition-transform duration-200 ease-out ',
        isHidden
          ? '-translate-y-[calc(100%+0.5rem)]'
          : 'translate-y-0',
        className
      )}
    >
      {children}
    </div>
  );
}

export { MobileStickyReveal };
