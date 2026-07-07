import PageOverlay from '../PageOverlay';

const WA = import.meta.env.VITE_WHATSAPP_NUMBER;

const services = {
  'MVP Development': {
    icon: '🚀',
    tagline: 'From idea to shipped product in 4–6 weeks.',
    description: 'We take your idea from a napkin sketch to a production-ready MVP — fast. No fluff, no endless planning sessions. Just rapid, focused execution that gets you to market before your competitors.',
    features: [
      { icon: '🎯', title: 'Product Scoping', body: 'We define your core feature set and cut everything that doesn\'t matter for v1.' },
      { icon: '🎨', title: 'UI/UX Design', body: 'Clean, conversion-focused interfaces designed to delight your first users.' },
      { icon: '⚙️', title: 'Full Stack Development', body: 'React frontend + Node.js backend + MongoDB — production-grade code from day one.' },
      { icon: '☁️', title: 'Deployment & Hosting', body: 'Set up on Vercel/Render/AWS with CI/CD pipelines so you can ship updates effortlessly.' },
      { icon: '📊', title: 'Analytics Integration', body: 'Google Analytics, Mixpanel, or PostHog — so you can measure what users actually do.' },
      { icon: '🔒', title: 'Auth & Payments', body: 'User authentication (JWT/OAuth) and payment processing (Razorpay/Stripe) included.' },
    ],
    timeline: '4–6 Weeks',
    ideal: 'Founders with a validated idea ready to build their first product.',
  },
  'AI Integration': {
    icon: '✨',
    tagline: 'Plug powerful AI into your existing product or build AI-native from scratch.',
    description: 'AI isn\'t magic — it\'s engineering. We integrate LLMs, build custom pipelines, and wire up AI capabilities that actually solve real user problems, not just demo well.',
    features: [
      { icon: '🤖', title: 'Custom Chatbots', body: 'GPT-4 / Claude-powered bots trained on your data, deployed in your product.' },
      { icon: '🔄', title: 'Workflow Automation', body: 'Automate repetitive tasks using AI — document processing, classification, extraction.' },
      { icon: '✍️', title: 'Content Generation', body: 'AI writing tools, image generation, and SEO content pipelines for your platform.' },
      { icon: '🔍', title: 'Semantic Search', body: 'Vector search (Pinecone/Qdrant) so users find what they need instantly.' },
      { icon: '📈', title: 'Recommendations', body: 'Personalised product, content, or action recommendations powered by ML models.' },
      { icon: '🔗', title: 'API Integrations', body: 'OpenAI, Anthropic, Replicate, Stability AI — we\'ve worked with them all.' },
    ],
    timeline: '2–8 Weeks',
    ideal: 'Products looking to add AI superpowers without rebuilding from scratch.',
  },
  'Full Stack Web Apps': {
    icon: '⚡',
    tagline: 'Custom web applications built for scale, speed, and your exact requirements.',
    description: 'Beyond MVPs — when you need a full-featured SaaS platform, internal tool, or business application with complex workflows, real-time data, and enterprise-grade reliability.',
    features: [
      { icon: '📱', title: 'SaaS Platforms', body: 'Multi-tenant SaaS with subscription billing, user management, and role-based access.' },
      { icon: '📊', title: 'Custom Dashboards', body: 'Real-time analytics dashboards with charts, filters, and data export.' },
      { icon: '🔗', title: 'API Development', body: 'RESTful or GraphQL APIs with full documentation, versioning, and rate limiting.' },
      { icon: '⚡', title: 'Real-time Features', body: 'WebSocket-powered live updates, notifications, and collaborative features.' },
      { icon: '🗄️', title: 'Database Design', body: 'MongoDB, PostgreSQL, or hybrid — optimised schema design for your use case.' },
      { icon: '🛡️', title: 'Security & Compliance', body: 'OWASP best practices, data encryption, audit logs, and GDPR-ready architecture.' },
    ],
    timeline: '6–16 Weeks',
    ideal: 'Businesses replacing spreadsheets or legacy systems with modern web apps.',
  },
  'Tech Consultation': {
    icon: '💬',
    tagline: 'Get clarity on your tech decisions before spending a single rupee.',
    description: 'Stuck on which stack to use? Not sure if your current architecture will scale? Worried you\'re building the wrong thing? One focused call can save you months of wasted effort.',
    features: [
      { icon: '🗺️', title: 'Tech Stack Selection', body: 'Unbiased advice on the right technologies for your product, team, and budget.' },
      { icon: '🔍', title: 'Code & Architecture Review', body: 'We audit your existing codebase and give actionable improvement recommendations.' },
      { icon: '📋', title: 'Product Roadmap Planning', body: 'Feature prioritisation and phased roadmap to get to market fast and iterate smart.' },
      { icon: '💰', title: 'Build vs Buy Analysis', body: 'Should you build it custom or use an existing tool? We help you decide.' },
      { icon: '🚀', title: 'Scaling Strategy', body: 'Performance, database, and infrastructure advice for when you start growing.' },
      { icon: '👥', title: 'Team & Hiring Guidance', body: 'When to hire, what roles to hire first, and how to structure your tech team.' },
    ],
    timeline: '1-hour call',
    ideal: 'Early-stage founders, CTOs, and product managers who need an expert sounding board.',
  },
};

