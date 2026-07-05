export default function Footer() {
  const year = new Date().getFullYear();

  const copyEmail = (e) => {
    e.preventDefault();
    navigator.clipboard.writeText('hello@stackvine.io').then(() => {
      const t = document.getElementById('toast');
      if (t) {
        t.textContent = '📋 Email copied!';
        t.classList.add('show');
        setTimeout(() => t.classList.remove('show'), 3000);
      }
    });
  };

  return (
    <>
      <div id="toast"></div>
      <button
        id="scroll-top"
        title="Back to top"
        onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
      >↑</button>

      <footer>
        <div className="container">
          <div className="footer-top">

            {/* Brand column with logo image */}
            <div className="fbrand">
              <a href="#" style={{ display: 'inline-block', marginBottom: 14 }}>
                <img
                  src="/logo.png"
                  alt="Stackvine"
                  style={{
                    height: '52px',
                    width: 'auto',
                    objectFit: 'contain',
                    filter: 'drop-shadow(0 0 8px rgba(108,99,255,0.35))',
                  }}
                />
              </a>
              <p className="ftagline">Full stack development studio. We build web products that actually ship.</p>
              <div className="femail">
                <a href="mailto:hello@stackvine.io" onClick={copyEmail}>hello@stackvine.io</a>
              </div>
              <p className="floc">📍Uttarakhand,India · Working globally</p>
              <div className="fsocials">
                <a href="https://github.com" target="_blank" rel="noopener" className="fsl">GH</a>
                <a href="https://linkedin.com" target="_blank" rel="noopener" className="fsl">in</a>
                <a href="https://twitter.com" target="_blank" rel="noopener" className="fsl">𝕏</a>
              </div>
            </div>

            <div className="fcol">
              <div className="fcol-title">Services</div>
              <ul>
                <li><a href="#services">MVP Development</a></li>
                <li><a href="#services">AI Integration</a></li>
                <li><a href="#services">Full Stack Apps</a></li>
                <li><a href="#services">Tech Consultation</a></li>
              </ul>
            </div>

            <div className="fcol">
              <div className="fcol-title">Company</div>
              <ul>
                <li><a href="#work">Our Work</a></li>
                <li><a href="#about">About Us</a></li>
                <li><a href="#process">Process</a></li>
                <li><a href="#careers">Careers</a></li>
              </ul>
            </div>

            <div className="fcol">
              <div className="fcol-title">Connect</div>
              <ul>
                <li><a href="#cta">Book a Call</a></li>
                <li><a href="#faq">FAQ</a></li>
                <li><a href="mailto:hello@stackvine.io">Email Us</a></li>
              </ul>
            </div>
          </div>

          <div className="fbot">
            <span>© {year} <a href="https://shaileshjukaria.netlify.app" target="_blank" rel="noopener noreferrer">Shailesh Jukaria</a>. All rights reserved.</span>
            <div className="fbot-right">
              <div className="fmade">Made with <span className="fheart">♥</span> in India</div>
              <a href="#">Privacy</a>
              <a href="#">Terms</a>
            </div>
          </div>
        </div>
      </footer>
    </>
  );
}