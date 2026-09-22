import { initNav } from './nav';
import { initCarousel } from './carousel';
import { initModal } from './modal';
import { initReveal } from './reveal';
import { initVideoAutoplay } from './video';

function init() {
  initNav();
  initCarousel();
  initModal();
  initReveal();
  initVideoAutoplay();
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', init);
} else {
  init();
}
