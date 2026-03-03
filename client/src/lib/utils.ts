import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

import i18n from "./i18n";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatJOD(amount: number | string): string {
  const numericAmount = Number(amount);
  if (isNaN(numericAmount)) return i18n.language === 'ar' ? "0.00 د.أ" : "JOD 0.00";
  
  const formatted = new Intl.NumberFormat(i18n.language === 'ar' ? 'ar-JO' : 'en-JO', {
    style: 'currency',
    currency: 'JOD',
    minimumFractionDigits: 2,
  }).format(numericAmount);

  if (i18n.language === 'ar') {
    return formatted.replace("د.أ.‏", "").trim() + " د.أ";
  }
  return formatted;
}

export function formatDate(date: string | Date): string {
  return new Intl.DateTimeFormat(i18n.language === 'ar' ? 'ar-JO' : 'en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  }).format(new Date(date));
}
