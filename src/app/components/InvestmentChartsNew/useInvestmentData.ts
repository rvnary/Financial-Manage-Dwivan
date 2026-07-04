import { useEffect, useState } from "react";
import {
  fetchYahooFinanceData,
  isYahooFinanceConfigured,
} from "../../utils/yahooFinanceApi";
import {
  analyzePriceMovement,
  generateForecastData,
  calculatePortfolioReturnByProfile,
  getPortfolioAllocation,
  interpolateHistoricalData,
  type AllocationRecommendation,
} from "../../utils/investmentCalculations";
import { allStockDefinitions } from "../../utils/stockDefinitions";
import type {
  ExternalRiskProfile,
  InvestmentOption,
  StockReturnEntry,
} from "./types";

interface UseInvestmentDataArgs {
  selectedRiskProfile: ExternalRiskProfile;
  onStockReturnsChange?: (returns: StockReturnEntry[]) => void;
}

interface UseInvestmentDataResult {
  investments: InvestmentOption[];
  loading: boolean;
  error: string | null;
  portfolioAllocations: AllocationRecommendation[];
  portfolioReturn: number;
  loadingProgress: string;
}

const PROFILE_KEYS = ["low", "medium", "high"] as const;

function profileKeyToExternal(key: string): ExternalRiskProfile {
  return key === "low" ? "conservative" : key === "medium" ? "balanced" : "aggressive";
}

/** Collect ALL unique stock returns across the cache (deduped by symbol). */
function collectAllStockReturns(
  cache: Record<string, InvestmentOption[]>,
): StockReturnEntry[] {
  const allStockReturns: StockReturnEntry[] = [];
  const addedSymbols = new Set<string>();
  for (const profileKey of Object.keys(cache)) {
    for (const inv of cache[profileKey]) {
      if (!addedSymbols.has(inv.symbol)) {
        allStockReturns.push({
          symbol: inv.symbol,
          monthlyReturn: inv.priceAnalysis?.monthlyReturn || 0,
        });
        addedSymbols.add(inv.symbol);
      }
    }
  }
  return allStockReturns;
}

/**
 * Encapsulates the investment-charts data lifecycle: load all profiles once on
 * mount, swap cached investments when the selected profile changes, and
 * recompute portfolio allocations/return on profile or investments change.
 */
