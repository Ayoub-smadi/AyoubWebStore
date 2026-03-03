import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatJOD(amount: number | string): string {
  const numericAmount = Number(amount);
  if (isNaN(numericAmount)) return "JOD 0.00";
  
  return new Intl.NumberFormat('en-JO', {
    style: 'currency',
    currency: 'JOD',
    minimumFractionDigits: 2,
  }).format(numericAmount);
}

export function formatDate(date: string | Date): string {
  return new Intl.DateTimeFormat('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  }).format(new Date(date));
}
