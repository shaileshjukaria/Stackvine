import { useEffect, useState, useCallback } from 'react';
import api from '../../api/axios';
import PageOverlay from '../PageOverlay';
import { getApplyJob, clearApplyJob, goHome } from '../../utils/nav';
import { trackFormSubmit, trackEvent } from '../../utils/analytics';

const STEPS = [
  { id: 1, label: 'Personal Info' },
  { id: 2, label: 'Professional' },
  { id: 3, label: 'Education' },
  { id: 4, label: 'Skills & Docs' },
  { id: 5, label: 'Review & Submit' },
];

const EXPERIENCE_OPTIONS = ['Less than 1 year', '1–2 years', '3–5 years', '5–8 years', '8+ years'];
const NOTICE_OPTIONS = ['Immediate', '15 days', '30 days', '60 days', '90+ days'];
const ALLOWED_TYPES = [
  'application/pdf',
  'application/msword',
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
];

const INITIAL_FORM = {
  name: '', email: '', phone: '', location: '', linkedIn: '', portfolio: '',
  currentRole: '', currentCompany: '', experience: '', noticePeriod: '',
  degree: '', field: '', institution: '', graduationYear: '', certifications: '',
  skills: [], coverLetter: '',
};

const DRAFT_KEY = 'sv_apply_draft';

function fmtBytes(b) {
  return b < 1024 * 1024 ? `${(b / 1024).toFixed(0)} KB` : `${(b / 1024 / 1024).toFixed(1)} MB`;
}

function validateFile(file) {
  if (!file) return null;
  if (!ALLOWED_TYPES.includes(file.type)) return 'Only PDF, DOC, or DOCX files are allowed.';
  if (file.size > 5 * 1024 * 1024) return 'File too large — max 5 MB.';
  return null;
}

function validateStep(step, form, resumeFile) {
  const errors = {};
  const req = (key, msg = 'This field is required') => { if (!String(form[key] ?? '').trim()) errors[key] = msg; };

  if (step === 1) {
    req('name', 'Full name is required');
    req('email', 'Email is required');
    if (form.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) errors.email = 'Enter a valid email address';
    req('phone', 'Phone number is required');
    req('location', 'Location is required');
    if (form.linkedIn && !/^https?:\/\/.+/i.test(form.linkedIn)) errors.linkedIn = 'Enter a full URL (https://...)';
    if (form.portfolio && !/^https?:\/\/.+/i.test(form.portfolio)) errors.portfolio = 'Enter a full URL (https://...)';
  }
  if (step === 2) {
    req('currentRole', 'Current role is required');
    req('experience', 'Please select your experience level');
    req('noticePeriod', 'Please select your notice period');
  }
  if (step === 3) {
    req('degree', 'Degree is required');
    req('institution', 'Institution is required');
    if (form.graduationYear && !/^\d{4}$/.test(form.graduationYear)) errors.graduationYear = 'Enter a valid 4-digit year';
  }
  if (step === 4) {
    if (!resumeFile) errors.resume = 'Resume is required';
    else { const e = validateFile(resumeFile); if (e) errors.resume = e; }
    if (form.skills.length === 0) errors.skills = 'Add at least one skill';
  }
  return errors;
}

/* ── Sub-components ──────────────────────────────────────── */
function Field({ label, optional, error, children }) {
  return (
    <div className="am-field">
      <label className="am-label">
        {label}{optional && <span className="am-optional"> — optional</span>}
      </label>
      {children}
      {error && <div className="apply-field-error">⚠ {error}</div>}
    </div>
  );
}

