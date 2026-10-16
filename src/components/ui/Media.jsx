import { useState } from 'react';
import { asset, cn } from '../../lib/utils';

export function Placeholder({ label, ratio, className, children }) {
  return (
    <div
      role="img"
      aria-label={label || 'Image coming soon'}
      className={cn('placeholder-img rounded-[inherit]', className)}
      style={ratio ? { aspectRatio: ratio } : undefined}
    >
      {label && label.trim() && (
        <span className="absolute inset-x-3 bottom-2.5 truncate font-mono text-[10px] font-medium tracking-[.12em] uppercase text-muted">
          {label}
        </span>
      )}
      {children}
    </div>
  );
}

export default function Media({ src, alt = '', ratio, label, className, imgClassName, eager = false }) {
  const [failed, setFailed] = useState(false);
  if (!src || failed) return <Placeholder label={label ?? alt} ratio={ratio} className={className} />;
  return (
    <img
      src={asset(src)}
      alt={alt}
      loading={eager ? 'eager' : 'lazy'}
      decoding="async"
      onError={() => setFailed(true)}
      className={cn('block w-full object-cover', className, imgClassName)}
      style={ratio ? { aspectRatio: ratio } : undefined}
    />
  );
}
