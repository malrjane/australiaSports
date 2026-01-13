document.addEventListener('DOMContentLoaded', () => {
  const yearEl = document.querySelector('.year, [data-year]');
  if (yearEl) yearEl.textContent = new Date().getFullYear();

  const burgers = document.querySelectorAll('[data-burger]');
  const nav = document.querySelector('[data-mobile-nav]');
  if (!burgers.length || !nav) return;

  // Base overlay styles (in case the model forgot them)
  nav.style.height = '100vh';
  nav.style.maxHeight = '100vh';
  nav.style.overflowY = 'auto';

  const bg =
    getComputedStyle(document.documentElement).getPropertyValue('--color-bg') ||
    getComputedStyle(document.documentElement).getPropertyValue('--color-surface') ||
    '#0f172a';
  nav.style.background = (bg || '').trim() || '#0f172a';

  // Ensure overlay is actually on top if classes are missing
  if (!nav.style.position) nav.style.position = 'fixed';
  if (!nav.style.inset) nav.style.inset = '0';
  if (!nav.style.zIndex) nav.style.zIndex = '9999';

  // If author uses opacity transitions, keep them consistent
  const hasOpacity0 = nav.classList.contains('opacity-0');
  const hasTransition = /transition-opacity/.test(nav.className);
  if (hasTransition && !hasOpacity0 && nav.classList.contains('hidden')) {
    nav.classList.add('opacity-0');
  }

  // Extract transition duration from Tailwind class like duration-300
  const durMatch = nav.className.match(/duration-(d+)/);
  const ANIM_MS = durMatch ? Math.max(0, Number(durMatch[1]) || 0) : 300;

  function openNav() {
    // show immediately
    nav.classList.remove('hidden');

    // fade-in if transition is used
    if (hasTransition) {
      // next frame to trigger transition
      requestAnimationFrame(() => {
        nav.classList.remove('opacity-0');
        nav.classList.add('opacity-100');
      });
    }

    document.body.classList.add('overflow-hidden');
  }

  function closeNav() {
    // fade-out first
    if (hasTransition) {
      nav.classList.add('opacity-0');
      nav.classList.remove('opacity-100');

      // then hide after animation
      window.setTimeout(() => {
        nav.classList.add('hidden');
      }, ANIM_MS);
    } else {
      nav.classList.add('hidden');
    }

    document.body.classList.remove('overflow-hidden');
  }

  function isOpen() {
    return !nav.classList.contains('hidden');
  }

  // Capture-phase handler to avoid inline scripts fighting with us
  burgers.forEach(btn => {
    btn.addEventListener('click', e => {
      e.preventDefault();
      e.stopPropagation();
      if (e.stopImmediatePropagation) e.stopImmediatePropagation();

      if (isOpen()) closeNav();
      else openNav();
    }, true);
  });

  // Close on link click inside overlay
  nav.querySelectorAll('a[href]').forEach(a => {
    a.addEventListener('click', () => closeNav(), true);
  });

  // Close on ESC
  document.addEventListener('keydown', e => {
    if (e.key === 'Escape' && isOpen()) closeNav();
  });

  // Close on desktop breakpoint
  window.addEventListener('resize', () => {
    if (window.innerWidth >= 768 && isOpen()) closeNav();
  });

  // Start closed
  if (!nav.classList.contains('hidden')) {
    // If markup shipped open, normalize to closed state
    nav.classList.add('hidden');
  }
  if (hasTransition) {
    nav.classList.add('opacity-0');
    nav.classList.remove('opacity-100');
  }
});