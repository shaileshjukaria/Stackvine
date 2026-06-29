import { useEffect, useRef } from 'react';

export function useCounter() {
  const ref = useRef(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const el = entry.target;
            const target = parseInt(el.dataset.target, 10);
            const duration = 1600;
            const step = Math.ceil(target / (duration / 16));
            let current = 0;
            const tick = () => {
              current = Math.min(current + step, target);
              el.textContent = current;
              if (current < target) requestAnimationFrame(tick);
            };
            requestAnimationFrame(tick);
            observer.unobserve(el);
          }
        });
      },
      { threshold: 0.5 }
    );

    const el = ref.current;
    if (el) {
      el.querySelectorAll('.counter').forEach((c) => observer.observe(c));
    }

    return () => observer.disconnect();
  }, []);

  return ref;
}
