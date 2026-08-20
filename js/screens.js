/* ============================================================================
   APPLICANTS — RentSpree screen builders. Vanilla JS, no build step, no
   framework. Each function returns a DOM node scoped under class "product"
   (the RentSpree token scope — see styles.css). Plain globals, not ES
   modules, to match the rest of the codebase's script-tag convention.
   ============================================================================ */

/* ── DOM helper ────────────────────────────────────────────────────────── */
function h(tag, props, ...children) {
  const el = document.createElement(tag);
  if (props) {
    Object.entries(props).forEach(([k, v]) => {
      if (v === undefined || v === null || v === false) return;
      if (k === 'class') el.className = v;
      else if (k === 'text') el.textContent = v;
      else if (k.startsWith('on') && typeof v === 'function') el.addEventListener(k.slice(2).toLowerCase(), v);
      else el.setAttribute(k, v === true ? '' : v);
    });
  }
  children.flat().forEach(c => {
    if (c === null || c === undefined) return;
    el.appendChild(typeof c === 'string' ? document.createTextNode(c) : c);
  });
  return el;
}

function svg(inner, viewBox) {
  const vb = viewBox || '0 0 24 24';
  // Explicit width/height (taken straight from the viewBox) rather than
  // leaving the SVG to size itself: found the hard way that a bare <svg>
  // only rendered at a sane size because every icon so far happened to sit
  // in a fixed-height flex container (icon buttons, the status bar). Drop
  // one into a container with auto height — .rs-add-row's "+" — and with no
  // definite cross-size to shrink against, the browser falls back to its
  // ~300x150 replaced-element default, scaled to a huge square by the
  // viewBox's 1:1 aspect ratio. Explicit dimensions make every icon
  // deterministic regardless of what it's sitting inside.
  const [, , w, hgt] = vb.split(' ').map(Number);
  const wrap = document.createElement('div');
  wrap.innerHTML = `<svg viewBox="${vb}" width="${w}" height="${hgt}" fill="none" xmlns="http://www.w3.org/2000/svg">${inner}</svg>`;
  return wrap.firstElementChild;
}

/* ── Icons — simplified, not traced from iOS glyphs ──────────────────────
   Good-enough first pass; swap for exact glyphs later if fidelity matters. */
const Icon = {
  back: () => svg('<path d="M15 5L8 12l7 7" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>'),
  kebab: () => svg('<circle cx="12" cy="5" r="1.6" fill="currentColor"/><circle cx="12" cy="12" r="1.6" fill="currentColor"/><circle cx="12" cy="19" r="1.6" fill="currentColor"/>'),
  close: () => svg('<path d="M6 6l12 12M18 6L6 18" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>'),
  arrowRight: () => svg('<path d="M5 12h14M13 6l6 6-6 6" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>'),
  chevronDown: () => svg('<path d="M6 9l6 6 6-6" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>'),
  check: () => svg('<path d="M5 13l4 4L19 7" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"/>'),
  signal: () => svg('<rect x="1" y="9" width="3" height="5" rx="0.5" fill="currentColor"/><rect x="6" y="6.5" width="3" height="7.5" rx="0.5" fill="currentColor"/><rect x="11" y="4" width="3" height="10" rx="0.5" fill="currentColor"/><rect x="16" y="1.5" width="3" height="12.5" rx="0.5" fill="currentColor"/>', '0 0 20 16'),
  wifi: () => svg('<path d="M1 6.5C5.8 2 14.2 2 19 6.5" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"/><path d="M4.3 9.8C7.7 6.7 12.3 6.7 15.7 9.8" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"/><path d="M7.6 13C9.5 11.3 10.5 11.3 12.4 13" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"/>', '0 0 20 16'),
  battery: () => svg('<rect x="0.75" y="1.75" width="19" height="10.5" rx="2.5" stroke="currentColor" stroke-width="1.2"/><rect x="2.25" y="3.25" width="14.5" height="7.5" rx="1.3" fill="currentColor"/><rect x="20.5" y="5" width="1.5" height="4" rx="0.7" fill="currentColor"/>', '0 0 23 14'),
  chevronUp: () => svg('<path d="M6 15l6-6 6 6" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>'),
  plus: () => svg('<path d="M12 5v14M5 12h14" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>'),
  minus: () => svg('<path d="M5 12h14" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>'),
  calendar: () => svg('<rect x="3" y="5" width="18" height="16" rx="2" stroke="currentColor" stroke-width="1.6"/><path d="M3 9.5h18M8 3v4M16 3v4" stroke="currentColor" stroke-width="1.6" stroke-linecap="round"/>'),
  phone: () => svg('<path d="M6.6 10.8c1.4 2.8 3.8 5.1 6.6 6.6l2.2-2.2c.3-.3.7-.4 1-.2 1.1.4 2.3.6 3.6.6.6 0 1 .4 1 1V20c0 .6-.4 1-1 1C10.6 21 3 13.4 3 4c0-.6.4-1 1-1h3.5c.6 0 1 .4 1 1 0 1.2.2 2.4.6 3.6.1.4 0 .8-.2 1L6.6 10.8z" fill="currentColor"/>'),
  envelope: () => svg('<rect x="3" y="5" width="18" height="14" rx="2" stroke="currentColor" stroke-width="1.6"/><path d="M4 6.5l8 6 8-6" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"/>'),
  wallet: () => svg('<rect x="2" y="5" width="20" height="15" rx="3" stroke="currentColor" stroke-width="1.6"/><path d="M2 9.5h20" stroke="currentColor" stroke-width="1.6"/><rect x="14.5" y="13.5" width="5.5" height="3" rx="1" fill="currentColor"/>'),
  lock: () => svg('<rect x="4" y="10" width="16" height="11" rx="2.5" stroke="currentColor" stroke-width="1.6"/><path d="M7.5 10V7a4.5 4.5 0 0 1 9 0v3" stroke="currentColor" stroke-width="1.6" stroke-linecap="round"/>'),
  apple: () => svg('<path d="M15.6 3.8c.1 1-.3 2-.9 2.7-.7.8-1.8 1.4-2.8 1.3-.1-1 .4-2 1-2.7.7-.8 1.9-1.4 2.7-1.3zM18.9 17c-.5 1.1-.7 1.6-1.3 2.5-.9 1.4-2.1 3-3.6 3-1.3 0-1.7-.9-3.4-.9-1.8 0-2.2.9-3.4.9-1.5 0-2.6-1.5-3.5-2.9C1 15.8.6 11.1 2.3 8.7c1.2-1.7 3-2.7 4.7-2.7 1.7 0 2.8 1 4.2 1 1.4 0 2.2-1 4.2-1 1.5 0 3.1.8 4.2 2.3-3.7 2-3.1 7.3-.7 8.7z" fill="currentColor"/>'),
  googlePay: () => svg('<circle cx="12" cy="12" r="10" fill="currentColor"/><text x="12" y="16.5" font-family="Manrope, system-ui, sans-serif" font-size="12" font-weight="700" text-anchor="middle" fill="var(--rs-paper)">G</text>', '0 0 24 24'),
  refresh: () => svg('<path d="M4 4v5h5" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/><path d="M4.6 15A8 8 0 1 0 6 6.3L4 9" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>'),
  info: () => svg('<circle cx="12" cy="12" r="9" stroke="currentColor" stroke-width="1.8"/><path d="M12 11v5.5M12 8v.01" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"/>'),
};

