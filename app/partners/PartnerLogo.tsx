'use client';

import { useState } from 'react';

export default function PartnerLogo({
  src,
  alt,
  fallbackIcon,
}: {
  src: string;
  alt: string;
  fallbackIcon?: string;
}) {
  const [broken, setBroken] = useState(false);

  if (broken || !src) {
    return (
      <div
        style={{
          width: 60,
          height: 60,
          borderRadius: 14,
          background: 'rgba(6,40,61,0.06)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <i
          className={fallbackIcon || 'fa-solid fa-handshake'}
          style={{ fontSize: '1.6rem', color: 'var(--navy)' }}
        />
      </div>
    );
  }

  return (
    <img
      src={src}
      alt={alt}
      style={{ height: 60, width: 'auto', objectFit: 'contain' }}
      onError={() => setBroken(true)}
      loading="lazy"
    />
  );
}