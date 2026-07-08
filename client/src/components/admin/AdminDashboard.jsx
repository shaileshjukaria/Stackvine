import { useEffect, useState, useCallback } from 'react';
import api from '../../api/axios';

/* ── Generic helpers ─────────────────────────────────────── */
function useCRUD(endpoint) {
  const [items, setItems] = useState([]);
  const [busy, setBusy] = useState(false);
  const load = useCallback(() =>
    api.get(endpoint).then(r => setItems(r.data)).catch(console.error), [endpoint]);
  useEffect(() => { load(); }, [load]);

  const create = async (data) => { setBusy(true); try { await api.post(endpoint, data); await load(); } finally { setBusy(false); } };
  const update = async (id, data) => { setBusy(true); try { await api.put(`${endpoint}/${id}`, data); await load(); } finally { setBusy(false); } };
  const patch = async (id, path, data) => { await api.patch(`${endpoint}/${id}/${path}`, data); await load(); };
  const remove = async (id, msg = 'Delete this item?') => {
    if (!confirm(msg)) return;
    await api.delete(`${endpoint}/${id}`); await load();
  };
  return { items, busy, load, create, update, patch, remove };
}

/* ── Reusable edit/add modal ─────────────────────────────── */
function AdminModal({ title, onClose, onSave, saving, children }) {
  useEffect(() => {
    const h = (e) => { if (e.key === 'Escape') onClose(); };
    window.addEventListener('keydown', h);
    return () => window.removeEventListener('keydown', h);
  }, [onClose]);
  return (
    <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,.75)', zIndex: 500, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 20 }}
      onClick={onClose}>
      <div style={{ background: 'var(--bg-card)', border: '1px solid var(--border-a)', borderRadius: 18, width: '100%', maxWidth: 560, maxHeight: '90vh', overflowY: 'auto', boxShadow: '0 24px 64px rgba(0,0,0,.7)' }}
        onClick={e => e.stopPropagation()}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '20px 24px 16px', borderBottom: '1px solid var(--border)' }}>
          <h3 style={{ margin: 0, fontFamily: 'Syne,sans-serif', fontSize: 18, fontWeight: 700 }}>{title}</h3>
          <button onClick={onClose} style={{ background: 'none', border: 'none', color: 'var(--t3)', cursor: 'pointer', fontSize: 20 }}>✕</button>
        </div>
        <form onSubmit={onSave} style={{ padding: 24, display: 'flex', flexDirection: 'column', gap: 14 }}>
          {children}
          <div style={{ display: 'flex', gap: 10, paddingTop: 8 }}>
            <button type="submit" className="admin-btn" disabled={saving} style={{ flex: 1 }}>
              {saving ? 'Saving…' : 'Save'}
            </button>
            <button type="button" className="admin-btn" style={{ background: 'var(--bg-hover)', flex: 0, padding: '0 20px' }} onClick={onClose}>Cancel</button>
          </div>
        </form>
      </div>
    </div>
  );
}

function AF({ label, children }) {
  return (
    <div className="admin-field">
      <label>{label}</label>
      {children}
    </div>
  );
}

