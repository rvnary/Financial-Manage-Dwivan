import { formatIDR } from "../../utils/investmentCalculations";
import { MAX_DIGITS, MAX_AMOUNT } from "./constants";

// Parse IDR string to number
export function parseIDR(value: string): number {
  return parseInt(value.replace(/\D/g, "")) || 0;
}

// Sanitize and limit input digits
export function sanitizeNominal(value: string): string {
  const digits = value.replace(/\D/g, "").slice(0, MAX_DIGITS);
  // Hard cap to MAX_AMOUNT
  if (digits && parseInt(digits) > MAX_AMOUNT) {
    return MAX_AMOUNT.toString();
  }
  return digits;
}

/**
 * Format a nominal value (string of digits or number) to IDR display.
 * Returns "" for empty input so form fields render blank until typed.
 * Delegates number formatting to the canonical `formatIDR` util.
 */
export function formatNominalIDR(value: string | number): string {
  const numValue =
    typeof value === "string" ? value.replace(/\D/g, "") : value.toString();
  if (!numValue) return "";
  return formatIDR(parseInt(numValue));
}
