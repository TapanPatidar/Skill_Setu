import React from 'react';
import { cn } from '../../lib/utils.js';

export const Select = React.forwardRef(({ className, children, ...props }, ref) => {
  return (
    <select
      ref={ref}
      className={cn(
        'flex h-12 w-full rounded-xl border border-[#E2E8F0] bg-white px-4 py-2 text-sm text-[#0F172A] shadow-sm transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#0052FF] focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 cursor-pointer',
        className
      )}
      {...props}
    >
      {children}
    </select>
  );
});

Select.displayName = 'Select';
