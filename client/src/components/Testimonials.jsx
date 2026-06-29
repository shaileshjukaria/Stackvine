import { useEffect, useState } from 'react';
import api from '../api/axios';
import { useReveal } from '../hooks/useReveal';

export default function Testimonials() {
  const [testimonials, setTestimonials] = useState([]);
  const [loading, setLoading] = useState(true);

  const ref = useReveal([testimonials]);

  useEffect(() => {
    api.get('/testimonials')
      .then(r => setTestimonials(r.data))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  return (
    <section id="testimonials" ref={ref}>
      <div className="container">
        <div className="reveal">
          <div className="eyebrow">What Clients Say</div>
          <h2 className="section-heading">Straight From the People We Shipped For</h2>
        </div>

        {loading && (
          <div className="tgrid" style={{ marginTop: 52 }}>
            {[1, 2, 3].map(i => (
              <div key={i} style={{
                height: 200, borderRadius: 20,
                background: 'var(--bg-card)', border: '1px solid var(--border)',
              }} />
            ))}
          </div>
        )}

        {!loading && testimonials.length === 0 && (
          <div className="reveal" style={{
            marginTop: 52, textAlign: 'center', padding: '48px 0',
            color: 'var(--t3)', fontFamily: 'JetBrains Mono, monospace', fontSize: 13,
          }}>
            Client testimonials coming soon.
          </div>
        )}

        {!loading && testimonials.length > 0 && (
          <div className="tgrid">
            {testimonials.map((t, i) => (
              <div className={`tcard reveal d${Math.min(i + 1, 4)}`} key={t._id}>
                <div className="tstars">{'★'.repeat(t.stars || 5)}</div>
                <div className="tquote">{t.quote}</div>
                <div className="tauthor">
                  <div className="tavatar">{t.initials}</div>
                  <div>
                    <div className="tname">{t.author}</div>
                    <div className="trole">{t.role}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
