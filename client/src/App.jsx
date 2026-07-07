import { useState, useEffect } from 'react';
import AdminLogin from './components/admin/AdminLogin';
import AdminDashboard from './components/admin/AdminDashboard';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import Marquee from './components/Marquee';
import Services from './components/Services';
import Process from './components/Process';
import Work from './components/Work';
import Stats from './components/Stats';
import About from './components/About';
import Testimonials from './components/Testimonials';
import Careers from './components/Careers';
import Faq from './components/Faq';
import Cta from './components/Cta';
import Footer from './components/Footer';
import WhatsAppButton from './components/WhatsAppButton';
import { initGA } from './utils/analytics';
import ServiceDetailPage from './components/pages/ServiceDetailPage';
import PrivacyPage from './components/pages/PrivacyPage';
import TermsPage from './components/pages/TermsPage';
import TrustCentrePage from './components/pages/TrustCentrePage';

const ADMIN_PATH = import.meta.env.VITE_ADMIN_PATH || 'admin';
const ADMIN_ENABLED = import.meta.env.VITE_ADMIN_ENABLED !== 'false';

const isAdminRoute = () =>
  ADMIN_ENABLED && window.location.pathname === `/${ADMIN_PATH}`;

// ── Admin App ─────────────────────────────────────────────
function AdminApp() {
  const [adminEmail, setAdminEmail] = useState(() => {
    const token = localStorage.getItem('sv_admin_token');
    if (!token) return null;
    try {
      const payload = JSON.parse(atob(token.split('.')[1]));
      return payload.exp * 1000 > Date.now() ? payload.email : null;
    } catch { return null; }
  });

  const logout = () => {
    localStorage.removeItem('sv_admin_token');
    setAdminEmail(null);
  };

  if (!adminEmail) return <AdminLogin onLogin={setAdminEmail} />;
  return <AdminDashboard adminEmail={adminEmail} onLogout={logout} />;
}

// ── Landing App ───────────────────────────────────────────
function LandingApp() {
  useEffect(() => {
    // Initialise Google Analytics (activates only if VITE_GA_ID is set)
    initGA();

    // Scroll-to-top button visibility
    const btn = document.getElementById('scroll-top');
    const onScroll = () => {
      if (btn) btn.classList.toggle('visible', window.scrollY > 400);
    };
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return (
    <>
      <Navbar />
      <Hero />
      <Marquee />
      <Services />
      <Process />
      <Work />
      <Stats />
      <About />
      <Testimonials />
      <Careers />
      <Faq />
      <Cta />
      <Footer />
      {/* WhatsApp floating button — activates via VITE_WHATSAPP_NUMBER in .env */}
      <WhatsAppButton />
    </>
  );
}

// ── Page Router ───────────────────────────────────────────
function PageRouter({ page }) {
  if (!page) return null;
  // Service pages
  const services = ['MVP Development', 'AI Integration', 'Full Stack Web Apps', 'Tech Consultation'];
  if (services.includes(page)) return <ServiceDetailPage serviceKey={page} />;
  if (page === 'privacy') return <PrivacyPage />;
  if (page === 'terms') return <TermsPage />;
  if (page === 'trust') return <TrustCentrePage />;
  return null;
}

// ── Root ──────────────────────────────────────────────────
export default function App() {
  const [activePage, setActivePage] = useState(null);

  // Listen for navigation events from any component
  useEffect(() => {
    const fn = (e) => setActivePage(e.detail);
    window.addEventListener('sv:page', fn);
    return () => window.removeEventListener('sv:page', fn);
  }, []);

  if (isAdminRoute()) return <AdminApp />;
  if (activePage) return <PageRouter page={activePage} />;
  return <LandingApp />;
}