function FileZone({ id, file, onFile, label, hint }) {
  const [drag, setDrag] = useState(false);
  const handle = (f) => {
    if (!f) return;
    const err = validateFile(f);
    if (err) { alert(err); return; }
    onFile(f);
  };
  return (
    <div className="am-field">
      <label className="am-label">{label}{hint && <span className="am-optional"> — {hint}</span>}</label>
      {file ? (
        <div className="am-file-pill">
          <span className="am-file-icon">📄</span>
          <div className="am-file-info">
            <div className="am-file-name">{file.name}</div>
            <div className="am-file-size">{fmtBytes(file.size)}</div>
          </div>
          <button type="button" className="am-file-remove" onClick={() => onFile(null)}>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
              <line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" />
            </svg>
          </button>
        </div>
      ) : (
        <div
          className={`am-dropzone${drag ? ' drag' : ''}`}
          onDragOver={e => { e.preventDefault(); setDrag(true); }}
          onDragLeave={() => setDrag(false)}
          onDrop={e => { e.preventDefault(); setDrag(false); handle(e.dataTransfer.files[0]); }}
          onClick={() => document.getElementById(id).click()}
        >
          <div className="am-drop-icon">📎</div>
          <div className="am-drop-text"><span className="am-drop-cta">Click to upload</span> or drag & drop</div>
          <div className="am-drop-hint">PDF, DOC, DOCX — max 5 MB</div>
        </div>
      )}
      <input id={id} type="file" accept=".pdf,.doc,.docx" style={{ display: 'none' }} onChange={e => handle(e.target.files[0])} />
    </div>
  );
}

function ReviewRow({ label, value }) {
  if (!value) return null;
  return (
    <div className="apply-review-row">
      <span className="apply-review-label">{label}</span>
      <span className="apply-review-value">{value}</span>
    </div>
  );
}

