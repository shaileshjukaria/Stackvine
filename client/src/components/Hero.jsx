import { useEffect, useRef } from 'react';

export default function Hero() {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    let animId;

    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    resize();
    window.addEventListener('resize', resize);

    const dots = Array.from({ length: 60 }, () => ({
      x: Math.random() * window.innerWidth,
      y: Math.random() * window.innerHeight,
      vx: (Math.random() - 0.5) * 0.4,
      vy: (Math.random() - 0.5) * 0.4,
      r: Math.random() * 1.5 + 0.5,
    }));

    const draw = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      dots.forEach(d => {
        d.x += d.vx; d.y += d.vy;
        if (d.x < 0 || d.x > canvas.width) d.vx *= -1;
        if (d.y < 0 || d.y > canvas.height) d.vy *= -1;
        ctx.beginPath();
        ctx.arc(d.x, d.y, d.r, 0, Math.PI * 2);
        ctx.fillStyle = 'rgba(108,99,255,0.6)';
        ctx.fill();
      });
      dots.forEach((a, i) => dots.slice(i + 1).forEach(b => {
        const dx = a.x - b.x, dy = a.y - b.y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < 120) {
          ctx.beginPath();
          ctx.moveTo(a.x, a.y);
          ctx.lineTo(b.x, b.y);
          ctx.strokeStyle = `rgba(108,99,255,${0.15 * (1 - dist / 120)})`;
          ctx.lineWidth = 0.5;
          ctx.stroke();
        }
      }));
      animId = requestAnimationFrame(draw);
    };
    draw();

    return () => {
      window.removeEventListener('resize', resize);
      cancelAnimationFrame(animId);
    };
  }, []);

  useEffect(() => {
    const glow = document.getElementById('glow');
    if (!glow) return;
    const move = (e) => {
      glow.style.transform = `translate(${e.clientX - 260}px,${e.clientY - 260}px)`;
    };
    window.addEventListener('mousemove', move);
    return () => window.removeEventListener('mousemove', move);
  }, []);

  return (
    <>
      <canvas id="bg-canvas" ref={canvasRef} />
      <div id="glow" />
      <section id="hero">
        <div className="hero-inner">
          <div className="hero-eyebrow">
            <span className="eyebrow-dot"></span>Full Stack · AI · MVPs
          </div>
          <h1 className="hero-headline">
            <span className="hw">We&nbsp;</span>
            <span className="hw">Build&nbsp;</span>
            <span className="hw">Products&nbsp;</span>
            <br />
            <span className="hw">That&nbsp;</span>
            <span className="hw ac">Actually&nbsp;</span>
            <span className="hw">Ship.</span>
          </h1>
          <p className="hero-sub">
            Stackvine is a full stack development studio specialising in web apps, AI integrations,
            and MVPs — built fast, built right.
          </p>
          <div className="hero-ctas">
            <a href="#cta" className="btn-primary">Start a Project →</a>
            <a href="#work" className="btn-outline">See Our Work</a>
          </div>
        </div>
        <div className="hero-code">
          <span className="cm">// stackvine.config.js</span><br />
          <span className="kw">export default</span> {'{'}<br />
          &nbsp;&nbsp;<span className="fn">stack</span>: [<span className="st">'React'</span>, <span className="st">'Node'</span>, <span className="st">'AI'</span>],<br />
          &nbsp;&nbsp;<span className="fn">delivery</span>: <span className="st">'4–6 weeks'</span>,<br />
          &nbsp;&nbsp;<span className="fn">status</span>: <span className="st">'shipping'</span> <span className="cm">// always</span><br />
          {'}'}<span className="cb"></span>
        </div>
      </section>
    </>
  );
}