function statusBar({ onHero } = {}) {
  return h('div', { class: 'rs-statusbar' + (onHero ? ' rs-statusbar--on-hero' : '') },
    h('span', { text: '9:41' }),
    h('span', { class: 'rs-statusbar-icons' }, Icon.signal(), Icon.wifi(), Icon.battery())
  );
}

/* Shared nav (circle back / title / close) + progress bar, used by every
   multi-step screen (household, review, payment, your-details) so the step
   chrome can't drift between them. */
function stepHeader({ title, step, total }) {
  const backBtn = h('button', { class: 'rs-icon-btn rs-icon-btn--circle-bg', 'aria-label': 'Back' }, Icon.back());
  backBtn.addEventListener('click', () => {
    backBtn.dispatchEvent(new CustomEvent('rs-navigate', { bubbles: true, detail: { to: 'back' } }));
  });
  return h('div', {},
    h('div', { class: 'rs-navbar' },
      backBtn,
      h('span', { class: 'rs-navbar-title', text: title }),
      h('button', { class: 'rs-icon-btn', 'aria-label': 'Close' }, Icon.close())
    ),
    h('div', { class: 'rs-progress-row' },
      h('div', { class: 'rs-progress-track' }, h('div', { class: 'rs-progress-fill', style: `width:${(step / total) * 100}%;` })),
      h('span', { class: 'rs-progress-label', text: `${step} of ${total}` })
    )
  );
}

/* Floating scroll-to-top control for the long step screens in the refs —
   fades in once the screen has scrolled, scrolls the .rs-scroll back to 0. */
function scrollTopControl(scrollEl) {
  const btn = h('button', { class: 'rs-scroll-top', type: 'button', 'aria-label': 'Scroll to top' }, Icon.chevronUp());
  btn.addEventListener('click', () => scrollEl.scrollTo({ top: 0, behavior: 'smooth' }));
  scrollEl.addEventListener('scroll', () => {
    btn.classList.toggle('is-visible', scrollEl.scrollTop > 80);
  }, { passive: true });
  return btn;
}

/* ============================================================================
   1. applications-list
   ============================================================================ */

const PROPERTIES = [
  { address: '789 Birch Blvd, Unit 8', city: 'Austin, TX 73301', status: 'not-started', label: 'Not started' },
  { address: '412 Cypress Trail', city: 'Austin, TX 78745', status: 'in-progress', label: 'In progress' },
  { address: '1908 Marigold Ct, Apt 5', city: 'Round Rock, TX 78664', status: 'submitted', label: 'Submitted' },
];

function propertyCard(p) {
  return h('div', { class: 'rs-property-card' },
    h('div', { class: 'rs-property-info' },
      h('p', { class: 'rs-property-address', text: p.address }),
      h('p', { class: 'rs-property-city', text: p.city }),
      h('span', { class: 'rs-pill' + (p.status === 'submitted' ? ' rs-pill--submitted' : ''), text: p.label })
    ),
    h('button', { class: 'rs-icon-btn rs-icon-btn--dark-fill', 'aria-label': `Open ${p.address}` }, Icon.arrowRight())
  );
}

/* `highlight === 'submitted'` — landing here fresh off the pay → review →
   submit flow. Renders 789 Birch Blvd in its normal (not-started) state
   first, then a beat later animates its pill to Submitted and slides in a
   confirmation toast — so the status change reads as something that just
   happened, not something that was already true when the screen appeared.
   Doesn't mutate the shared PROPERTIES array, since a still-mount elsewhere
   on the page renders the default state. */
function applicationsList(highlight) {
  const justSubmitted = highlight === 'submitted';

  const root = h('div', { class: 'product' },
    statusBar({ onHero: true }),
    h('div', { class: 'rs-scroll' },
      h('div', { class: 'rs-hero-header' },
        h('div', { class: 'rs-nav-row' },
          h('button', { class: 'rs-icon-btn rs-icon-btn--light', 'aria-label': 'Back' }, Icon.back()),
          h('button', { class: 'rs-icon-btn rs-icon-btn--light', 'aria-label': 'More' }, Icon.kebab())
        ),
        h('h1', { class: 'rs-hero-title', text: 'Applications' })
      ),
      h('div', { class: 'rs-list' }, PROPERTIES.map(propertyCard))
    ),
    h('div', { class: 'rs-bottom-bar' },
      h('button', { class: 'rs-btn-primary', text: 'Finish applications' })
    )
  );

  if (justSubmitted) {
    const birchCard = Array.from(root.querySelectorAll('.rs-property-card'))
      .find(card => card.querySelector('.rs-property-address').textContent === '789 Birch Blvd, Unit 8');
    const birchPill = birchCard && birchCard.querySelector('.rs-pill');

    const closeBtn = h('button', { type: 'button', class: 'rs-toast-close', 'aria-label': 'Dismiss' }, Icon.close());
    const toast = h('div', { class: 'rs-toast' },
      h('span', { class: 'rs-toast-icon' }, Icon.info()),
      h('span', { class: 'rs-toast-text', text: 'Application submitted for 789 Birch Blvd, Unit 8.' }),
      closeBtn
    );
    root.appendChild(h('div', { class: 'rs-toast-wrap' }, toast));

    let dismissed = false;
    function dismiss() {
      if (dismissed) return;
      dismissed = true;
      toast.classList.remove('is-visible');
      setTimeout(() => toast.parentElement && toast.parentElement.remove(), 300);
    }
    closeBtn.addEventListener('click', dismiss);

    setTimeout(() => {
      if (!root.isConnected) return;
      if (birchPill) {
        birchPill.textContent = 'Submitted';
        birchPill.classList.add('rs-pill--submitted', 'is-updated');
      }
      requestAnimationFrame(() => toast.classList.add('is-visible'));
    }, 400);
    setTimeout(dismiss, 3400);
  }

  return root;
}

