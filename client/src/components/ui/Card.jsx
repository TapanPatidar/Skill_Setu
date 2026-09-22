import React from 'react';
import { cn } from '../../lib/utils.js';

export const Card = React.forwardRef(({ className, featured = false, children, ...props }, ref) => {
  if (featured) {
    return (
      <div className={cn('p-[2px] rounded-2xl gradient-accent shadow-accent-sm transition-all duration-300 hover:shadow-accent-lg', className)}>
        <div
          ref={ref}
          className="bg-white rounded-[14px] p-6 sm:p-8 h-full transition-all duration-200"
          {...props}
        >
          {children}
        </div>
      </div>
    );
  }

  return (
    <div
      ref={ref}
      className={cn(
        'relative bg-white border border-[#E2E8F0] rounded-xl sm:rounded-2xl shadow-md transition-all duration-300 hover:shadow-xl hover:border-[#0052FF]/20 overflow-hidden group',
        className
      )}
      {...props}
    >
      <div className="absolute inset-0 bg-gradient-to-br from-[#0052FF]/[0.03] to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" />
      {children}
    </div>
  );
});

Card.displayName = 'Card';

export const CardHeader = ({ className, children, ...props }) => (
  <div className={cn('p-6 pb-3 space-y-1.5', className)} {...props}>
    {children}
  </div>
);

export const CardTitle = ({ className, children, ...props }) => (
  <h3 className={cn('text-lg sm:text-xl font-semibold tracking-tight text-[#0F172A]', className)} {...props}>
    {children}
  </h3>
);

export const CardDescription = ({ className, children, ...props }) => (
  <p className={cn('text-sm text-[#64748B] leading-relaxed', className)} {...props}>
    {children}
  </p>
);

export const CardContent = ({ className, children, ...props }) => (
  <div className={cn('p-6 pt-0', className)} {...props}>
    {children}
  </div>
);

export const CardFooter = ({ className, children, ...props }) => (
  <div className={cn('p-6 pt-0 flex items-center', className)} {...props}>
    {children}
  </div>
);
