/*
 * Kyoto Sushi — bootstrap. Each behaviour lives in its own module and
 * bails out quietly if its markup is not on the page.
 */
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