/* ============================================================================
   2. overview — one function, three states: 'fresh' (nothing started),
   'resumed' (This rental already done — the toggle's default), and
   'resumed-about-you-done', reached by completing the About you form and
   hitting Continue there. Only the step badges/Edit buttons and the
   bottom-button label differ between states.
   ============================================================================ */

const OVERVIEW_STEPS = [
  { n: 1, label: 'This rental' },
  { n: 2, label: 'About you' },
  { n: 3, label: 'Credit and background' },
  { n: 4, label: 'Review and pay' },
];

// Which step numbers show a check for a given overview state.
function doneStepsFor(state) {
  if (state === 'resumed-about-you-done') return [1, 2];
  if (state === 'resumed') return [1];
  return [];
}

function stepRow(step, done) {
  return h('div', { class: 'rs-step-row' },
    h('div', { class: 'rs-step-badge' }, done ? Icon.check() : h('span', { text: String(step.n) })),
    h('span', { class: 'rs-step-label', text: step.label }),
    done ? h('button', { class: 'rs-edit-btn', text: 'Edit' }) : null
  );
}

function overview(state) {
  const started = state === 'resumed' || state === 'resumed-about-you-done';
  const doneSteps = new Set(doneStepsFor(state));

  const primaryBtn = h('button', { class: 'rs-btn-primary', text: started ? 'Continue' : 'Start application' });
  primaryBtn.addEventListener('click', () => {
    primaryBtn.dispatchEvent(new CustomEvent('rs-navigate', { bubbles: true, detail: { to: 'yourDetails' } }));
  });

  return h('div', { class: 'product' },
    statusBar(),
    h('div', { class: 'rs-scroll' },
      h('div', { class: 'rs-navbar' },
        h('button', { class: 'rs-icon-btn', 'aria-label': 'Back' }, Icon.back())
      ),
      h('div', { class: 'rs-page-head' },
        h('p', { class: 'rs-eyebrow', text: 'Applying to' }),
        h('h1', { class: 'rs-h1', text: '789 Birch Blvd, Unit 8' }),
        h('p', { class: 'rs-subtitle', text: 'Austin, TX 73301', style: 'margin-bottom:20px;' })
      ),
      h('div', { class: 'rs-card rs-agent-card' },
        h('div', { class: 'rs-avatar', text: 'JB' }),
        h('div', { class: 'rs-agent-meta' },
          h('p', { class: 'rs-agent-label', text: 'Application goes to' }),
          h('p', { class: 'rs-agent-name', text: 'Jordan Blake' }),
          h('p', { class: 'rs-agent-email', text: 'jordan.blake@rentspree.com' })
        )
      ),
      h('div', { class: 'rs-section-head' },
        h('p', { class: 'rs-h2', text: 'Your application' }),
        h('p', { class: 'rs-section-sub', text: 'About 10 minutes. Your progress saves as you go.' })
      ),
      h('div', { class: 'rs-card rs-steps', style: 'margin-top:14px;' },
        OVERVIEW_STEPS.map(step => stepRow(step, doneSteps.has(step.n)))
      )
    ),
    h('div', { class: 'rs-bottom-bar' }, primaryBtn)
  );
}

/* ============================================================================
   3. household — the interactive one. Real progressive disclosure, not a
   toggled state from outside.
   ============================================================================ */

function revealPanel(contentEl) {
  const panel = h('div', { class: 'rs-reveal' }, h('div', { class: 'rs-reveal-inner' }, contentEl));
  function setOpen(open) {
    if (open) {
      panel.classList.add('is-open');
      panel.style.maxHeight = panel.scrollHeight + 'px';
    } else {
      panel.style.maxHeight = panel.scrollHeight + 'px'; // lock current height before collapsing
      requestAnimationFrame(() => {
        panel.classList.remove('is-open');
        panel.style.maxHeight = '0px';
      });
    }
  }
  panel._setOpen = setOpen;
  return panel;
}

/* Stacked Yes/No radio rows — pale --rs-signal-tint fill + solid border on
   the selected row, matching the 08-19 refs. Replaces the old side-by-side
   segmented toggle. */
function radioYesNo(onChange) {
  const yesRow = h('button', { type: 'button', class: 'rs-radio-row' },
    h('span', { text: 'Yes' }), h('span', { class: 'rs-radio-dot' })
  );
  const noRow = h('button', { type: 'button', class: 'rs-radio-row' },
    h('span', { text: 'No' }), h('span', { class: 'rs-radio-dot' })
  );
  function set(v) {
    yesRow.classList.toggle('is-selected', v === true);
    noRow.classList.toggle('is-selected', v === false);
    onChange(v);
  }
  yesRow.addEventListener('click', () => set(true));
  noRow.addEventListener('click', () => set(false));
  return h('div', { class: 'rs-radio-list' }, yesRow, noRow);
}

function inputRow(labelText, placeholder, minor) {
  return h('div', { class: 'rs-input-row' + (minor ? ' rs-input-row--minor' : '') },
    h('label', { text: labelText }),
    h('input', { type: 'text', placeholder: placeholder || '', autocomplete: 'off' })
  );
}

/* "You click into the empty states, and it autofills in fake information.
   That's as far as that design needs to go." — tapping into any one empty
   field in the group fills every empty field in the group at once, so the
   visitor doesn't have to tap through each field individually to watch the
   section go from untouched to complete. No validation, no storage, just
   plausible values dropped in on first focus. */
