'use client';

import { useState } from 'react';
import Link from 'next/link';
import NewsImage from './NewsImage';

export default function NewsCard({
  article,
  variant = 'card',
}: {
  article: any;
  variant?: 'featured' | 'card';
}) {
  const [open, setOpen] = useState(false);
  const isFeatured = variant === 'featured';

  if (isFeatured) {
    return (
      <div className="two-col reveal">
        <div className="two-col-img">
          <NewsImage
            src={article.image}
            alt={article.title}
            fallbackIcon={article.fallbackIcon}
          />
        </div>

        <div>
          <span
            style={{
              display: 'inline-block',
              background: 'rgba(212,160,23,0.18)',
              color: '#B8860B',
              fontSize: '0.72rem',
              fontWeight: 800,
              letterSpacing: '1.6px',
              textTransform: 'uppercase',
              padding: '6px 16px',
              borderRadius: 999,
              marginBottom: 20,
            }}
          >
            {article.badge || 'Featured'}
          </span>

          <h2
            style={{
              fontFamily: 'Playfair Display, serif',
              fontSize: 'clamp(1.8rem, 3vw, 2.4rem)',
              fontWeight: 700,
              color: 'var(--navy)',
              lineHeight: 1.2,
              margin: '0 0 16px',
            }}
          >
            {article.title}
          </h2>

          <p
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: 8,
              color: 'var(--gray-600)',
              fontSize: '0.88rem',
              marginBottom: 18,
            }}
          >
            <i
              className="fa-regular fa-calendar"
              style={{ color: 'var(--gold)' }}
            />
            {article.date}
          </p>

          <p
            style={{
              color: 'var(--gray-600)',
              fontSize: '1.02rem',
              lineHeight: 1.8,
              margin: '0 0 20px',
            }}
          >
            {article.excerpt}
          </p>

          {/* Expanded body */}
          <div className={`nc-expand ${open ? 'open' : ''}`} aria-hidden={!open}>
            <div className="nc-expand-inner">
              {(article.body || '')
                .split('\n\n')
                .filter(Boolean)
                .map((p: string, i: number) => (
                  <p
                    key={i}
                    style={{
                      color: 'var(--gray-600)',
                      fontSize: '1.02rem',
                      lineHeight: 1.8,
                      margin: '0 0 16px',
                    }}
                  >
                    {p}
                  </p>
                ))}
            </div>
          </div>

          <div
            style={{
              display: 'flex',
              gap: 12,
              flexWrap: 'wrap',
              marginTop: 8,
            }}
          >
            {article.body && (
              <button
                type="button"
                onClick={() => setOpen((v) => !v)}
                className={`nc-toggle ${open ? 'is-open' : ''}`}
              >
                {open ? 'Read Less' : 'Read More'}
                <i
                  className={`fa-solid fa-chevron-${open ? 'up' : 'down'}`}
                  style={{ fontSize: '0.7rem' }}
                />
              </button>
            )}
            {article.ctaText && (
              <Link href={article.ctaLink} className="btn btn-gold">
                {article.ctaText}{' '}
                <i className="fa-solid fa-arrow-right" />
              </Link>
            )}
          </div>
        </div>
      </div>
    );
  }

  /* ---- Card variant ---- */
  return (
    <article className="news-card">
      <div className="news-img">
        <NewsImage
          src={article.image}
          alt={article.title}
          fallbackIcon={article.fallbackIcon}
        />
      </div>
      <div
        style={{
          padding: '24px 22px 26px',
          display: 'flex',
          flexDirection: 'column',
          flex: 1,
        }}
      >
        <div className="project-date">
          <i className="fa-regular fa-calendar" /> {article.date}
        </div>
        <h3
          style={{
            fontFamily: 'Playfair Display, serif',
            fontSize: '1.15rem',
            fontWeight: 600,
            color: 'var(--navy)',
            marginBottom: 10,
            lineHeight: 1.35,
          }}
        >
          {article.title}
        </h3>
        <p
          style={{
            color: 'var(--gray-600)',
            fontSize: '0.88rem',
            lineHeight: 1.65,
            margin: '0 0 14px',
          }}
        >
          {article.excerpt}
        </p>

        {/* Expanded body */}
        <div className={`nc-expand ${open ? 'open' : ''}`} aria-hidden={!open}>
          <div className="nc-expand-inner">
            {(article.body || '')
              .split('\n\n')
              .filter(Boolean)
              .map((p: string, i: number) => (
                <p
                  key={i}
                  style={{
                    color: 'var(--gray-600)',
                    fontSize: '0.88rem',
                    lineHeight: 1.7,
                    margin: '0 0 12px',
                  }}
                >
                  {p}
                </p>
              ))}
          </div>
        </div>

        <div
          style={{
            display: 'flex',
            gap: 10,
            flexWrap: 'wrap',
            marginTop: 'auto',
            paddingTop: 8,
          }}
        >
          {article.body && (
            <button
              type="button"
              onClick={() => setOpen((v) => !v)}
              className={`nc-toggle nc-toggle--small ${open ? 'is-open' : ''}`}
            >
              {open ? 'Read Less' : 'Read More'}
              <i
                className={`fa-solid fa-chevron-${open ? 'up' : 'down'}`}
                style={{ fontSize: '0.65rem' }}
              />
            </button>
          )}
          {article.linkText && article.link && (
            <Link
              href={article.link}
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: 6,
                color: 'var(--gold)',
                fontSize: '0.82rem',
                fontWeight: 700,
                textDecoration: 'none',
                alignSelf: 'center',
              }}
            >
              {article.linkText}{' '}
              <i
                className="fa-solid fa-arrow-right"
                style={{ fontSize: '0.7rem' }}
              />
            </Link>
          )}
        </div>
      </div>

      <style>{`
        .nc-expand {
          display: grid;
          grid-template-rows: 0fr;
          transition: grid-template-rows 0.5s cubic-bezier(0.22, 1, 0.36, 1),
            margin-top 0.5s ease, opacity 0.4s ease;
          opacity: 0;
          margin-top: 0;
        }
        .nc-expand.open {
          grid-template-rows: 1fr;
          opacity: 1;
          margin-top: 14px;
        }
        .nc-expand-inner {
          overflow: hidden;
          min-height: 0;
        }
        .nc-toggle {
          display: inline-flex;
          align-items: center;
          gap: 8px;
          padding: 11px 22px;
          background: transparent;
          border: 1.5px solid var(--gold);
          color: #B8860B;
          border-radius: 999px;
          font-family: 'Inter', sans-serif;
          font-size: 0.85rem;
          font-weight: 700;
          cursor: pointer;
          transition: all 0.25s ease;
          letter-spacing: 0.3px;
        }
        .nc-toggle:hover {
          background: var(--gold);
          color: #06283D;
          box-shadow: 0 10px 22px rgba(212,160,23,0.28);
        }
        .nc-toggle.is-open {
          background: var(--navy);
          color: #fff;
          border-color: var(--navy);
        }
        .nc-toggle--small {
          padding: 8px 16px;
          font-size: 0.78rem;
        }
      `}</style>
    </article>
  );
}