/* ── Contacts Tab ────────────────────────────────────────── */
function ContactsTab() {
  const { items: contacts, patch, remove } = useCRUD('/admin/contacts');
  const [expanded, setExpanded] = useState(null);

  return (
    <div>
      <div className="admin-header">
        <h2 className="admin-title">Contact Submissions</h2>
        <span style={{ color: 'var(--t3)', fontSize: 14 }}>{contacts.length} total · {contacts.filter(c => !c.read).length} unread</span>
      </div>
      <table className="admin-table">
        <thead><tr><th>Name</th><th>Email</th><th>Service</th><th>Date</th><th>Status</th><th>Actions</th></tr></thead>
        <tbody>
          {contacts.map(c => (
            <>
              <tr key={c._id} style={{ opacity: c.read ? 0.65 : 1 }}>
                <td style={{ color: 'var(--t1)', fontWeight: c.read ? 400 : 700 }}>{c.name}</td>
                <td><a href={`mailto:${c.email}`} style={{ color: 'var(--accent)' }}>{c.email}</a></td>
                <td>{c.service || '—'}</td>
                <td style={{ whiteSpace: 'nowrap' }}>{new Date(c.createdAt).toLocaleDateString()}</td>
                <td><span className={`badge ${c.read ? 'badge-read' : 'badge-unread'}`}>{c.read ? 'Read' : 'New'}</span></td>
                <td>
                  <div className="admin-actions">
                    <button className="admin-btn sm" onClick={() => setExpanded(expanded === c._id ? null : c._id)}>
                      {expanded === c._id ? 'Hide' : 'View'}
                    </button>
                    <button className="admin-btn sm" onClick={() => patch(c._id, 'read', { read: !c.read })}>
                      {c.read ? 'Unread' : 'Mark Read'}
                    </button>
                    <button className="admin-btn danger sm" onClick={() => remove(c._id, 'Delete this contact?')}>Delete</button>
                  </div>
                </td>
              </tr>
              {expanded === c._id && (
                <tr key={`${c._id}-expand`}>
                  <td colSpan={6}>
                    <div style={{ background: 'var(--bg-hover)', borderRadius: 10, padding: '14px 18px', margin: '4px 0 8px', fontSize: 14, color: 'var(--t2)', lineHeight: 1.7 }}>
                      <strong style={{ color: 'var(--t1)' }}>Message:</strong><br />{c.message}
                    </div>
                  </td>
                </tr>
              )}
            </>
          ))}
        </tbody>
      </table>
    </div>
  );
}

/* ── Applications Tab ────────────────────────────────────── */
function ApplicationsTab() {
  const { items: apps, patch, remove } = useCRUD('/admin/applications');
  const [expanded, setExpanded] = useState(null);
  const [downloading, setDownloading] = useState(null);

  const downloadResume = async (app) => {
    setDownloading(app._id);
    try {
      const res = await api.get(`/admin/applications/${app._id}/resume`, { responseType: 'blob' });
      const ext = app.resume?.filename?.split('.').pop() || 'pdf';
      const url = URL.createObjectURL(res.data);
      const a = document.createElement('a');
      a.href = url; a.download = app.resume?.filename || `${app.name.replace(/\s/g, '-')}-resume.${ext}`; a.click();
      URL.revokeObjectURL(url);
    } catch { alert('Could not download resume.'); }
    finally { setDownloading(null); }
  };

  const fmtBytes = (b) => !b ? '' : b < 1024 * 1024 ? `${(b / 1024).toFixed(0)} KB` : `${(b / 1024 / 1024).toFixed(1)} MB`;

  return (
    <div>
      <div className="admin-header">
        <h2 className="admin-title">Job Applications</h2>
        <span style={{ color: 'var(--t3)', fontSize: 14 }}>{apps.length} total · {apps.filter(a => !a.read).length} unread</span>
      </div>
      <table className="admin-table">
        <thead><tr><th>Name</th><th>Email</th><th>Role</th><th>Date</th><th>Resume</th><th>Status</th><th>Actions</th></tr></thead>
        <tbody>
          {apps.map(a => (
            <>
              <tr key={a._id} style={{ opacity: a.read ? 0.65 : 1 }}>
                <td style={{ color: 'var(--t1)', fontWeight: a.read ? 400 : 700 }}>{a.name}</td>
                <td><a href={`mailto:${a.email}`} style={{ color: 'var(--accent)' }}>{a.email}</a></td>
                <td><span className="badge badge-green">{a.role}</span></td>
                <td style={{ whiteSpace: 'nowrap' }}>{new Date(a.createdAt).toLocaleDateString()}</td>
                <td>
                  {a.resume?.filename ? (
                    <button className="admin-btn sm" onClick={() => downloadResume(a)} disabled={downloading === a._id}>
                      {downloading === a._id ? '⏳' : '⬇️'} {downloading === a._id ? 'Downloading…' : 'Resume'}
                    </button>
                  ) : <span style={{ color: 'var(--t3)', fontSize: 12 }}>—</span>}
                </td>
                <td><span className={`badge ${a.read ? 'badge-read' : 'badge-unread'}`}>{a.read ? 'Read' : 'New'}</span></td>
                <td>
                  <div className="admin-actions">
                    <button className="admin-btn sm" onClick={() => setExpanded(expanded === a._id ? null : a._id)}>
                      {expanded === a._id ? 'Hide' : 'Details'}
                    </button>
                    <button className="admin-btn sm" onClick={() => patch(a._id, 'read', { read: !a.read })}>
                      {a.read ? 'Unread' : 'Mark Read'}
                    </button>
                    <button className="admin-btn danger sm" onClick={() => remove(a._id, 'Delete this application?')}>Delete</button>
                  </div>
                </td>
              </tr>
              {expanded === a._id && (
                <tr key={`${a._id}-exp`}>
                  <td colSpan={7}>
                    <div style={{ background: 'var(--bg-hover)', borderRadius: 10, padding: '16px 20px', margin: '4px 0 10px', display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '8px 24px', fontSize: 13 }}>
                      {[
                        ['Phone', a.phone], ['Location', a.location], ['LinkedIn', a.linkedIn],
                        ['Portfolio', a.portfolio], ['Current Role', a.currentRole], ['Company', a.currentCompany],
                        ['Experience', a.experience], ['Notice Period', a.noticePeriod],
                        ['Degree', a.degree], ['Field', a.field], ['Institution', a.institution],
                        ['Grad Year', a.graduationYear], ['Certifications', a.certifications],
                        ['Skills', Array.isArray(a.skills) ? a.skills.join(', ') : a.skills],
                        ['Resume', a.resume?.filename ? `${a.resume.filename} (${fmtBytes(a.resume.size)})` : '—'],
                        ['Cover Letter', a.message],
                      ].filter(([, v]) => v).map(([k, v]) => (
                        <div key={k}>
                          <div style={{ color: 'var(--t3)', fontSize: 10, textTransform: 'uppercase', letterSpacing: '1px', marginBottom: 2 }}>{k}</div>
                          <div style={{ color: 'var(--t1)', wordBreak: 'break-word' }}>{v}</div>
                        </div>
                      ))}
                    </div>
                  </td>
                </tr>
              )}
            </>
          ))}
        </tbody>
      </table>
    </div>
  );
}

