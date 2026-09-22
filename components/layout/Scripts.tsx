'use client';

import { useEffect } from 'react';
import { usePathname } from 'next/navigation';

export default function Scripts() {
  const pathname = usePathname();

  useEffect(() => {
    // Skip all site scripts inside /admin
    if (pathname?.startsWith('/admin')) return;

    /* ============================================================
       NAVBAR — top bar offset + scroll state
       ============================================================ */
    const nav = document.getElementById('mainNav') as HTMLElement | null;

    const updateNav = () => {
      if (!nav) return;
      const scrolled = window.scrollY > 80;
      const isMobile = window.innerWidth < 1024;
      nav.style.top = scrolled || isMobile ? '0' : '37px';
      nav.classList.toggle('glass-dark', scrolled);
      nav.classList.toggle('scrolled', scrolled);
    };

    updateNav();
    window.addEventListener('scroll', updateNav, { passive: true });
    window.addEventListener('resize', updateNav);

    /* ============================================================
       BACK TO TOP BUTTON
       ============================================================ */
    let backToTop = document.querySelector('.back-to-top') as HTMLButtonElement | null;
    if (!backToTop) {
      backToTop = document.createElement('button');
      backToTop.className = 'back-to-top';
      backToTop.setAttribute('aria-label', 'Back to top');
      backToTop.innerHTML = '<i class="fa-solid fa-arrow-up"></i>';
      document.body.appendChild(backToTop);
    }

    const updateBackToTop = () => {
      if (!backToTop) return;
      backToTop.classList.toggle('visible', window.scrollY > 400);
    };

    const scrollToTop = () => {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    backToTop.addEventListener('click', scrollToTop);
    window.addEventListener('scroll', updateBackToTop, { passive: true });
    updateBackToTop();

    /* ============================================================
       MOBILE MENU
       ============================================================ */
    const menuBtn = document.getElementById('mobileMenuBtn') as HTMLButtonElement | null;
    const mobileMenu = document.getElementById('mobileMenu') as HTMLElement | null;
    const menuIcon = menuBtn?.querySelector('i');

    const toggleMenu = () => {
      if (!mobileMenu) return;
      mobileMenu.classList.toggle('open');
      menuIcon?.classList.toggle('fa-bars');
      menuIcon?.classList.toggle('fa-xmark');
    };

    const closeMenu = () => {
      if (!mobileMenu) return;
      mobileMenu.classList.remove('open');
      menuIcon?.classList.add('fa-bars');
      menuIcon?.classList.remove('fa-xmark');
    };

    menuBtn?.addEventListener('click', toggleMenu);
    const menuLinks = mobileMenu?.querySelectorAll('a') || [];
    menuLinks.forEach((link) => link.addEventListener('click', closeMenu));

    /* Mobile submenu dropdowns (if any) */
    const submenuButtons = document.querySelectorAll('.mobile-dropdown-btn');
    const handleSubmenu = (e: Event) => {
      const btn = e.currentTarget as HTMLElement;
      const submenu = btn.nextElementSibling as HTMLElement | null;
      if (!submenu) return;

      document.querySelectorAll('.mobile-dropdown-menu.open').forEach((m) => {
        if (m !== submenu) m.classList.remove('open');
      });
      document.querySelectorAll('.mobile-dropdown-btn.open').forEach((b) => {
        if (b !== btn) b.classList.remove('open');
      });

      submenu.classList.toggle('open');
      btn.classList.toggle('open');
    };
    submenuButtons.forEach((btn) => btn.addEventListener('click', handleSubmenu));

    /* ============================================================
       REVEAL ON SCROLL
       ============================================================ */
    const revealObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('visible');
            revealObserver.unobserve(entry.target);
          }
        });
      },
      { rootMargin: '0px 0px -50px 0px', threshold: 0.1 }
    );

    document
      .querySelectorAll('.reveal:not(.visible), .img-reveal:not(.visible)')
      .forEach((el) => revealObserver.observe(el));

    // Safety net — force reveal anything still hidden after 2s
    const revealFallback = setTimeout(() => {
      document
        .querySelectorAll('.reveal:not(.visible), .img-reveal:not(.visible)')
        .forEach((el) => el.classList.add('visible'));
    }, 2000);

    /* ============================================================
       COUNTER ANIMATION — runs exactly ONCE per element
       ============================================================ */
    const counterObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;

          const el = entry.target as HTMLElement;

          // Guard: never animate twice
          if (el.dataset.animated === 'true') return;
          el.dataset.animated = 'true';
          counterObserver.unobserve(el);

          const target = parseInt(el.getAttribute('data-target') || '0', 10);
          const suffix = el.getAttribute('data-suffix') || '';
          const duration = 2000;
          const start = performance.now();

          const animate = (now: number) => {
            const progress = Math.min((now - start) / duration, 1);
            const eased = 1 - Math.pow(1 - progress, 3);
            el.textContent = Math.floor(eased * target) + suffix;
            if (progress < 1) requestAnimationFrame(animate);
            else el.textContent = target + suffix;
          };

          requestAnimationFrame(animate);
        });
      },
      { threshold: 0.5 }
    );

    document
      .querySelectorAll('.counter:not([data-animated])')
      .forEach((el) => counterObserver.observe(el));

    /* ============================================================
       SMOOTH SCROLL FOR ANCHOR LINKS
       ============================================================ */
    const handleAnchor = (e: Event) => {
      const a = e.currentTarget as HTMLAnchorElement;
      const href = a.getAttribute('href');
      if (!href || !href.startsWith('#')) return;
      if (href === '#' || href === '#!' || href.length < 2) return;

      let target: HTMLElement | null = null;
      try {
        target = document.querySelector(href) as HTMLElement | null;
      } catch {
        return;
      }
      if (!target) return;

      e.preventDefault();
      const offset = (nav?.offsetHeight || 80) + 20;
      window.scrollTo({
        top: target.getBoundingClientRect().top + window.pageYOffset - offset,
        behavior: 'smooth',
      });
    };

    const anchors = document.querySelectorAll('a[href^="#"]');
    anchors.forEach((a) => a.addEventListener('click', handleAnchor));

    /* ============================================================
       WATCH FOR NEW DOM (React re-renders / late content)
       — re-attach reveal + counters when new elements appear
       ============================================================ */
    const mutationObserver = new MutationObserver(() => {
      document
        .querySelectorAll('.reveal:not(.visible), .img-reveal:not(.visible)')
        .forEach((el) => revealObserver.observe(el));

      document
        .querySelectorAll('.counter:not([data-animated])')
        .forEach((el) => counterObserver.observe(el));
    });

    mutationObserver.observe(document.body, {
      childList: true,
      subtree: true,
    });

    /* ============================================================
       CLEANUP
       ============================================================ */
    return () => {
      window.removeEventListener('scroll', updateNav);
      window.removeEventListener('resize', updateNav);
      window.removeEventListener('scroll', updateBackToTop);
      backToTop?.removeEventListener('click', scrollToTop);
      if (backToTop && backToTop.parentNode) {
        backToTop.parentNode.removeChild(backToTop);
      }
      menuBtn?.removeEventListener('click', toggleMenu);
      menuLinks.forEach((link) =>
        link.removeEventListener('click', closeMenu)
      );
      submenuButtons.forEach((btn) =>
        btn.removeEventListener('click', handleSubmenu)
      );
      anchors.forEach((a) => a.removeEventListener('click', handleAnchor));
      revealObserver.disconnect();
      counterObserver.disconnect();
      mutationObserver.disconnect();
      clearTimeout(revealFallback);
    };
  }, [pathname]);

  return null;
}