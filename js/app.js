/* ============================================================================
   APPLICANTS — app logic. Vanilla JS, no build step, no framework.
   Registers GSAP/ScrollTrigger and gates all motion behind
   prefers-reduced-motion. Per-section scroll reveals get added here as the
   8 sections are built — this is just the guard rail they'll hang off.
   ============================================================================ */

const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

if (window.gsap && window.ScrollTrigger) {
  gsap.registerPlugin(ScrollTrigger);
}

function initScrollReveals() {
  if (prefersReducedMotion || !window.gsap) return;
  // Section-by-section gsap.from(...) + ScrollTrigger entries go here.
}

document.addEventListener('DOMContentLoaded', initScrollReveals);
