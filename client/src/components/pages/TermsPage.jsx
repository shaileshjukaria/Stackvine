import PageOverlay from '../PageOverlay';

export default function TermsPage() {
  const updated = 'July 2025';
  return (
    <PageOverlay>
      <div className="container legal-page">
        <div className="legal-hero">
          <div className="eyebrow">Legal</div>
          <h1 className="legal-title">Terms of Service</h1>
          <p className="legal-updated">Last updated: {updated}</p>
        </div>

        <div className="legal-body">
          <p>These Terms of Service govern your use of the Stackvine website and any services provided by Stackvine. By accessing our website or engaging our services, you agree to these terms.</p>

          <h2>1. Services</h2>
          <p>Stackvine provides software development services including MVP development, AI integration, full-stack web application development, and technology consultation. Specific deliverables, timelines, and pricing are agreed upon in writing before any project commences.</p>

          <h2>2. Project Engagement</h2>
          <ul>
            <li>All projects begin with a signed Statement of Work (SOW) or project agreement</li>
            <li>A deposit (typically 30–50%) is required before work begins</li>
            <li>Final payment is due upon project delivery</li>
            <li>Scope changes beyond the agreed SOW may incur additional charges</li>
          </ul>

          <h2>3. Intellectual Property</h2>
          <p>Upon full payment, you own the custom code and deliverables created specifically for your project. We retain the right to use the project as a portfolio reference unless explicitly agreed otherwise in writing.</p>
          <p>Open-source libraries and third-party components remain subject to their respective licences.</p>

          <h2>4. Confidentiality</h2>
          <p>We treat all client information, business ideas, and project details as strictly confidential. We do not disclose client information to third parties without consent. NDAs are available upon request.</p>

          <h2>5. Warranties & Liability</h2>
          <p>We warrant that our work will be performed with reasonable skill and care. We will fix bugs discovered within 30 days of delivery at no additional cost.</p>
          <p>Our liability is limited to the amount paid for the specific project in question. We are not liable for indirect, consequential, or incidental damages.</p>

          <h2>6. Payment Terms</h2>
          <ul>
            <li>Invoices are due within 7 days of issue unless otherwise agreed</li>
            <li>Late payments may incur a 2% monthly fee</li>
            <li>Work may pause if invoices are more than 14 days overdue</li>
          </ul>

          <h2>7. Termination</h2>
          <p>Either party may terminate the engagement with 14 days written notice. Work completed up to the termination date is billable. Any deposit paid is non-refundable after work has commenced.</p>

          <h2>8. Governing Law</h2>
          <p>These terms are governed by the laws of India. Any disputes shall be subject to the jurisdiction of courts in Uttarakhand, India.</p>

          <h2>9. Contact</h2>
          <p><strong>Email:</strong> <a href="mailto:hello.stackvine@outlook.com">hello.stackvine@outlook.com</a></p>
        </div>
      </div>
    </PageOverlay>
  );
}
