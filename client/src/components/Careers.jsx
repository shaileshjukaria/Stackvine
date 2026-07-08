import { useEffect, useState } from 'react';
import api from '../api/axios';
import { useReveal } from '../hooks/useReveal';
import { navigateToApply } from '../utils/nav';

export default function Careers() {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const ref = useReveal([jobs]);

  useEffect(() => {
    api.get('/jobs')
      .then(r => setJobs(r.data))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  return (
    <section id="careers" ref={ref}>
      <div className="container">
        <div className="careers-hdr">
          <div className="reveal">
            <div className="eyebrow">Join the Team</div>
            <h2 className="section-heading">Open Roles</h2>
            <p className="section-sub">Remote-first. No red tape. Just shipping great products with a great team.</p>
          </div>
        </div>

        {loading && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
            {[1, 2, 3].map(i => (
              <div key={i} style={{
                height: 76, borderRadius: 14,
                background: 'var(--bg-hover)', border: '1px solid var(--border)',
                animation: 'pulse-skeleton 1.5s ease infinite',
              }} />
            ))}
          </div>
        )}

        {!loading && jobs.length === 0 && (
          <div className="reveal" style={{
            border: '1px dashed var(--border)', borderRadius: 14,
            padding: '48px 32px', textAlign: 'center',
          }}>
            <div style={{ fontSize: 40, marginBottom: 14 }}>🔍</div>
            <h3 style={{ fontFamily: 'Syne,sans-serif', fontSize: 20, fontWeight: 700, marginBottom: 10 }}>
              No Open Roles Right Now
            </h3>
            <p style={{ color: 'var(--t2)', fontSize: 14, lineHeight: 1.75, maxWidth: 400, margin: '0 auto 20px' }}>
              We're not actively hiring, but we're always interested in talented people.
            </p>
            <a href="mailto:hello.stackvine@outlook.com" className="btn-outline" style={{ display: 'inline-flex' }}>
              Send us your resume →
            </a>
          </div>
        )}

        {!loading && jobs.length > 0 && (
          <div className="jlist">
            {jobs.map((j, idx) => (
              <div
                className={`jcard reveal d${Math.min(idx + 1, 4)}`}
                key={j._id}
                onClick={() => navigateToApply(j)}
                role="button"
                tabIndex={0}
                onKeyDown={e => e.key === 'Enter' && navigateToApply(j)}
              >
                <div className="jleft">
                  <div className="jtitle">{j.title}</div>
                  <div className="jmeta">
                    <span className="jtag rem">{j.type}</span>
                    <span className="jtag typ">{j.department}</span>
                    <span className="jtag dep">{j.location}</span>
                  </div>
                </div>
                <div className="jarrow">→</div>
              </div>
            ))}
          </div>
        )}

        <p className="careers-note" style={{ marginTop: 26 }}>
          Don't see your role?{' '}
          <a href="mailto:hello.stackvine@outlook.com">Email us</a>
          {' '}— we're always open to great people.
        </p>
      </div>
    </section>
  );
}
