'use client';

import {
  Children,
  cloneElement,
  isValidElement,
  useEffect,
  useRef,
} from 'react';

import { cn } from '@/lib/utils';
import { gsap } from 'gsap';
import ScrollTrigger from 'gsap/ScrollTrigger';

const defaultConfig = [
  { opacity: 0, y: 30 },
  {
    opacity: 1,
    y: 0,
    duration: 0.45,
    stagger: 0.1,
  },
];

const configs = {
  sm: [
    { opacity: 0, y: 6 },
    {
      opacity: 1,
      y: 0,
      duration: 0.08,
      stagger: 0.04,
    },
  ],
  default: defaultConfig,
};

const SplitTextPoor: React.FC<{
  children: React.ReactNode;
  className?: string;
  config?: keyof typeof configs;
  split?: string;
  delay?: number;
  as?: any;
}> = ({
  children,
  className,
  config = 'default',
  as: As = 'div',
  split = ' ',
  delay,
}) => {
  gsap.registerPlugin(ScrollTrigger);

  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (containerRef.current) {
      const spans = containerRef.current.querySelectorAll('span');
      const selectedConfig = configs[config] || defaultConfig;

      gsap
        .timeline({
          scrollTrigger: {
            trigger: containerRef.current,
            start: 'top 80%',
            end: 'bottom 20%',
            toggleActions: 'play none none none',
          },
          delay,
        })
        .fromTo(
          spans,
          selectedConfig[0] as any,
          selectedConfig[1] as any
        );
    }
  }, []);

  const wrapWords = (node: React.ReactNode): React.ReactNode => {
    if (typeof node === 'string') {
      return node.split(split).map((word, index) => (
        <span
          key={index}
          style={{ display: 'inline-block', whiteSpace: 'nowrap' }}
          id="child"
          className="opacity-0"
        >
          {word}
          {split === ' ' &&
            index < node.split(split).length - 1 &&
            '\u00A0'}
        </span>
      ));
    }

    if (isValidElement(node)) {
      return cloneElement(node, {
        children: Children.map(
          (node?.props as any)?.children,
          wrapWords
        ),
      } as any);
    }

    return node;
  };

  return (
    <As
      ref={containerRef}
      className={cn(className, 'initial-opacity')}
      style={{ display: 'inline-block' }}
    >
      {Children.map(children, wrapWords)}
    </As>
  );
};

export { SplitTextPoor };
