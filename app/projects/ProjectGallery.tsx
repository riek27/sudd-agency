'use client';

import { useState } from 'react';

export default function ProjectGallery({
  images,
  title,
  fallbackIcon,
}: {
  images: string[];
  title: string;
  fallbackIcon?: string;
}) {
  const [broken, setBroken] = useState<Record<number, boolean>>({});

  const validImages = (images || []).filter((img, i) => img && !broken[i]);

  if (validImages.length === 0) {
    return (
      <div
        style={{
          width: '100%',
          height: '100%',
          background: 'rgba(6,40,61,0.08)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <i
          className={fallbackIcon || 'fa-solid fa-leaf'}
          style={{ fontSize: '2.5rem', color: 'rgba(6,40,61,0.32)' }}
        />
      </div>
    );
  }

  const markBroken = (originalIndex: number) =>
    setBroken((b) => ({ ...b, [originalIndex]: true }));

  /* ---------- Single image ---------- */
  if (validImages.length === 1) {
    return (
      <img
        src={validImages[0]}
        alt={title}
        loading="lazy"
        style={{ width: '100%', height: '100%', objectFit: 'cover' }}
        onError={() => {
          const idx = images.indexOf(validImages[0]);
          if (idx >= 0) markBroken(idx);
        }}
      />
    );
  }

  /* ---------- 2+ images ---------- */
  const count = validImages.length;
  const layout = count >= 4 ? 'grid-4' : count === 3 ? 'grid-3' : 'grid-2';
  const visible = validImages.slice(0, 4);
  const extra = count - 4;

  return (
    <div className={`pg-gallery pg-${layout}`}>
      {visible.map((img, i) => (
        <div key={i} className="pg-cell">
          <img
            src={img}
            alt={`${title} ${i + 1}`}
            loading="lazy"
            onError={() => {
              const idx = images.indexOf(img);
              if (idx >= 0) markBroken(idx);
            }}
          />
          {i === 3 && extra > 0 && (
            <div className="pg-more">+{extra} more</div>
          )}
        </div>
      ))}

      <style>{`
        .pg-gallery {
          width: 100%;
          height: 100%;
          display: grid;
          gap: 3px;
          background: #0A0F1F;
        }
        .pg-grid-2 {
          grid-template-columns: 1fr 1fr;
        }
        .pg-grid-3 {
          grid-template-columns: 2fr 1fr;
          grid-template-rows: 1fr 1fr;
        }
        .pg-grid-3 .pg-cell:first-child {
          grid-row: span 2;
        }
        .pg-grid-4 {
          grid-template-columns: 1fr 1fr;
          grid-template-rows: 1fr 1fr;
        }
        .pg-cell {
          position: relative;
          overflow: hidden;
          background: #0A0F1F;
        }
        .pg-cell img {
          width: 100%;
          height: 100%;
          object-fit: cover;
          display: block;
          transition: transform 0.4s ease;
        }
        .pg-cell:hover img {
          transform: scale(1.06);
        }
        .pg-more {
          position: absolute;
          inset: 0;
          background: rgba(6,40,61,0.72);
          color: #fff;
          display: flex;
          align-items: center;
          justify-content: center;
          font-family: 'Inter', sans-serif;
          font-size: 1.1rem;
          font-weight: 800;
          letter-spacing: 0.5px;
          backdrop-filter: blur(2px);
        }
      `}</style>
    </div>
  );
}