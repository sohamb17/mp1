export function initCarousel() {
  const carousel = document.querySelector('.carousel');
  if (!carousel) return;

  const slides = Array.from(carousel.querySelectorAll('.carousel__slide'));
  if (slides.length < 2) return;

  const prevBtn = carousel.querySelector('.carousel__btn--prev');
  const nextBtn = carousel.querySelector('.carousel__btn--next');
  const dotsWrap = carousel.querySelector('.carousel__dots');
  const autoplayDelay = Number(carousel.dataset.autoplay) || 0;

  let index = Math.max(0, slides.findIndex((s) => s.classList.contains('is-active')));
  let timer = null;

  const dots = slides.map((slide, i) => {
    slide.setAttribute('aria-hidden', String(i !== index));

    if (!dotsWrap) return null;
    const dot = document.createElement('button');
    dot.type = 'button';
    dot.className = 'carousel__dot';
    dot.setAttribute('aria-label', `Show slide ${i + 1} of ${slides.length}`);
    if (i === index) dot.classList.add('is-active');
    dot.addEventListener('click', () => {
      goTo(i, i > index ? 'next' : 'prev');
      restart();
    });
    dotsWrap.appendChild(dot);
    return dot;
  });

  function goTo(target, direction) {
    const total = slides.length;
    const next = ((target % total) + total) % total;
    if (next === index) return;

    carousel.classList.toggle('is-reversing', direction === 'prev');

    slides[index].classList.remove('is-active');
    slides[index].setAttribute('aria-hidden', 'true');
    slides[next].classList.add('is-active');
    slides[next].setAttribute('aria-hidden', 'false');

    if (dots[index]) dots[index].classList.remove('is-active');
    if (dots[next]) dots[next].classList.add('is-active');

    index = next;
  }

  function step(offset) {
    goTo(index + offset, offset > 0 ? 'next' : 'prev');
  }

  function restart() {
    stop();
    if (autoplayDelay > 0) {
      timer = window.setInterval(() => step(1), autoplayDelay);
    }
  }

  function stop() {
    if (timer !== null) {
      window.clearInterval(timer);
      timer = null;
    }
  }

  if (prevBtn) {
    prevBtn.addEventListener('click', () => {
      step(-1);
      restart();
    });
  }

  if (nextBtn) {
    nextBtn.addEventListener('click', () => {
      step(1);
      restart();
    });
  }

  carousel.addEventListener('keydown', (event) => {
    if (event.key === 'ArrowLeft') {
      step(-1);
      restart();
    } else if (event.key === 'ArrowRight') {
      step(1);
      restart();
    }
  });

  carousel.addEventListener('mouseenter', stop);
  carousel.addEventListener('mouseleave', restart);
  carousel.addEventListener('focusin', stop);
  carousel.addEventListener('focusout', restart);

  restart();
}
