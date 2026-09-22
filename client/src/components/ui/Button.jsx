import React from 'react';
import { cva } from 'class-variance-authority';
import { cn } from '../../lib/utils.js';

const buttonVariants = cva(
  'inline-flex items-center justify-center font-medium transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#0052FF] focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 select-none group',
  {
    variants: {
      variant: {
        primary:
          'bg-gradient-to-r from-[#0052FF] to-[#4D7CFF] text-white shadow-sm hover:-translate-y-0.5 hover:shadow-accent-lg hover:brightness-110 active:scale-[0.98]',
        secondary:
          'bg-white text-[#0F172A] border border-[#E2E8F0] shadow-sm hover:bg-[#F1F5F9] hover:border-[#0052FF]/30 active:scale-[0.98]',
        outline:
          'border border-[#E2E8F0] bg-transparent text-[#0F172A] hover:bg-[#F1F5F9] hover:border-[#0052FF]/30',
        ghost:
          'text-[#64748B] hover:text-[#0F172A] hover:bg-[#F1F5F9]',
        danger:
          'bg-rose-600 text-white hover:bg-rose-700 shadow-sm active:scale-[0.98]',
      },
      size: {
        sm: 'h-9 px-4 text-xs rounded-lg',
        md: 'h-11 px-5 text-sm rounded-xl',
        lg: 'h-13 px-7 text-base rounded-xl font-semibold',
        xl: 'h-14 px-8 text-base rounded-xl font-semibold',
        icon: 'h-10 w-10 rounded-xl p-0',
      },
    },
    defaultVariants: {
      variant: 'primary',
      size: 'md',
    },
  }
);

export const Button = React.forwardRef(
  ({ className, variant, size, children, asChild = false, ...props }, ref) => {
    return (
      <button
        ref={ref}
        className={cn(buttonVariants({ variant, size, className }))}
        {...props}
      >
        {children}
      </button>
    );
  }
);

Button.displayName = 'Button';
