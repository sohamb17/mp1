import { initNav } from './nav';
import { initCarousel } from './carousel';
import { initModal } from './modal';
import { initReveal } from './reveal';

function init() {
  initNav();
  initCarousel();
  initModal();
  initReveal();
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', init);
} else {
  init();
}