/* ── Main Page ───────────────────────────────────────────── */
export default function ApplyPage() {
  const job = getApplyJob();
  const [step, setStep] = useState(1);
  const [form, setForm] = useState(INITIAL_FORM);
  const [skillInput, setSkillInput] = useState('');
  const [resumeFile, setResumeFile] = useState(null);
  const [coverFile, setCoverFile] = useState(null);
  const [confirmed, setConfirmed] = useState(false);
  const [errors, setErrors] = useState({});
  const [status, setStatus] = useState('idle');

  const set = useCallback((key, val) => {
    setForm(f => ({ ...f, [key]: val }));
    setErrors(e => ({ ...e, [key]: undefined }));
  }, []);

  /* Redirect home if no job context */
  useEffect(() => { if (!job) goHome(); }, [job]);

  /* Restore draft */
  useEffect(() => {
    if (!job) return;
    try {
      const raw = sessionStorage.getItem(DRAFT_KEY);
      if (!raw) return;
      const d = JSON.parse(raw);
      if (d.jobId === job._id) {
        setForm(f => ({ ...f, ...d.form, skills: d.form?.skills ?? [] }));
        setStep(Math.min(d.step ?? 1, 5));
      }
    } catch { /* ignore */ }
  }, [job]);

  const saveDraft = useCallback((s, f) => {
    if (!job) return;
    sessionStorage.setItem(DRAFT_KEY, JSON.stringify({ jobId: job._id, step: s, form: f }));
  }, [job]);

  const addSkill = (raw) => {
    const tag = raw.trim().replace(/,$/, '');
    if (!tag || form.skills.includes(tag) || form.skills.length >= 20) return;
    set('skills', [...form.skills, tag]);
    setSkillInput('');
  };

  const next = () => {
    const errs = validateStep(step, form, resumeFile);
    if (Object.keys(errs).length) { setErrors(errs); return; }
    const n = Math.min(step + 1, 5);
    setStep(n); saveDraft(n, form); window.scrollTo(0, 0);
  };

  const back = () => { setStep(s => Math.max(s - 1, 1)); setErrors({}); window.scrollTo(0, 0); };

  const goToStep = (n) => {
    if (n >= step) return;
    setStep(n); setErrors({}); window.scrollTo(0, 0);
  };

  const submit = async (e) => {
    e.preventDefault();
    if (!confirmed) { setErrors({ confirmed: 'Please confirm your application is accurate' }); return; }
    setStatus('loading');
    try {
      const fd = new FormData();
      fd.append('role', job.title);
      Object.entries(form).forEach(([k, v]) => {
        if (k === 'skills') fd.append('skills', JSON.stringify(v));
        else fd.append(k, v ?? '');
      });
      fd.append('message', form.coverLetter);
      if (resumeFile) fd.append('resume', resumeFile);
      if (coverFile) fd.append('coverLetterFile', coverFile);
      await api.post('/careers/apply', fd, { headers: { 'Content-Type': 'multipart/form-data' } });
      sessionStorage.removeItem(DRAFT_KEY);
      clearApplyJob();
      setStatus('success');
      trackFormSubmit('job_application');
    } catch {
      setStatus('error');
      trackEvent('form_error', { event_label: 'job_application' });
    }
  };

  if (!job) return null;

  return (
    <PageOverlay>
      <div className="container apply-page">

        {/* Job header */}
        <div className="apply-header">
          <div className="am-eyebrow" style={{ marginBottom: 10 }}>
            <span className="am-tag rem">{job.type}</span>
            <span className="am-tag typ">{job.department}</span>
            <span className="am-tag dep">{job.location}</span>
          </div>
          <h1 className="apply-title">
            {status === 'success' ? 'Application Sent! 🎉' : `Apply — ${job.title}`}
          </h1>
          {status !== 'success' && (
            <p className="apply-sub">Complete all 5 steps. Your progress is saved in this browser session.</p>
          )}
        </div>

        {/* Success */}
        {status === 'success' ? (
          <div className="apply-success">
            <div className="am-success-icon">🎉</div>
            <p className="am-success-text">
              We've received your application for <strong>{job.title}</strong>. We'll review it personally and be in touch within 3–5 business days.
            </p>
            <button className="am-submit" style={{ maxWidth: 260, margin: '0 auto' }} onClick={goHome}>Back to Careers</button>
          </div>
        ) : (
          <>
            {/* Stepper — desktop */}
            <div className="apply-stepper">
              {STEPS.map(s => (
                <button
                  key={s.id}
                  type="button"
                  className={`apply-step${step === s.id ? ' active' : ''}${step > s.id ? ' done' : ''}`}
                  onClick={() => goToStep(s.id)}
                  disabled={s.id > step}
                >
                  <span className="apply-step-num">{step > s.id ? '✓' : s.id}</span>
                  <span className="apply-step-label">{s.label}</span>
                </button>
              ))}
            </div>
            {/* Stepper — mobile */}
            <div className="apply-step-mobile">Step {step} of 5 — {STEPS[step - 1].label}</div>

            <form className="apply-body" onSubmit={submit} noValidate>

              {/* ── Stage 1: Personal ── */}
              {step === 1 && (
                <div className="apply-stage">
                  <h2 className="apply-stage-title">Personal Information</h2>
                  <div className="apply-grid">
                    <Field label="Full Name" error={errors.name}>
                      <input className="am-input" required value={form.name} onChange={e => set('name', e.target.value)} placeholder="Shailesh Jukaria" />
                    </Field>
                    <Field label="Email Address" error={errors.email}>
                      <input className="am-input" type="email" required value={form.email} onChange={e => set('email', e.target.value)} placeholder="you@example.com" />
                    </Field>
                    <Field label="Phone Number" error={errors.phone}>
                      <input className="am-input" type="tel" required value={form.phone} onChange={e => set('phone', e.target.value)} placeholder="+91 98765 43210" />
                    </Field>
                    <Field label="City / Location" error={errors.location}>
                      <input className="am-input" required value={form.location} onChange={e => set('location', e.target.value)} placeholder="Mumbai, India" />
                    </Field>
                    <Field label="LinkedIn Profile" optional error={errors.linkedIn}>
                      <input className="am-input" value={form.linkedIn} onChange={e => set('linkedIn', e.target.value)} placeholder="https://linkedin.com/in/yourname" />
                    </Field>
                    <Field label="Portfolio / Website" optional error={errors.portfolio}>
                      <input className="am-input" value={form.portfolio} onChange={e => set('portfolio', e.target.value)} placeholder="https://yourportfolio.com" />
                    </Field>
                  </div>
                </div>
              )}

              {/* ── Stage 2: Professional ── */}
              {step === 2 && (
                <div className="apply-stage">
                  <h2 className="apply-stage-title">Professional Background</h2>
                  <div className="apply-grid">
                    <Field label="Current / Most Recent Role" error={errors.currentRole}>
                      <input className="am-input" required value={form.currentRole} onChange={e => set('currentRole', e.target.value)} placeholder="Senior Frontend Developer" />
                    </Field>
                    <Field label="Current Company" optional>
                      <input className="am-input" value={form.currentCompany} onChange={e => set('currentCompany', e.target.value)} placeholder="Acme Corp" />
                    </Field>
                    <Field label="Years of Experience" error={errors.experience}>
                      <select className="am-input apply-select" required value={form.experience} onChange={e => set('experience', e.target.value)}>
                        <option value="">Select…</option>
                        {EXPERIENCE_OPTIONS.map(o => <option key={o}>{o}</option>)}
                      </select>
                    </Field>
                    <Field label="Notice Period" error={errors.noticePeriod}>
                      <select className="am-input apply-select" required value={form.noticePeriod} onChange={e => set('noticePeriod', e.target.value)}>
                        <option value="">Select…</option>
                        {NOTICE_OPTIONS.map(o => <option key={o}>{o}</option>)}
                      </select>
                    </Field>
                  </div>
                </div>
              )}

              {/* ── Stage 3: Education ── */}
              {step === 3 && (
                <div className="apply-stage">
                  <h2 className="apply-stage-title">Education</h2>
                  <div className="apply-grid">
                    <Field label="Highest Degree" error={errors.degree}>
                      <input className="am-input" required value={form.degree} onChange={e => set('degree', e.target.value)} placeholder="B.Tech / B.Sc / MBA…" />
                    </Field>
                    <Field label="Field of Study" optional>
                      <input className="am-input" value={form.field} onChange={e => set('field', e.target.value)} placeholder="Computer Science" />
                    </Field>
                    <Field label="Institution / University" error={errors.institution}>
                      <input className="am-input" required value={form.institution} onChange={e => set('institution', e.target.value)} placeholder="IIT Delhi" />
                    </Field>
                    <Field label="Graduation Year" optional error={errors.graduationYear}>
                      <input className="am-input" value={form.graduationYear} onChange={e => set('graduationYear', e.target.value)} placeholder="2023" maxLength={4} />
                    </Field>
                  </div>
                  <Field label="Certifications" optional>
                    <textarea className="am-input am-textarea" rows={3} value={form.certifications}
                      onChange={e => set('certifications', e.target.value)} placeholder="AWS Certified, Google UX Design, etc." />
                  </Field>
                </div>
              )}

              {/* ── Stage 4: Skills & Docs ── */}
              {step === 4 && (
                <div className="apply-stage">
                  <h2 className="apply-stage-title">Skills & Documents</h2>

                  <Field label="Skills" error={errors.skills}>
                    <div className="apply-skills-wrap">
                      {form.skills.length > 0 && (
                        <div className="apply-skills-chips">
                          {form.skills.map(s => (
                            <span key={s} className="apply-skill-chip">
                              {s}
                              <button type="button" onClick={() => set('skills', form.skills.filter(x => x !== s))}>×</button>
                            </span>
                          ))}
                        </div>
                      )}
                      <input
                        className="am-input"
                        value={skillInput}
                        onChange={e => setSkillInput(e.target.value)}
                        onKeyDown={e => { if (e.key === 'Enter' || e.key === ',') { e.preventDefault(); addSkill(skillInput); } }}
                        placeholder="Type a skill and press Enter (e.g. React, Node.js)"
                      />
                      <div className="apply-skills-hint">Press Enter or comma to add · up to 20 skills</div>
                    </div>
                  </Field>

                  <FileZone id="apply-resume" file={resumeFile} onFile={setResumeFile} label="Resume / CV" hint="required · PDF, DOC, DOCX · max 5 MB" />
                  {errors.resume && <div className="apply-field-error">⚠ {errors.resume}</div>}

                  <Field label="Cover Letter" optional>
                    <textarea className="am-input am-textarea" rows={4} value={form.coverLetter}
                      onChange={e => set('coverLetter', e.target.value)}
                      placeholder="Tell us why you're a great fit for this role and what excites you about Stackvine…" />
                  </Field>

                  <FileZone id="apply-cover-file" file={coverFile} onFile={setCoverFile} label="Cover Letter File" hint="optional · PDF, DOC, DOCX · max 5 MB" />
                </div>
              )}

              {/* ── Stage 5: Review ── */}
              {step === 5 && (
                <div className="apply-stage">
                  <h2 className="apply-stage-title">Review & Submit</h2>
                  <p className="apply-review-intro">Check everything carefully before submitting. Use the Edit buttons to go back and make changes.</p>

                  {[
                    { n: 1, title: 'Personal Information' },
                    { n: 2, title: 'Professional Background' },
                    { n: 3, title: 'Education' },
                    { n: 4, title: 'Skills & Documents' },
                  ].map(({ n, title }) => (
                    <div key={n} className="apply-review-section">
                      <div className="apply-review-hdr">
                        <h3>{title}</h3>
                        <button type="button" className="apply-edit-btn" onClick={() => goToStep(n)}>Edit →</button>
                      </div>
                      {n === 1 && <>
                        <ReviewRow label="Name" value={form.name} />
                        <ReviewRow label="Email" value={form.email} />
                        <ReviewRow label="Phone" value={form.phone} />
                        <ReviewRow label="Location" value={form.location} />
                        <ReviewRow label="LinkedIn" value={form.linkedIn} />
                        <ReviewRow label="Portfolio" value={form.portfolio} />
                      </>}
                      {n === 2 && <>
                        <ReviewRow label="Role" value={form.currentRole} />
                        <ReviewRow label="Company" value={form.currentCompany} />
                        <ReviewRow label="Experience" value={form.experience} />
                        <ReviewRow label="Notice Period" value={form.noticePeriod} />
                      </>}
                      {n === 3 && <>
                        <ReviewRow label="Degree" value={form.degree} />
                        <ReviewRow label="Field" value={form.field} />
                        <ReviewRow label="Institution" value={form.institution} />
                        <ReviewRow label="Grad Year" value={form.graduationYear} />
                        <ReviewRow label="Certs" value={form.certifications} />
                      </>}
                      {n === 4 && <>
                        <ReviewRow label="Skills" value={form.skills.join(', ')} />
                        <ReviewRow label="Resume" value={resumeFile?.name} />
                        <ReviewRow label="Cover Letter" value={form.coverLetter || coverFile?.name} />
                      </>}
                    </div>
                  ))}

                  <label className="apply-confirm">
                    <input type="checkbox" checked={confirmed} onChange={e => { setConfirmed(e.target.checked); setErrors({}); }} />
                    <span>I confirm that all information provided is accurate and complete to the best of my knowledge.</span>
                  </label>
                  {errors.confirmed && <div className="apply-field-error">⚠ {errors.confirmed}</div>}
                  {status === 'error' && <div className="am-error" style={{ marginTop: 12 }}>⚠️ Something went wrong. Please try again.</div>}
                </div>
              )}

              {/* Nav */}
              <div className="apply-nav">
                {step > 1
                  ? <button type="button" className="btn-outline apply-back" onClick={back}>← Back</button>
                  : <span />
                }
                {step < 5
                  ? <button type="button" className="am-submit apply-next" onClick={next}>Continue →</button>
                  : <button type="submit" className="am-submit apply-next" disabled={status === 'loading'}>
                      {status === 'loading' ? <><span className="am-spinner" /> Submitting…</> : 'Submit Application →'}
                    </button>
                }
              </div>
            </form>
          </>
        )}
      </div>
    </PageOverlay>
  );
}
