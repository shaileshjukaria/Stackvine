import { useEffect, useState, useCallback } from 'react';
import api from '../../api/axios';

// ── Contacts Tab ───────────────────────────────────────────
function ContactsTab() {
  const [contacts, setContacts] = useState([]);
  const load = useCallback(() => api.get('/admin/contacts').then(r => setContacts(r.data)), []);
  useEffect(() => { load(); }, [load]);

  const markRead = async (id, read) => {
    await api.patch(`/admin/contacts/${id}/read`, { read });
    load();
  };
  const del = async (id) => {
    if (!confirm('Delete this contact?')) return;
    await api.delete(`/admin/contacts/${id}`);
    load();
  };

  return (
    <div>
      <div className="admin-header">
        <h2 className="admin-title">Contact Submissions</h2>
        <span style={{ color: 'var(--t3)', fontSize: 14 }}>{contacts.length} total</span>
      </div>
      <table className="admin-table">
        <thead>
          <tr><th>Name</th><th>Email</th><th>Service</th><th>Message</th><th>Date</th><th>Status</th><th>Actions</th></tr>
        </thead>
        <tbody>
          {contacts.map(c => (
            <tr key={c._id}>
              <td style={{ color: 'var(--t1)', fontWeight: 600 }}>{c.name}</td>
              <td>{c.email}</td>
              <td>{c.service || '—'}</td>
              <td style={{ maxWidth: 240 }}>{c.message.slice(0, 80)}{c.message.length > 80 ? '…' : ''}</td>
              <td>{new Date(c.createdAt).toLocaleDateString()}</td>
              <td><span className={`badge ${c.read ? 'badge-read' : 'badge-unread'}`}>{c.read ? 'Read' : 'New'}</span></td>
              <td>
                <div className="admin-actions">
                  <button className="admin-btn sm" onClick={() => markRead(c._id, !c.read)}>{c.read ? 'Mark Unread' : 'Mark Read'}</button>
                  <button className="admin-btn danger sm" onClick={() => del(c._id)}>Delete</button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

// ── Applications Tab ───────────────────────────────────────
function ApplicationsTab() {
  const [apps, setApps] = useState([]);
  const [downloading, setDownloading] = useState(null);
  const load = useCallback(() => api.get('/admin/applications').then(r => setApps(r.data)), []);
  useEffect(() => { load(); }, [load]);

  const markRead = async (id, read) => {
    await api.patch(`/admin/applications/${id}/read`, { read });
    load();
  };

  const del = async (id) => {
    if (!confirm('Delete this application?')) return;
    await api.delete(`/admin/applications/${id}`);
    load();
  };

  // Download resume using JWT — streams the file through axios then triggers browser download
  const downloadResume = async (app) => {
    setDownloading(app._id);
    try {
      const res = await api.get(`/admin/applications/${app._id}/resume`, {
        responseType: 'blob',
      });
      const ext = app.resume?.filename?.split('.').pop() || 'pdf';
      const url = URL.createObjectURL(res.data);
      const a = document.createElement('a');
      a.href = url;
      a.download = app.resume?.filename || `${app.name.replace(/\s/g,'-')}-resume.${ext}`;
      a.click();
      URL.revokeObjectURL(url);
    } catch {
      alert('Could not download resume. Try again.');
    } finally {
      setDownloading(null);
    }
  };

  const formatBytes = (b) => !b ? '' : b < 1024*1024
    ? `${(b/1024).toFixed(0)} KB`
    : `${(b/1024/1024).toFixed(1)} MB`;

  return (
    <div>
      <div className="admin-header">
        <h2 className="admin-title">Job Applications</h2>
        <span style={{ color: 'var(--t3)', fontSize: 14 }}>{apps.length} total</span>
      </div>
      <table className="admin-table">
        <thead>
          <tr>
            <th>Name</th><th>Email</th><th>Role</th><th>Cover Note</th>
            <th>Resume</th><th>Date</th><th>Status</th><th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {apps.map(a => (
            <tr key={a._id} style={{ opacity: a.read ? 0.7 : 1 }}>
              <td style={{ color: 'var(--t1)', fontWeight: a.read ? 400 : 700 }}>{a.name}</td>
              <td><a href={`mailto:${a.email}`} style={{ color: 'var(--accent)' }}>{a.email}</a></td>
              <td><span className="badge badge-green">{a.role}</span></td>
              <td style={{ maxWidth: 200, color: 'var(--t2)' }}>
                {a.message ? a.message.slice(0, 60) + (a.message.length > 60 ? '…' : '') : <span style={{ color: 'var(--t3)' }}>—</span>}
              </td>
              <td>
                {a.resume?.filename ? (
                  <button
                    className="admin-btn sm"
                    onClick={() => downloadResume(a)}
                    disabled={downloading === a._id}
                    title={`${a.resume.filename} · ${formatBytes(a.resume.size)}`}
                    style={{ display: 'flex', alignItems: 'center', gap: 5 }}
                  >
                    {downloading === a._id ? '⏳' : '⬇️'}
                    {downloading === a._id ? ' Downloading…' : ' Resume'}
                  </button>
                ) : (
                  <span style={{ color: 'var(--t3)', fontSize: 12 }}>No file</span>
                )}
              </td>
              <td style={{ whiteSpace: 'nowrap' }}>{new Date(a.createdAt).toLocaleDateString()}</td>
              <td><span className={`badge ${a.read ? 'badge-read' : 'badge-unread'}`}>{a.read ? 'Read' : 'New'}</span></td>
              <td>
                <div className="admin-actions">
                  <button className="admin-btn sm" onClick={() => markRead(a._id, !a.read)}>
                    {a.read ? 'Mark Unread' : 'Mark Read'}
                  </button>
                  <button className="admin-btn danger sm" onClick={() => del(a._id)}>Delete</button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

// ── Projects Tab ───────────────────────────────────────────
function ProjectsTab() {
  const [projects, setProjects] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ title: '', description: '', tags: '', stack: '', link: '', order: 0 });
  const [saving, setSaving] = useState(false);

  const load = useCallback(() => api.get('/admin/projects').then(r => setProjects(r.data)), []);
  useEffect(() => { load(); }, [load]);

  const setF = (k) => (e) => setForm(f => ({ ...f, [k]: e.target.value }));

  const save = async (e) => {
    e.preventDefault(); setSaving(true);
    try {
      await api.post('/admin/projects', {
        ...form,
        tags: form.tags.split(',').map(s => s.trim()).filter(Boolean),
        stack: form.stack.split(',').map(s => s.trim()).filter(Boolean),
        order: Number(form.order),
      });
      setForm({ title: '', description: '', tags: '', stack: '', link: '', order: 0 });
      setShowForm(false);
      load();
    } finally { setSaving(false); }
  };

  const del = async (id) => {
    if (!confirm('Delete this project?')) return;
    await api.delete(`/admin/projects/${id}`);
    load();
  };

  return (
    <div>
      <div className="admin-header">
        <h2 className="admin-title">Portfolio Projects</h2>
        <button className="admin-btn" onClick={() => setShowForm(s => !s)}>{showForm ? 'Cancel' : '+ Add Project'}</button>
      </div>

      {showForm && (
        <form className="admin-form" onSubmit={save} style={{ marginBottom: 32, background: 'var(--bg-card)', padding: 24, borderRadius: 14, border: '1px solid var(--border)' }}>
          <div className="admin-field"><label>Title</label><input required value={form.title} onChange={setF('title')} placeholder="Project Name" /></div>
          <div className="admin-field"><label>Description</label><textarea required rows={3} value={form.description} onChange={setF('description')} /></div>
          <div className="admin-field"><label>Tags (comma separated)</label><input value={form.tags} onChange={setF('tags')} placeholder="AI, SaaS, Payments" /></div>
          <div className="admin-field"><label>Stack (comma separated)</label><input value={form.stack} onChange={setF('stack')} placeholder="React, Node.js, MongoDB" /></div>
          <div className="admin-field"><label>Live URL (optional)</label><input value={form.link} onChange={setF('link')} placeholder="https://..." /></div>
          <div className="admin-field"><label>Order</label><input type="number" value={form.order} onChange={setF('order')} /></div>
          <button type="submit" className="admin-btn" disabled={saving}>{saving ? 'Saving…' : 'Save Project'}</button>
        </form>
      )}

      {projects.map(p => (
        <div className="admin-card" key={p._id}>
          <div>
            <div className="admin-card-title">{p.title}</div>
            <div className="admin-card-meta">{p.stack?.join(', ')}</div>
          </div>
          <div className="admin-actions">
            <button className="admin-btn danger sm" onClick={() => del(p._id)}>Delete</button>
          </div>
        </div>
      ))}
    </div>
  );
}

// ── Jobs Tab ───────────────────────────────────────────────
function JobsTab() {
  const [jobs, setJobs] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ title: '', type: 'Remote', department: '', location: 'India', order: 0 });
  const [saving, setSaving] = useState(false);

  const load = useCallback(() => api.get('/admin/jobs').then(r => setJobs(r.data)), []);
  useEffect(() => { load(); }, [load]);

  const setF = (k) => (e) => setForm(f => ({ ...f, [k]: e.target.value }));

  const save = async (e) => {
    e.preventDefault(); setSaving(true);
    try {
      await api.post('/admin/jobs', { ...form, order: Number(form.order) });
      setForm({ title: '', type: 'Remote', department: '', location: 'India', order: 0 });
      setShowForm(false); load();
    } finally { setSaving(false); }
  };

  const toggle = async (job) => {
    await api.put(`/admin/jobs/${job._id}`, { ...job, active: !job.active });
    load();
  };

  const del = async (id) => {
    if (!confirm('Delete this job?')) return;
    await api.delete(`/admin/jobs/${id}`);
    load();
  };

  return (
    <div>
      <div className="admin-header">
        <h2 className="admin-title">Job Listings</h2>
        <button className="admin-btn" onClick={() => setShowForm(s => !s)}>{showForm ? 'Cancel' : '+ Add Job'}</button>
      </div>

      {showForm && (
        <form className="admin-form" onSubmit={save} style={{ marginBottom: 32, background: 'var(--bg-card)', padding: 24, borderRadius: 14, border: '1px solid var(--border)' }}>
          <div className="admin-field"><label>Title</label><input required value={form.title} onChange={setF('title')} placeholder="Senior React Developer" /></div>
          <div className="admin-field">
            <label>Type</label>
            <select value={form.type} onChange={setF('type')}>
              <option>Remote</option><option>Hybrid</option><option>On-site</option>
            </select>
          </div>
          <div className="admin-field"><label>Department</label><input required value={form.department} onChange={setF('department')} placeholder="Engineering" /></div>
          <div className="admin-field"><label>Location</label><input value={form.location} onChange={setF('location')} placeholder="India" /></div>
          <div className="admin-field"><label>Order</label><input type="number" value={form.order} onChange={setF('order')} /></div>
          <button type="submit" className="admin-btn" disabled={saving}>{saving ? 'Saving…' : 'Save Job'}</button>
        </form>
      )}

      {jobs.map(j => (
        <div className="admin-card" key={j._id}>
          <div>
            <div className="admin-card-title">{j.title}</div>
            <div className="admin-card-meta">{j.type} · {j.department} · {j.location}</div>
          </div>
          <div className="admin-actions">
            <label className="toggle">
              <input type="checkbox" checked={j.active} onChange={() => toggle(j)} />
              <span className="toggle-slider" />
            </label>
            <span style={{ fontSize: 12, color: j.active ? 'var(--green)' : 'var(--t3)' }}>{j.active ? 'Active' : 'Hidden'}</span>
            <button className="admin-btn danger sm" onClick={() => del(j._id)}>Delete</button>
          </div>
        </div>
      ))}
    </div>
  );
}

// ── Stats Tab ──────────────────────────────────────────────
function StatsTab() {
  const [stats, setStats] = useState([]);
  const [saving, setSaving] = useState(null);
  const load = useCallback(() => api.get('/admin/stats').then(r => setStats(r.data)), []);
  useEffect(() => { load(); }, [load]);

  const update = async (stat) => {
    setSaving(stat.key);
    try {
      await api.patch(`/admin/stats/${stat.key}`, stat);
      load();
    } finally { setSaving(null); }
  };

  const setVal = (key, field, val) => {
    setStats(s => s.map(st => st.key === key ? { ...st, [field]: field === 'value' ? Number(val) : val } : st));
  };

  return (
    <div>
      <div className="admin-header"><h2 className="admin-title">Stats</h2></div>
      <div style={{ background: 'var(--bg-card)', border: '1px solid var(--border)', borderRadius: 14, padding: '8px 24px' }}>
        {stats.map(s => (
          <div className="stat-edit-row" key={s.key}>
            <label>{s.label}</label>
            <input type="number" value={s.value} onChange={e => setVal(s.key, 'value', e.target.value)} />
            <input style={{ width: 60 }} value={s.suffix} onChange={e => setVal(s.key, 'suffix', e.target.value)} placeholder="+" />
            <button className="admin-btn sm" onClick={() => update(s)} disabled={saving === s.key}>
              {saving === s.key ? '…' : 'Save'}
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}

// ── Dashboard Shell ────────────────────────────────────────
const TABS = [
  { id: 'contacts', label: '📨 Contacts' },
  { id: 'applications', label: '👤 Applications' },
  { id: 'projects', label: '🗂️ Projects' },
  { id: 'jobs', label: '💼 Jobs' },
  { id: 'stats', label: '📊 Stats' },
];

export default function AdminDashboard({ adminEmail, onLogout }) {
  const [tab, setTab] = useState('contacts');

  return (
    <div className="admin-layout">
      <div className="admin-sidebar">
        <div className="admin-logo" style={{ textAlign: 'center', paddingBottom: 8 }}>
          <img
            src="/logo.png"
            alt="Stackvine"
            style={{
              height: '56px',
              width: 'auto',
              objectFit: 'contain',
              filter: 'drop-shadow(0 0 10px rgba(108,99,255,0.5))',
            }}
          />
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
        {tab === 'contacts' && <ContactsTab />}
        {tab === 'applications' && <ApplicationsTab />}
        {tab === 'projects' && <ProjectsTab />}
        {tab === 'jobs' && <JobsTab />}
        {tab === 'stats' && <StatsTab />}
      </div>
    </div>
  );
}
