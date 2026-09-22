import React from 'react';
import { cn } from '../../lib/utils.js';

export const Progress = ({ value = 0, max = 100, className, barClassName }) => {
  const percentage = Math.min(Math.max((value / max) * 100, 0), 100);

  return (
    <div
      role="progressbar"
      aria-valuenow={value}
      aria-valuemin={0}
      aria-valuemax={max}
      className={cn('relative h-2.5 w-full overflow-hidden rounded-full bg-[#F1F5F9]', className)}
    >
      <div
        className={cn('h-full bg-gradient-to-r from-[#0052FF] to-[#4D7CFF] rounded-full transition-all duration-500 ease-out', barClassName)}
        style={{ width: `${percentage}%` }}
      />
    </div>
  );
};