function EnquiryButtons({ service }) {
  const subject = encodeURIComponent(`Enquiry: ${service}`);
  const body = encodeURIComponent(`Hi Stackvine,\n\nI'm interested in your ${service} service.\n\nCan we discuss my project?\n\nBest,`);
  const waMsg = encodeURIComponent(`Hi Stackvine! I'm interested in your *${service}* service. Can we discuss my project? 👋`);
  const waHref = WA ? `https://wa.me/${WA}?text=${waMsg}` : null;

  return (
    <div className="svc-enquiry">
      <p className="svc-enquiry-label">Ready to get started?</p>
      <div className="svc-enquiry-btns">
        <a
          href={`mailto:hello.stackvine@outlook.com?subject=${subject}&body=${body}`}
          className="btn-primary"
        >
          📧 Email Us
        </a>
        {waHref && (
          <a href={waHref} target="_blank" rel="noopener noreferrer" className="svc-wa-btn">
            <svg viewBox="0 0 24 24" width="18" height="18" fill="currentColor">
              <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
            </svg>
            WhatsApp Us
          </a>
        )}
      </div>
    </div>
  );
}

export default function ServiceDetailPage({ serviceKey }) {
  const svc = services[serviceKey];
  if (!svc) return null;

  return (
    <PageOverlay>
      {/* Hero */}
      <div className="svc-hero">
        <div className="container">
          <div className="svc-hero-icon">{svc.icon}</div>
          <div className="eyebrow">Our Services</div>
          <h1 className="svc-hero-title">{serviceKey}</h1>
          <p className="svc-hero-tagline">{svc.tagline}</p>
          <div className="svc-meta-row">
            <div className="svc-meta-pill">
              <span className="svc-meta-label">Timeline</span>
              <span className="svc-meta-val">{svc.timeline}</span>
            </div>
            <div className="svc-meta-pill">
              <span className="svc-meta-label">Pricing</span>
              <span className="svc-meta-val">Get a quote →</span>
            </div>
          </div>
        </div>
      </div>

      <div className="container svc-body">
        {/* About */}
        <section className="svc-section">
          <h2 className="svc-section-title">About this service</h2>
          <p className="svc-section-body">{svc.description}</p>
        </section>

        {/* What's included */}
        <section className="svc-section">
          <h2 className="svc-section-title">What's included</h2>
          <div className="svc-features-grid">
            {svc.features.map(f => (
              <div className="svc-feature-card" key={f.title}>
                <div className="svc-feature-icon">{f.icon}</div>
                <div>
                  <div className="svc-feature-title">{f.title}</div>
                  <div className="svc-feature-body">{f.body}</div>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Ideal for */}
        <section className="svc-section">
          <div className="svc-ideal">
            <span className="svc-ideal-label">✅ Ideal for</span>
            <span className="svc-ideal-text">{svc.ideal}</span>
          </div>
        </section>

        {/* CTA */}
        <EnquiryButtons service={serviceKey} />
      </div>
    </PageOverlay>
  );
}
