'use client';

import { cn } from '@/lib/utils';
import {
  ComponentProps,
  ElementType,
  useLayoutEffect,
  useRef,
  useState,
} from 'react';

import gsap from 'gsap';
import ScrollTrigger from 'gsap/ScrollTrigger';

const defaultConfig = (space: number, duration: number = 0.8) => ({
  top: [
    { opacity: 0, y: space },
    {
      opacity: 1,
      y: 0,
      duration,
      stagger: 0.1,
    },
  ],
  bottom: [
    { opacity: 0, y: -space },
    {
      opacity: 1,
      y: 0,
      duration,
      stagger: 0.1,
    },
  ],
  left: [
    { opacity: 0, x: space },
    {
      opacity: 1,
      x: 0,
      duration,
      stagger: 0.1,
    },
  ],
  right: [
    { opacity: 0, x: -space },
    {
      opacity: 1,
      x: 0,
      duration,
      stagger: 0.1,
    },
  ],
});

function ContainerAnimation<T extends ElementType = 'div'>({
  className,
  children,
  position,
  delay,
  duration = 0.8,
  space = 20,
  distance = [80, 20],
  as: As = 'div',
  hideNotInView = false,
  ...props
}: ComponentProps<'div'> & {
  position?: 'top' | 'bottom' | 'left' | 'right';
  delay?: number;
  space?: number;
  duration?: number;
  distance?: [number, number];
  hideNotInView?: boolean;
  as?: T | string;
} & ComponentProps<T>) {
  gsap.registerPlugin(ScrollTrigger);
  const containerRef = useRef<HTMLDivElement>(null);
  const [show, setShow] = useState(!hideNotInView);

  useLayoutEffect(() => {
    if (containerRef.current) {
      const child = containerRef.current.querySelector('#child');
      gsap
        .timeline({
          scrollTrigger: {
            trigger: containerRef.current,
            start: `top ${distance[0]}%`,
            end: `bottom ${distance[1]}%`,
            toggleActions: 'play none none none',
            onEnter: () => {
              setShow(true);
            },
          },
          delay,
        })
        .fromTo(
          child,
          (defaultConfig(space, duration) as any)[
            position || 'top'
          ][0] || {},
          (defaultConfig(space, duration) as any)[
            position || 'top'
          ][1] || {}
        );
    }
  }, []);

  return (
    <>
      <As
        className={cn(position, className, 'initial-opacity')}
        {...props}
        ref={containerRef as any}
      >
        <div id="child" className="h-full opacity-0">
          {show && children}
        </div>
      </As>
    </>
  );
}

export default ContainerAnimation;
