import React from 'react';
import { cva } from 'class-variance-authority';
import { cn } from '../../lib/utils.js';

const badgeVariants = cva(
  'inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold whitespace-nowrap transition-colors select-none',
  {
    variants: {
      variant: {
        default: 'bg-[#F1F5F9] text-[#0F172A] border border-[#E2E8F0]',
        accent: 'bg-[#0052FF]/10 text-[#0052FF] border border-[#0052FF]/25 font-medium',
        secondary: 'bg-[#0F172A] text-white font-medium',
        outline: 'border border-[#E2E8F0] text-[#64748B] bg-transparent',
        success: 'bg-emerald-50 text-emerald-700 border border-emerald-200',
        warning: 'bg-amber-50 text-amber-700 border border-amber-200',
        trend: 'bg-gradient-to-r from-[#0052FF] to-[#4D7CFF] text-white shadow-sm',
      },
    },
    defaultVariants: {
      variant: 'default',
    },
  }
);

export const Badge = ({ className, variant, children, ...props }) => {
  return (
    <span className={cn(badgeVariants({ variant, className }))} {...props}>
      {children}
    </span>
  );
};
