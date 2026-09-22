'use client';

import { useState } from 'react';

export default function NewsImage({
  src,
  alt,
  fallbackIcon,
  className,
}: {
  src: string;
  alt: string;
  fallbackIcon?: string;
  className?: string;
}) {
  const [broken, setBroken] = useState(false);

  if (broken || !src) {
    return (
      <div
        className={className}
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
          className={fallbackIcon || 'fa-solid fa-newspaper'}
          style={{ fontSize: '3rem', color: 'rgba(6,40,61,0.28)' }}
        />
      </div>
    );
  }

  return (
    <img
      src={src}
      alt={alt}
      className={className}
      onError={() => setBroken(true)}
      loading="lazy"
    />
  );
}