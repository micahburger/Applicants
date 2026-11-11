/* ============================================================================
   APPLICANTS — the lab. Different layouts for the intro and the three arcs,
   switched from a pill in the corner, so they can be compared on the real
   page before one wins. v2's lab (v2-site/app/src/lab.ts, LabPanel.tsx) is
   the model: the same pill and panel, the choice carried in the query string
   only (?intro=brief&arcs=split), so a link is shareable and a plain link
   gets the defaults. Each list leads with its default, which is Current, the
   live layout, until a take is picked.

   Why these takes (Micah, 2026-11-10): the intro (a headline over two
   paragraphs beside the collage) and the arcs (title, paragraphs, then a
   phone beside long numbered notes) felt cluttered. The new takes borrow
   Opendoor's case study on v2 (/project/opendoor) so the two read as one
   system: an opening paragraph with the brief as labelled facts, and arcs
   cut to a title, a short lede, the phone and a few titled notes.

   How it works: every take of a section is in the markup at once. The
   current layout is wrapped in .take--old, the new one in .take--new, and
   css/lab.css shows one or the other from <html data-intro|data-arcs>
   (set before first paint by the inline script in index.html). The live
   phones and the thesis collage are built once and moved, not copied, into
   whichever take is showing: copies would double the phones' listeners and
   lose their state. Each one is tagged data-media="<name>" and each place
   for it in a new take data-holds="<name>"; a hidden marker left where it
   was built is where it goes back to for Current.

   Once a take wins, fold its markup and CSS into the page and delete the
   others, css/lab.css and this file.
   ============================================================================ */

const LAB = {
  intro: [
    { id: 'current', label: 'Current' },
    { id: 'brief',   label: 'Brief' },
    { id: 'stacked', label: 'Stacked' },
  ],
  arcs: [
    { id: 'current', label: 'Current' },
    { id: 'split',   label: 'Split' },
    { id: 'side',    label: 'Side' },
    { id: 'stage',   label: 'Stage' },
  ],
};

const LAB_TITLES = { intro: 'Intro', arcs: 'Arcs' };

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
  Object.keys(state).forEach(key => params.set(key, state[key]));
  window.history.replaceState(null, '', `${window.location.pathname}?${params}${window.location.hash}`);
}

/* name -> { el, home } for every movable piece of media. */
const labMedia = new Map();

function collectMedia() {
  document.querySelectorAll('[data-media]').forEach(el => {
    const home = document.createElement('span');
    home.hidden = true;
    el.before(home);
    labMedia.set(el.dataset.media, { el, home });
  });
}

/* Move each piece of a section's media into its new take, or back home. */
function placeMedia(section, useNew) {
  if (!section) return;
  section.querySelectorAll('[data-holds]').forEach(holder => {
    const entry = labMedia.get(holder.dataset.holds);
    if (!entry) return;
    if (useNew) {
      if (entry.el.parentNode !== holder) holder.appendChild(entry.el);
    } else if (entry.home.nextSibling !== entry.el) {
      entry.home.after(entry.el);
    }
  });
}

function applyLab(state) {
  const root = document.documentElement;
  root.dataset.intro = state.intro;
  root.dataset.arcs = state.arcs;
  placeMedia(document.getElementById('thesis'), state.intro !== 'current');
  document.querySelectorAll('section.arc').forEach(s => placeMedia(s, state.arcs !== 'current'));
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

    LAB[key].forEach(option => {
      const btn = document.createElement('button');
      btn.type = 'button';
      btn.setAttribute('role', 'radio');
      btn.textContent = option.label;
      const sync = () => {
        const on = state[key] === option.id;
        btn.classList.toggle('is-on', on);
        btn.setAttribute('aria-checked', String(on));
      };
      sync();
      btn.addEventListener('click', () => {
        state[key] = option.id;
        seg.querySelectorAll('button').forEach(b => b.dispatchEvent(new Event('lab-sync')));
        applyLab(state);
        writeLab(state);
      });
      btn.addEventListener('lab-sync', sync);
      seg.appendChild(btn);
    });

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
  // Runs after phone.js has built the phones: both listen for
  // DOMContentLoaded, and this script is included after it.
  collectMedia();
  const state = readLab();
  applyLab(state);
  buildLabPanel(state);
}

document.addEventListener('DOMContentLoaded', initLab);
