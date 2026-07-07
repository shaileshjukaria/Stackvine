import PageOverlay from '../PageOverlay';

export default function TrustCentrePage() {
  return (
    <PageOverlay>
      <div className="container legal-page">
        <div className="legal-hero">
          <div className="eyebrow">Trust & Safety</div>
          <h1 className="legal-title">Trust Centre</h1>
          <p className="legal-updated">How we keep your data and projects safe</p>
        </div>

        <div className="legal-body">

          <div className="trust-grid">
            <div className="trust-card">
              <div className="trust-icon">🔒</div>
              <h3>Data Security</h3>
              <p>All data is encrypted at rest (AES-256) and in transit (TLS 1.3). We use MongoDB Atlas on AWS with automated backups and point-in-time recovery.</p>
            </div>
            <div className="trust-card">
              <div className="trust-icon">🛡️</div>
              <h3>Application Security</h3>
              <p>Our APIs use JWT authentication, rate limiting (100 req/15min), Helmet.js security headers, and input validation on every endpoint.</p>
            </div>
            <div className="trust-card">
              <div className="trust-icon">🔐</div>
              <h3>Access Control</h3>
              <p>Admin access requires JWT + IP whitelisting. Passwords are hashed with bcrypt (12 rounds). No plain-text secrets are stored anywhere.</p>
            </div>
            <div className="trust-card">
              <div className="trust-icon">📋</div>
              <h3>Confidentiality</h3>
              <p>Every client project is treated as strictly confidential. NDAs available upon request. We never share client details, code, or business information.</p>
            </div>
            <div className="trust-card">
              <div className="trust-icon">🌐</div>
              <h3>Infrastructure</h3>
              <p>Hosted on Vercel (global edge network) + MongoDB Atlas. 99.9% uptime SLA. DDoS protection at the infrastructure level.</p>
            </div>
            <div className="trust-card">
              <div className="trust-icon">✅</div>
              <h3>Code Quality</h3>
              <p>All code goes through linting, manual review, and testing before delivery. We follow OWASP security guidelines for all web applications.</p>
            </div>
          </div>

          <h2>Responsible Disclosure</h2>
          <p>Found a security vulnerability on our website or in code we delivered? Please report it responsibly to:</p>
          <p><strong>Email:</strong> <a href="mailto:hello.stackvine@outlook.com">hello.stackvine@outlook.com</a></p>
          <p>We take all security reports seriously and commit to responding within 48 hours.</p>

          <h2>Data Handling Commitments</h2>
          <ul>
            <li>✅ We never sell your data to third parties</li>
            <li>✅ We never use your project ideas or code for other clients</li>
            <li>✅ We delete your data upon request within 30 days</li>
            <li>✅ We notify you within 72 hours of any data breach affecting you</li>
            <li>✅ We use minimal third-party integrations (only Google Analytics + MongoDB Atlas)</li>
          </ul>

          <h2>Certifications & Standards</h2>
          <ul>
            <li>OWASP Top 10 compliance for all web applications</li>
            <li>GDPR-aware data handling practices</li>
            <li>MongoDB Atlas SOC 2 Type II certified infrastructure</li>
            <li>Vercel ISO 27001 certified hosting</li>
          </ul>
        </div>
      </div>
    </PageOverlay>
  );
}
