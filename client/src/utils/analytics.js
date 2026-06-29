/**
 * Google Analytics GA4 tracker
 * Tracks: page views, CTA clicks, form submissions, section visibility
 *
 * Activate by setting VITE_GA_ID=G-XXXXXXXXXX in client/.env
 */

const GA_ID = import.meta.env.VITE_GA_ID;

// Load GA script once
let loaded = false;
function loadGA() {
  if (loaded || !GA_ID) return;
  loaded = true;

  const script = document.createElement('script');
  script.async = true;
  script.src = `https://www.googletagmanager.com/gtag/js?id=${GA_ID}`;
  document.head.appendChild(script);

  window.dataLayer = window.dataLayer || [];
  window.gtag = function () { window.dataLayer.push(arguments); };
  window.gtag('js', new Date());
  window.gtag('config', GA_ID, {
    anonymize_ip: true,
    page_title: document.title,
    page_location: window.location.href,
  });
}

// Track a custom event
export function trackEvent(event_name, params = {}) {
  if (!GA_ID || !window.gtag) return;
  window.gtag('event', event_name, params);
}

// Track CTA button clicks
export function trackCTA(label) {
  trackEvent('cta_click', { event_category: 'engagement', event_label: label });
}

// Track form submissions
export function trackFormSubmit(form_name) {
  trackEvent('form_submit', { event_category: 'lead', event_label: form_name });
}

// Initialise GA
export function initGA() {
  loadGA();
}
