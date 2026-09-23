'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';

const FALLBACK_FOOTER = {
  aboutText:
    'Sudd Environment Agency (SEA) is a locally led, indigenous non-profit organization advocating for the protection of the Sudd Wetlands, climate action, wildlife conservation, and sustainable livelihoods across South Sudan.',
  columns: [
    {
      title: 'Quick Links',
      links: [
        { label: 'Home', href: '/' },
        { label: 'About', href: '/about' },
        { label: 'Programs', href: '/programs' },
        { label: 'Projects', href: '/projects' },
        { label: 'News', href: '/news' },
        { label: 'Get Involved', href: '/get-involved' },
      ],
    },
    {
      title: 'Focus Areas',
      links: [
        { label: 'Wetlands Advocacy', href: '/programs#wetlands-advocacy' },
        { label: 'Climate Action', href: '/programs#climate-action' },
        { label: 'Wildlife Conservation', href: '/programs#wildlife-advocacy' },
        { label: 'Agroforestry', href: '/programs#agroforestry' },
        { label: 'Humanitarian Response', href: '/programs#humanitarian' },
      ],
    },
  ],
  socialLinks: [
    { icon: 'fa-brands fa-facebook-f', label: 'Facebook', url: 'https://www.facebook.com', className: 'facebook' },
    { icon: 'fa-brands fa-x-twitter', label: 'Twitter / X', url: 'https://www.twitter.com', className: 'twitter' },
    { icon: 'fa-brands fa-instagram', label: 'Instagram', url: 'https://www.instagram.com', className: 'instagram' },
    { icon: 'fa-brands fa-linkedin-in', label: 'LinkedIn', url: 'https://www.linkedin.com', className: 'linkedin' },
  ],
  copyrightText: 'Sudd Environment Agency. All rights reserved.',
  creditText: 'Registered National NGO No. 2360, South Sudan',
  creditLink: '/about',
};

const FALLBACK_SITE = {
  name: 'Sudd Environment Agency',
  tagline: 'Protecting Nature',
  logo: '/images/sea-logo-2025.jpg',
};

export default function Footer() {
  const [footer, setFooter] = useState<any>(FALLBACK_FOOTER);
  const [site, setSite] = useState<any>(FALLBACK_SITE);

  useEffect(() => {
    fetch('/api/settings')
      .then((r) => r.json())
      .then((json) => {
        if (json?.footer) {
          setFooter({
            ...FALLBACK_FOOTER,
            ...json.footer,
            columns:
              Array.isArray(json.footer.columns) && json.footer.columns.length > 0
                ? json.footer.columns
                : FALLBACK_FOOTER.columns,
            socialLinks:
              Array.isArray(json.footer.socialLinks) && json.footer.socialLinks.length > 0
                ? json.footer.socialLinks
                : FALLBACK_FOOTER.socialLinks,
          });
        }
        if (json?.site) setSite({ ...FALLBACK_SITE, ...json.site });
      })
      .catch(() => {});
  }, []);

  const columns: any[] = footer.columns || [];

  return (
    <footer className="footer">
      <div className="footer-grid">
        <div className="footer-about">
          <Link href="/" className="footer-brand">
            <img src={site.logo || '/images/sea-logo-2025.jpg'} alt={site.name || 'SEA'} />
            <span className="footer-brand-text">
              <strong>{site.name || 'Sudd Environment Agency'}</strong>
              <span>{site.tagline || 'Protecting Nature'}</span>
            </span>
          </Link>
          <p>{footer.aboutText}</p>

          <div className="footer-socials">
            {(footer.socialLinks || []).map((s: any, i: number) => (
              <a
                key={i}
                href={s.url}
                className={s.className || ''}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={s.label}
              >
                <i className={s.icon} />
              </a>
            ))}
          </div>
        </div>

        {columns.map((col: any, ci: number) => (
          <div className="footer-col" key={ci}>
            <h4>{col.title}</h4>
            <ul className="footer-links">
              {(col.links || []).map((link: any, li: number) => (
                <li key={li}>
                  {link.icon ? (
                    <a
                      className="footer-contact"
                      href={link.href}
                      target={link.href?.startsWith('http') ? '_blank' : undefined}
                      rel={link.href?.startsWith('http') ? 'noopener noreferrer' : undefined}
                    >
                      <i className={link.icon} />
                      <span>{link.label}</span>
                    </a>
                  ) : link.href?.startsWith('http') ? (
                    <a href={link.href} target="_blank" rel="noopener noreferrer">
                      {link.label}
                    </a>
                  ) : (
                    <Link href={link.href || '/'}>{link.label}</Link>
                  )}
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>

      <div className="footer-bottom">
        <p>
          &copy; {new Date().getFullYear()}{' '}
          {footer.copyrightText || 'Sudd Environment Agency. All rights reserved.'}
          {footer.creditText && (
            <>
              <span style={{ opacity: 0.5, margin: '0 8px' }}>|</span>
              <Link href={footer.creditLink || '/about'}>
                {footer.creditText}
              </Link>
            </>
          )}
        </p>
      </div>
    </footer>
  );
}