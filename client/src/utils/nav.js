/**
 * Lightweight page navigation — no React Router needed.
 */
export function navigate(page) {
  window.dispatchEvent(new CustomEvent('sv:page', { detail: page }));
}

export function goHome() {
  navigate(null);
}

export function navigateToApply(job) {
  window._svApplyJob = job;
  navigate('apply');
}

export function getApplyJob() {
  return window._svApplyJob ?? null;
}

export function clearApplyJob() {
  delete window._svApplyJob;
}
