import { useState } from 'react';

export function ImageWithFallback({ src, alt, className, fallbackSrc, ...props }) {
  const [error, setError] = useState(false);

  return (
    <img
      src={error ? (fallbackSrc || "https://placehold.co/600x400?text=Error") : src}
      alt={alt}
      className={className}
      onError={() => setError(true)}
      {...props}
    />
  );
}
