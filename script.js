/* ============================================
   ТЕНЬ У ШАПКИ ПРИ СКРОЛЛЕ
   ============================================ */
const header = document.getElementById('header');
if (header) {
  window.addEventListener('scroll', () => {
    if (window.scrollY > 10) {
      header.classList.add('scrolled');
    } else {
      header.classList.remove('scrolled');
    }
  });
}

/* ============================================
   БУРГЕР (с защитой)
   ============================================ */
const burger = document.getElementById('burger');
if (burger) {
  burger.addEventListener('click', () => {
    burger.classList.toggle('active');
  });
}

/* ============================================
   СВАЙПЕР-ВЕРНИСАЖ
   ============================================ */
(function () {
  const track = document.getElementById('swiperTrack');
  const swiperEl = document.getElementById('swiper');

  // Если свайпера нет на странице — тихо выходим
  if (!track || !swiperEl) {
    console.warn('Свайпер не найден на странице');
    return;
  }

  const slides = Array.from(track.children);
  const prevBtn = document.getElementById('swiperPrev');
  const nextBtn = document.getElementById('swiperNext');
  const progressBar = document.getElementById('swiperProgressBar');
  const currentEl = document.getElementById('swiperCurrent');
  const totalEl = document.getElementById('swiperTotal');

  let currentIndex = 0;
  let slidesPerView = getSlidesPerView();
  let maxIndex = slides.length - slidesPerView;
  let autoplayTimer = null;
  let isPaused = false;

  const AUTOPLAY_DELAY = 5000; // 5 секунд

  function getSlidesPerView() {
    return window.innerWidth <= 900 ? 1 : 3;
  }

  function update() {
    slides.forEach((slide, i) => {
      slide.classList.toggle(
        'active',
        i >= currentIndex && i < currentIndex + slidesPerView
      );
    });

    const slideWidth = slides[0].getBoundingClientRect().width;
    const gap = parseFloat(getComputedStyle(track).gap) || 0;
    const offset = currentIndex * (slideWidth + gap);
    track.style.transform = `translateX(-${offset}px)`;

    if (progressBar) {
      const progress = ((currentIndex + 1) / slides.length) * 100;
      progressBar.style.width = progress + '%';
    }

    if (currentEl) currentEl.textContent = String(currentIndex + 1).padStart(2, '0');
    if (totalEl) totalEl.textContent = String(slides.length).padStart(2, '0');
  }

  function next() {
    currentIndex = currentIndex < maxIndex ? currentIndex + 1 : 0;
    update();
  }

  function prev() {
    currentIndex = currentIndex > 0 ? currentIndex - 1 : maxIndex;
    update();
  }

  /* ===== АВТОПРОКРУТКА ===== */
  function startAutoplay() {
    stopAutoplay();
    autoplayTimer = setInterval(() => {
      if (!isPaused) next();
    }, AUTOPLAY_DELAY);
  }

  function stopAutoplay() {
    if (autoplayTimer) {
      clearInterval(autoplayTimer);
      autoplayTimer = null;
    }
  }

  if (nextBtn) {
    nextBtn.addEventListener('click', () => {
      next();
      startAutoplay();
    });
  }

  if (prevBtn) {
    prevBtn.addEventListener('click', () => {
      prev();
      startAutoplay();
    });
  }

  slides.forEach((slide, i) => {
    slide.addEventListener('click', () => {
      currentIndex = Math.min(i, maxIndex);
      update();
      startAutoplay();
    });
  });

  /* ===== ПАУЗА ПРИ НАВЕДЕНИИ ===== */
  swiperEl.addEventListener('mouseenter', () => { isPaused = true; });
  swiperEl.addEventListener('mouseleave', () => { isPaused = false; });

  /* ===== ПАУЗА, КОГДА ВКЛАДКА НЕ АКТИВНА ===== */
  document.addEventListener('visibilitychange', () => {
    isPaused = document.hidden;
  });

  /* ===== РЕСАЙЗ ===== */
  window.addEventListener('resize', () => {
    const newSpv = getSlidesPerView();
    if (newSpv !== slidesPerView) {
      slidesPerView = newSpv;
      maxIndex = slides.length - slidesPerView;
      if (currentIndex > maxIndex) currentIndex = maxIndex;
    }
    update();
  });

  /* ===== КЛАВИАТУРА ===== */
  document.addEventListener('keydown', (e) => {
    if (e.key === 'ArrowRight') { next(); startAutoplay(); }
    if (e.key === 'ArrowLeft')  { prev(); startAutoplay(); }
  });

  /* ===== СТАРТ ===== */
  update();
  startAutoplay();

  console.log('✅ Свайпер запущен. Слайдов:', slides.length);
})();

/* ============================================
   ПЛАВНАЯ ПРОКРУТКА ПО ЯКОРНЫМ ССЫЛКАМ
   ============================================ */
(function () {
  // высота липкой шапки — с запасом
  const HEADER_OFFSET = 100;

  document.querySelectorAll('a[href^="#"]').forEach((link) => {
    link.addEventListener('click', (e) => {
      const href = link.getAttribute('href');

      // игнорируем пустые ссылки типа href="#"
      if (href === '#' || href === '') return;

      const target = document.querySelector(href);
      if (!target) return;

      e.preventDefault();

      const targetPosition =
        target.getBoundingClientRect().top +
        window.pageYOffset -
        HEADER_OFFSET;

      window.scrollTo({
        top: targetPosition,
        behavior: 'smooth',
      });

      // обновляем адресную строку без прыжка
      history.pushState(null, '', href);
    });
  });

  /* ===== КНОПКА "НАВЕРХ" В ПОДВАЛЕ ===== */
  const footerUp = document.querySelector('.footer__up');
  if (footerUp) {
    footerUp.addEventListener('click', (e) => {
      e.preventDefault();
      window.scrollTo({ top: 0, behavior: 'smooth' });
      history.pushState(null, '', window.location.pathname);
    });
  }
})();