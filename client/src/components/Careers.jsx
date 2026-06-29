import { useEffect, useState } from 'react';
import api from '../api/axios';
import { useReveal } from '../hooks/useReveal';
import { trackFormSubmit, trackEvent } from '../utils/analytics';

function ApplyModal({ job, onClose }) {
  const [form, setForm] = useState({ name: '', email: '', message: '' });
  const [resumeFile, setResumeFile] = useState(null);
  const [dragOver, setDragOver] = useState(false);
  const [status, setStatus] = useState('idle');

  // Close on Escape key
  useEffect(() => {
    const handler = (e) => { if (e.key === 'Escape') onClose(); };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [onClose]);

  // Handle file selection (click or drag-drop)
  const handleFile = (file) => {
    if (!file) return;
    const allowed = ['application/pdf', 'application/msword',
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document'];
    if (!allowed.includes(file.type)) {
      alert('Please upload a PDF, DOC, or DOCX file.');
      return;
    }
    if (file.size > 5 * 1024 * 1024) {
      alert('File is too large. Maximum size is 5 MB.');
      return;
    }
    setResumeFile(file);
  };

  const onDrop = (e) => {
    e.preventDefault();
    setDragOver(false);
    handleFile(e.dataTransfer.files[0]);
  };

  const submit = async (e) => {
    e.preventDefault();
    setStatus('loading');
    try {
      // Build FormData to send file + text fields together
      const fd = new FormData();
      fd.append('name', form.name);
      fd.append('email', form.email);
      fd.append('role', job.title);
      fd.append('message', form.message);
      if (resumeFile) fd.append('resume', resumeFile);

      // Send as multipart/form-data (axios handles Content-Type automatically)
      await api.post('/careers/apply', fd, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });

      setStatus('success');
      trackFormSubmit('job_application');
    } catch (err) {
      setStatus('error');
      trackEvent('form_error', { event_label: 'job_application' });
    }
  };

  const formatBytes = (b) => b < 1024 * 1024
    ? `${(b / 1024).toFixed(0)} KB`
    : `${(b / 1024 / 1024).toFixed(1)} MB`;

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal" onClick={e => e.stopPropagation()}>
        <button className="modal-close" onClick={onClose}>✕</button>

        {status === 'success' ? (
          <div style={{ textAlign: 'center', padding: '20px 0' }}>
            <div style={{ fontSize: 44, marginBottom: 12 }}>🎉</div>
            <h3 className="modal-title">Application Sent!</h3>
            <p style={{ color: 'var(--t2)', fontSize: 14, lineHeight: 1.7 }}>
              We'll review your application and reach out soon.
            </p>
            <button className="btn-primary" style={{ marginTop: 20 }} onClick={onClose}>Close</button>
          </div>
        ) : (
          <form onSubmit={submit}>
            <h3 className="modal-title">Apply — {job.title}</h3>
            <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', marginBottom: 20 }}>
              <span className="jtag rem">{job.type}</span>
              <span className="jtag typ">{job.department}</span>
              <span className="jtag dep">{job.location}</span>
            </div>

            <div className="cfield" style={{ marginBottom: 12 }}>
              <label>Your Name</label>
              <input required value={form.name}
                onChange={e => setForm(f => ({ ...f, name: e.target.value }))}
                placeholder="Raj Patel" />
            </div>

            <div className="cfield" style={{ marginBottom: 12 }}>
              <label>Email</label>
              <input type="email" required value={form.email}
                onChange={e => setForm(f => ({ ...f, email: e.target.value }))}
                placeholder="you@example.com" />
            </div>

            <div className="cfield" style={{ marginBottom: 12 }}>
              <label>Why Stackvine? <span style={{ color: 'var(--t3)' }}>(optional)</span></label>
              <textarea rows={3} value={form.message}
                onChange={e => setForm(f => ({ ...f, message: e.target.value }))}
                placeholder="Tell us something about yourself..." />
            </div>

            {/* ── Resume Upload ─────────────────────────────── */}
            <div className="cfield" style={{ marginBottom: 20 }}>
              <label>
                Resume / CV{' '}
                <span style={{ color: 'var(--t3)', fontWeight: 400 }}>(PDF, DOC, DOCX · max 5 MB)</span>
              </label>

              {resumeFile ? (
                /* File chosen — show pill with remove button */
                <div style={{
                  display: 'flex', alignItems: 'center', gap: 12,
                  background: 'rgba(108,99,255,0.1)',
                  border: '1px solid rgba(108,99,255,0.35)',
                  borderRadius: 10, padding: '10px 14px',
                }}>
                  <span style={{ fontSize: 22 }}>📄</span>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{
                      color: 'var(--t1)', fontSize: 13, fontWeight: 600,
                      overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap',
                    }}>
                      {resumeFile.name}
                    </div>
                    <div style={{ color: 'var(--t3)', fontSize: 11, marginTop: 2 }}>
                      {formatBytes(resumeFile.size)}
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={() => setResumeFile(null)}
                    style={{
                      background: 'none', border: 'none', cursor: 'pointer',
                      color: 'var(--t3)', fontSize: 18, padding: 4, lineHeight: 1,
                    }}
                    title="Remove file"
                  >✕</button>
                </div>
              ) : (
                /* Drop zone */
                <div
                  onDragOver={e => { e.preventDefault(); setDragOver(true); }}
                  onDragLeave={() => setDragOver(false)}
                  onDrop={onDrop}
                  onClick={() => document.getElementById('resume-file-input').click()}
                  style={{
                    border: `2px dashed ${dragOver ? 'var(--accent)' : 'var(--border)'}`,
                    borderRadius: 12,
                    padding: '28px 20px',
                    textAlign: 'center',
                    cursor: 'pointer',
                    background: dragOver ? 'rgba(108,99,255,0.06)' : 'transparent',
                    transition: 'all .2s',
                  }}
                >
                  <div style={{ fontSize: 28, marginBottom: 8 }}>📎</div>
                  <div style={{ color: 'var(--t2)', fontSize: 13, lineHeight: 1.6 }}>
                    <span style={{ color: 'var(--accent)', fontWeight: 600 }}>Click to upload</span>
                    {' '}or drag & drop your resume
                  </div>
                  <div style={{ color: 'var(--t3)', fontSize: 11, marginTop: 4 }}>
                    PDF, DOC, DOCX — max 5 MB
                  </div>
                </div>
              )}

              {/* Hidden file input */}
              <input
                id="resume-file-input"
                type="file"
                accept=".pdf,.doc,.docx,application/pdf,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document"
                style={{ display: 'none' }}
                onChange={e => handleFile(e.target.files[0])}
              />
            </div>

            {status === 'error' && (
              <p style={{ color: 'var(--red)', fontSize: 13, marginBottom: 10 }}>
                Something went wrong. Please try again.
              </p>
            )}

            <button type="submit" className="cform-submit" disabled={status === 'loading'}>
              {status === 'loading' ? 'Submitting…' : 'Submit Application →'}
            </button>
          </form>
        )}
      </div>
    </div>
  );
}

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
            <p className="section-sub">
              Remote-first. No red tape. Just shipping great products with a great team.
            </p>
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
            <h3 style={{ fontFamily: 'Syne, sans-serif', fontSize: 20, fontWeight: 700, marginBottom: 10, color: 'var(--t1)' }}>
              No Open Roles Right Now
            </h3>
            <p style={{ color: 'var(--t2)', fontSize: 14, lineHeight: 1.75, maxWidth: 400, margin: '0 auto 20px' }}>
              We're not actively hiring at the moment, but we're always interested in hearing from talented people.
            </p>
            <a href="mailto:careers@stackvine.io" className="btn-outline" style={{ display: 'inline-flex' }}>
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
          <a href="mailto:careers@stackvine.io">Email us</a>
          {' '}— we're always open to great people.
        </p>
      </div>

      {selected && <ApplyModal job={selected} onClose={() => setSelected(null)} />}
    </section>
  );
}
