export type RiskProfile = "low" | "medium" | "high";
export type ExternalRiskProfile = "conservative" | "balanced" | "aggressive";

export interface InvestmentRecommendationsProps {
  remainingMoney: number;
  monthlySalary: number;
  stockReturns?: Array<{
    symbol: string;
    monthlyReturn: number;
  }>;
  selectedRiskProfile?: ExternalRiskProfile;
  onRiskProfileChange?: (profile: ExternalRiskProfile) => void;
}

export interface AllocationEntry {
  name: string;
  symbol: string;
  percentage: number;
  color: string;
}

export interface AllocationOption {
  profile: RiskProfile;
  label: string;
  description: string;
  thesis: string;
  bestFor: string;
  reason: string;
  behavior: string;
  allocations: AllocationEntry[];
  expectedReturn: string;
}

export interface StockReturn {
  symbol: string;
  monthlyReturn: number; // percentage
}

/** Allocation entry augmented with the rupiah amount invested in that stock. */
export interface AllocationDataItem extends AllocationEntry {
  value: number;
}
