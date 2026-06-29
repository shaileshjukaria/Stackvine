import { useEffect, useRef, useState } from 'react';
import api from '../api/axios';

export default function Stats() {
  const [stats, setStats] = useState([]);
  const ref = useRef(null);

  useEffect(() => {
    api.get('/stats')
      .then(r => setStats(r.data))
      .catch(console.error);
  }, []);

  // Run counter animation after stats load
  useEffect(() => {
    if (stats.length === 0) return;

    const el = ref.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const counterEl = entry.target;
            const target = parseInt(counterEl.dataset.target, 10);
            const duration = 1800;
            const step = Math.ceil(target / (duration / 16));
            let current = 0;
            const tick = () => {
              current = Math.min(current + step, target);
              counterEl.textContent = current.toLocaleString();
              if (current < target) requestAnimationFrame(tick);
            };
            requestAnimationFrame(tick);
            observer.unobserve(counterEl);
          }
        });
      },
      { threshold: 0.5 }
    );

    // Small delay so React has flushed new DOM
    const timer = setTimeout(() => {
      el.querySelectorAll('.counter').forEach(c => observer.observe(c));
    }, 80);

    return () => {
      clearTimeout(timer);
      observer.disconnect();
    };
  }, [stats]);

  if (stats.length === 0) return null;

  return (
    <section id="stats" ref={ref}>
      <div className="container">
        <div className="stats-grid">
          {stats.map((s) => (
            <div className="sitem" key={s.key}>
              <div className="snum">
                <span
                  className="counter"
                  data-target={s.value}
                >
                  0
                </span>
                <sup>{s.suffix}</sup>
              </div>
              <div className="slabel">{s.label}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
