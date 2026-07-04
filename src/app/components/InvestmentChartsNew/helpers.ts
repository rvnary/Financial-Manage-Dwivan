import type { InvestmentOption } from "./types";

/** Projected gain on `remainingMoney * 0.3` over 30 days for one investment. */
export function calculatePotentialReturn(
  investment: InvestmentOption,
  remainingMoney: number,
): number {
  if (remainingMoney <= 0) return 0;
  // Allocate 30% to each investment
  const investmentAmount = remainingMoney * 0.3;
  // Use monthly return (30-day), not annualized
  const monthlyReturnPercent = investment.priceAnalysis?.monthlyReturn || 0;
  const returnAmount = investmentAmount * (monthlyReturnPercent / 100);
  return returnAmount;
}

export function getRiskBadgeColor(risk: string): string {
  switch (risk) {
    case "Low":
      return "bg-green-100 text-green-800 border-green-200";
    case "Medium":
      return "bg-yellow-100 text-yellow-800 border-yellow-200";
    case "High":
      return "bg-red-100 text-red-800 border-red-200";
    default:
      return "bg-gray-100 text-gray-800 border-gray-200";
  }
}

/**
 * Resolve the effective 30-day return percentage to display for an investment.
 * Uses `||` (not `??`) to preserve the original barrel behavior: a true 0
 * monthlyReturn falls back to expectedReturn, matching the inline code that
 * was duplicated throughout the JSX.
 */
export function getDisplayReturn(investment: InvestmentOption): number {
  return investment.priceAnalysis?.monthlyReturn || investment.expectedReturn;
}
