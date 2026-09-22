'use client';

import { useState } from 'react';

export default function ProjectImage({
  src,
  alt,
  fallbackIcon,
}: {
  src: string;
  alt: string;
  fallbackIcon: string;
}) {
  const [broken, setBroken] = useState(false);

  if (broken || !src) {
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