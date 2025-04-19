'use client';

import { cn } from '@/lib/utils';
import { AnimatePresence, cubicBezier, motion } from 'framer-motion';
import {
  ReactElement,
  ReactNode,
  createContext,
  startTransition,
  useContext,
  useEffect,
  useRef,
  useState,
} from 'react';

const transition = {
  type: 'tween',
  ease: cubicBezier(0.8, 0.15, 0.05, 1.1),
  duration: 0.6,
};

const getHoverAnimationProps = (
  hoveredRect?: DOMRect,
  navRect?: DOMRect
) => {
  if (!hoveredRect || !navRect) {
    return {
      x: 0,
      y: 0,
      width: 0,
      height: 0,
    };
  }
  return {
    x: hoveredRect.left - navRect.left - 9,
    y: hoveredRect.top - navRect.top - 2,
    width: hoveredRect.width + 18,
    height: hoveredRect.height + 4,
  };
};

const TabContext = createContext<{
  selectedTabIndex?: string;
  setSelectedTabIndex?: (index: string) => void;
}>({});

export const TabProvider = ({
  children,
  defaultTab,
}: {
  children: ReactNode;
  defaultTab?: string;
}) => {
  const [selectedTabIndex, setSelectedTabIndex] = useState<
    string | undefined
  >(defaultTab);

  return (
    <TabContext value={{ selectedTabIndex, setSelectedTabIndex }}>
      {children}
    </TabContext>
  );
};

export const useTabContext = () => {
  const context = useContext(TabContext);
  if (!context) {
    console.log('useTabContext must be used within a TabProvider');
    throw new Error(
      'useTabContext must be used within a TabProvider'
    );
  }
  return context;
};

export const TabItem = ({
  children,
  value,
}: {
  children: ReactNode;
  value: string;
}) => {
  const { selectedTabIndex } = useTabContext();
  return (
    <AnimatePresence mode="popLayout">
      {selectedTabIndex === value && (
        <motion.div
          initial={{ opacity: 0, filter: 'blur(8px)' }}
          animate={{ opacity: 1, filter: 'blur(0px)' }}
          exit={{ opacity: 0, filter: 'blur(8px)' }}
          transition={transition}
        >
          {children}
        </motion.div>
      )}
    </AnimatePresence>
  );
};

const AnimatedTabs = ({
  tabs,
  className,
  defaultTab,
  callback,
}: {
  tabs: {
    label: string;
    value: string;
  }[];
  className?: string;
  defaultTab?: string;
  callback?: () => void;
}): ReactElement<any> => {
  const { selectedTabIndex, setSelectedTabIndex } = useTabContext();
  const [navRect, setNavRect] = useState<DOMRect | null>(null);
  const [selectedRect, setSelectedRect] = useState<DOMRect | null>(
    null
  );
  const [hoveredRect, setHoveredRect] = useState<DOMRect | null>(
    null
  );
  const [hoveredTabIndex, setHoveredTabIndex] = useState<
    string | null
  >(null);

  const buttonRefs = useRef<{
    [key: string]: HTMLButtonElement | null;
  }>({});

  const navRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setNavRect(navRef.current?.getBoundingClientRect() ?? null);
    setSelectedRect(
      buttonRefs.current[
        selectedTabIndex ?? 0
      ]?.getBoundingClientRect() ?? null
    );
    setHoveredRect(
      buttonRefs.current[
        hoveredTabIndex ?? -1
      ]?.getBoundingClientRect() ?? null
    );
  }, [selectedTabIndex, hoveredTabIndex, buttonRefs.current]);

  const handleTabChange = (index: string) => {
    startTransition(() => {
      setSelectedTabIndex?.(index);
      callback?.();
    });
  };

  return (
    <nav
      ref={navRef}
      className={cn(
        'w-fit flex flex-shrink-0 justify-center items-center relative z-0 p-1 bg-muted rounded-md text-muted-foreground',
        'shadow-[inset_0_2px_4px_rgba(0,0,0,0.01),_0_0px_16px_rgba(0,0,0,0.1)]',
        className
      )}
      onPointerLeave={() => setHoveredTabIndex(null)}
    >
      {tabs.map((item, i) => (
        <button
          key={item.value}
          className={cn(
            'relative uppercase font-semibold rounded-md flex items-center h-7 z-20 bg-transparent cursor-pointer select-none transition-colors px-4',
            i === 0 && 'pr-4 px-3',
            i === tabs.length - 1 && 'pl-4 px-3'
          )}
          onPointerEnter={() => setHoveredTabIndex(item.value)}
          onFocus={() => setHoveredTabIndex(item.value)}
          onBlur={() => setHoveredTabIndex(null)}
          onClick={() => handleTabChange(item.value)}
        >
          <motion.span
            ref={(el) => {
              buttonRefs.current[item.value] =
                el as HTMLButtonElement;
            }}
            className={cn(
              'block tracking-wider transition-all duration-1000 text-muted-foreground',
              selectedTabIndex === item.value && 'text-foreground'
            )}
          >
            <small className="relative z-[1]">{item.label}</small>
          </motion.span>
        </button>
      ))}

      <AnimatePresence>
        {hoveredRect && navRect && (
          <motion.div
            style={{ willChange: 'transform, opacity' }}
            className={cn(
              'absolute z-10 top-0 left-0 rounded-md bg-background/50'
            )}
            initial={{
              ...getHoverAnimationProps(
                selectedRect || hoveredRect,
                navRect
              ),
              opacity: 0,
              transition: { duration: 1.8 },
            }}
            animate={{
              ...getHoverAnimationProps(hoveredRect, navRect),
              opacity: 1,
            }}
            exit={{
              ...getHoverAnimationProps(
                selectedRect || hoveredRect,
                navRect
              ),
              opacity: 0,
            }}
            transition={transition}
          />
        )}
      </AnimatePresence>

      <AnimatePresence>
        {selectedRect && navRect && (
          <motion.div
            style={{ willChange: 'transform, opacity' }}
            className="absolute z-10 top-0 left-0 rounded-md bg-background"
            initial={{
              ...getHoverAnimationProps(selectedRect, navRect),
              opacity: 0,
            }}
            animate={{
              ...getHoverAnimationProps(selectedRect, navRect),
              opacity: 1,
            }}
            exit={{
              ...getHoverAnimationProps(selectedRect, navRect),
              opacity: 0,
            }}
            transition={transition}
          />
        )}
      </AnimatePresence>
    </nav>
  );
};

export { AnimatedTabs };