/* ── Testimonials Tab ────────────────────────────────────── */
function TestimonialsTab() {
  const { items, busy, create, update, remove } = useCRUD('/admin/testimonials');
  const blank = { author: '', role: '', quote: '', initials: '', stars: 5, order: items.length + 1 };
  const [modal, setModal] = useState(null); // null | { mode:'add'|'edit', data }

  const openAdd = () => setModal({ mode: 'add', data: { ...blank, order: items.length + 1 } });
  const openEdit = (t) => setModal({ mode: 'edit', data: { ...t } });

  const setF = (k) => (e) => setModal(m => ({ ...m, data: { ...m.data, [k]: e.target.value } }));

  const save = async (e) => {
    e.preventDefault();
    const d = { ...modal.data, stars: Number(modal.data.stars), order: Number(modal.data.order) };
    if (modal.mode === 'add') await create(d);
    else await update(d._id, d);
    setModal(null);
  };

  return (
    <div>
      <div className="admin-header">
        <h2 className="admin-title">Testimonials</h2>
        <button className="admin-btn" onClick={openAdd}>+ Add Testimonial</button>
      </div>

      {items.map(t => (
        <div className="admin-card" key={t._id}>
          <div style={{ flex: 1 }}>
            <div className="admin-card-title">{t.author} <span style={{ color: 'var(--t3)', fontWeight: 400, fontSize: 13 }}>— {t.role}</span></div>
            <div className="admin-card-meta">{'★'.repeat(t.stars)} · "{t.quote.slice(0, 80)}{t.quote.length > 80 ? '…' : ''}"</div>
          </div>
          <div className="admin-actions">
            <button className="admin-btn sm" onClick={() => openEdit(t)}>Edit</button>
            <button className="admin-btn danger sm" onClick={() => remove(t._id, 'Delete this testimonial?')}>Delete</button>
          </div>
        </div>
      ))}

      {modal && (
        <AdminModal
          title={modal.mode === 'add' ? 'Add Testimonial' : 'Edit Testimonial'}
          onClose={() => setModal(null)} onSave={save} saving={busy}
        >
          <AF label="Author Name"><input required value={modal.data.author} onChange={setF('author')} placeholder="Shailesh Jukaria" /></AF>
          <AF label="Role / Company"><input required value={modal.data.role} onChange={setF('role')} placeholder="Founder @ Stackvine" /></AF>
          <AF label="Initials (avatar)"><input value={modal.data.initials} onChange={setF('initials')} placeholder="SJ" maxLength={3} /></AF>
          <AF label="Quote"><textarea required rows={3} value={modal.data.quote} onChange={setF('quote')} placeholder="What they said…" /></AF>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14 }}>
            <AF label="Stars (1–5)"><input type="number" min={1} max={5} value={modal.data.stars} onChange={setF('stars')} /></AF>
            <AF label="Display Order"><input type="number" min={1} value={modal.data.order} onChange={setF('order')} /></AF>
          </div>
        </AdminModal>
      )}
    </div>
  );
}

