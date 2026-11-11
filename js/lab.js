/* ============================================================================
   APPLICANTS — the lab. Layouts for one section at a time, switched from a
   pill in the corner, so they can be compared on the real page before one
   wins. v2's lab (v2-site/app/src/lab.ts, LabPanel.tsx) is the model: the
   same pill and panel, the choice carried in the query string only
   (?close=row), so a link is shareable and a plain link gets the default.
   Each list leads with its default, which is the live layout until a take
   is picked.

   History: the first round (2026-11-10) compared the intro (Current, Brief,
   Stacked) and the arcs (Current, Split, Side, Stage), modelled on the
   Opendoor case study on v2. Micah picked Brief and Side; both are now the
   page's only layouts, in styles.css, and left the lab.

   Now: the close, the three blocks beside the hand-holding-a-phone photo
   (evaluation, the prototype, applicant to tenant). Micah suggested the
   three side by side with the photo on top; the other takes vary that.

   How it works: the close has one set of markup. This only sets
   <html data-close>, which css/lab.css reads to lay it out (the inline
   script in index.html sets it before first paint too). Nothing is moved,
   so the blocks' staggered build-in keeps working in every take.

   Once a take wins, fold its CSS into styles.css and delete the others,
   css/lab.css and this file.
   ============================================================================ */

const LAB = {
  close: [
    { id: 'current', label: 'Current' },
    { id: 'row',     label: 'Row' },
    { id: 'overlap', label: 'Overlap' },
    { id: 'cards',   label: 'Cards' },
  ],
};

const LAB_TITLES = { close: 'Close' };

function readLab() {
  const params = new URLSearchParams(window.location.search);
  const state = {};
  Object.keys(LAB).forEach(key => {
    const value = params.get(key);
    state[key] = LAB[key].some(o => o.id === value) ? value : LAB[key][0].id;
  });
  return state;
}

function writeLab(state) {
  const params = new URLSearchParams(window.location.search);
  // Links from the first round may still carry these; both left the lab.
  params.delete('intro');
  params.delete('arcs');
  Object.keys(state).forEach(key => params.set(key, state[key]));
  window.history.replaceState(null, '', `${window.location.pathname}?${params}${window.location.hash}`);
}

function applyLab(state) {
  Object.keys(state).forEach(key => { document.documentElement.dataset[key] = state[key]; });
}

/* The pill and panel, built the way v2's LabPanel renders: collapsed to one
   pill so it stays out of screenshots, open to one segmented row per
   section. */
function buildLabPanel(state) {
  const root = document.createElement('div');
  root.className = 'lab';

  const panel = document.createElement('div');
  panel.className = 'lab__panel';
  panel.setAttribute('role', 'group');
  panel.setAttribute('aria-label', 'Layout variants');
  panel.hidden = true;

  Object.keys(LAB).forEach(key => {
    const row = document.createElement('div');
    row.className = 'lab__row';
    const title = document.createElement('span');
    title.className = 'lab__title';
    title.textContent = LAB_TITLES[key];
    const seg = document.createElement('div');
    seg.className = 'lab__seg';
    seg.setAttribute('role', 'radiogroup');
    seg.setAttribute('aria-label', LAB_TITLES[key]);

    const buttons = LAB[key].map(option => {
      const btn = document.createElement('button');
      btn.type = 'button';
      btn.setAttribute('role', 'radio');
      btn.textContent = option.label;
      btn.dataset.value = option.id;
      btn.addEventListener('click', () => {
        state[key] = option.id;
        sync();
        applyLab(state);
        writeLab(state);
      });
      seg.appendChild(btn);
      return btn;
    });
    function sync() {
      buttons.forEach(b => {
        const on = b.dataset.value === state[key];
        b.classList.toggle('is-on', on);
        b.setAttribute('aria-checked', String(on));
      });
    }
    sync();

    row.append(title, seg);
    panel.appendChild(row);
  });

  const toggle = document.createElement('button');
  toggle.type = 'button';
  toggle.className = 'lab__toggle';
  toggle.setAttribute('aria-expanded', 'false');
  toggle.textContent = 'Lab';
  toggle.addEventListener('click', () => {
    const open = panel.hidden;
    panel.hidden = !open;
    root.classList.toggle('is-open', open);
    toggle.setAttribute('aria-expanded', String(open));
    toggle.textContent = open ? 'Close' : 'Lab';
  });

  root.append(panel, toggle);
  document.body.appendChild(root);
}

function initLab() {
  const state = readLab();
  applyLab(state);
  writeLab(state);
  buildLabPanel(state);
}

document.addEventListener('DOMContentLoaded', initLab);
