import PageOverlay from '../PageOverlay';

export default function PrivacyPage() {
  const updated = 'July 2025';
  return (
    <PageOverlay>
      <div className="container legal-page">
        <div className="legal-hero">
          <div className="eyebrow">Legal</div>
          <h1 className="legal-title">Privacy Policy</h1>
          <p className="legal-updated">Last updated: {updated}</p>
        </div>

        <div className="legal-body">
          <p>Stackvine ("we", "us", "our") is committed to protecting your personal information. This Privacy Policy explains how we collect, use, and safeguard data when you use our website or services.</p>

          <h2>1. Information We Collect</h2>
          <p>We collect information you voluntarily provide to us, including:</p>
          <ul>
            <li><strong>Contact information</strong> — name, email address, and message when you submit our contact form</li>
            <li><strong>Application data</strong> — name, email, cover letter, and resume when you apply for a position</li>
            <li><strong>Usage data</strong> — pages visited, time spent on site, and browser type via Google Analytics</li>
          </ul>

          <h2>2. How We Use Your Information</h2>
          <ul>
            <li>To respond to your enquiries and project requests</li>
            <li>To review job applications and contact candidates</li>
            <li>To improve our website and services</li>
            <li>To send service-related communications (no marketing without consent)</li>
          </ul>

          <h2>3. Data Storage & Security</h2>
          <p>Your data is stored on MongoDB Atlas (cloud database hosted on AWS) with encryption at rest. We implement industry-standard security measures including JWT authentication, rate limiting, and HTTPS-only access.</p>
          <p>We do not sell, trade, or rent your personal information to third parties.</p>

          <h2>4. Third-Party Services</h2>
          <ul>
            <li><strong>Google Analytics</strong> — anonymised usage tracking. You can opt out via Google's opt-out browser add-on.</li>
            <li><strong>MongoDB Atlas</strong> — secure cloud database storage</li>
            <li><strong>Vercel</strong> — website hosting and edge delivery</li>
          </ul>

          <h2>5. Data Retention</h2>
          <p>We retain contact form submissions and job applications for up to 12 months. You may request deletion of your data at any time by emailing us.</p>

          <h2>6. Your Rights</h2>
          <p>You have the right to:</p>
          <ul>
            <li>Access the personal data we hold about you</li>
            <li>Request correction of inaccurate data</li>
            <li>Request deletion of your data</li>
            <li>Withdraw consent at any time</li>
          </ul>

          <h2>7. Cookies</h2>
          <p>We use minimal cookies — only those required by Google Analytics (anonymised). No advertising or tracking cookies are used.</p>

          <h2>8. Contact Us</h2>
          <p>For any privacy-related questions or requests:</p>
          <p><strong>Email:</strong> <a href="mailto:hello.stackvine@outlook.com">hello.stackvine@outlook.com</a></p>
        </div>
      </div>
    </PageOverlay>
  );
}