function autofillGroupOnFocus(fields) {
  let filled = false;
  fields.forEach(([input]) => {
    input.addEventListener('focus', () => {
      if (filled) return;
      filled = true;
      fields.forEach(([el, fakeValue]) => { if (!el.disabled && !el.value) el.value = fakeValue; });
    }, { once: true });
  });
}

/* Subordinate optional count field — kept visually secondary (small type,
   muted) since it sits alongside the household question rather than as its
   own top-level category. See the household() comment for why. */
function numberStepper(labelText, helperText) {
  let value = 0;
  const countEl = h('span', { class: 'rs-stepper-count', text: '0' });
  const minusBtn = h('button', { type: 'button', class: 'rs-stepper-btn', 'aria-label': `Decrease ${labelText}` }, Icon.minus());
  const plusBtn = h('button', { type: 'button', class: 'rs-stepper-btn', 'aria-label': `Increase ${labelText}` }, Icon.plus());
  function render() {
    countEl.textContent = String(value);
    minusBtn.disabled = value <= 0;
  }
  minusBtn.addEventListener('click', () => { if (value > 0) { value -= 1; render(); } });
  plusBtn.addEventListener('click', () => { value += 1; render(); });
  render();
  return h('div', { class: 'rs-stepper-row' },
    h('div', { class: 'rs-stepper-copy' },
      h('p', { class: 'rs-field-label rs-field-label--minor', text: labelText }),
      helperText ? h('p', { class: 'rs-field-helper', style: 'margin:2px 0 0;', text: helperText }) : null
    ),
    h('div', { class: 'rs-stepper' }, minusBtn, countEl, plusBtn)
  );
}

/* One tan (--rs-fog) entry panel — "Pet 1", "First additional tenant" —
   with its own remove control. onRemove is optional (the tenant panel isn't
   removable since there's nothing above it to fall back to). */
function expandEntryPanel(label, fieldsEl, onRemove) {
  const panel = h('div', { class: 'rs-expand-panel' },
    h('div', { class: 'rs-expand-panel-header' },
      h('span', { text: label }),
      onRemove ? h('button', { class: 'rs-expand-panel-close', type: 'button', 'aria-label': `Remove ${label}` }, Icon.close()) : null
    ),
    fieldsEl
  );
  if (onRemove) panel.querySelector('.rs-expand-panel-close').addEventListener('click', onRemove);
  return panel;
}

function household() {
  const scrollEl = h('div', { class: 'rs-scroll' });

  /* ── Pets — repeatable ─────────────────────────────────────────────── */
  const petsList = h('div', {});
  let petCount = 0;
  function addPet() {
    petCount += 1;
    const n = petCount;
    const fields = h('div', { class: 'rs-expand-panel-fields' }, inputRow('Type / breed', 'e.g. Labrador retriever'), inputRow('Weight (lbs)', 'Optional'));
    const panel = expandEntryPanel(`Pet ${n}`, fields, () => { panel.remove(); });
    petsList.appendChild(panel);
  }
  addPet();
  const addPetBtn = h('button', { class: 'rs-add-row', type: 'button' }, Icon.plus(), h('span', { text: 'Add additional pet' }));
  addPetBtn.addEventListener('click', addPet);

  const petsReveal = revealPanel(h('div', {}, petsList, addPetBtn));
  const petsRadio = radioYesNo(v => petsReveal._setOpen(v === true));

  /* ── Additional tenants — repeatable ─────────────────────────────────── */
  const tenantsList = h('div', {});
  let tenantCount = 0;
  function addTenant() {
    tenantCount += 1;
    const n = tenantCount;
    const fields = h('div', { class: 'rs-expand-panel-fields' },
      inputRow('First name', ''),
      inputRow('Last name', ''),
      inputRow('Email or phone', ''),
      h('p', { class: 'rs-expand-panel-helper', text: "We'll send them their own application link on submit." })
    );
    const label = n === 1 ? 'First additional tenant' : `Additional tenant ${n}`;
    const panel = expandEntryPanel(label, fields, n === 1 ? null : () => { panel.remove(); });
    tenantsList.appendChild(panel);
  }
  addTenant();
  const addTenantBtn = h('button', { class: 'rs-add-row', type: 'button' }, Icon.plus(), h('span', { text: 'Add additional tenant' }));
  addTenantBtn.addEventListener('click', addTenant);

  const tenantsReveal = revealPanel(h('div', {}, tenantsList, addTenantBtn));
  const tenantsRadio = radioYesNo(v => tenantsReveal._setOpen(v === true));

  /* Children under 18 — deliberately not its own category alongside Pets
     and Additional tenants. Kept as a subordinate, optional count inside
     the household question so it can't read as a familial-status filter. */
  const childrenStepper = numberStepper('Children under 18', 'Optional — helps us plan for household size.');

  scrollEl.append(
    stepHeader({ title: '789 Birch Blvd, Unit 8', step: 1, total: 4 }),
    h('div', { class: 'rs-page-head' },
      h('h1', { class: 'rs-h1', text: 'Who will live here' })
    ),
    h('p', { class: 'rs-field-section-title', text: 'Pets' }),
    h('div', { class: 'rs-field-group' },
      h('p', { class: 'rs-field-label', text: 'Do you have pets?' }),
      petsRadio,
      petsReveal
    ),
    h('hr', { class: 'rs-field-divider' }),
    h('p', { class: 'rs-field-section-title', text: 'Additional tenants' }),
    h('div', { class: 'rs-field-group' },
      h('p', { class: 'rs-field-helper', text: "List anyone 18 or over who will live here.", style: 'margin-top:-8px;' }),
      h('p', { class: 'rs-field-label', text: 'Will anyone else live here with you?', style: 'margin-top:14px;' }),
      tenantsRadio,
      tenantsReveal,
      childrenStepper
    )
  );

  return h('div', { class: 'product' },
    statusBar(),
    scrollEl,
    h('div', { class: 'rs-bottom-bar' },
      h('button', { class: 'rs-btn-primary', text: 'Continue' })
    ),
    scrollTopControl(scrollEl)
  );
}

/* ============================================================================
   4. review
   ============================================================================ */

function reviewRow(label, value) {
  return h('div', { class: 'rs-row' },
    h('span', { class: 'rs-row-label', text: label }),
    h('span', { class: 'rs-row-value', text: value })
  );
}

