import { useEffect, useState } from 'react';

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 30);
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const close = () => setMenuOpen(false);

  return (
    <>
      <nav id="navbar" className={scrolled ? 'scrolled' : ''}>
        <div className="container nav-inner">

          {/* Logo image */}
          <a href="#" className="nav-logo">
            <img
              src="/logo.png"
              alt="Stackvine"
              style={{
                height: '38px',
                width: 'auto',
                objectFit: 'contain',
                filter: 'drop-shadow(0 0 10px rgba(108,99,255,0.5))',
                transition: 'filter .3s',
              }}
              onMouseEnter={e => e.currentTarget.style.filter = 'drop-shadow(0 0 16px rgba(108,99,255,0.8))'}
              onMouseLeave={e => e.currentTarget.style.filter = 'drop-shadow(0 0 10px rgba(108,99,255,0.5))'}
            />
          </a>

          <ul className="nav-links" id="nav-links">
            <li><a href="#work">Work</a></li>
            <li><a href="#services">Services</a></li>
            <li><a href="#about">About</a></li>
            <li><a href="#careers">Careers</a></li>
            <li><a href="#cta">Contact</a></li>
          </ul>

          <div className="nav-right">
            <div className="nav-status">
              <span className="status-dot"></span>Available for projects
            </div>
            <a href="#cta" className="btn-nav">Book a Call →</a>
          </div>

          <button
            className={`hamburger${menuOpen ? ' open' : ''}`}
            id="hamburger"
            aria-label="Open menu"
            onClick={() => setMenuOpen(o => !o)}
          >
            <span/><span/><span/>
          </button>
        </div>
      </nav>

      <div id="overlay" className={menuOpen ? 'open' : ''} onClick={close} />

      <nav id="mobile-menu" className={menuOpen ? 'open' : ''}>
        <a href="#" onClick={close} style={{ marginBottom: 8 }}>
          <img src="/logo.png" alt="Stackvine" style={{ height: 44, width: 'auto' }} />
        </a>
        <a href="#work" onClick={close}>Work</a>
        <a href="#services" onClick={close}>Services</a>
        <a href="#about" onClick={close}>About</a>
        <a href="#careers" onClick={close}>Careers</a>
        <a href="#cta" onClick={close}>Contact</a>
        <a href="#cta" className="btn-nav" onClick={close}>Book a Call →</a>
      </nav>
    </>
  );
}
