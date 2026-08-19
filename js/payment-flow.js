/* ============================================================================
   APPLICANTS — arc-3's phone stays put; the annotation panel is a static
   reference covering all four states (payment -> loader -> reviewReport ->
   applicationsList) side by side, so it reads the same regardless of where
   the phone currently is. Only the one-time interaction caption reacts to
   navigation, hiding itself once the visitor has driven the phone once.
   ============================================================================ */

function initPaymentFlow() {
  const layout = document.getElementById('payment-flow-layout');
  if (!layout) return;
  const figure = layout.querySelector('.phone-figure');
  if (!figure) return;

  const caption = figure.querySelector('.phone-caption');
  const resetBtn = figure.querySelector('.phone-reset');

  function hideCaption() {
    if (caption) caption.classList.add('is-hidden');
  }
  function showCaption() {
    if (caption) caption.classList.remove('is-hidden');
  }

  figure.addEventListener('rs-navigate', e => {
    if (!e.detail || !e.detail.to) return;
    hideCaption();
  });

  if (resetBtn) {
    resetBtn.addEventListener('click', showCaption);
  }
}

document.addEventListener('DOMContentLoaded', initPaymentFlow);