/* ── Projects Tab ────────────────────────────────────────── */
function ProjectsTab() {
  const { items, busy, create, update, remove } = useCRUD('/admin/projects');
  const blank = { title: '', description: '', tags: '', stack: '', link: '', order: 0 };
  const [modal, setModal] = useState(null);

  const openAdd = () => setModal({ mode: 'add', data: { ...blank, order: items.length + 1 } });
  const openEdit = (p) => setModal({ mode: 'edit', data: { ...p, tags: p.tags?.join(', ') || '', stack: p.stack?.join(', ') || '' } });
  const setF = (k) => (e) => setModal(m => ({ ...m, data: { ...m.data, [k]: e.target.value } }));

  const save = async (e) => {
    e.preventDefault();
    const d = {
      ...modal.data,
      tags: modal.data.tags.split(',').map(s => s.trim()).filter(Boolean),
      stack: modal.data.stack.split(',').map(s => s.trim()).filter(Boolean),
      order: Number(modal.data.order),
    };
    if (modal.mode === 'add') await create(d);
    else await update(d._id, d);
    setModal(null);
  };

  return (
    <div>
      <div className="admin-header">
        <h2 className="admin-title">Portfolio Projects</h2>
        <button className="admin-btn" onClick={openAdd}>+ Add Project</button>
      </div>

      {items.map(p => (
        <div className="admin-card" key={p._id}>
          <div style={{ flex: 1 }}>
            <div className="admin-card-title">{p.title}</div>
            <div className="admin-card-meta">{p.stack?.join(' · ')} {p.link && <a href={p.link} target="_blank" rel="noreferrer" style={{ color: 'var(--accent)', marginLeft: 8 }}>↗ Live</a>}</div>
          </div>
          <div className="admin-actions">
            <button className="admin-btn sm" onClick={() => openEdit(p)}>Edit</button>
            <button className="admin-btn danger sm" onClick={() => remove(p._id, 'Delete this project?')}>Delete</button>
          </div>
        </div>
      ))}

      {modal && (
        <AdminModal
          title={modal.mode === 'add' ? 'Add Project' : 'Edit Project'}
          onClose={() => setModal(null)} onSave={save} saving={busy}
        >
          <AF label="Title"><input required value={modal.data.title} onChange={setF('title')} placeholder="Imaginova" /></AF>
          <AF label="Description"><textarea required rows={3} value={modal.data.description} onChange={setF('description')} /></AF>
          <AF label="Tags (comma separated)"><input value={modal.data.tags} onChange={setF('tags')} placeholder="AI, SaaS, Payments" /></AF>
          <AF label="Stack (comma separated)"><input value={modal.data.stack} onChange={setF('stack')} placeholder="React, Node.js, MongoDB" /></AF>
          <AF label="Live URL (optional)"><input value={modal.data.link} onChange={setF('link')} placeholder="https://..." /></AF>
          <AF label="Display Order"><input type="number" value={modal.data.order} onChange={setF('order')} /></AF>
        </AdminModal>
      )}
    </div>
  );
}

