const SCROLL_TRIGGER = 40; // px before the navbar collapses
const BOTTOM_SLACK = 2;    // px tolerance for "scrolled to the bottom"

export function initNav() {
  const header = document.querySelector('.site-header');
  const list = document.querySelector('.nav__list');
  const toggle = document.querySelector('.nav__toggle');
  const links = Array.from(document.querySelectorAll('.nav__link'));

  if (!header || !links.length) return;

  // Sections in nav order, derived from the links themselves.
  const sections = links
    .map((link) => document.querySelector(link.getAttribute('href')))
    .filter(Boolean);

  let ticking = false;

  function setActive(id) {
    links.forEach((link) => {
      const isActive = link.getAttribute('href') === `#${id}`;
      link.classList.toggle('is-active', isActive);
      if (isActive) {
        link.setAttribute('aria-current', 'true');
      } else {
        link.removeAttribute('aria-current');
      }
    });
  }

  function update() {
    const scrollY = window.pageYOffset || document.documentElement.scrollTop;

    // 1. Navbar resize.
    header.classList.toggle('is-scrolled', scrollY > SCROLL_TRIGGER);

    // 2. Position indicator: last section whose top sits above the
    //    bottom edge of the navbar.
    const readingLine = scrollY + header.offsetHeight + 1;
    let currentId = sections.length ? sections[0].id : null;

    sections.forEach((section) => {
      const top = section.getBoundingClientRect().top + scrollY;
      if (top <= readingLine) currentId = section.id;
    });

    // 3. At the very bottom, force the final item — the last section may be
    //    too short to ever cross the reading line on its own.
    const viewportBottom = Math.ceil(scrollY + window.innerHeight);
    const pageHeight = document.documentElement.scrollHeight;
    if (sections.length && viewportBottom >= pageHeight - BOTTOM_SLACK) {
      currentId = sections[sections.length - 1].id;
    }

    if (currentId) setActive(currentId);
    ticking = false;
  }

  function requestUpdate() {
    if (ticking) return;
    ticking = true;
    window.requestAnimationFrame(update);
  }

  function closeMenu() {
    if (!list || !toggle) return;
    list.classList.remove('is-open');
    toggle.setAttribute('aria-expanded', 'false');
  }

  // ---- Mobile menu ----
  if (toggle && list) {
    toggle.addEventListener('click', () => {
      const isOpen = list.classList.toggle('is-open');
      toggle.setAttribute('aria-expanded', String(isOpen));
    });
  }

  // ---- Smooth scrolling for every in-page anchor ----
  document.addEventListener('click', (event) => {
    const link = event.target.closest('a[href^="#"]');
    if (!link) return;

    const hash = link.getAttribute('href');
    if (!hash || hash === '#') return;

    const target = document.querySelector(hash);
    if (!target) return;

    event.preventDefault();
    closeMenu();
    // scroll-margin-top on .section keeps the heading clear of the navbar.
    target.scrollIntoView({ behavior: 'smooth', block: 'start' });
    window.history.replaceState(null, '', hash);
  });

  window.addEventListener('scroll', requestUpdate, { passive: true });
  window.addEventListener('resize', requestUpdate);
  update();
}
