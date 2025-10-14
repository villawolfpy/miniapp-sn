import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

/**
 * Utility to merge conditional Tailwind class names.
 */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/**
 * Shortens an address while keeping the prefix and suffix visible for quick identification.
 */
export function truncateAddress(address: string, visible = 4): string {
  if (!address || address.length <= visible * 2 + 2) {
    return address;
  }
  return `${address.slice(0, visible + 2)}…${address.slice(-visible)}`;
}

/**
 * Truncates long hexadecimal values such as transaction hashes or signatures for compact display.
 */
export function truncateHex(value: string, start = 6, end = 4): string {
  if (!value || value.length <= start + end + 2) {
    return value;
  }
  return `${value.slice(0, start + 2)}…${value.slice(-end)}`;
}
