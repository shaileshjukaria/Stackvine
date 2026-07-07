import { useEffect } from 'react';
import { goHome } from '../utils/nav';

/**
 * Full-screen page overlay.
 * Slides over the main site content with a smooth animation.
 * Close via: back button, Escape key, or goHome().
 */
export default function PageOverlay({ title, children }) {
  // Close on Escape
  useEffect(() => {
    const fn = (e) => { if (e.key === 'Escape') goHome(); };
    window.addEventListener('keydown', fn);
    document.body.style.overflow = 'hidden';
    window.scrollTo(0, 0);
    return () => {
      window.removeEventListener('keydown', fn);
      document.body.style.overflow = '';
    };
  }, []);

  return (
    <div className="page-overlay">
      {/* Sticky top bar */}
      <header className="page-overlay-bar">
        <button className="page-back-btn" onClick={goHome}>
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M19 12H5M12 5l-7 7 7 7" />
          </svg>
          Back to Stackvine
        </button>
        <a href="#" onClick={e => { e.preventDefault(); goHome(); }} style={{ display: 'inline-block' }}>
          <img src="/logo.png" alt="Stackvine" style={{ height: 36, width: 'auto', objectFit: 'contain', filter: 'drop-shadow(0 0 8px rgba(108,99,255,0.35))' }} />
        </a>
      </header>

      {/* Scrollable content */}
      <main className="page-overlay-content">
        {children}
      </main>
    </div>
  );
}
