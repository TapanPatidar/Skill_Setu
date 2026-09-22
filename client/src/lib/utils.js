import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

/**
 * Merge class names conditionally and resolve Tailwind conflicts
 * @param  {...any} inputs
 * @returns {string}
 */
export function cn(...inputs) {
  return twMerge(clsx(inputs));
}
