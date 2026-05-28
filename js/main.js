(function () {
  'use strict';

  const toggle  = document.getElementById('navToggle');
  const navList = document.getElementById('navList');

  if (toggle && navList) {
    toggle.addEventListener('click', () => {
      const isOpen = navList.classList.toggle('is-open');
      toggle.setAttribute('aria-expanded', String(isOpen));
      toggle.setAttribute('aria-label', isOpen ? 'Fechar menu' : 'Abrir menu');
      document.body.style.overflow = isOpen ? 'hidden' : '';
    });

    navList.querySelectorAll('a').forEach((link) => {
      link.addEventListener('click', () => {
        navList.classList.remove('is-open');
        toggle.setAttribute('aria-expanded', 'false');
        document.body.style.overflow = '';
      });
    });
  }

  const header = document.getElementById('siteHeader');
  const onScroll = () => {
    if (!header) return;
    header.classList.toggle('is-scrolled', window.scrollY > 8);
  };
  document.addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  const sections = document.querySelectorAll('main section[id]');
  const links    = document.querySelectorAll('.nav__list a[href^="#"]');

  if ('IntersectionObserver' in window && sections.length && links.length) {
    const byHref = new Map();
    links.forEach((a) => byHref.set(a.getAttribute('href'), a));

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;
          const id = '#' + entry.target.id;
          links.forEach((a) => a.classList.remove('is-active'));
          byHref.get(id)?.classList.add('is-active');
        });
      },
      { rootMargin: '-40% 0px -55% 0px', threshold: 0 }
    );

    sections.forEach((s) => observer.observe(s));
  }

  document.querySelectorAll('.yt-facade').forEach((facade) => {
    const load = () => {
      const id = facade.getAttribute('data-video-id');
      if (!id) return;
      const iframe = document.createElement('iframe');
      iframe.setAttribute('src',
        `https://www.youtube.com/embed/${id}?autoplay=1&rel=0&modestbranding=1`);
      iframe.setAttribute('title', 'Demonstração do DropSales');
      iframe.setAttribute('allow',
        'accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture');
      iframe.setAttribute('allowfullscreen', '');
      facade.innerHTML = '';
      facade.appendChild(iframe);
      facade.style.cursor = 'default';
    };
    facade.addEventListener('click', load);
    facade.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); load(); }
    });
  });

  const carousel = document.getElementById('heroCarousel');
  if (carousel) {
    const track   = carousel.querySelector('#carouselTrack');
    const slides  = Array.from(track.querySelectorAll('.carousel__slide'));
    const prev    = carousel.querySelector('.carousel__btn--prev');
    const next    = carousel.querySelector('.carousel__btn--next');
    const dotsEl  = carousel.querySelector('#carouselDots');
    const caption = carousel.querySelector('#carouselCaption');

    let index = 0;
    let autoplayId = null;
    let userPaused = false;
    const AUTOPLAY_MS = 5000;

    slides.forEach((slide, i) => {
      const li = document.createElement('li');
      li.setAttribute('role', 'presentation');
      const b = document.createElement('button');
      b.type = 'button';
      b.setAttribute('role', 'tab');
      b.setAttribute('aria-label', `Ir para a tela ${i + 1}: ${slide.dataset.label || ''}`);
      b.addEventListener('click', () => { goTo(i); pauseAutoplay(); });
      li.appendChild(b);
      dotsEl.appendChild(li);
    });
    const dots = Array.from(dotsEl.querySelectorAll('button'));

    function render() {
      track.style.transform = `translateX(-${index * 100}%)`;
      dots.forEach((d, i) =>
        d.setAttribute('aria-current', i === index ? 'true' : 'false'));
      if (caption) caption.textContent = slides[index].dataset.label || '';
    }

    function goTo(i) {
      index = (i + slides.length) % slides.length;
      render();
    }
    const nextSlide = () => goTo(index + 1);
    const prevSlide = () => goTo(index - 1);

    function startAutoplay() {
      stopAutoplay();
      if (userPaused) return;
      if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
      autoplayId = setInterval(nextSlide, AUTOPLAY_MS);
    }
    function stopAutoplay() {
      if (autoplayId) { clearInterval(autoplayId); autoplayId = null; }
    }
    function pauseAutoplay() {
      userPaused = true;
      stopAutoplay();
    }

    next.addEventListener('click', () => { nextSlide(); pauseAutoplay(); });
    prev.addEventListener('click', () => { prevSlide(); pauseAutoplay(); });

    carousel.addEventListener('mouseenter', stopAutoplay);
    carousel.addEventListener('mouseleave', () => { if (!userPaused) startAutoplay(); });
    carousel.addEventListener('focusin', stopAutoplay);
    carousel.addEventListener('focusout', () => { if (!userPaused) startAutoplay(); });

    carousel.addEventListener('keydown', (e) => {
      if (e.key === 'ArrowRight') { e.preventDefault(); nextSlide(); pauseAutoplay(); }
      else if (e.key === 'ArrowLeft') { e.preventDefault(); prevSlide(); pauseAutoplay(); }
    });

    let touchStartX = 0;
    let touchEndX = 0;
    carousel.addEventListener('touchstart', (e) => {
      touchStartX = e.changedTouches[0].screenX;
    }, { passive: true });
    carousel.addEventListener('touchend', (e) => {
      touchEndX = e.changedTouches[0].screenX;
      const dx = touchEndX - touchStartX;
      if (Math.abs(dx) > 40) {
        if (dx < 0) nextSlide(); else prevSlide();
        pauseAutoplay();
      }
    });

    document.addEventListener('visibilitychange', () => {
      if (document.hidden) stopAutoplay();
      else if (!userPaused) startAutoplay();
    });

    render();
    startAutoplay();

    const lightbox = document.getElementById('lightbox');
    const expandBtn = document.getElementById('carouselExpand');
    if (lightbox && expandBtn) {
      const lbImage = document.getElementById('lightboxImage');
      const lbCaption = document.getElementById('lightboxCaption');
      const lbCounter = document.getElementById('lightboxCounter');
      const lbClose = document.getElementById('lightboxClose');
      const lbPrev = document.getElementById('lightboxPrev');
      const lbNext = document.getElementById('lightboxNext');
      let lbIndex = 0;
      let lastFocused = null;

      function renderLightbox() {
        const slide = slides[lbIndex];
        const img = slide.querySelector('img');
        lbImage.src = img.src;
        lbImage.alt = img.alt;
        lbCaption.textContent = slide.dataset.label || '';
        lbCounter.textContent = `${lbIndex + 1} / ${slides.length}`;
      }

      function openLightbox(startIndex) {
        lbIndex = startIndex;
        lastFocused = document.activeElement;
        renderLightbox();
        lightbox.hidden = false;
        document.body.classList.add('lightbox-open');
        stopAutoplay();
        setTimeout(() => lbClose.focus(), 0);
      }

      function closeLightbox() {
        lightbox.hidden = true;
        document.body.classList.remove('lightbox-open');
        if (lastFocused && lastFocused.focus) lastFocused.focus();
        if (!userPaused) startAutoplay();
      }

      function lbGoTo(i) {
        lbIndex = (i + slides.length) % slides.length;
        renderLightbox();
      }

      expandBtn.addEventListener('click', () => openLightbox(index));
      lbClose.addEventListener('click', closeLightbox);
      lbPrev.addEventListener('click', () => lbGoTo(lbIndex - 1));
      lbNext.addEventListener('click', () => lbGoTo(lbIndex + 1));

      lightbox.addEventListener('click', (e) => {
        if (e.target === lightbox) closeLightbox();
      });

      document.addEventListener('keydown', (e) => {
        if (lightbox.hidden) return;
        if (e.key === 'Escape') { e.preventDefault(); closeLightbox(); }
        else if (e.key === 'ArrowRight') { e.preventDefault(); lbGoTo(lbIndex + 1); }
        else if (e.key === 'ArrowLeft') { e.preventDefault(); lbGoTo(lbIndex - 1); }
      });

      let lbTouchStartX = 0;
      lightbox.addEventListener('touchstart', (e) => {
        lbTouchStartX = e.changedTouches[0].screenX;
      }, { passive: true });
      lightbox.addEventListener('touchend', (e) => {
        const dx = e.changedTouches[0].screenX - lbTouchStartX;
        if (Math.abs(dx) > 40) {
          if (dx < 0) lbGoTo(lbIndex + 1);
          else lbGoTo(lbIndex - 1);
        }
      });
    }
  }
})();
