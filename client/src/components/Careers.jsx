import { useEffect, useState } from 'react';
import api from '../api/axios';
import { useReveal } from '../hooks/useReveal';
import { trackFormSubmit, trackEvent } from '../utils/analytics';

/* ── Apply Modal ──────────────────────────────────────────── */
function ApplyModal({ job, onClose }) {
  const [form, setForm] = useState({ name: '', email: '', message: '' });
  const [resumeFile, setResumeFile] = useState(null);
  const [dragOver, setDragOver] = useState(false);
  const [status, setStatus] = useState('idle'); // idle | loading | success | error

  /* Close on Escape, lock body scroll */
  useEffect(() => {
    const onKey = (e) => { if (e.key === 'Escape') onClose(); };
    window.addEventListener('keydown', onKey);
    document.body.style.overflow = 'hidden';
    return () => {
      window.removeEventListener('keydown', onKey);
      document.body.style.overflow = '';
    };
  }, [onClose]);

  /* File validation */
  const handleFile = (file) => {
    if (!file) return;
    const allowed = [
      'application/pdf',
      'application/msword',
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    ];
    if (!allowed.includes(file.type)) { alert('Please upload a PDF, DOC, or DOCX file.'); return; }
    if (file.size > 5 * 1024 * 1024) { alert('File too large — max 5 MB.'); return; }
    setResumeFile(file);
  };

  const onDrop = (e) => { e.preventDefault(); setDragOver(false); handleFile(e.dataTransfer.files[0]); };
  const fmt = (b) => b < 1024 * 1024 ? `${(b / 1024).toFixed(0)} KB` : `${(b / 1024 / 1024).toFixed(1)} MB`;

  /* Submit */
  const submit = async (e) => {
    e.preventDefault();
    setStatus('loading');
    try {
      const fd = new FormData();
      fd.append('name', form.name);
      fd.append('email', form.email);
      fd.append('role', job.title);
      fd.append('message', form.message);
      if (resumeFile) fd.append('resume', resumeFile);
      await api.post('/careers/apply', fd, { headers: { 'Content-Type': 'multipart/form-data' } });
      setStatus('success');
      trackFormSubmit('job_application');
    } catch {
      setStatus('error');
      trackEvent('form_error', { event_label: 'job_application' });
    }
  };

  return (
    <div className="am-overlay" onClick={onClose}>
      <div className="am-box" onClick={(e) => e.stopPropagation()}>

        {/* ── Header ── */}
        <div className="am-header">
          <div>
            <div className="am-eyebrow">
              <span className="am-tag rem">{job.type}</span>
              <span className="am-tag typ">{job.department}</span>
              <span className="am-tag dep">{job.location}</span>
            </div>
            <h2 className="am-title">
              {status === 'success' ? 'Application Sent! 🎉' : job.title}
            </h2>
          </div>
          <button className="am-close" onClick={onClose} title="Close">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
              <line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" />
            </svg>
          </button>
        </div>

        {/* ── Body ── */}
        <div className="am-body">

          {/* Success state */}
          {status === 'success' ? (
            <div className="am-success">
              <div className="am-success-icon">🎉</div>
              <p className="am-success-text">
                We've received your application and will be in touch soon. Thanks for your interest in Stackvine!
              </p>
              <button className="am-submit" onClick={onClose}>Close</button>
            </div>
          ) : (
            <form onSubmit={submit} className="am-form">

              {/* Name */}
              <div className="am-field">
                <label className="am-label">Full Name</label>
                <input
                  className="am-input"
                  required
                  value={form.name}
                  onChange={(e) => setForm(f => ({ ...f, name: e.target.value }))}
                  placeholder="Shailesh Jukaria"
                />
              </div>

              {/* Email */}
              <div className="am-field">
                <label className="am-label">Email Address</label>
                <input
                  className="am-input"
                  type="email"
                  required
                  value={form.email}
                  onChange={(e) => setForm(f => ({ ...f, email: e.target.value }))}
                  placeholder="you@example.com"
                />
              </div>

              {/* Message */}
              <div className="am-field">
                <label className="am-label">
                  Why Stackvine?
                  <span className="am-optional"> — optional</span>
                </label>
                <textarea
                  className="am-input am-textarea"
                  rows={3}
                  value={form.message}
                  onChange={(e) => setForm(f => ({ ...f, message: e.target.value }))}
                  placeholder="Tell us a bit about yourself and why you want to join..."
                />
              </div>

              {/* Resume Upload */}
              <div className="am-field">
                <label className="am-label">
                  Resume / CV
                  <span className="am-optional"> — PDF, DOC, DOCX · max 5 MB</span>
                </label>

                {resumeFile ? (
                  /* File selected pill */
                  <div className="am-file-pill">
                    <span className="am-file-icon">📄</span>
                    <div className="am-file-info">
                      <div className="am-file-name">{resumeFile.name}</div>
                      <div className="am-file-size">{fmt(resumeFile.size)}</div>
                    </div>
                    <button type="button" className="am-file-remove" onClick={() => setResumeFile(null)} title="Remove">
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
                        <line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" />
                      </svg>
                    </button>
                  </div>
                ) : (
                  /* Drop zone */
                  <div
                    className={`am-dropzone${dragOver ? ' drag' : ''}`}
                    onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
                    onDragLeave={() => setDragOver(false)}
                    onDrop={onDrop}
                    onClick={() => document.getElementById('am-file-input').click()}
                  >
                    <div className="am-drop-icon">📎</div>
                    <div className="am-drop-text">
                      <span className="am-drop-cta">Click to upload</span> or drag & drop
                    </div>
                    <div className="am-drop-hint">PDF, DOC, DOCX — max 5 MB</div>
                  </div>
                )}

                <input
                  id="am-file-input"
                  type="file"
                  accept=".pdf,.doc,.docx"
                  style={{ display: 'none' }}
                  onChange={(e) => handleFile(e.target.files[0])}
                />
              </div>

              {/* Error */}
              {status === 'error' && (
                <div className="am-error">⚠️ Something went wrong. Please try again.</div>
              )}

              {/* Submit */}
              <button type="submit" className="am-submit" disabled={status === 'loading'}>
                {status === 'loading' ? (
                  <><span className="am-spinner" />Submitting…</>
                ) : (
                  'Submit Application →'
                )}
              </button>

            </form>
          )}
        </div>
      </div>
    </div>
  );
}

/* ── Careers Section ──────────────────────────────────────── */
export default function Careers() {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selected, setSelected] = useState(null);
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

        {/* Loading skeleton */}
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

        {/* Empty state */}
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

        {/* Job listings */}
        {!loading && jobs.length > 0 && (
          <div className="jlist">
            {jobs.map((j, idx) => (
              <div
                className={`jcard reveal d${Math.min(idx + 1, 4)}`}
                key={j._id}
                onClick={() => setSelected(j)}
                role="button"
                tabIndex={0}
                onKeyDown={e => e.key === 'Enter' && setSelected(j)}
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

      {selected && <ApplyModal job={selected} onClose={() => setSelected(null)} />}
    </section>
  );
}
