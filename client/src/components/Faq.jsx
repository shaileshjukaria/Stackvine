import { useState } from 'react';
import { useReveal } from '../hooks/useReveal';

const FAQS = [
  { q: 'How long does an MVP take?', a: 'Most MVPs take 4–6 weeks from kickoff to live deployment. Timeline depends on scope, but we always agree on a clear schedule before starting.' },
  { q: 'Do you work with non-technical founders?', a: 'Absolutely. We handle all the tech. You bring the vision and domain knowledge — we translate it into a working product.' },
  { q: 'What\'s your pricing model?', a: 'We work on fixed-scope projects or monthly retainers. No hourly billing, no scope creep surprises. Everything\'s agreed upfront.' },
  { q: 'Can you take over an existing codebase?', a: 'Yes. We\'ll do a codebase audit first, then agree on what to refactor vs. rebuild. We\'ve rescued many legacy projects.' },
  { q: 'Do you provide post-launch support?', a: 'Every project includes 30 days of post-launch support. Ongoing maintenance retainers are available after that.' },
  { q: 'What tech do you specialise in?', a: 'Our core stack is MERN (MongoDB, Express, React, Node.js) with TypeScript. We also work with Next.js, PostgreSQL, AWS, and OpenAI APIs.' },
];

export default function Faq() {
  const [open, setOpen] = useState(null);
  const ref = useReveal();

  const toggle = (i) => setOpen(o => o === i ? null : i);

  return (
    <section id="faq" ref={ref}>
      <div className="container">
        <div className="reveal">
          <div className="eyebrow">FAQ</div>
          <h2 className="section-heading">Common Questions</h2>
        </div>
        <div className="faq-grid">
          {FAQS.map((f, i) => (
            <div className={`fitem${open === i ? ' open' : ''}`} key={i}>
              <div className="fq" onClick={() => toggle(i)}>
                {f.q}
                <span className="fq-icon">+</span>
              </div>
              <div className="fa">{f.a}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
