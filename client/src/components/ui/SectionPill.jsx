import React from 'react';
import { cn } from '../../lib/utils.js';

export const SectionPill = ({ children, className, light = false }) => {
  return (
    <div
      className={cn(
        'inline-flex items-center gap-2.5 rounded-full px-5 py-2 text-xs font-mono-label font-medium uppercase select-none transition-all',
        light
          ? 'border border-white/20 bg-white/10 text-white shadow-sm backdrop-blur-sm'
          : 'border border-[#0052FF]/30 bg-[#0052FF]/5 text-[#0052FF]',
        className
      )}
    >
      <span
        className={cn(
          'w-2 h-2 rounded-full animate-pulse-dot shrink-0',
          light ? 'bg-cyan-400' : 'bg-[#0052FF]'
        )}
      />
      <span>{children}</span>
    </div>
  );
};
