import { useReveal } from '../hooks/useReveal';
import { navigate } from '../utils/nav';

const services = [
  { icon: '🚀', tag: 'Most Popular', title: 'MVP Development', body: 'Turn your idea into a working product in 4–6 weeks. We scope, design, build, and ship — no fluff, no delays.' },
  { icon: '✨', tag: null, title: 'AI Integration', body: 'Chatbots, automation, content generation, and recommendations — powered by OpenAI and Anthropic APIs, wired into your product.' },
  { icon: '⚡', tag: null, title: 'Full Stack Web Apps', body: 'Custom dashboards, SaaS platforms, CRMs, and business tools — built on MERN stack with clean architecture and test coverage.' },
  { icon: '💬', tag: 'Free first call', title: 'Tech Consultation', body: '1-hour strategy call to validate your idea, choose the right stack, and get a clear roadmap before spending a single rupee.' },
];

export default function Services() {
  const ref = useReveal();

  return (
    <section id="services" className="section-pad" ref={ref}>
      <div className="container">
        <div className="reveal">
          <div className="eyebrow">What We Do</div>
          <h2 className="section-heading">End-to-End Digital Products</h2>
          <p className="section-sub">From idea to deployment — we handle the full stack so you can focus on growth.</p>
        </div>
        <div className="cards-grid">
          {services.map((s, i) => (
            <div
              className={`scard reveal d${i + 1}`}
              key={s.title}
              onClick={() => navigate(s.title)}
              role="button"
              tabIndex={0}
              onKeyDown={e => e.key === 'Enter' && navigate(s.title)}
              style={{ cursor: 'pointer' }}
            >
              <div className="card-icon">{s.icon}</div>
              {s.tag && <span className="ctag">{s.tag}</span>}
              <div className="ctitle">{s.title}</div>
              <div className="cbody">{s.body}</div>
              <div className="scard-link">Learn more →</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

