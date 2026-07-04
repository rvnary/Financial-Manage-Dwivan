import type { PriceAnalysis } from "../../utils/investmentCalculations";
import type { RiskLevel } from "../../utils/stockDefinitions";

export type ExternalRiskProfile = "conservative" | "balanced" | "aggressive";

export interface InvestmentChartsProps {
  remainingMoney: number;
  onStockReturnsChange?: (
    returns: Array<{ symbol: string; monthlyReturn: number }>,
  ) => void;
  selectedRiskProfile?: ExternalRiskProfile;
  onRiskProfileChange?: (profile: ExternalRiskProfile) => void;
}

export interface HistoricalPricePoint {
  date: string;
  open: number;
  high: number;
  low: number;
  close: number;
}

export interface ForecastPricePoint {
  date: string;
  price: number;
}

export interface InvestmentOption {
  symbol: string;
  name: string;
  currentPrice: number;
  expectedPrice: number;
  expectedReturn: number;
  riskLevel: RiskLevel;
  historicalData: HistoricalPricePoint[];
  forecastData: ForecastPricePoint[];
  color: string;
  description: string;
  priceAnalysis?: PriceAnalysis;
  weight?: number; // Portfolio weight
}

export interface StockReturnEntry {
  symbol: string;
  monthlyReturn: number;
}
