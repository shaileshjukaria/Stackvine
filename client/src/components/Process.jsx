import { useReveal } from '../hooks/useReveal';

const steps = [
  { num: '01', title: 'Discover', body: 'Deep dive into your product goals, users, and constraints. No assumptions, no copy-paste templates.' },
  { num: '02', title: 'Build', body: 'Weekly sprints with live previews. You see real progress every week — not just at the final handoff.' },
  { num: '03', title: 'Launch', body: 'Deployed, tested, documented, and handed over — with 30 days of post-launch support included.' },
];

export default function Process() {
  const ref = useReveal();

  return (
    <section id="process" ref={ref}>
      <div className="container">
        <div className="reveal">
          <div className="eyebrow">How We Work</div>
          <h2 className="section-heading">Simple. Transparent. Fast.</h2>
        </div>
        <div className="proc-steps">
          {steps.map((s, i) => (
            <div className={`pstep reveal d${i + 1}`} key={s.num}>
              <span className="pcircle">{s.num}</span>
              <div className="ptitle">{s.title}</div>
              <div className="pbody">{s.body}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
