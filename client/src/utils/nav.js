/**
 * Lightweight page navigation — no React Router needed.
 * Any component fires:  window.dispatchEvent(new CustomEvent('sv:page', { detail: 'privacy' }))
 * App.jsx listens and renders the correct page overlay.
 */
export function navigate(page) {
  window.dispatchEvent(new CustomEvent('sv:page', { detail: page }));
}

export function goHome() {
  navigate(null);
}
