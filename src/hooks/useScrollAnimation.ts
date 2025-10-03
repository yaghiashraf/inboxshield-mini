'use client';

import { useEffect, useRef } from 'react';

type ScrollAnimationOptions = {
  rootMargin?: string;
  threshold?: number | number[];
  triggerOnce?: boolean;
};

export const useScrollAnimation = (options?: ScrollAnimationOptions) => {
  const ref = useRef<HTMLElement>(null);

  useEffect(() => {
    if (!ref.current) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
          if (options?.triggerOnce) {
            observer.unobserve(entry.target);
          }
        }
      },
      {
        rootMargin: options?.rootMargin || '0px',
        threshold: options?.threshold || 0.1,
      }
    );

    observer.observe(ref.current);

    return () => {
      if (ref.current) {
        observer.unobserve(ref.current);
      }
    };
  }, [options]);

  return ref;
};