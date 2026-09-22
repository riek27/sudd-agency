'use client';

import { useState } from 'react';

export default function PartnerLogo({ src, alt, fallbackIcon }: { src: string; alt: string; fallbackIcon: string }) {
  const [broken, setBroken] = useState(false);

  if (broken || !src) {
    return (
      <div className="placeholder-logo" style={{ display: 'flex' }}>
        <i className={fallbackIcon} />
      </div>
    );
  }

  return (
    <img
      src={src}
      alt={alt}
      onError={() => setBroken(true)}
    />
  );
}