/* Multi-line value, right-aligned — landlord contact info, employer + title. */
function reviewRowStack(label, lines) {
  return h('div', { class: 'rs-row' },
    h('span', { class: 'rs-row-label', text: label }),
    h('div', { class: 'rs-row-value rs-row-value--stack' }, lines.map(line => h('span', { text: line })))
  );
}

/* Bare sub-heading inside a card's row list — "Pet 1", "Rental details" —
   no value, just a stronger label. Falls into the same auto-divider rhythm
   as every other .rs-row since it's still a first-class row. */
function reviewSubhead(text) {
  return h('div', { class: 'rs-row' }, h('span', { class: 'rs-row-label rs-row-label--strong', text }));
}

/* "Who else lives here" style row — bold label + underlined Edit link,
   rather than a value. */
function reviewLinkRow(label) {
  return h('div', { class: 'rs-row rs-row--link' },
    h('span', { class: 'rs-row-label rs-row-label--strong', text: label }),
    h('button', { class: 'rs-edit-link', text: 'Edit' })
  );
}

function review() {
  const scrollEl = h('div', { class: 'rs-scroll' },
      stepHeader({ title: '789 Birch Blvd, Unit 8', step: 1, total: 2 }),
      h('div', { class: 'rs-page-head' },
        h('h1', { class: 'rs-h1', text: 'Review your application' }),
        h('p', { class: 'rs-subtitle', text: 'Check everything before it goes to Jordan. You can still edit.' })
      ),
      h('div', { class: 'rs-card' },
        h('div', { class: 'rs-card-header' },
          h('p', { class: 'rs-card-title', text: 'Basic info' }),
          h('button', { class: 'rs-edit-btn', text: 'Edit' })
        ),
        reviewRow('Full legal name', 'Taylor Reese Morgan'),
        reviewRow('Date of birth', 'Apr 18, 1992'),
        reviewRow('Phone', '(512) 555-0134'),
        reviewRow('Email', 'taylor.morgan@example.com')
      ),
      h('div', { class: 'rs-card' },
        h('div', { class: 'rs-card-header' },
          h('p', { class: 'rs-card-title', text: 'This rental' }),
          h('button', { class: 'rs-edit-btn', text: 'Edit' })
        ),
        reviewRow('Your role in this application', 'Tenant'),
        reviewRow('Desired move-in date', 'Sep 1, 2026'),
        reviewRow('Monthly rent', '$2,400'),
        reviewRow('Represented by a renter’s agent', 'No'),
        reviewRow('Applying with a guarantor or co-signer', 'No'),
        reviewLinkRow('Who else lives here'),
        reviewRow('Pets', 'Yes'),
        reviewSubhead('Pet 1'),
        reviewRow('Type / breed', 'Labrador retriever'),
        reviewRow('Weight', '65 lbs'),
        reviewRow('Anyone else living here', 'Yes'),
        reviewSubhead('First additional tenant'),
        reviewRow('Name', 'Sam Reyes'),
        reviewRow('Email or phone', 'sam.reyes@example.com')
      ),
      h('div', { class: 'rs-card' },
        h('div', { class: 'rs-card-header' },
          h('p', { class: 'rs-card-title', text: 'Home history' }),
          h('button', { class: 'rs-edit-btn', text: 'Edit' })
        ),
        reviewRow('Current home', '1240 Cedar St, Austin, TX 78702'),
        reviewRow('Own or rent this place', 'Rent'),
        reviewSubhead('Rental details'),
        reviewRow('Monthly rent', '$1,500'),
        reviewRowStack('Landlord contact info', ['Chuck Midas', 'chuck@example.com', '(315) 560-5656']),
        reviewRow('Move-in date', 'Nov 2023')
      ),
      h('div', { class: 'rs-card' },
        h('div', { class: 'rs-card-header' },
          h('p', { class: 'rs-card-title', text: 'Work history' }),
          h('button', { class: 'rs-edit-btn', text: 'Edit' })
        ),
        reviewRow('Current work status', 'Employed'),
        reviewSubhead('Work details'),
        reviewRowStack('Employment info', ['Northwind Design Co.', 'Floor manager'])
      )
  );

  return h('div', { class: 'product' },
    statusBar(),
    scrollEl,
    h('div', { class: 'rs-bottom-bar' },
      h('button', { class: 'rs-btn-primary', text: 'Continue' })
    ),
    scrollTopControl(scrollEl)
  );
}

/* ============================================================================
   5. payment — working total, working checkbox, focusable fields. Pay
   navigates into the loader → review-report → submit flow (below).
   ============================================================================ */

const PAYMENT_LINE_ITEMS = [
  { key: 'app-fee', label: 'Application fee', amount: 49.99, always: true },
  { key: 'screening', label: 'Reusable Screening Package', amount: 15.00, always: false },
];

function money(n) { return `$${n.toFixed(2)}`; }

/* Bottom sheet — slides up from the .product frame's own bottom edge (not
   the browser viewport), matching the portfolio's slide-in motion tokens.
   Reused by payment() for the wallet picker; generic enough for any
   pick-one-of-a-few-options prompt. */
function bottomSheet(title, items, onSelect) {
  const optionButtons = items.map(item => {
    const btn = h('button', { type: 'button', class: 'rs-sheet-option' },
      h('span', { class: 'rs-sheet-option-icon' }, item.icon()),
      h('span', { class: 'rs-sheet-option-label', text: item.label })
    );
    btn.addEventListener('click', () => { onSelect(item); close(); });
    return btn;
  });
  const cancelBtn = h('button', { type: 'button', class: 'rs-sheet-cancel', text: 'Cancel' });
  const sheet = h('div', { class: 'rs-sheet', role: 'dialog', 'aria-modal': 'true', 'aria-label': title },
    h('div', { class: 'rs-sheet-handle' }),
    h('p', { class: 'rs-sheet-title', text: title }),
    h('div', { class: 'rs-sheet-options' }, optionButtons),
    cancelBtn
  );
  const backdrop = h('div', { class: 'rs-sheet-backdrop' });
  const root = h('div', { class: 'rs-sheet-root' }, backdrop, sheet);

  function open() { root.classList.add('is-open'); }
  function close() { root.classList.remove('is-open'); }
  backdrop.addEventListener('click', close);
  cancelBtn.addEventListener('click', close);

  root.open = open;
  root.close = close;
  return root;
}

