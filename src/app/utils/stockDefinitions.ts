// Stock universe definition for the investment charts feature.
// Organized by risk profile (3 stocks per profile to minimize API calls).
// These are well-known US stocks that work reliably with Alpha Vantage / Yahoo Finance.

export type RiskLevel = "Low" | "Medium" | "High";

export interface StockDefinition {
  symbol: string;
  name: string;
  basePrice: number;
  color: string;
  description: string;
  riskLevel: RiskLevel;
}

/**
 * All stock definitions keyed by risk bucket (`low` | `medium` | `high`).
 * Kept here as a single source of truth so the charts and any other feature
 * that needs the stock universe share the same data.
 */
export const allStockDefinitions: Record<string, StockDefinition[]> = {
  // Low Risk Portfolio: Stable, defensive stocks
  low: [
    {
      symbol: "SPY",
      name: "S&P 500 ETF (SPY)",
      basePrice: 600,
      color: "#007200",
      description: "Indeks luas yang melacak 500 perusahaan besar AS",
      riskLevel: "Low",
    },
    {
      symbol: "JNJ",
      name: "Johnson & Johnson (JNJ)",
      basePrice: 160,
      color: "#dc2626",
      description: "Pemimpin sektor kesehatan dengan histori dividen panjang",
      riskLevel: "Low",
    },
    {
      symbol: "KO",
      name: "Coca-Cola (KO)",
      basePrice: 62,
      color: "#1e40af",
      description: "Brand konsumsi defensif dengan dividen stabil",
      riskLevel: "Low",
    },
  ],
  // Medium Risk Portfolio: Balanced growth
  medium: [
    {
      symbol: "SPY",
      name: "S&P 500 ETF (SPY)",
      basePrice: 600,
      color: "#007200",
      description: "Indeks luas yang melacak 500 perusahaan besar AS",
      riskLevel: "Low",
    },
    {
      symbol: "MSFT",
      name: "Microsoft (MSFT)",
      basePrice: 420,
      color: "#0078d4",
      description: "Perusahaan teknologi berkualitas dengan pertumbuhan stabil",
      riskLevel: "Medium",
    },
    {
      symbol: "AAPL",
      name: "Apple (AAPL)",
      basePrice: 250,
      color: "#a3a3a3",
      description: "Ekosistem teknologi dengan pendapatan kuat",
      riskLevel: "Medium",
    },
  ],
  // High Risk Portfolio: High-growth tech stocks
  high: [
    {
      symbol: "NVDA",
      name: "NVIDIA (NVDA)",
      basePrice: 140,
      color: "#76b900",
      description: "Pemimpin pasar AI/GPU dengan pertumbuhan tinggi",
      riskLevel: "High",
    },
    {
      symbol: "TSLA",
      name: "Tesla (TSLA)",
      basePrice: 400,
      color: "#dc2626",
      description: "Inovasi EV dan energi dengan volatilitas tinggi",
      riskLevel: "High",
    },
    {
      symbol: "AAPL",
      name: "Apple (AAPL)",
      basePrice: 250,
      color: "#a3a3a3",
      description: "Ekosistem teknologi dengan loyalitas brand kuat",
      riskLevel: "High",
    },
  ],
};

/**
 * Map a risk profile (`conservative` | `balanced` | `aggressive`) to its
 * stock bucket (`low` | `medium` | `high`) and return the stock list.
 */
export function getStocksByProfile(
  profile: "conservative" | "balanced" | "aggressive",
): StockDefinition[] {
  const profileMap: Record<string, string> = {
    conservative: "low",
    balanced: "medium",
    aggressive: "high",
  };
  return allStockDefinitions[profileMap[profile]] || allStockDefinitions.medium;
}
