'use client';

import { useState } from 'react';

const CATEGORY_COLORS: Record<string, { bg: string; color: string; border: string }> = {
  MILESTONE: { bg: '#FEF3C7', color: '#92400E', border: '#FDE68A' },
  AWARENESS: { bg: '#DBEAFE', color: '#1E40AF', border: '#BFDBFE' },
  'FIELD UPDATE': { bg: '#D1FAE5', color: '#065F46', border: '#A7F3D0' },
};

function getCategoryStyle(cat: string) {
  return (
    CATEGORY_COLORS[(cat || '').toUpperCase()] || {
      bg: '#E0F2F1',
      color: '#0D9488',
      border: '#B2DFDB',
    }
  );
}

export default function NewsArticle({ article, variant = 'card' }: { article: any; variant?: 'featured' | 'card' }) {
  const [open, setOpen] = useState(false);
  const cat = getCategoryStyle(article.category);
  const hasImage = !!article.image;
  const isFeatured = variant === 'featured';

  return (
    <article className={`na-card ${isFeatured ? 'na-featured' : ''} ${open ? 'na-open' : ''}`}>
      {hasImage && (
        <div className="na-media">
          <img src={article.image} alt={article.title} loading="lazy" />
          <div className="na-media-overlay" />
          <div className="na-media-badges">
            <span
              className="na-badge"
              style={{ background: cat.bg, color: cat.color, borderColor: cat.border }}
            >
              {article.category}
            </span>
          </div>
        </div>
      )}

      <div className="na-body">
        <div className="na-head">
          {!hasImage && (
            <span
              className="na-badge"
              style={{ background: cat.bg, color: cat.color, borderColor: cat.border }}
            >
              {article.category}
            </span>
          )}
          {article.date && (
            <span className="na-date">
              <i className="far fa-clock" /> {article.date}
            </span>
          )}
        </div>

        <h3 className={`na-title ${isFeatured ? 'na-title-lg' : ''}`}>{article.title}</h3>

        <p className="na-excerpt">{article.excerpt}</p>

        {article.tags?.length > 0 && open && (
          <div className="na-tags">
            {article.tags.map((t: string, i: number) => (
              <span key={i} className="na-tag">{t}</span>
            ))}
          </div>
        )}

        <div className={`na-expand ${open ? 'open' : ''}`} aria-hidden={!open}>
          <div className="na-expand-inner">
            {article.body
              ? article.body.split('\n\n').map((p: string, i: number) => (
                  <p key={i} className="na-body-text">{p}</p>
                ))
              : null}
          </div>
        </div>

        <button
          type="button"
          onClick={() => setOpen((v) => !v)}
          className={`na-toggle ${open ? 'is-open' : ''}`}
          aria-expanded={open}
        >
          <span>{open ? 'Read Less' : 'Read More'}</span>
          <i className={`fas fa-chevron-${open ? 'up' : 'down'}`} />
        </button>
      </div>

      <style>{`
        .na-card {
          background: #fff;
          border-radius: 20px;
          overflow: hidden;
          border: 1px solid #EEF2F5;
          box-shadow: 0 6px 22px rgba(10,15,31,0.05);
          display: flex; flex-direction: column;
          transition: box-shadow .35s ease, transform .35s ease, border-color .35s ease;
          position: relative;
        }
        .na-card:hover {
          box-shadow: 0 22px 50px rgba(10,15,31,0.10);
          border-color: rgba(13,148,136,0.25);
          transform: translateY(-4px);
        }
        .na-featured {
          border-radius: 24px;
          box-shadow: 0 18px 50px rgba(10,15,31,0.09);
        }
        .na-featured:hover { transform: translateY(-2px); }
        .na-featured.na-open { transform: none; }

        .na-media {
          position: relative; width: 100%;
          aspect-ratio: 16 / 10;
          overflow: hidden; background: #0A0F1F;
        }
        .na-featured .na-media { aspect-ratio: 21 / 9; }
        .na-media img {
          width: 100%; height: 100%; object-fit: cover;
          transition: transform .8s ease;
        }
        .na-card:hover .na-media img { transform: scale(1.05); }
        .na-media-overlay {
          position: absolute; inset: 0;
          background: linear-gradient(180deg, rgba(10,15,31,0) 40%, rgba(10,15,31,0.35) 100%);
          pointer-events: none;
        }
        .na-media-badges { position: absolute; top: 16px; left: 16px; z-index: 2; }

        .na-body {
          padding: 28px 26px 26px;
          display: flex; flex-direction: column; flex: 1;
        }
        .na-featured .na-body { padding: 40px 44px 38px; }

        .na-head {
          display: flex; align-items: center; gap: 12px;
          flex-wrap: wrap; margin-bottom: 14px;
        }
        .na-badge {
          display: inline-flex; align-items: center;
          font-family: 'Poppins', sans-serif;
          font-size: 10.5px; font-weight: 800;
          letter-spacing: 1.6px; text-transform: uppercase;
          padding: 6px 12px; border-radius: 999px; border: 1px solid;
        }
        .na-date {
          display: inline-flex; align-items: center; gap: 6px;
          font-size: 12.5px; color: var(--gray-600); font-weight: 500;
        }

        .na-title {
          font-family: 'Poppins', sans-serif;
          font-size: 20px; font-weight: 700;
          line-height: 1.35; color: var(--navy-900);
          margin: 0 0 12px;
        }
        .na-title-lg {
          font-size: clamp(24px, 2.8vw, 34px);
          line-height: 1.25; margin-bottom: 16px;
        }

        .na-excerpt {
          color: var(--gray-600);
          font-size: 14.5px; line-height: 1.7; margin: 0;
        }
        .na-featured .na-excerpt { font-size: 16px; line-height: 1.75; }

        .na-tags {
          display: flex; flex-wrap: wrap; gap: 8px;
          margin-top: 18px; animation: na-fade .4s ease;
        }
        .na-tag {
          font-size: 12.5px; font-weight: 600;
          color: var(--teal); background: #E0F2F1;
          padding: 5px 12px; border-radius: 999px;
        }

        .na-expand {
          display: grid; grid-template-rows: 0fr;
          transition: grid-template-rows .5s cubic-bezier(.22,1,.36,1), margin-top .5s ease, opacity .4s ease;
          opacity: 0;
        }
        .na-expand.open { grid-template-rows: 1fr; opacity: 1; margin-top: 20px; }
        .na-expand-inner { overflow: hidden; min-height: 0; }
        .na-body-text {
          color: var(--gray-600); font-size: 14.5px;
          line-height: 1.8; margin: 0 0 14px;
        }
        .na-body-text:last-child { margin-bottom: 0; }
        .na-featured .na-body-text { font-size: 15.5px; }

        .na-toggle {
          margin-top: 22px; align-self: flex-start;
          display: inline-flex; align-items: center; gap: 10px;
          padding: 11px 22px; background: transparent;
          border: 1.5px solid var(--teal); color: var(--teal);
          border-radius: 999px;
          font-family: 'Poppins', sans-serif;
          font-size: 13.5px; font-weight: 700; letter-spacing: .4px;
          cursor: pointer;
          transition: background .3s, color .3s, box-shadow .3s;
        }
        .na-toggle:hover {
          background: var(--teal); color: #fff;
          box-shadow: 0 10px 24px rgba(13,148,136,0.28);
        }
        .na-toggle i { font-size: 11px; }
        .na-toggle.is-open {
          background: var(--navy-900); color: #fff; border-color: var(--navy-900);
        }

        @keyframes na-fade {
          from { opacity: 0; transform: translateY(-4px); }
          to { opacity: 1; transform: translateY(0); }
        }

        @media (max-width: 640px) {
          .na-featured .na-body { padding: 26px 22px 24px; }
          .na-featured .na-media { aspect-ratio: 16 / 10; }
          .na-body { padding: 22px 20px 22px; }
        }
      `}</style>
    </article>
  );
}