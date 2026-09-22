'use client';

import { useState } from 'react';

export default function VolunteerImage({
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
          width: '100%',
          height: '100%',
          minHeight: 400,
          background: 'rgba(6,40,61,0.08)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <i
          className={fallbackIcon || 'fa-solid fa-people-group'}
          style={{ fontSize: '4rem', color: 'rgba(6,40,61,0.25)' }}
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
      style={{ width: '100%', height: '100%', objectFit: 'cover' }}
    />
  );
}