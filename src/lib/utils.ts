import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatYear(year?: number): string {
  return year ? year.toString() : 'N/A';
}

export function formatRating(rating?: number): string {
  return rating ? rating.toFixed(1) : 'N/A';
}

export function truncateText(text: string, maxLength: number): string {
  if (text.length <= maxLength) return text;
  return text.substring(0, maxLength) + '...';
}