function payment() {
  let screeningIncluded = true;

  const totalValueEl = h('span', { class: 'rs-total-value' });
  const chevronWrap = h('span', { class: 'rs-total-chevron' }, Icon.chevronDown());
  const breakdownInner = h('div', { class: 'rs-total-breakdown-inner' });
  const breakdown = h('div', { class: 'rs-total-breakdown' }, breakdownInner);

  function currentTotal() {
    return PAYMENT_LINE_ITEMS.reduce((sum, item) => sum + (item.always || screeningIncluded ? item.amount : 0), 0);
  }

  function renderBreakdown() {
    breakdownInner.innerHTML = '';
    PAYMENT_LINE_ITEMS.forEach(item => {
      if (!item.always && !screeningIncluded) return;
      breakdownInner.appendChild(h('div', { class: 'rs-line-item' },
        h('span', { text: item.label }),
        h('span', { text: money(item.amount) })
      ));
    });
  }

  function renderTotal() {
    totalValueEl.textContent = money(currentTotal());
    renderBreakdown();
    if (breakdown.classList.contains('is-open')) {
      breakdown.style.maxHeight = breakdown.scrollHeight + 'px';
    }
  }

  const totalRow = h('button', { class: 'rs-total-row', type: 'button' },
    h('span', { class: 'rs-total-label', text: 'Total' }),
    h('span', { class: 'rs-total-amounts' }, totalValueEl, chevronWrap)
  );
  totalRow.addEventListener('click', () => {
    const open = !breakdown.classList.contains('is-open');
    chevronWrap.firstElementChild.classList.toggle('is-open', open);
    if (open) {
      breakdown.classList.add('is-open');
      breakdown.style.maxHeight = breakdown.scrollHeight + 'px';
    } else {
      breakdown.style.maxHeight = breakdown.scrollHeight + 'px';
      requestAnimationFrame(() => {
        breakdown.classList.remove('is-open');
        breakdown.style.maxHeight = '0px';
      });
    }
  });

  const checkboxMark = h('div', { class: 'rs-checkbox is-checked' }, Icon.check());
  const screeningRow = h('div', { class: 'rs-checkbox-row', role: 'checkbox', 'aria-checked': 'true', tabindex: '0' },
    checkboxMark,
    h('div', { class: 'rs-checkbox-copy' },
      h('p', { class: 'rs-checkbox-title', text: 'Reusable Screening Package ($15)' }),
      h('p', { class: 'rs-checkbox-desc', text: "Apply to as many properties as you like for 30 days. Add-ons are priced separately, so adding or removing one won’t change anything else in your cart." })
    )
  );
  function toggleScreening() {
    screeningIncluded = !screeningIncluded;
    checkboxMark.classList.toggle('is-checked', screeningIncluded);
    screeningRow.setAttribute('aria-checked', String(screeningIncluded));
    renderTotal();
  }
  screeningRow.addEventListener('click', toggleScreening);
  screeningRow.addEventListener('keydown', e => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); toggleScreening(); } });

  const saveCardMark = h('div', { class: 'rs-checkbox' }, Icon.check());
  const saveCardRow = h('div', { class: 'rs-checkbox-row', role: 'checkbox', 'aria-checked': 'false', tabindex: '0' },
    saveCardMark,
    h('div', { class: 'rs-checkbox-copy' }, h('p', { class: 'rs-checkbox-title', text: 'Save this card for future payments' }))
  );
  function toggleSaveCard() {
    const checked = saveCardMark.classList.toggle('is-checked');
    saveCardRow.setAttribute('aria-checked', String(checked));
  }
  saveCardRow.addEventListener('click', toggleSaveCard);
  saveCardRow.addEventListener('keydown', e => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); toggleSaveCard(); } });

  /* "Add payment method" — opens a sheet to pick Apple Pay or Google Pay
     instead of the card fields above. Picking one just marks the row
     selected; there's no real wallet integration to hand off to. */
  const walletOptionDesc = h('p', { class: 'rs-payment-option-desc', text: 'Bank account, Apple Pay, Google Pay' });
  const walletRadioDot = h('span', { class: 'rs-radio-dot' });
  const walletOptionRow = h('button', { type: 'button', class: 'rs-payment-option-row' },
    h('span', { class: 'rs-payment-option-icon' }, Icon.wallet()),
    h('span', { class: 'rs-payment-option-copy' },
      h('p', { class: 'rs-payment-option-title', text: 'Add payment method' }),
      walletOptionDesc
    ),
    walletRadioDot
  );
  const walletSheet = bottomSheet('Choose a payment method', [
    { label: 'Apple Pay', icon: Icon.apple },
    { label: 'Google Pay', icon: Icon.googlePay },
  ], item => {
    walletRadioDot.classList.add('is-selected');
    walletOptionDesc.textContent = item.label;
  });
  walletOptionRow.addEventListener('click', () => walletSheet.open());

  renderTotal();

  const payBtn = h('button', { class: 'rs-btn-primary', text: 'Pay' });
  payBtn.addEventListener('click', () => {
    payBtn.dispatchEvent(new CustomEvent('rs-navigate', { bubbles: true, detail: { to: 'loader' } }));
  });

  const cardNumberInput = h('input', { type: 'text', inputmode: 'numeric', placeholder: 'Card number', autocomplete: 'off' });
  const expirationInput = h('input', { type: 'text', placeholder: 'Expiration (MM/YY)', autocomplete: 'off' });
  const cvcInput = h('input', { type: 'text', inputmode: 'numeric', placeholder: 'CVC', autocomplete: 'off' });
  autofillGroupOnFocus([
    [cardNumberInput, '4242 4242 4242 4242'],
    [expirationInput, '12/29'],
    [cvcInput, '123'],
  ]);

  const scrollEl = h('div', { class: 'rs-scroll' },
    stepHeader({ title: '789 Birch Blvd, Unit 8', step: 2, total: 2 }),
    h('div', { class: 'rs-page-head' },
      h('h1', { class: 'rs-h1', text: 'Confirm and pay' }),
      h('p', { class: 'rs-subtitle', text: 'Your reports start running once you pay.' })
    ),
    h('div', { class: 'rs-card' }, totalRow, breakdown),
    h('div', { class: 'rs-card' }, screeningRow),
    h('p', { class: 'rs-field-block-label', text: 'Payment method' }),
    h('div', { class: 'rs-payment-fields' },
      cardNumberInput,
      h('div', { class: 'rs-field-row' }, expirationInput, cvcInput)
    ),
    h('div', { class: 'rs-save-card-row' }, saveCardRow),
    h('div', { class: 'rs-payment-options' },
      walletOptionRow,
      h('p', { class: 'rs-payment-security' }, Icon.lock(), h('span', { text: 'Your card is encrypted by Stripe.' }))
    )
  );

  return h('div', { class: 'product' },
    statusBar(),
    scrollEl,
    h('div', { class: 'rs-bottom-bar' }, payBtn),
    scrollTopControl(scrollEl),
    walletSheet
  );
}