/* ── Jobs Tab ────────────────────────────────────────────── */
function JobsTab() {
  const { items: jobs, busy, load, create, update, remove } = useCRUD('/admin/jobs');
  const blank = { title: '', type: 'Remote', department: '', location: 'India', active: true, order: 0 };
  const [modal, setModal] = useState(null);
  const [hiringPaused, setHiringPaused] = useState(false);
  const [pauseBusy, setPauseBusy] = useState(false);

  // Derived: if all jobs inactive → hiring is paused
  useEffect(() => {
    if (jobs.length > 0) setHiringPaused(jobs.every(j => !j.active));
  }, [jobs]);

  const openAdd = () => setModal({ mode: 'add', data: { ...blank, order: jobs.length + 1 } });
  const openEdit = (j) => setModal({ mode: 'edit', data: { ...j } });
  const setF = (k) => (e) => setModal(m => ({ ...m, data: { ...m.data, [k]: e.target.value } }));

  const save = async (e) => {
    e.preventDefault();
    const d = { ...modal.data, order: Number(modal.data.order), active: modal.data.active !== false };
    if (modal.mode === 'add') await create(d);
    else await update(d._id, d);
    setModal(null);
  };

  const toggleActive = (job) => update(job._id, { ...job, active: !job.active });

  const pauseAllHiring = async () => {
    setPauseBusy(true);
    try {
      await Promise.all(jobs.map(j => api.put(`/admin/jobs/${j._id}`, { ...j, active: false })));
      await load();
    } finally { setPauseBusy(false); }
  };

  const resumeHiring = async () => {
    setPauseBusy(true);
    try {
      await Promise.all(jobs.map(j => api.put(`/admin/jobs/${j._id}`, { ...j, active: true })));
      await load();
    } finally { setPauseBusy(false); }
  };

  return (
    <div>
      <div className="admin-header">
        <h2 className="admin-title">Job Listings</h2>
        <div style={{ display: 'flex', gap: 10 }}>
          <button className="admin-btn" onClick={openAdd}>+ Add Job</button>
        </div>
      </div>

      {/* Hiring status banner */}
      <div style={{
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        background: hiringPaused ? 'rgba(255,91,127,.08)' : 'rgba(34,211,160,.06)',
        border: `1px solid ${hiringPaused ? 'rgba(255,91,127,.25)' : 'rgba(34,211,160,.2)'}`,
        borderRadius: 12, padding: '14px 18px', marginBottom: 20,
      }}>
        <div>
          <div style={{ fontWeight: 700, fontSize: 14, color: hiringPaused ? 'var(--red)' : 'var(--green)' }}>
            {hiringPaused ? '🔴 Hiring Paused' : '🟢 Actively Hiring'}
          </div>
          <div style={{ fontSize: 12, color: 'var(--t3)', marginTop: 2 }}>
            {hiringPaused
              ? 'All jobs are hidden. The site shows "No Current Roles Open" to visitors.'
              : 'Active jobs are visible on the careers page.'}
          </div>
        </div>
        <button
          className={`admin-btn${hiringPaused ? '' : ' danger'} sm`}
          onClick={hiringPaused ? resumeHiring : pauseAllHiring}
          disabled={pauseBusy || jobs.length === 0}
          style={{ whiteSpace: 'nowrap', flexShrink: 0 }}
        >
          {pauseBusy ? '…' : hiringPaused ? '▶ Resume Hiring' : '⏸ Pause All Hiring'}
        </button>
      </div>

      {jobs.map(j => (
        <div className="admin-card" key={j._id} style={{ opacity: j.active ? 1 : 0.55 }}>
          <div style={{ flex: 1 }}>
            <div className="admin-card-title">{j.title}</div>
            <div className="admin-card-meta">{j.type} · {j.department} · {j.location}</div>
          </div>
          <div className="admin-actions">
            <label className="toggle" title={j.active ? 'Click to hide' : 'Click to show'}>
              <input type="checkbox" checked={j.active} onChange={() => toggleActive(j)} />
              <span className="toggle-slider" />
            </label>
            <span style={{ fontSize: 12, color: j.active ? 'var(--green)' : 'var(--t3)', width: 46 }}>
              {j.active ? 'Live' : 'Hidden'}
            </span>
            <button className="admin-btn sm" onClick={() => openEdit(j)}>Edit</button>
            <button className="admin-btn danger sm" onClick={() => remove(j._id, 'Delete this job?')}>Delete</button>
          </div>
        </div>
      ))}

      {jobs.length === 0 && (
        <div style={{ textAlign: 'center', padding: '32px 0', color: 'var(--t3)', fontSize: 14 }}>
          No jobs yet. Add one above to start hiring.
        </div>
      )}

      {modal && (
        <AdminModal
          title={modal.mode === 'add' ? 'Add Job' : 'Edit Job'}
          onClose={() => setModal(null)} onSave={save} saving={busy}
        >
          <AF label="Job Title"><input required value={modal.data.title} onChange={setF('title')} placeholder="Senior React Developer" /></AF>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14 }}>
            <AF label="Type">
              <select value={modal.data.type} onChange={setF('type')}>
                <option>Remote</option><option>Hybrid</option><option>On-site</option>
              </select>
            </AF>
            <AF label="Department"><input required value={modal.data.department} onChange={setF('department')} placeholder="Engineering" /></AF>
            <AF label="Location"><input value={modal.data.location} onChange={setF('location')} placeholder="India" /></AF>
            <AF label="Display Order"><input type="number" value={modal.data.order} onChange={setF('order')} /></AF>
          </div>
        </AdminModal>
      )}
    </div>
  );
}

