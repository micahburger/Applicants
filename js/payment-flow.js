/* ============================================================================
   APPLICANTS — arc-3's phone. The one-time interaction caption reacts to
   navigation, hiding itself once the visitor has driven the phone once, and
   reappearing on Reset.
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
