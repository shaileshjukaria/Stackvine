import { useState } from 'react';
import api from '../api/axios';
import { trackFormSubmit, trackEvent } from '../utils/analytics';

export default function Cta() {
  const [form, setForm] = useState({ name: '', email: '', company: '', service: '', message: '' });
  const [status, setStatus] = useState('idle'); // idle | loading | success | error

  const set = (k) => (e) => setForm(f => ({ ...f, [k]: e.target.value }));

  const submit = async (e) => {
    e.preventDefault();
    setStatus('loading');
    try {
      await api.post('/contact', form);
      setStatus('success');
      trackFormSubmit('contact_form');
      setForm({ name: '', email: '', company: '', service: '', message: '' });
    } catch {
      setStatus('error');
      trackEvent('form_error', { event_label: 'contact_form' });
    }
  };

  return (
    <section id="cta">
      <div className="container">
        <div className="cta-inner">
          <h2 className="cta-heading">Ready to Build Something?</h2>
          <p className="cta-sub">Tell us about your project and we'll get back to you within 24 hours with a plan of action.</p>

          {status === 'success' ? (
            <div style={{ textAlign: 'center', padding: '40px 0' }}>
              <div style={{ fontSize: 56, marginBottom: 16 }}>🚀</div>
              <h3 style={{ fontFamily: 'Syne,sans-serif', fontSize: 24, marginBottom: 10 }}>Message received!</h3>
              <p style={{ color: 'var(--t2)' }}>We'll respond within 24 hours. Check your inbox!</p>
            </div>
          ) : (
            <form className="cform" onSubmit={submit}>
              <div className="cform-row">
                <div className="cfield">
                  <label>Name</label>
                  <input id="cta-name" required value={form.name} onChange={set('name')} placeholder="Raj Patel" />
                </div>
                <div className="cfield">
                  <label>Email</label>
                  <input id="cta-email" type="email" required value={form.email} onChange={set('email')} placeholder="raj@startup.io" />
                </div>
              </div>
              <div className="cform-row">
                <div className="cfield">
                  <label>Company (optional)</label>
                  <input id="cta-company" value={form.company} onChange={set('company')} placeholder="Startup Inc." />
                </div>
                <div className="cfield">
                  <label>Service</label>
                  <select id="cta-service" value={form.service} onChange={set('service')}>
                    <option value="">Select a service</option>
                    <option>MVP Development</option>
                    <option>AI Integration</option>
                    <option>Full Stack Web App</option>
                    <option>Tech Consultation</option>
                    <option>Other</option>
                  </select>
                </div>
              </div>
              <div className="cfield">
                <label>Tell us about your project</label>
                <textarea id="cta-message" required rows={4} value={form.message} onChange={set('message')} placeholder="We want to build an AI-powered..." />
              </div>
              {status === 'error' && (
                <p style={{ color: 'var(--red)', fontSize: 13 }}>Something went wrong. Please try again.</p>
              )}
              <button id="cta-submit" className="cform-submit" disabled={status === 'loading'} type="submit">
                {status === 'loading' ? 'Sending…' : 'Send Message →'}
              </button>
            </form>
          )}

          <p className="cta-or">— or reach us directly —</p>
          <div className="cta-direct">
            <a href="mailto:hello.stackvine@outlook.com">hello.stackvine@outlook.com</a>
          </div>
        </div>
      </div>
    </section>
  );
}
