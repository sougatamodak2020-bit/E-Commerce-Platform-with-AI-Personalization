// ============================================
// SCROLL POSITION HOOK
// ============================================

import { useState, useEffect } from 'react';

interface ScrollPosition {
  x: number;
  y: number;
}

export const useScrollPosition = (): ScrollPosition => {
  const [scrollPosition, setScrollPosition] = useState<ScrollPosition>({ x: 0, y: 0 });

  useEffect(() => {
    const handleScroll = () => {
      setScrollPosition({
        x: window.scrollX,
        y: window.scrollY,
      });
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();

    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return scrollPosition;
};

export const useIsScrolled = (threshold: number = 50): boolean => {
  const { y } = useScrollPosition();
  return y > threshold;
};
