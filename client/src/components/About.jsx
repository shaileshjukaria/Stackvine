import { useEffect, useState } from 'react';
import { useReveal } from '../hooks/useReveal';

const LINES = [
  { p: '$', o: null, k: null, v: 'whoami' },
  { p: null, o: 'stackvine', k: null, v: null },
  { p: '$', o: null, k: null, v: 'cat mission.txt' },
  { p: null, o: null, k: 'mission:', v: ' Ship great software' },
  { p: null, o: null, k: 'founded:', v: ' 2026' },
  { p: null, o: null, k: 'base:', v: ' India' },
  { p: null, o: null, k: 'status:', v: ' actively building' },
  { p: '$', o: null, k: null, v: '_' },
];

const BADGES = ['React', 'Node.js', 'MongoDB', 'Express', 'TypeScript', 'Next.js', 'PostgreSQL', 'Docker', 'AWS', 'OpenAI', 'GraphQL', 'Redis'];

export default function About() {
  const ref = useReveal();
  const [lines, setLines] = useState([]);

  useEffect(() => {
    let count = 0;
    let mounted = true;
    const iv = setInterval(() => {
      if (!mounted) return;
      if (count < LINES.length) {
        const line = LINES[count];
        count++;
        setLines(prev => [...prev, line]);
      } else {
        clearInterval(iv);
      }
    }, 240);
    return () => {
      mounted = false;
      clearInterval(iv);
    };
  }, []);

  return (
    <section id="about" ref={ref}>
      <div className="container">
        <div className="about-grid">
          <div>
            <div className="reveal">
              <div className="eyebrow">About Us</div>
              <h2 className="section-heading">We Are Stackvine</h2>
            </div>
            <div className="about-body reveal d1">
              <p>We're a small, senior team of full stack engineers and product designers — obsessed with writing clean code and shipping products that actually work in the real world.</p>
              <p>We work with founders, startups, and businesses who need to move fast without breaking things. Whether it's a brand-new MVP or an existing system that needs serious scaling, we've got the depth to handle it.</p>
              <p>No juniors. No offshore delegation. Just the people you talked to, building your product.</p>
            </div>
            <div className="abadges reveal d2">
              {BADGES.map(b => <span className="abadge" key={b}>⬡ {b}</span>)}
            </div>
          </div>
          <div className="reveal d2">
            <div className="term-card">
              <div className="term-bar">
                <div className="mdot r" /><div className="mdot y" /><div className="mdot g" />
                <span className="term-file">~/stackvine</span>
              </div>
              <div className="term-body">
                {lines.map((line, idx) => (
                  <div key={idx}>
                    {line.p !== null && <span className="tp">{line.p}&nbsp;</span>}
                    {line.o !== null && <span className="to">{line.o}</span>}
                    {line.k !== null && <span className="tk">{line.k}</span>}
                    {line.v !== null && <span className="tv">{line.v}</span>}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