/* ============================================================================
   5a. loader — "Preparing your reports" post-Pay screen. Checklist rows
   build in one at a time on a timer, each holding long enough to read
   before it flips to done, then auto-navigates into reviewReport. No
   header/back — this step isn't interactive or interruptible, matching the
   refs. Deliberately never says "submitted" or "sent" — reports are being
   prepared, not shared with the agent yet. That only happens after the
   applicant reviews them and hits Submit application in reviewReport().
   ============================================================================ */

const LOADER_STEPS = [
  'Running credit report',
  'Running background check',
  'Checking eviction history',
  'Ready for review',
];

function loader() {
  const items = LOADER_STEPS.map((label, i) => {
    const iconWrap = h('span', { class: 'rs-checklist-icon rs-checklist-icon--pending rs-checklist-icon--spin' }, Icon.refresh());
    const sub = i === LOADER_STEPS.length - 1 ? h('p', { class: 'rs-checklist-sub', text: 'In progress' }) : null;
    const row = h('div', { class: 'rs-checklist-item' },
      iconWrap,
      h('div', { class: 'rs-checklist-copy' }, h('p', { class: 'rs-checklist-label', text: label }), sub)
    );
    return { row, iconWrap, sub };
  });

  const root = h('div', { class: 'product' },
    statusBar(),
    h('div', { class: 'rs-scroll' },
      h('div', { class: 'rs-page-head', style: 'padding-top:28px;' },
        h('h1', { class: 'rs-h1', text: 'Preparing your reports' }),
        h('p', { class: 'rs-subtitle', text: "Your application hasn't been sent to the agent yet." })
      ),
      h('div', { class: 'rs-checklist' }, items.map(item => item.row))
    )
  );

  function markDone(item) {
    item.iconWrap.className = 'rs-checklist-icon rs-checklist-icon--done';
    item.iconWrap.innerHTML = '';
    item.iconWrap.appendChild(Icon.check());
    if (item.sub) item.sub.remove();
  }

  // Recursive setTimeout rather than setInterval — each step's hold time can
  // vary (the last one lingers a beat longer) and it self-cancels cleanly:
  // every callback checks root.isConnected first, so if the phone is reset
  // or swapped to another screen mid-sequence, the chain just stops.
  function advance(i) {
    if (!root.isConnected) return;
    if (i >= items.length) {
      setTimeout(() => {
        if (!root.isConnected) return;
        root.dispatchEvent(new CustomEvent('rs-navigate', { bubbles: true, detail: { to: 'reviewReport' } }));
      }, 500);
      return;
    }
    requestAnimationFrame(() => items[i].row.classList.add('is-visible'));
    const holdMs = i === items.length - 1 ? 900 : 750;
    setTimeout(() => {
      if (!root.isConnected) return;
      markDone(items[i]);
      setTimeout(() => advance(i + 1), 260);
    }, holdMs);
  }
  setTimeout(() => advance(0), 300);

  return root;
}

/* ============================================================================
   5b. reviewReport — "Review your reports" credit/background check summary.
   Reuses .rs-card/.rs-row from review(). The reviewed checkbox is optional
   per the refs (not required to submit). Submit navigates to
   applicationsList with value 'submitted' to show the Submitted status +
   toast back on the applications list.
   ============================================================================ */

