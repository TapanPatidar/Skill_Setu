import React, { useState } from 'react';
import { cn } from '../../lib/utils.js';

export const Avatar = ({ src, alt = 'Avatar', fallback, size = 'md', className }) => {
  const [hasError, setHasError] = useState(false);

  const sizeClasses = {
    sm: 'h-8 w-8 text-xs',
    md: 'h-10 w-10 text-sm',
    lg: 'h-13 w-13 text-base',
    xl: 'h-16 w-16 text-lg',
  };

  const initials = fallback || alt.split(' ').map((n) => n[0]).slice(0, 2).join('').toUpperCase();

  return (
    <div
      className={cn(
        'relative inline-flex items-center justify-center shrink-0 rounded-full bg-[#F1F5F9] border border-[#E2E8F0] font-medium text-[#0F172A] overflow-hidden select-none',
        sizeClasses[size] || sizeClasses.md,
        className
      )}
    >
      {src && !hasError ? (
        <img
          src={src}
          alt={alt}
          onError={() => setHasError(true)}
          className="h-full w-full object-cover"
          referrerPolicy="no-referrer"
        />
      ) : (
        <span className="font-semibold text-[#0052FF]">{initials || 'U'}</span>
      )}
    </div>
  );
};
