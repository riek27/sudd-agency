'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';

const NAV_LINKS = [
  { label: 'Home', href: '/' },
  { label: 'About', href: '/about' },
  { label: 'Programs', href: '/programs' },
  { label: 'Impact', href: '/impact' },
  { label: 'Projects', href: '/projects' },
  { label: 'News', href: '/news' },
  { label: 'Partners', href: '/partners' },
  { label: 'Get Involved', href: '/get-involved' },
  { label: 'Contact', href: '/contact' },
];

export default function Header() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 30);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => {
    document.body.style.overflow = menuOpen ? 'hidden' : '';
    return () => { document.body.style.overflow = ''; };
  }, [menuOpen]);

  return (
    <>
      {/* TOP BAR */}
      <div className="top-bar">
        <div className="left">
          <a href="tel:+211912511115">
            <i className="fa-solid fa-phone" /> +211 912 511 115
          </a>
          <span className="sep">|</span>
          <a href="mailto:info@seasouthsudan.org">
            <i className="fa-solid fa-envelope" /> info@seasouthsudan.org
          </a>
        </div>
        <div className="right">
          <a href="/get-involved">Volunteer</a>
          <a href="/donate" style={{ background: 'var(--gold)', color: 'var(--navy)', padding: '6px 16px', borderRadius: 999, fontWeight: 700 }}>
            Donate Now <i className="fa-solid fa-heart" />
          </a>
        </div>
      </div>

      {/* NAVBAR */}
      <nav className={`navbar ${scrolled ? 'scrolled' : ''}`}>
        <Link href="/" className="logo">
          <img src="/images/sealogo.jpg" alt="SEA Logo" />
          <span>Sudd Environment<br />Agency</span>
        </Link>

        <ul className="nav-links">
          {NAV_LINKS.map((l) => (
            <li key={l.href}>
              <Link href={l.href}>{l.label}</Link>
            </li>
          ))}
          <li>
            <Link href="/donate" className="nav-cta">
              Donate <i className="fa-solid fa-heart" style={{ fontSize: '0.75rem', marginLeft: 6 }} />
            </Link>
          </li>
        </ul>

        <button className="mobile-toggle" aria-label="Toggle menu" onClick={() => setMenuOpen(!menuOpen)}>
          <span /><span /><span />
        </button>
      </nav>

      {/* MOBILE MENU */}
      <div className={`mobile-menu ${menuOpen ? 'active' : ''}`}>
        {NAV_LINKS.map((l) => (
          <Link key={l.href} href={l.href} onClick={() => setMenuOpen(false)}>
            {l.label}
          </Link>
        ))}
        <Link
          href="/donate"
          onClick={() => setMenuOpen(false)}
          style={{ color: 'var(--gold)', fontWeight: 700 }}
        >
          Donate
        </Link>
      </div>
    </>
  );
}