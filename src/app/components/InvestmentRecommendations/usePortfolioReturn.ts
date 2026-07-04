import { useMemo } from "react";
import type { AllocationOption, StockReturn } from "./types";

export interface PortfolioReturnSummary {
  /** Sum of (invested * monthlyReturn/100) across all allocations. */
  totalGain: number;
  /** Weighted average monthly return (percentage), i.e. sum(return * share). */
  weightedReturn: number;
  /** remainingMoney + rounded totalGain — projected portfolio value in 30 days. */
  projectedValue: number;
  /** true when totalGain >= 0 */
  isPositive: boolean;
}

/**
 * Collapse the per-allocation return math (previously repeated as 5 inline IIFEs
 * in the JSX) into a single memoized computation.
 */
export function usePortfolioReturn(
  remainingMoney: number,
  selectedAllocation: AllocationOption,
  returnMap: Map<string, number>,
): PortfolioReturnSummary {
  return useMemo(() => {
    let totalGain = 0;
    let weightedReturn = 0;

    for (const alloc of selectedAllocation.allocations) {
      const returnRate = returnMap.get(alloc.symbol) || 0;
      const invested = remainingMoney * (alloc.percentage / 100);
      totalGain += invested * (returnRate / 100);
      weightedReturn += returnRate * (alloc.percentage / 100);
    }

    return {
      totalGain,
      weightedReturn,
      projectedValue: remainingMoney + Math.round(totalGain),
      isPositive: totalGain >= 0,
    };
  }, [remainingMoney, selectedAllocation, returnMap]);
}

/** Build a symbol -> monthlyReturn map from the stockReturns prop. */
export function buildReturnMap(stockReturns: StockReturn[]): Map<string, number> {
  return new Map(stockReturns.map((sr) => [sr.symbol, sr.monthlyReturn]));
}
