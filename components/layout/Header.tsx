'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';

const FALLBACK_HEADER = {
  logo: '/images/sea-logo-2025.jpg',
  brandName: 'Sudd Environment',
  brandTagline: 'Agency',
  tagline: 'Protecting Nature',
  ctaText: 'Donate',
  ctaLink: '/donate',
  topBarPhone: '+211 912 511 115',
  topBarEmail: 'info@seasouthsudan.org',
  topBarLinks: [
    { label: 'Careers', href: '/get-involved#careers' },
    { label: 'Volunteer', href: '/get-involved#volunteer' },
  ],
  navLinks: [
    { label: 'Home', href: '/' },
    { label: 'About', href: '/about' },
    { label: 'Programs', href: '/programs' },
    { label: 'Impact', href: '/impact' },
    { label: 'Projects', href: '/projects' },
    { label: 'News', href: '/news' },
    { label: 'Partners', href: '/partners' },
    { label: 'Get Involved', href: '/get-involved' },
    { label: 'Contact', href: '/contact' },
  ],
};

export default function Header() {
  const [header, setHeader] = useState<any>(FALLBACK_HEADER);

  useEffect(() => {
    fetch('/api/settings')
      .then((r) => r.json())
      .then((json) => {
        if (json?.header) {
          setHeader({
            ...FALLBACK_HEADER,
            ...json.header,
            navLinks:
              Array.isArray(json.header.navLinks) && json.header.navLinks.length > 0
                ? json.header.navLinks
                : FALLBACK_HEADER.navLinks,
            topBarLinks:
              Array.isArray(json.header.topBarLinks) && json.header.topBarLinks.length > 0
                ? json.header.topBarLinks
                : FALLBACK_HEADER.topBarLinks,
          });
        }
      })
      .catch(() => {});
  }, []);

  const phoneHref = `tel:${(header.topBarPhone || '').replace(/[^0-9+]/g, '')}`;

  return (
    <>
      {/* TOP BAR */}
      <div className="top-bar">
        <div className="left">
          {header.topBarPhone && (
            <a href={phoneHref}>
              <i className="fa-solid fa-phone" /> {header.topBarPhone}
            </a>
          )}
          {header.topBarEmail && (
            <>
              <span className="sep">|</span>
              <a href={`mailto:${header.topBarEmail}`}>
                <i className="fa-solid fa-envelope" /> {header.topBarEmail}
              </a>
            </>
          )}
        </div>
        <div className="right">
          {(header.topBarLinks || []).map((l: any, i: number) => (
            <Link key={i} href={l.href}>
              {l.label}
            </Link>
          ))}
          {header.ctaText && (
            <Link
              href={header.ctaLink || '/donate'}
              style={{
                background: 'var(--gold)',
                color: 'var(--navy)',
                padding: '6px 16px',
                borderRadius: 999,
                fontWeight: 700,
              }}
            >
              Donate Now <i className="fa-solid fa-heart" />
            </Link>
          )}
        </div>
      </div>

      {/* NAVBAR */}
      <nav id="mainNav" className="navbar">
        <Link href="/" className="logo">
          <div className="logo-image-container">
            <img
              src={header.logo || '/images/sea-logo-2025.jpg'}
              alt={header.brandName || 'SEA Logo'}
              className="logo-image"
            />
          </div>
          <span>
            {header.brandName || 'Sudd Environment'}
            <br />
            {header.brandTagline || 'Agency'}
          </span>
        </Link>

        <ul className="nav-links">
          {(header.navLinks || []).map((l: any, i: number) => (
            <li key={i}>
              <Link href={l.href} className="nav-link">
                {l.label}
              </Link>
            </li>
          ))}
          <li>
            <Link href={header.ctaLink || '/donate'} className="nav-cta">
              {header.ctaText || 'Donate'}{' '}
              <i className="fa-solid fa-heart" style={{ fontSize: '0.75rem', marginLeft: 6 }} />
            </Link>
          </li>
        </ul>

        <button id="mobileMenuBtn" className="mobile-toggle" aria-label="Toggle menu">
          <i className="fa-solid fa-bars text-2xl" />
        </button>
      </nav>

      {/* MOBILE MENU */}
      <div id="mobileMenu" className="mobile-menu">
        {(header.navLinks || []).map((l: any, i: number) => (
          <Link key={i} href={l.href}>
            {l.label}
          </Link>
        ))}
        <Link href={header.ctaLink || '/donate'} style={{ color: 'var(--gold)', fontWeight: 700 }}>
          {header.ctaText || 'Donate'}
        </Link>
      </div>
    </>
  );
}