export function useInvestmentData({
  selectedRiskProfile,
  onStockReturnsChange,
}: UseInvestmentDataArgs): UseInvestmentDataResult {
  const [investments, setInvestments] = useState<InvestmentOption[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [portfolioAllocations, setPortfolioAllocations] = useState<
    AllocationRecommendation[]
  >([]);
  const [portfolioReturn, setPortfolioReturn] = useState(0);
  const [loadingProgress, setLoadingProgress] = useState<string>("");
  const [allDataLoaded, setAllDataLoaded] = useState(false);
  const [investmentCache, setInvestmentCache] = useState<
    Record<string, InvestmentOption[]>
  >({});

  // Load ALL data for ALL profiles at startup - only once
  useEffect(() => {
    const loadAllProfilesData = async () => {
      // Skip if already loaded
      if (allDataLoaded) return;

      setLoading(true);
      setError(null);

      // Yahoo Finance API - FREE real-time data, no API key needed!
      if (!isYahooFinanceConfigured()) {
        setError("Yahoo Finance API is not available");
        setLoading(false);
        return;
      }

      // Small delay between requests to be polite to the API
      const delay = (ms: number) =>
        new Promise((resolve) => setTimeout(resolve, ms));

      // Track all loaded data by symbol to avoid duplicate API calls
      const loadedStockData: Record<string, InvestmentOption> = {};
      const newCache: Record<string, InvestmentOption[]> = {};
      const failedSymbols: string[] = [];
      let totalStocks = 0;
      let loadedCount = 0;

      // Count total unique stocks
      const allSymbols = new Set<string>();
      for (const profile of PROFILE_KEYS) {
        for (const stock of allStockDefinitions[profile]) {
          allSymbols.add(stock.symbol);
        }
      }
      totalStocks = allSymbols.size;

      // Load each unique stock once
      const symbolsArray = Array.from(allSymbols);
      for (let i = 0; i < symbolsArray.length; i++) {
        const symbol = symbolsArray[i];

        // Find stock definition (from any profile)
        let stockDef = null;
        for (const profile of PROFILE_KEYS) {
          stockDef = allStockDefinitions[profile].find(
            (s) => s.symbol === symbol,
          );
          if (stockDef) break;
        }
        if (!stockDef) continue;

        setLoadingProgress(
          `Memuat ${symbol} (${loadedCount + 1}/${totalStocks})...`,
        );

        // Small delay between stocks to avoid overwhelming the API
        if (i > 0) {
          await delay(500);
        }

        try {
          const historicalData = await fetchYahooFinanceData(symbol);

          if (!historicalData || historicalData.length === 0) {
            throw new Error(`No data returned for ${symbol}`);
          }

          const interpolatedData = interpolateHistoricalData(historicalData);
          const priceAnalysis = analyzePriceMovement(
            interpolatedData.map((p) => ({ close: p.close })),
          );
          const currentPrice =
            interpolatedData[interpolatedData.length - 1].close;
          const forecast = generateForecastData(
            currentPrice,
            priceAnalysis.annualizedCAGR,
            30,
          );

          loadedStockData[symbol] = {
            symbol: stockDef.symbol,
            name: stockDef.name,
            currentPrice,
            expectedPrice: priceAnalysis.forecastedPrice30Days,
            expectedReturn: priceAnalysis.annualizedReturn,
            riskLevel: stockDef.riskLevel,
            historicalData: interpolatedData,
            forecastData: forecast,
            color: stockDef.color,
            description: stockDef.description,
            priceAnalysis,
          };
          loadedCount++;
        } catch (err) {
          const errorMsg =
            err instanceof Error ? err.message : String(err);
          console.error(`Failed to load data for ${symbol}: ${errorMsg}`);
          failedSymbols.push(symbol);
        }
      }

      // Build cache for each profile using loaded stock data
      for (const profile of PROFILE_KEYS) {
        const profileStocks = allStockDefinitions[profile];
        const profileInvestments: InvestmentOption[] = [];

        for (const stock of profileStocks) {
          if (loadedStockData[stock.symbol]) {
            // Clone and update with profile-specific info
            profileInvestments.push({
              ...loadedStockData[stock.symbol],
              name: stock.name,
              color: stock.color,
              description: stock.description,
              riskLevel: stock.riskLevel,
            });
          }
        }

        newCache[profileKeyToExternal(profile)] = profileInvestments;
      }

      if (loadedCount === 0) {
        setError(
          `Tidak ada data yang berhasil dimuat. Gagal: ${failedSymbols.join(", ")}`,
        );
        setLoading(false);
        return;
      }

      if (failedSymbols.length > 0) {
        console.warn(
          `Some symbols failed to load: ${failedSymbols.join(", ")}`,
        );
      }

      // Update cache with all profiles
      setInvestmentCache(newCache);
      setAllDataLoaded(true);

      // Set current profile's investments
      setInvestments(newCache[selectedRiskProfile] || []);
      setLoading(false);
      setLoadingProgress("");

      // Call callback with ALL stock returns from all profiles
      if (onStockReturnsChange) {
        onStockReturnsChange(collectAllStockReturns(newCache));
      }
    };

    loadAllProfilesData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []); // Only run once on mount

  // When profile changes, update investments from cache (no API call needed)
  useEffect(() => {
    if (allDataLoaded && investmentCache[selectedRiskProfile]) {
      setInvestments(investmentCache[selectedRiskProfile]);

      // Send ALL stock returns, not just current profile
      if (onStockReturnsChange) {
        onStockReturnsChange(collectAllStockReturns(investmentCache));
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedRiskProfile, allDataLoaded]);

  // Update portfolio allocations when risk profile changes
  useEffect(() => {
    const allocations = getPortfolioAllocation(selectedRiskProfile);
    setPortfolioAllocations(allocations);

    // Calculate portfolio return based on risk profile and stock returns
    if (investments.length > 0) {
      const stockReturns = investments.map((inv) => inv.expectedReturn);
      const symbols = investments.map((inv) => inv.symbol);
      const totalReturn = calculatePortfolioReturnByProfile(
        selectedRiskProfile,
        stockReturns,
        symbols,
      );
      setPortfolioReturn(totalReturn);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedRiskProfile, investments]);

  return {
    investments,
    loading,
    error,
    portfolioAllocations,
    portfolioReturn,
    loadingProgress,
  };
}
