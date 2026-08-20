/* ============================================================================
   APPLICANTS — page shell. Section tracking, pill nav + jump list, keyboard
   nav, sticky bar visibility, scroll-triggered reveal. Vanilla JS.
   ============================================================================ */

const SECTIONS = [
  { id: 'hero',              name: 'Hero' },
  { id: 'thesis',            name: 'Thesis' },
  { id: 'diagnosis',         name: 'Diagnosis' },
  { id: 'arc-1',             name: 'Arc one' },
  { id: 'arc-2',             name: 'Arc two' },
  { id: 'arc-3',             name: 'Arc three' },
  { id: 'close',             name: 'Close' },
];

const shellReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

let currentIndex = 0;

function sectionEl(id) { return document.getElementById(id); }

function jumpTo(index) {
  index = Math.max(0, Math.min(SECTIONS.length - 1, index));
  const el = sectionEl(SECTIONS[index].id);
  if (el) el.scrollIntoView({ behavior: shellReducedMotion ? 'auto' : 'smooth', block: 'start' });
}

/* ── Sticky bar — hidden while #hero is in view ───────────────────────── */
function wireTopBar() {
  const bar = document.querySelector('.top-bar');
  const hero = sectionEl('hero');
  if (!bar || !hero) return;
  const nameEl = bar.querySelector('.top-bar-section');

  const observer = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      bar.classList.toggle('is-visible', !entry.isIntersecting);
    });
  }, { threshold: 0.15 });
  observer.observe(hero);

  return nameEl;
}

/* ── Active-section tracking — drives the pill label + sticky bar name ──── */
function wireSectionTracking(topBarNameEl) {
  const pillCount = document.querySelector('.section-pill .pill-count');
  const pillName = document.querySelector('.section-pill .pill-name');

  const observer = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (!entry.isIntersecting) return;
      const idx = SECTIONS.findIndex(s => s.id === entry.target.id);
      if (idx === -1) return;
      currentIndex = idx;
      if (pillCount) pillCount.textContent = `${idx + 1} / ${SECTIONS.length}`;
      if (pillName) pillName.textContent = SECTIONS[idx].name;
      if (topBarNameEl) topBarNameEl.textContent = SECTIONS[idx].name;
      updateActiveJumpButton();
    });
  }, { threshold: 0.5 });

  SECTIONS.forEach(s => { const el = sectionEl(s.id); if (el) observer.observe(el); });
}

function updateActiveJumpButton() {
  document.querySelectorAll('.section-jumplist button').forEach(btn => {
    btn.classList.toggle('active', btn.dataset.index === String(currentIndex));
  });
}

/* ── Reveal-on-scroll — one fade+rise per section, fires once ────────────── */
function wireReveal() {
  if (shellReducedMotion) return;
  const targets = document.querySelectorAll('.reveal');
  const observer = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('is-visible');
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.2 });
  targets.forEach(t => observer.observe(t));
}

/* ── V1 sheet — full-screen takeover of the original RentSpree screens,
   reached from the last item in the pill's expanded jump list. ─────────── */
function openV1Sheet() {
  const sheet = document.getElementById('v1-sheet');
  if (!sheet) return;
  sheet.removeAttribute('inert');
  sheet.classList.add('is-open');
  document.body.style.overflow = 'hidden';
  const closeBtn = document.getElementById('v1-sheet-close');
  if (closeBtn) closeBtn.focus();
}
function closeV1Sheet() {
  const sheet = document.getElementById('v1-sheet');
  if (!sheet || !sheet.classList.contains('is-open')) return;
  sheet.classList.remove('is-open');
  sheet.setAttribute('inert', '');
  document.body.style.overflow = '';
}
function wireV1Sheet() {
  const closeBtn = document.getElementById('v1-sheet-close');
  if (closeBtn) closeBtn.addEventListener('click', closeV1Sheet);
  document.addEventListener('keydown', e => {
    if (e.key === 'Escape') closeV1Sheet();
  });
}

/* ── Pill nav — collapsed pill / plain jump list ─────────────────────────── */
function wirePillNav() {
  const pill = document.querySelector('.section-pill');
  const root = document.querySelector('.section-nav');
  if (!pill || !root) return;

  let open = false;
  let listEl = null;

  function closeList() {
    if (!listEl) return;
    const el = listEl;
    listEl = null;
    open = false;
    el.classList.add('is-closing');
    setTimeout(() => el.remove(), 150);
  }

  function openList() {
    open = true;
    listEl = document.createElement('div');
    listEl.className = 'section-jumplist';
    listEl.setAttribute('role', 'menu');
    SECTIONS.forEach((s, i) => {
      const btn = document.createElement('button');
      btn.type = 'button';
      btn.dataset.index = String(i);
      if (i === currentIndex) btn.classList.add('active');
      btn.innerHTML = `<span class="jump-n">0${i + 1}</span><span>${s.name}</span>`;
      btn.addEventListener('click', () => { jumpTo(i); closeList(); });
      listEl.appendChild(btn);
    });
    const v1Btn = document.createElement('button');
    v1Btn.type = 'button';
    v1Btn.className = 'v1-trigger';
    v1Btn.textContent = 'Application experience V1';
    v1Btn.addEventListener('click', () => { closeList(); openV1Sheet(); });
    listEl.appendChild(v1Btn);
    root.appendChild(listEl);
  }

  pill.addEventListener('click', () => { open ? closeList() : openList(); });

  document.addEventListener('click', e => {
    if (!open) return;
    if (root.contains(e.target)) return;
    closeList();
  });
  document.addEventListener('keydown', e => {
    if (e.key === 'Escape' && open) closeList();
  });
}

/* ── Keyboard nav — drives the whole page while screen-sharing ───────────── */
function wireKeyboardNav() {
  document.addEventListener('keydown', e => {
    // Don't hijack typing in a form field or a modifier-held shortcut.
    const tag = (e.target.tagName || '').toLowerCase();
    if (tag === 'input' || tag === 'textarea' || e.target.isContentEditable) return;
    if (e.metaKey || e.ctrlKey || e.altKey) return;
    // A live phone owns the keyboard — arrow keys/spacebar scroll its own
    // screen and number keys are just card content, not section jumps.
    if (document.querySelector('.phone-frame.is-live')) return;
    // Same story for the V1 sheet — it scrolls its own content over the
    // page, section jumps underneath it would be invisible and confusing.
    const v1Sheet = document.getElementById('v1-sheet');
    if (v1Sheet && v1Sheet.classList.contains('is-open')) return;

    if (e.key >= '1' && Number(e.key) <= SECTIONS.length) { jumpTo(Number(e.key) - 1); return; }

    switch (e.key) {
      case 'ArrowDown': case 'ArrowRight': case ' ':
        e.preventDefault(); jumpTo(currentIndex + 1); break;
      case 'ArrowUp': case 'ArrowLeft':
        e.preventDefault(); jumpTo(currentIndex - 1); break;
      case 'Home':
        e.preventDefault(); jumpTo(0); break;
      case 'End':
        e.preventDefault(); jumpTo(SECTIONS.length - 1); break;
    }
  });
}

function initShell() {
  const topBarNameEl = wireTopBar();
  wireSectionTracking(topBarNameEl);
  wireReveal();
  wirePillNav();
  wireKeyboardNav();
  wireV1Sheet();
}

document.addEventListener('DOMContentLoaded', initShell);
