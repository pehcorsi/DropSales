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
})();
