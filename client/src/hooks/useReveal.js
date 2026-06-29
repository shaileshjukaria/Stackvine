import { useEffect, useRef } from 'react';

/**
 * useReveal — attaches an IntersectionObserver to all .reveal children.
 * Pass `deps` (e.g. [data]) so the observer re-runs after async data loads.
 */
export function useReveal(deps = []) {
  const ref = useRef(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('visible');
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.08, rootMargin: '0px 0px -40px 0px' }
    );

    // Small delay so React has flushed the DOM after data updates
    const timer = setTimeout(() => {
      el.querySelectorAll('.reveal:not(.visible)').forEach((r) => observer.observe(r));
    }, 60);

    return () => {
      clearTimeout(timer);
      observer.disconnect();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, deps);

  return ref;
}
