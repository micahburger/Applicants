/* ============================================================================
   APPLICANTS — Phone / Still device components. Vanilla JS, no framework.
   Scans the DOM for declarative mount points and hydrates them:

     <div class="phone-mount" data-screen="overview"
          data-caption="Click in — then switch between..."
          data-states='["Not started","Resumed"]'></div>

     <div class="still-mount" data-screen="applications-list"
          data-caption="Three properties. Three states. Three transactions."></div>

   `data-screen` names a function on window.RSScreens (js/screens.js). Screens
   mount on page load — it's local DOM, so there's no loading state to build.
   ============================================================================ */

/* Maps a screen name + human state label to the argument RSScreens[screen]
   expects. Only overview takes a state argument today. */
const PHONE_STATE_VALUES = {
  overview: { 'Not started': 'fresh', 'Resumed': 'resumed' },
};

function phoneScreenFn(name) {
  const key = name.replace(/-([a-z])/g, (_, c) => c.toUpperCase()); // "applications-list" -> "applicationsList"
  const fn = window.RSScreens && window.RSScreens[key];
  if (!fn) throw new Error(`No RSScreens.${key} for data-screen="${name}"`);
  return fn;
}

function buildPhone(mountEl) {
  const screenName = mountEl.getAttribute('data-screen');
  const caption = mountEl.getAttribute('data-caption') || '';
  const size = mountEl.getAttribute('data-size'); // 'sm' -> ~300px frame
  const statesAttr = mountEl.getAttribute('data-states');
  const stateLabels = statesAttr ? JSON.parse(statesAttr) : null;
  const stateMap = PHONE_STATE_VALUES[screenName.replace(/-([a-z])/g, (_, c) => c.toUpperCase())] || null;
  const screenFn = phoneScreenFn(screenName);

  let currentValue = stateLabels && stateMap ? stateMap[stateLabels[0]] : undefined;

  const figure = document.createElement('div');
  figure.className = 'phone-figure';

  const frame = document.createElement('div');
  frame.className = 'phone-frame' + (size === 'sm' ? ' frame--sm' : '');

  const screenWrap = document.createElement('div');
  screenWrap.className = 'phone-screen-wrap';

  // Dedicated slot for whichever screen node is currently mounted, kept
  // separate from screenWrap itself — screenWrap also holds the activation
  // overlay, which needs to survive a screen swap (in-phone navigation via
  // rs-navigate, or the state segmented control) rather than getting wiped
  // along with the old screen node.
  const screenSlot = document.createElement('div');

  // name/value of whatever's currently mounted, so in-phone navigation
  // (rs-navigate) can push/pop it as a stack independent of the state
  // segmented control's own value.
  let currentScreenName = screenName;
  const navStack = [];

  function mountScreen(value, nameOverride) {
    const fn = nameOverride ? phoneScreenFn(nameOverride) : screenFn;
    const node = value !== undefined ? fn(value) : fn();
    node.style.pointerEvents = frame.classList.contains('is-live') ? 'auto' : 'none';
    screenSlot.innerHTML = '';
    screenSlot.appendChild(node);
    return node;
  }

  function fadeIn(node) {
    node.style.opacity = '0';
    requestAnimationFrame(() => { node.style.opacity = '1'; });
  }

  mountScreen(currentValue);
  screenWrap.appendChild(screenSlot);

  // Screens dispatch `rs-navigate` (bubbling) with `{ to: 'yourDetails' }` to
  // push a new screen, or `{ to: 'back' }` to pop — see overview()'s primary
  // button and stepHeader()'s back button in screens.js. Scoped to this
  // mount's own stack, so it's a no-op for any phone that never navigates.
  screenWrap.addEventListener('rs-navigate', e => {
    const to = e.detail && e.detail.to;
    if (!to) return;
    if (to === 'back') {
      if (!navStack.length) return;
      currentScreenName = navStack.pop();
    } else {
      navStack.push(currentScreenName);
      currentScreenName = to;
    }
    fadeIn(mountScreen(undefined, currentScreenName));
  });

  const overlay = document.createElement('button');
  overlay.type = 'button';
  overlay.className = 'phone-activate-overlay';
  overlay.setAttribute('aria-label', 'Activate this screen');

  function setLive(live) {
    frame.classList.toggle('is-live', live);
    const productEl = screenWrap.querySelector('.product');
    if (productEl) productEl.style.pointerEvents = live ? 'auto' : 'none';
  }

  function activate() { setLive(true); }
  function deactivate() { setLive(false); }

  overlay.addEventListener('click', activate);

  document.addEventListener('click', e => {
    if (!frame.classList.contains('is-live')) return;
    if (frame.contains(e.target)) return;
    deactivate();
  });
  document.addEventListener('keydown', e => {
    if (e.key === 'Escape' && frame.classList.contains('is-live')) deactivate();
  });

  screenWrap.appendChild(overlay);
  frame.appendChild(screenWrap);
  figure.appendChild(frame);

  if (caption) {
    const cap = document.createElement('p');
    cap.className = 'phone-caption';
    cap.textContent = caption;
    figure.appendChild(cap);
  }

  const controls = document.createElement('div');
  controls.className = 'phone-controls';

  if (stateLabels && stateMap) {
    const seg = document.createElement('div');
    seg.className = 'phone-states';
    stateLabels.forEach((label, i) => {
      const btn = document.createElement('button');
      btn.type = 'button';
      btn.textContent = label;
      if (i === 0) btn.classList.add('active');
      btn.addEventListener('click', () => {
        if (btn.classList.contains('active')) return;
        seg.querySelectorAll('button').forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        const wasLive = frame.classList.contains('is-live');
        const productEl = screenWrap.querySelector('.product');
        if (productEl) productEl.style.opacity = '0';
        setTimeout(() => {
          currentValue = stateMap[label];
          navStack.length = 0;
          currentScreenName = screenName;
          mountScreen(currentValue);
          setLive(wasLive);
          const fresh = screenWrap.querySelector('.product');
          if (fresh) {
            fresh.style.opacity = '0';
            requestAnimationFrame(() => { fresh.style.opacity = '1'; });
          }
        }, 150);
      });
      seg.appendChild(btn);
    });
    controls.appendChild(seg);
  }

  const resetBtn = document.createElement('button');
  resetBtn.type = 'button';
  resetBtn.className = 'phone-reset';
  resetBtn.textContent = 'Reset';
  resetBtn.addEventListener('click', () => {
    const wasLive = frame.classList.contains('is-live');
    navStack.length = 0;
    currentScreenName = screenName;
    mountScreen(currentValue);
    setLive(wasLive);
  });
  controls.appendChild(resetBtn);

  figure.appendChild(controls);

  mountEl.replaceWith(figure);
}

function buildStill(mountEl) {
  const screenName = mountEl.getAttribute('data-screen');
  const caption = mountEl.getAttribute('data-caption') || '';
  const size = mountEl.getAttribute('data-size'); // 'sm' -> ~300px frame, e.g. thesis's visual
  const screenFn = phoneScreenFn(screenName);

  const figure = document.createElement('div');
  figure.className = 'still-figure';

  const frame = document.createElement('div');
  frame.className = 'still-frame' + (size === 'sm' ? ' frame--sm' : '');

  const screenWrap = document.createElement('div');
  screenWrap.className = 'still-screen-wrap';
  screenWrap.appendChild(screenFn());

  frame.appendChild(screenWrap);
  figure.appendChild(frame);

  if (caption) {
    const cap = document.createElement('p');
    cap.className = 'still-caption';
    cap.textContent = caption;
    figure.appendChild(cap);
  }

  mountEl.replaceWith(figure);
}

function initPhones() {
  document.querySelectorAll('.phone-mount').forEach(buildPhone);
  document.querySelectorAll('.still-mount').forEach(buildStill);
}

document.addEventListener('DOMContentLoaded', initPhones);
