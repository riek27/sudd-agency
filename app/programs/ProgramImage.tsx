'use client';

import { useState } from 'react';

export default function ProgramImage({
  src,
  alt,
  fallbackIcon,
  bgTint = 'rgba(6,40,61,0.1)',
}: {
  src: string;
  alt: string;
  fallbackIcon: string;
  bgTint?: string;
}) {
  const [broken, setBroken] = useState(false);

  if (broken || !src) {
    return (
      <div
        style={{
          width: '100%',
          height: '100%',
          background: bgTint,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <i
          className={fallbackIcon}
          style={{ fontSize: '2.5rem', color: 'rgba(6,40,61,0.35)' }}
        />
      </div>
    );
  }

  return (
    <img
      src={src}
      alt={alt}
      onError={() => setBroken(true)}
      loading="lazy"
    />
  );
}