function reviewReport() {
  const reviewedMark = h('div', { class: 'rs-checkbox' }, Icon.check());
  const reviewedRow = h('div', { class: 'rs-checkbox-row', role: 'checkbox', 'aria-checked': 'false', tabindex: '0' },
    reviewedMark,
    h('div', { class: 'rs-checkbox-copy' }, h('p', { class: 'rs-checkbox-title', text: "I've reviewed my reports" }))
  );
  function toggleReviewed() {
    const checked = reviewedMark.classList.toggle('is-checked');
    reviewedRow.setAttribute('aria-checked', String(checked));
  }
  reviewedRow.addEventListener('click', toggleReviewed);
  reviewedRow.addEventListener('keydown', e => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); toggleReviewed(); } });

  const backBtn = h('button', { class: 'rs-icon-btn', 'aria-label': 'Back' }, Icon.back());
  backBtn.addEventListener('click', () => {
    backBtn.dispatchEvent(new CustomEvent('rs-navigate', { bubbles: true, detail: { to: 'back' } }));
  });
  const closeBtn = h('button', { class: 'rs-icon-btn', 'aria-label': 'Close' }, Icon.close());
  closeBtn.addEventListener('click', () => {
    closeBtn.dispatchEvent(new CustomEvent('rs-navigate', { bubbles: true, detail: { to: 'back' } }));
  });

  function readyPill() { return h('span', { class: 'rs-pill rs-pill--submitted', text: 'Ready' }); }
  function cardHeader(title) {
    return h('div', { class: 'rs-card-header' }, h('p', { class: 'rs-card-title', text: title }), readyPill());
  }

  const scrollEl = h('div', { class: 'rs-scroll' },
    h('div', { class: 'rs-navbar' }, backBtn, h('span', { class: 'rs-navbar-title', text: '789 Birch Blvd, Unit 8' }), closeBtn),
    h('div', { class: 'rs-page-head' },
      h('h1', { class: 'rs-h1', text: 'Review your reports' }),
      h('p', { class: 'rs-subtitle', text: 'Check these over, then send them to Jordan to finish.' })
    ),
    h('div', { class: 'rs-card' },
      cardHeader('Credit report'),
      h('div', { class: 'rs-row' }, h('span', { class: 'rs-row-label', text: 'TransUnion score' }), h('span', { class: 'rs-row-value rs-row-value--score', text: '742' })),
      reviewRow('Tradelines', '5 active, 2 closed'),
      reviewRow('Credit inquiries', '2'),
      reviewRow('Collections', '0 open, 0 closed'),
      reviewRow('Public records', '0'),
      h('div', { class: 'rs-note-box' }, h('p', { text: 'No late payments across 7 accounts. Low utilization and a long, clean history.' })),
      h('button', { type: 'button', class: 'rs-outline-btn', text: 'View full report' })
    ),
    h('div', { class: 'rs-card' },
      cardHeader('Reference check'),
      h('p', { class: 'rs-card-desc', text: 'Requests sent to the 2 references you gave us.' }),
      h('button', { type: 'button', class: 'rs-outline-btn', text: 'View references' })
    ),
    h('div', { class: 'rs-card' },
      cardHeader('Background check'),
      h('p', { class: 'rs-card-desc', text: '1 record found. National, county, and sex-offender registries across 50 states.' }),
      h('button', { type: 'button', class: 'rs-outline-btn', text: 'View report' })
    ),
    h('div', { class: 'rs-card' },
      cardHeader('Eviction record'),
      h('p', { class: 'rs-card-desc', text: '1 record found. Filings in the nationwide eviction database.' }),
      h('button', { type: 'button', class: 'rs-outline-btn', text: 'View report' })
    ),
    h('div', { class: 'rs-reviewed-row' }, reviewedRow)
  );

  const submitBtn = h('button', { class: 'rs-btn-primary', text: 'Submit application' });
  submitBtn.addEventListener('click', () => {
    submitBtn.dispatchEvent(new CustomEvent('rs-navigate', { bubbles: true, detail: { to: 'applicationsList', value: 'submitted' } }));
  });

  return h('div', { class: 'product' },
    statusBar(),
    scrollEl,
    h('div', { class: 'rs-bottom-bar' }, submitBtn),
    scrollTopControl(scrollEl)
  );
}

/* ============================================================================
   6. your-details — step 1 of "About you". Every field autofills a plausible
   value on first focus (same trick as payment()'s card fields) — the point
   isn't a working form, it's a fast way to show a section going from
   untouched to complete. Continue pops back to overview() with
   'resumed-about-you-done' so the About you step picks up its check.
   ============================================================================ */

function fieldWithIcon(inputEl, iconFn) {
  return h('div', { class: 'rs-field-icon-wrap' }, inputEl, h('span', { class: 'rs-field-icon' }, iconFn()));
}

function yourDetails() {
  const firstNameInput = h('input', { type: 'text', placeholder: 'First name', autocomplete: 'off' });
  const lastNameInput = h('input', { type: 'text', placeholder: 'Last name', autocomplete: 'off' });
  const dobInput = h('input', { type: 'text', placeholder: 'Date of birth', autocomplete: 'off' });
  const phoneInput = h('input', { type: 'tel', placeholder: 'Phone number', autocomplete: 'off' });
  const emailInput = h('input', { type: 'email', placeholder: 'Email', autocomplete: 'off' });

  const noMiddleMark = h('div', { class: 'rs-checkbox' }, Icon.check());
  const middleNameInput = h('input', { type: 'text', placeholder: 'Middle name', autocomplete: 'off' });

  autofillGroupOnFocus([
    [firstNameInput, 'Taylor'],
    [lastNameInput, 'Morgan'],
    [dobInput, 'Apr 18, 1992'],
    [phoneInput, '(512) 555-0134'],
    [emailInput, 'taylor.morgan@example.com'],
    [middleNameInput, 'Reese'],
  ]);
  const noMiddleRow = h('div', { class: 'rs-checkbox-row', role: 'checkbox', 'aria-checked': 'false', tabindex: '0' },
    noMiddleMark,
    h('div', { class: 'rs-checkbox-copy' }, h('p', { class: 'rs-checkbox-title', text: 'I have no middle name' }))
  );
  function toggleNoMiddle() {
    const checked = noMiddleMark.classList.toggle('is-checked');
    noMiddleRow.setAttribute('aria-checked', String(checked));
    middleNameInput.disabled = checked;
    middleNameInput.value = checked ? '' : middleNameInput.value;
    middleNameInput.placeholder = checked ? "You've said you have no middle name" : 'Middle name';
  }
  noMiddleRow.addEventListener('click', toggleNoMiddle);
  noMiddleRow.addEventListener('keydown', e => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); toggleNoMiddle(); } });

  const scrollEl = h('div', { class: 'rs-scroll' },
    stepHeader({ title: '789 Birch Blvd, Unit 8', step: 1, total: 4 }),
    h('div', { class: 'rs-page-head' },
      h('h1', { class: 'rs-h1', text: 'Your details' }),
      h('p', { class: 'rs-subtitle', text: 'Use your legal name so we can match it to your ID.' })
    ),
    h('div', { class: 'rs-form-fields' },
      firstNameInput,
      middleNameInput,
      h('div', { class: 'rs-form-checkbox-row' }, noMiddleRow),
      lastNameInput,
      fieldWithIcon(dobInput, Icon.calendar),
      fieldWithIcon(phoneInput, Icon.phone),
      fieldWithIcon(emailInput, Icon.envelope)
    )
  );

  const continueBtn = h('button', { class: 'rs-btn-primary', text: 'Continue' });
  continueBtn.addEventListener('click', () => {
    continueBtn.dispatchEvent(new CustomEvent('rs-navigate', { bubbles: true, detail: { to: 'back', value: 'resumed-about-you-done' } }));
  });

  return h('div', { class: 'product' },
    statusBar(),
    scrollEl,
    h('div', { class: 'rs-bottom-bar' }, continueBtn),
    scrollTopControl(scrollEl)
  );
}

/* ── Exposed as plain globals, matching the rest of the codebase ────────── */
window.RSScreens = { applicationsList, overview, household, review, payment, loader, reviewReport, yourDetails };
