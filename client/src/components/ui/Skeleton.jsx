import React from 'react';
import { cn } from '../../lib/utils.js';

export const Skeleton = ({ className, ...props }) => {
  return (
    <div
      className={cn('animate-pulse rounded-xl bg-[#F1F5F9]', className)}
      {...props}
    />
  );
};