/* ── Stats Tab ───────────────────────────────────────────── */
function StatsTab() {
  const [stats, setStats] = useState([]);
  const [saving, setSaving] = useState(null);
  const load = useCallback(() => api.get('/admin/stats').then(r => setStats(r.data)), []);
  useEffect(() => { load(); }, [load]);

  const setVal = (key, field, val) =>
    setStats(s => s.map(st => st.key === key ? { ...st, [field]: field === 'value' ? Number(val) : val } : st));

  const save = async (stat) => {
    setSaving(stat.key);
    try { await api.patch(`/admin/stats/${stat.key}`, stat); await load(); }
    finally { setSaving(null); }
  };

  return (
    <div>
      <div className="admin-header"><h2 className="admin-title">Stats</h2></div>
      <div style={{ background: 'var(--bg-card)', border: '1px solid var(--border)', borderRadius: 14, padding: '8px 24px' }}>
        {stats.map(s => (
          <div className="stat-edit-row" key={s.key}>
            <label>{s.label}</label>
            <input type="number" value={s.value} onChange={e => setVal(s.key, 'value', e.target.value)} />
            <input style={{ width: 60 }} value={s.suffix} onChange={e => setVal(s.key, 'suffix', e.target.value)} placeholder="%" />
            <input style={{ width: 160 }} value={s.label} onChange={e => setVal(s.key, 'label', e.target.value)} placeholder="Label" />
            <button className="admin-btn sm" onClick={() => save(s)} disabled={saving === s.key}>
              {saving === s.key ? '…' : 'Save'}
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}

/* ── Dashboard Shell ─────────────────────────────────────── */
const TABS = [
  { id: 'contacts',     label: '📨 Contacts' },
  { id: 'applications', label: '👤 Applications' },
  { id: 'testimonials', label: '⭐ Testimonials' },
  { id: 'projects',     label: '🗂️ Projects' },
  { id: 'jobs',         label: '💼 Jobs' },
  { id: 'stats',        label: '📊 Stats' },
];

export default function AdminDashboard({ adminEmail, onLogout }) {
  const [tab, setTab] = useState('contacts');

  return (
    <div className="admin-layout">
      <div className="admin-sidebar">
        <div className="admin-logo" style={{ textAlign: 'center', paddingBottom: 8 }}>
          <img src="/logo.png" alt="Stackvine" style={{ height: 56, width: 'auto', objectFit: 'contain', filter: 'drop-shadow(0 0 10px rgba(108,99,255,0.5))' }} />
        </div>
        {TABS.map(t => (
          <button key={t.id} className={`admin-nav-btn${tab === t.id ? ' active' : ''}`} onClick={() => setTab(t.id)}>
            {t.label}
          </button>
        ))}
        <div style={{ marginTop: 'auto', padding: '12px 0', borderTop: '1px solid var(--border)', color: 'var(--t3)', fontSize: 11, fontFamily: 'JetBrains Mono' }}>
          {adminEmail}
        </div>
        <button className="logout-btn" onClick={onLogout}>Sign out →</button>
      </div>
      <div className="admin-content">
        {tab === 'contacts'     && <ContactsTab />}
        {tab === 'applications' && <ApplicationsTab />}
        {tab === 'testimonials' && <TestimonialsTab />}
        {tab === 'projects'     && <ProjectsTab />}
        {tab === 'jobs'         && <JobsTab />}
        {tab === 'stats'        && <StatsTab />}
      </div>
    </div>
  );
}
