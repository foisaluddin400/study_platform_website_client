import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatCurrency(amount: number, currency: string = "USD"): string {
  const symbols: Record<string, string> = {
    USD: "$",
    GBP: "£",
    CAD: "CA$",
    AUD: "A$",
    EUR: "€",
  };
  const symbol = symbols[currency] || `${currency} `;
  return `${symbol}${amount.toLocaleString()}`;
}

export function formatDate(dateString: string): string {
  if (!dateString) return "";
  try {
    const d = new Date(dateString);
    return d.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  } catch {
    return dateString;
  }
}
