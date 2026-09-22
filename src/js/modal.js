const FOCUSABLE =
  'a[href], button:not([disabled]), input, select, textarea, [tabindex]:not([tabindex="-1"])';

export function initModal() {
  const modal = document.querySelector('#dish-modal');
  if (!modal) return;

  const dialog = modal.querySelector('.modal__dialog');
  const imageEl = modal.querySelector('#modal-image');
  const tagsEl = modal.querySelector('#modal-tags');
  const titleEl = modal.querySelector('#modal-title');
  const priceEl = modal.querySelector('#modal-price');
  const bodyEl = modal.querySelector('#modal-body');
  const closeBtn = modal.querySelector('.modal__close');

  let lastFocused = null;

  function open(trigger) {
    lastFocused = trigger;

    const data = trigger.dataset;
    titleEl.textContent = data.modalTitle || '';
    priceEl.textContent = data.modalPrice || '';
    tagsEl.innerHTML = data.modalTags || '';
    bodyEl.textContent = data.modalBody || '';

    // Reuse the card's own image so the resolved URL is always correct,
    // whether or not webpack rewrote it.
    const cardImage = trigger.querySelector('img');
    if (cardImage && imageEl) {
      imageEl.setAttribute('src', cardImage.getAttribute('src'));
      imageEl.setAttribute('alt', cardImage.getAttribute('alt') || '');
    }

    modal.classList.add('is-open');
    modal.setAttribute('aria-hidden', 'false');
    document.body.classList.add('has-modal');

    if (closeBtn) closeBtn.focus();
    document.addEventListener('keydown', onKeydown);
  }

  function close() {
    modal.classList.remove('is-open');
    modal.setAttribute('aria-hidden', 'true');
    document.body.classList.remove('has-modal');
    document.removeEventListener('keydown', onKeydown);

    if (lastFocused) {
      lastFocused.focus();
      lastFocused = null;
    }
  }

  function onKeydown(event) {
    if (event.key === 'Escape') {
      close();
      return;
    }

    if (event.key !== 'Tab' || !dialog) return;

    // Keep focus inside the dialog while it is open.
    const focusable = Array.from(dialog.querySelectorAll(FOCUSABLE));
    if (!focusable.length) return;

    const first = focusable[0];
    const last = focusable[focusable.length - 1];

    if (event.shiftKey && document.activeElement === first) {
      event.preventDefault();
      last.focus();
    } else if (!event.shiftKey && document.activeElement === last) {
      event.preventDefault();
      first.focus();
    }
  }

  document.querySelectorAll('.menu-card__button').forEach((trigger) => {
    trigger.addEventListener('click', () => open(trigger));
  });

  modal.querySelectorAll('[data-modal-close]').forEach((el) => {
    el.addEventListener('click', close);
  });
}
