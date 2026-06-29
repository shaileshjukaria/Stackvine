import { useEffect, useState } from 'react';
import api from '../api/axios';
import { useReveal } from '../hooks/useReveal';

function CodeEditor({ codeFile, codeLines }) {
  return (
    <div className="meditor">
      <div className="mtbar">
        <div className="mdot r" /><div className="mdot y" /><div className="mdot g" />
        <span className="mfname">{codeFile}</span>
      </div>
      <div className="mcode">
        {(codeLines || []).map((line, i) => (
          <div className="cl" key={i}>
            <span className="ln">{i + 1}</span>
            <span className="cc">{line || '\u00a0'}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

export default function Work() {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);

  // Pass projects as dep so observer re-runs after data loads
  const ref = useReveal([projects]);

  useEffect(() => {
    api.get('/projects')
      .then(r => setProjects(r.data))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  return (
    <section id="work" className="section-pad" ref={ref}>
      <div className="container">
        <div className="reveal" style={{ marginBottom: 64 }}>
          <div className="eyebrow">Selected Work</div>
          <h2 className="section-heading">Products We've Built</h2>
        </div>

        {loading && (
          <div style={{ textAlign: 'center', padding: '60px 0', color: 'var(--t3)', fontFamily: 'JetBrains Mono,monospace', fontSize: 13 }}>
            Loading projects…
          </div>
        )}

        {!loading && projects.length === 0 && (
          <div style={{
            textAlign: 'center', padding: '60px 0',
            border: '1px dashed var(--border)', borderRadius: 14,
            color: 'var(--t3)', fontFamily: 'JetBrains Mono,monospace', fontSize: 13,
          }}>
            <div style={{ fontSize: 32, marginBottom: 12 }}>🚀</div>
            Projects coming soon — check back shortly.
          </div>
        )}

        {projects.map((p, idx) => (
          <div className={`pcard reveal d${Math.min(idx + 1, 4)}${p.reversed ? ' rev' : ''}`} key={p._id}>
            <div className="ptext">
              <div className="ptags">
                {(p.tags || []).map(t => <span className="ptag" key={t}>{t}</span>)}
              </div>
              <h3 className="pwork-title">{p.title}</h3>
              <p className="pdesc">{p.description}</p>
              <div className="pstack">
                {(p.stack || []).map(s => <span className="stag" key={s}>{s}</span>)}
              </div>
              {p.link && (
                <a href={p.link} target="_blank" rel="noopener" className="plink">
                  View Project →
                </a>
              )}
            </div>
            <div className="pvisual">
              <div className="pvisual-inner">
                <CodeEditor codeFile={p.codeFile} codeLines={p.codeLines} />
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
