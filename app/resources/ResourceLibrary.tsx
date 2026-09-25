'use client';

import { useMemo, useState } from 'react';

interface Props {
  resources: any[];
  categories: any[];
  library: any;
}

export default function ResourceLibrary({ resources, categories, library }: Props) {
  const [query, setQuery] = useState('');
  const [activeCat, setActiveCat] = useState<string>('all');
  const [downloadingId, setDownloadingId] = useState<string | null>(null);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return (resources || []).filter((r: any) => {
      const matchCat = activeCat === 'all' || r.category === activeCat;
      const matchSearch =
        !q ||
        (r.title || '').toLowerCase().includes(q) ||
        (r.description || '').toLowerCase().includes(q);
      return matchCat && matchSearch;
    });
  }, [resources, query, activeCat]);

  const hasResources = (resources || []).length > 0;

  /* ---------- DOWNLOAD HANDLER ---------- */
  const handleDownload = async (r: any) => {
    if (!r.fileUrl) return;
    setDownloadingId(r.id);

    const ext = (r.fileType || r.fileUrl.split('.').pop() || 'pdf').toLowerCase();
    const safeTitle = (r.title || 'document')
      .replace(/[^a-zA-Z0-9 _-]/g, '')
      .trim()
      .replace(/\s+/g, '-');
    const filename = `${safeTitle}.${ext}`;

    try {
      const res = await fetch(r.fileUrl);
      if (!res.ok) throw new Error('Download failed');

      const blob = await res.blob();
      const objectUrl = URL.createObjectURL(blob);

      const a = document.createElement('a');
      a.href = objectUrl;
      a.download = filename;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);

      setTimeout(() => URL.revokeObjectURL(objectUrl), 1000);
    } catch (err) {
      console.error('Download failed:', err);
      window.open(r.fileUrl, '_blank', 'noopener,noreferrer');
    } finally {
      setDownloadingId(null);
    }
  };

  return (
    <div className="rl-wrap">
      {/* SEARCH + FILTER CONTROLS */}
      <div className="rl-controls">
        <div className="rl-search">
          <i className="fas fa-search" />
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder={library?.searchPlaceholder || 'Search resources...'}
          />
          {query && (
            <button
              type="button"
              onClick={() => setQuery('')}
              className="rl-clear"
              aria-label="Clear search"
            >
              <i className="fas fa-times" />
            </button>
          )}
        </div>

        {/* Dropdown for mobile + chips for desktop */}
        <div className="rl-dropdown-wrap">
          <label className="rl-dropdown-label">Filter by Category</label>
          <select
            className="rl-dropdown"
            value={activeCat}
            onChange={(e) => setActiveCat(e.target.value)}
          >
            <option value="all">
              {library?.allLabel || 'All Categories'} ({(resources || []).length})
            </option>
            {categories.map((c: any) => {
              const count = (resources || []).filter(
                (r: any) => r.category === c.id
              ).length;
              return (
                <option key={c.id} value={c.id}>
                  {c.title} ({count})
                </option>
              );
            })}
          </select>
        </div>

        <div className="rl-filters">
          <button
            type="button"
            className={`rl-chip ${activeCat === 'all' ? 'is-active' : ''}`}
            onClick={() => setActiveCat('all')}
          >
            {library?.allLabel || 'All'}
            <span className="rl-chip-count">{(resources || []).length}</span>
          </button>
          {categories.map((c: any) => {
            const count = (resources || []).filter(
              (r: any) => r.category === c.id
            ).length;
            return (
              <button
                key={c.id}
                type="button"
                className={`rl-chip ${activeCat === c.id ? 'is-active' : ''}`}
                onClick={() => setActiveCat(c.id)}
              >
                <i
                  className={c.icon}
                  style={{ color: c.accent, marginRight: 6, fontSize: 12 }}
                />
                {c.title}
                <span className="rl-chip-count">{count}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* RESULTS */}
      {!hasResources ? (
        <div className="rl-empty">
          <div className="rl-empty-icon">
            <i className="fas fa-folder-open" />
          </div>
          <h3>{library?.emptyTitle || 'Resources coming soon'}</h3>
          <p>{library?.emptyText}</p>
        </div>
      ) : filtered.length === 0 ? (
        <div className="rl-empty">
          <div className="rl-empty-icon">
            <i className="fas fa-search" />
          </div>
          <h3>No results found</h3>
          <p>Try a different search term or category.</p>
        </div>
      ) : (
        <div className="rl-grid">
          {filtered.map((r: any) => {
            const cat = categories.find((c: any) => c.id === r.category);
            const accent = cat?.accent || '#0D9488';
            const isDownloading = downloadingId === r.id;

            return (
              <article key={r.id} className="rl-card">
                <div className="rl-card-top">
                  <div
                    className="rl-card-icon"
                    style={{
                      background: `linear-gradient(135deg, ${accent}22, ${accent}0A)`,
                      color: accent,
                      borderColor: `${accent}33`,
                    }}
                  >
                    <i className={cat?.icon || 'fas fa-file'} />
                  </div>
                  <div className="rl-card-meta">
                    <span
                      className="rl-cat-tag"
                      style={{
                        background: `${accent}15`,
                        color: accent,
                        borderColor: `${accent}33`,
                      }}
                    >
                      {cat?.title || 'Document'}
                    </span>
                    <div className="rl-card-sub">
                      {r.fileType && <span className="rl-type">{r.fileType}</span>}
                      {r.fileSize && <span>· {r.fileSize}</span>}
                      {r.date && <span>· {r.date}</span>}
                    </div>
                  </div>
                </div>

                <h3 className="rl-card-title">{r.title}</h3>
                {r.description && <p className="rl-card-desc">{r.description}</p>}

                <div className="rl-card-actions">
                  {r.fileUrl ? (
                    <>
                      <a
                        href={r.fileUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="rl-btn rl-btn-view"
                      >
                        <i className="fas fa-eye" /> {library?.viewText || 'View'}
                      </a>
                      <button
                        type="button"
                        onClick={() => handleDownload(r)}
                        disabled={isDownloading}
                        className="rl-btn rl-btn-download"
                      >
                        {isDownloading ? (
                          <>
                            <i className="fas fa-circle-notch fa-spin" /> Downloading…
                          </>
                        ) : (
                          <>
                            <i className="fas fa-download" />{' '}
                            {library?.downloadText || 'Download'}
                          </>
                        )}
                      </button>
                    </>
                  ) : (
                    <span className="rl-unavailable">Not yet available</span>
                  )}
                </div>
              </article>
            );
          })}
        </div>
      )}

      <style>{`
        .rl-wrap { display: flex; flex-direction: column; gap: 32px; }

        .rl-controls {
          display: flex; flex-direction: column; gap: 18px;
          max-width: 1000px; margin: 0 auto; width: 100%;
        }

        .rl-search {
          position: relative;
          display: flex; align-items: center;
          background: #fff; border: 1.5px solid #E5E7EB;
          border-radius: 14px; padding: 0 18px;
          box-shadow: 0 4px 14px rgba(6,40,61,0.04);
          transition: border-color .25s, box-shadow .25s;
        }
        .rl-search:focus-within {
          border-color: var(--teal);
          box-shadow: 0 8px 24px rgba(13,148,136,0.14);
        }
        .rl-search > i {
          color: var(--gray-600); font-size: 15px; margin-right: 12px;
        }
        .rl-search input {
          flex: 1; border: none; outline: none;
          padding: 16px 0; font-size: 15px;
          font-family: 'Inter', sans-serif;
          color: var(--navy); background: transparent;
        }
        .rl-clear {
          background: #F3F4F6; border: none; color: #6B7280;
          width: 26px; height: 26px; border-radius: 50%;
          cursor: pointer; display: flex; align-items: center;
          justify-content: center; font-size: 11px;
        }
        .rl-clear:hover { background: #E5E7EB; color: #111; }

        /* Dropdown (mobile-friendly) */
        .rl-dropdown-wrap {
          display: none;
          flex-direction: column;
          gap: 6px;
        }
        .rl-dropdown-label {
          font-family: 'Inter', sans-serif;
          font-size: 0.78rem;
          font-weight: 700;
          letter-spacing: 1.2px;
          text-transform: uppercase;
          color: var(--gray-600);
        }
        .rl-dropdown {
          width: 100%;
          padding: 14px 16px;
          border-radius: 12px;
          border: 1.5px solid #E5E7EB;
          background: #fff;
          font-family: 'Inter', sans-serif;
          font-size: 0.95rem;
          font-weight: 600;
          color: var(--navy);
          cursor: pointer;
          outline: none;
          appearance: none;
          background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='8' viewBox='0 0 12 8'%3E%3Cpath fill='%2306283D' d='M6 8L0 2l1.4-1.4L6 5.2 10.6.6 12 2z'/%3E%3C/svg%3E");
          background-repeat: no-repeat;
          background-position: right 18px center;
          padding-right: 44px;
        }
        .rl-dropdown:focus { border-color: var(--teal); }

        .rl-filters {
          display: flex; flex-wrap: wrap; gap: 8px;
          justify-content: center;
        }
        .rl-chip {
          display: inline-flex; align-items: center; gap: 8px;
          padding: 9px 16px; border-radius: 999px;
          border: 1.5px solid #E5E7EB; background: #fff;
          color: var(--navy); font-family: 'Inter', sans-serif;
          font-size: 13px; font-weight: 600; cursor: pointer;
          transition: all .25s ease;
        }
        .rl-chip:hover {
          border-color: var(--teal); color: var(--teal);
        }
        .rl-chip.is-active {
          background: var(--navy); color: #fff;
          border-color: var(--navy);
          box-shadow: 0 8px 20px rgba(6,40,61,0.20);
        }
        .rl-chip.is-active i { color: #fff !important; }
        .rl-chip-count {
          background: rgba(0,0,0,0.08);
          border-radius: 999px; padding: 1px 8px;
          font-size: 11px; font-weight: 700;
        }
        .rl-chip.is-active .rl-chip-count {
          background: rgba(255,255,255,0.22);
        }

        .rl-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(320px, 1fr));
          gap: 22px;
        }

        .rl-card {
          background: #fff;
          border: 1px solid #EEF2F5;
          border-radius: 18px;
          padding: 26px 24px 22px;
          display: flex; flex-direction: column;
          transition: transform .35s ease, box-shadow .35s ease, border-color .35s ease;
          position: relative; overflow: hidden;
        }
        .rl-card::before {
          content: '';
          position: absolute; left: 0; top: 0; bottom: 0;
          width: 4px;
          background: linear-gradient(180deg, var(--teal), var(--gold));
          transform: scaleY(0); transform-origin: top;
          transition: transform .4s ease;
        }
        .rl-card:hover {
          transform: translateY(-5px);
          box-shadow: 0 20px 45px rgba(6,40,61,0.10);
          border-color: rgba(13,148,136,0.22);
        }
        .rl-card:hover::before { transform: scaleY(1); }

        .rl-card-top {
          display: flex; align-items: center; gap: 14px;
          margin-bottom: 18px;
        }
        .rl-card-icon {
          width: 52px; height: 52px; border-radius: 14px;
          display: flex; align-items: center; justify-content: center;
          font-size: 22px; border: 1.5px solid; flex-shrink: 0;
          transition: transform .35s ease;
        }
        .rl-card:hover .rl-card-icon { transform: scale(1.06); }

        .rl-card-meta {
          display: flex; flex-direction: column; gap: 4px; min-width: 0;
        }
        .rl-cat-tag {
          display: inline-block; align-self: flex-start;
          font-family: 'Inter', sans-serif;
          font-size: 10.5px; font-weight: 800;
          letter-spacing: 1.4px; text-transform: uppercase;
          padding: 4px 10px; border-radius: 999px; border: 1px solid;
        }
        .rl-card-sub {
          font-size: 11.5px; color: var(--gray-600);
          display: flex; gap: 5px; align-items: center;
        }
        .rl-type {
          font-weight: 700; color: var(--navy);
          letter-spacing: 0.4px;
        }

        .rl-card-title {
          font-family: 'Playfair Display', serif;
          font-size: 17px; font-weight: 700;
          color: var(--navy);
          line-height: 1.35; margin: 0 0 10px;
        }
        .rl-card-desc {
          color: var(--gray-600);
          font-size: 13.5px; line-height: 1.6;
          margin: 0 0 20px; flex: 1;
        }

        .rl-card-actions {
          display: flex; gap: 8px; flex-wrap: wrap;
          padding-top: 4px;
        }
        .rl-btn {
          display: inline-flex; align-items: center; gap: 7px;
          padding: 9px 18px; border-radius: 999px;
          font-family: 'Inter', sans-serif;
          font-size: 13px; font-weight: 700;
          text-decoration: none; cursor: pointer;
          transition: all .25s ease;
          border: 1.5px solid transparent;
          background: transparent;
        }
        .rl-btn i { font-size: 11px; }

        .rl-btn-view {
          color: var(--navy);
          border-color: #E5E7EB;
        }
        .rl-btn-view:hover {
          border-color: var(--navy);
          background: var(--navy); color: #fff;
        }

        .rl-btn-download {
          background: linear-gradient(135deg, #D4A017, #e8b830);
          color: #06283D;
          box-shadow: 0 8px 18px rgba(212,160,23,0.25);
          border: none;
        }
        .rl-btn-download:hover:not(:disabled) {
          transform: translateY(-1px);
          box-shadow: 0 12px 26px rgba(212,160,23,0.35);
        }
        .rl-btn-download:disabled {
          opacity: 0.7;
          cursor: wait;
        }

        .rl-unavailable {
          font-size: 12.5px; color: var(--gray-600);
          font-style: italic; padding: 10px 0;
        }

        .rl-empty {
          text-align: center; padding: 70px 20px;
          background: #fff;
          border: 1px dashed #D1D5DB;
          border-radius: 20px;
          max-width: 640px; margin: 0 auto; width: 100%;
        }
        .rl-empty-icon {
          width: 72px; height: 72px; border-radius: 22px;
          background: linear-gradient(135deg, #E0F2F1, #CCFBF1);
          color: var(--teal);
          display: flex; align-items: center; justify-content: center;
          font-size: 30px; margin: 0 auto 18px;
        }
        .rl-empty h3 {
          font-family: 'Playfair Display', serif;
          font-size: 20px; font-weight: 700;
          color: var(--navy); margin: 0 0 8px;
        }
        .rl-empty p {
          color: var(--gray-600);
          font-size: 14.5px; line-height: 1.7; margin: 0;
          max-width: 460px; margin: 0 auto;
        }

        @media (max-width: 768px) {
          .rl-filters { display: none; }
          .rl-dropdown-wrap { display: flex; }
        }

        @media (max-width: 640px) {
          .rl-grid { grid-template-columns: 1fr; gap: 16px; }
          .rl-card { padding: 22px 20px 20px; }
          .rl-empty { padding: 50px 20px; }
        }
      `}</style>
    </div>
  );
}