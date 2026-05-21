import { useState, useEffect } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "./ui/card";
import {
  ComposedChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Area,
  BarChart,
  Bar,
  Cell,
} from "recharts";
import {
  TrendingUp,
  ArrowUpRight,
  ArrowDownRight,
  Loader2,
} from "lucide-react";
import {
  fetchYahooFinanceData,
  isYahooFinanceConfigured,
} from "../utils/yahooFinanceApi";
import {
  analyzePriceMovement,
  generateForecastData,
  calculatePortfolioReturn,
  calculatePortfolioReturnByProfile,
  getPortfolioAllocation,
  formatUSD,
  formatIDR,
  formatPercentage,
  AllocationRecommendation,
  PriceAnalysis,
  interpolateHistoricalData,
} from "../utils/investmentCalculations";

interface InvestmentChartsProps {
  remainingMoney: number;
  onStockReturnsChange?: (
    returns: Array<{ symbol: string; monthlyReturn: number }>,
  ) => void;
  selectedRiskProfile?: "conservative" | "balanced" | "aggressive";
  onRiskProfileChange?: (
    profile: "conservative" | "balanced" | "aggressive",
  ) => void;
}

interface InvestmentOption {
  symbol: string;
  name: string;
  currentPrice: number;
  expectedPrice: number;
  expectedReturn: number;
  riskLevel: "Low" | "Medium" | "High";
  historicalData: Array<{
    date: string;
    open: number;
    high: number;
    low: number;
    close: number;
  }>;
  forecastData: Array<{
    date: string;
    price: number;
  }>;
  color: string;
  description: string;
  priceAnalysis?: PriceAnalysis;
  weight?: number; // Portfolio weight
}

export function InvestmentCharts({
  remainingMoney,
  onStockReturnsChange,
  selectedRiskProfile: externalRiskProfile,
  onRiskProfileChange,
}: InvestmentChartsProps) {
  const [investments, setInvestments] = useState<InvestmentOption[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [portfolioAllocations, setPortfolioAllocations] = useState<
    AllocationRecommendation[]
  >([]);
  // Use external state if provided, otherwise use internal state
  const [internalRiskProfile, setInternalRiskProfile] = useState<
    "conservative" | "balanced" | "aggressive"
  >("balanced");

  const selectedRiskProfile = externalRiskProfile ?? internalRiskProfile;
  const setSelectedRiskProfile = onRiskProfileChange ?? setInternalRiskProfile;

  const [portfolioReturn, setPortfolioReturn] = useState(0);
  const [loadingProgress, setLoadingProgress] = useState<string>("");
  const [allDataLoaded, setAllDataLoaded] = useState(false);

  // Cache for loaded investments by profile to avoid re-fetching
  const [investmentCache, setInvestmentCache] = useState<
    Record<string, InvestmentOption[]>
  >({});

  const profileNarratives = {
    conservative: {
      label: "Conservative",
      accent: "#38bdf8",
      title: "Stabil dulu, growth belakangan",
      reason:
        "SPY dipakai sebagai core diversifikasi, lalu JNJ dan KO disertakan karena karakter bisnisnya defensif sehingga cocok saat prioritasnya menjaga modal.",
    },
    balanced: {
      label: "Balanced",
      accent: "#70e000",
      title: "Seimbang antara safety dan growth",
      reason:
        "SPY menjadi jangkar pasar luas, sementara MSFT dan AAPL disertakan karena kualitas laba dan ekosistemnya memberi potensi pertumbuhan yang lebih konsisten.",
    },
    aggressive: {
      label: "Aggressive",
      accent: "#ef4444",
      title: "Kejar upside, siap volatilitas",
      reason:
        "NVDA dan TSLA disertakan untuk eksposur inovasi berisiko tinggi, sedangkan AAPL membantu memberi fondasi kualitas di portofolio growth.",
    },
  } satisfies Record<
    "conservative" | "balanced" | "aggressive",
    { label: string; accent: string; title: string; reason: string }
  >;

  // All stock definitions organized by risk profile
  // Using 3 stocks per profile to minimize API calls (Alpha Vantage: 5 calls/min)
  // These are well-known US stocks that work reliably with Alpha Vantage
  const allStockDefinitions: Record<
    string,
    {
      symbol: string;
      name: string;
      basePrice: number;
      color: string;
      description: string;
      riskLevel: "Low" | "Medium" | "High";
    }[]
  > = {
    // Low Risk Portfolio: Stable, defensive stocks
    low: [
      {
        symbol: "SPY",
        name: "S&P 500 ETF (SPY)",
        basePrice: 600,
        color: "#007200",
        description: "Diversified index tracking 500 largest US companies",
        riskLevel: "Low",
      },
      {
        symbol: "JNJ",
        name: "Johnson & Johnson (JNJ)",
        basePrice: 160,
        color: "#dc2626",
        description: "Healthcare leader with 60+ years of dividends",
        riskLevel: "Low",
      },
      {
        symbol: "KO",
        name: "Coca-Cola (KO)",
        basePrice: 62,
        color: "#1e40af",
        description: "Defensive consumer brand with stable dividends",
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
        description: "Diversified index tracking 500 largest US companies",
        riskLevel: "Low",
      },
      {
        symbol: "MSFT",
        name: "Microsoft (MSFT)",
        basePrice: 420,
        color: "#0078d4",
        description: "Quality tech company with stable growth",
        riskLevel: "Medium",
      },
      {
        symbol: "AAPL",
        name: "Apple (AAPL)",
        basePrice: 250,
        color: "#a3a3a3",
        description: "Technology ecosystem with strong earnings",
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
        description: "AI and GPU market leader with explosive growth",
        riskLevel: "High",
      },
      {
        symbol: "TSLA",
        name: "Tesla (TSLA)",
        basePrice: 400,
        color: "#dc2626",
        description: "EV and energy innovation with high volatility",
        riskLevel: "High",
      },
      {
        symbol: "AAPL",
        name: "Apple (AAPL)",
        basePrice: 250,
        color: "#a3a3a3",
        description: "Technology ecosystem with strong brand loyalty",
        riskLevel: "High",
      },
    ],
  };

  // Get current profile's stocks
  const getCurrentProfileStocks = () => {
    const profileMap: Record<string, string> = {
      conservative: "low",
      balanced: "medium",
      aggressive: "high",
    };
    return (
      allStockDefinitions[profileMap[selectedRiskProfile]] ||
      allStockDefinitions.medium
    );
  };

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

      // Collect all unique stocks from all profiles
      const allProfiles = ["low", "medium", "high"] as const;
      const profileNameMap: Record<string, string> = {
        low: "Low Risk",
        medium: "Medium Risk",
        high: "High Risk",
      };

      // Track all loaded data by symbol to avoid duplicate API calls
      const loadedStockData: Record<string, InvestmentOption> = {};
      const newCache: Record<string, InvestmentOption[]> = {};
      const failedSymbols: string[] = [];
      let totalStocks = 0;
      let loadedCount = 0;

      // Count total unique stocks
      const allSymbols = new Set<string>();
      for (const profile of allProfiles) {
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
        for (const profile of allProfiles) {
          stockDef = allStockDefinitions[profile].find(
            (s) => s.symbol === symbol,
          );
          if (stockDef) break;
        }
        if (!stockDef) continue;

        setLoadingProgress(
          `Loading ${symbol} (${loadedCount + 1}/${totalStocks})...`,
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
        } catch (error) {
          const errorMsg =
            error instanceof Error ? error.message : String(error);
          console.error(`Failed to load data for ${symbol}: ${errorMsg}`);
          failedSymbols.push(symbol);
        }
      }

      // Build cache for each profile using loaded stock data
      for (const profile of allProfiles) {
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

        const profileKey =
          profile === "low"
            ? "conservative"
            : profile === "medium"
              ? "balanced"
              : "aggressive";
        newCache[profileKey] = profileInvestments;
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
        const allStockReturns: Array<{
          symbol: string;
          monthlyReturn: number;
        }> = [];
        const addedSymbols = new Set<string>();

        // Collect all unique stocks from all profiles
        for (const profileKey of Object.keys(newCache)) {
          for (const inv of newCache[profileKey]) {
            if (!addedSymbols.has(inv.symbol)) {
              allStockReturns.push({
                symbol: inv.symbol,
                monthlyReturn: inv.priceAnalysis?.monthlyReturn || 0,
              });
              addedSymbols.add(inv.symbol);
            }
          }
        }
        onStockReturnsChange(allStockReturns);
      }
    };

    loadAllProfilesData();
  }, []); // Only run once on mount

  // When profile changes, update investments from cache (no API call needed)
  useEffect(() => {
    if (allDataLoaded && investmentCache[selectedRiskProfile]) {
      setInvestments(investmentCache[selectedRiskProfile]);

      // Send ALL stock returns, not just current profile
      if (onStockReturnsChange) {
        const allStockReturns: Array<{
          symbol: string;
          monthlyReturn: number;
        }> = [];
        const addedSymbols = new Set<string>();

        for (const profileKey of Object.keys(investmentCache)) {
          for (const inv of investmentCache[profileKey]) {
            if (!addedSymbols.has(inv.symbol)) {
              allStockReturns.push({
                symbol: inv.symbol,
                monthlyReturn: inv.priceAnalysis?.monthlyReturn || 0,
              });
              addedSymbols.add(inv.symbol);
            }
          }
        }
        onStockReturnsChange(allStockReturns);
      }
    }
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
  }, [selectedRiskProfile, investments]);

  const calculateDynamicDomain = (data: any[], priceKey: string) => {
    if (data.length === 0) return ["dataMin", "dataMax"];

    const prices = data.map((d) => d[priceKey]);
    const min = Math.min(...prices);
    const max = Math.max(...prices);
    const range = max - min;

    // Gunakan 15% padding dari range untuk lebih strech
    const padding = range * 0.15;

    return [
      Math.floor((min - padding) * 100) / 100,
      Math.ceil((max + padding) * 100) / 100,
    ];
  };

  const ForecastChart = ({ data, color }: { data: any[]; color: string }) => {
    return (
      <ResponsiveContainer width="100%" height={200}>
        <ComposedChart
          data={data}
          margin={{ top: 10, right: 10, left: 0, bottom: 0 }}
        >
          <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
          <XAxis
            dataKey="date"
            tick={{ fontSize: 11, fill: "#d1d5db" }}
            interval="preserveStartEnd"
          />
          <YAxis
            tick={{ fontSize: 11, fill: "#d1d5db" }}
            domain={calculateDynamicDomain(data, "price")}
          />
          <Tooltip
            contentStyle={{
              backgroundColor: "#1f2937",
              border: "1px solid #374151",
              borderRadius: "8px",
              fontSize: "12px",
              color: "#fff",
            }}
            content={({ active, payload, label }) => {
              if (active && payload && payload.length) {
                const forecastData = payload.find(
                  (p: any) => p.name === "forecast",
                );
                if (forecastData) {
                  return (
                    <div className="bg-gray-800 border border-gray-600 rounded-lg p-2">
                      <p className="text-white font-medium">{label}</p>
                      <p className="text-green-400">
                        Forecast: {formatUSD(forecastData.value as number)}
                      </p>
                    </div>
                  );
                }
              }
              return null;
            }}
          />
          <Area
            type="natural"
            dataKey="price"
            name="area"
            stroke={color}
            fill={color}
            fillOpacity={0.1}
            strokeWidth={2}
            legendType="none"
          />
          <Line
            type="natural"
            dataKey="price"
            name="forecast"
            stroke={color}
            strokeWidth={3}
            dot={false}
            strokeDasharray="5 5"
            legendType="none"
          />
        </ComposedChart>
      </ResponsiveContainer>
    );
  };

  const HistoricalChart = ({ data, color }: { data: any[]; color: string }) => {
    return (
      <ResponsiveContainer width="100%" height={200}>
        <ComposedChart
          data={data}
          margin={{ top: 10, right: 10, left: 0, bottom: 0 }}
        >
          <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
          <XAxis
            dataKey="date"
            tick={{ fontSize: 11, fill: "#d1d5db" }}
            interval="preserveStartEnd"
          />
          <YAxis
            tick={{ fontSize: 11, fill: "#d1d5db" }}
            domain={calculateDynamicDomain(data, "close")}
          />
          <Tooltip
            contentStyle={{
              backgroundColor: "#1f2937",
              border: "1px solid #374151",
              borderRadius: "8px",
              fontSize: "12px",
              color: "#fff",
            }}
            content={({ active, payload, label }) => {
              if (active && payload && payload.length) {
                const priceData = payload.find(
                  (p: any) => p.name === "priceline",
                );
                if (priceData) {
                  return (
                    <div className="bg-gray-800 border border-gray-600 rounded-lg p-2">
                      <p className="text-white font-medium">{label}</p>
                      <p className="text-green-400">
                        Price: {formatUSD(priceData.value as number)}
                      </p>
                    </div>
                  );
                }
              }
              return null;
            }}
          />
          <Area
            type="monotone"
            dataKey="close"
            name="area"
            stroke={color}
            fill={color}
            fillOpacity={0.1}
            strokeWidth={1}
            legendType="none"
          />
          <Line
            type="monotone"
            dataKey="close"
            name="priceline"
            stroke={color}
            strokeWidth={2}
            dot={false}
            legendType="none"
          />
        </ComposedChart>
      </ResponsiveContainer>
    );
  };

  const calculatePotentialReturn = (investment: InvestmentOption) => {
    if (remainingMoney <= 0) return 0;
    // Allocate 30% to each investment
    const investmentAmount = remainingMoney * 0.3;
    // Use monthly return (30-day), not annualized
    const monthlyReturnPercent = investment.priceAnalysis?.monthlyReturn || 0;
    const returnAmount = investmentAmount * (monthlyReturnPercent / 100);
    return returnAmount;
  };

  const getRiskBadgeColor = (risk: string) => {
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
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-12">
        <Loader2
          className="w-12 h-12 animate-spin"
          style={{ color: "#70e000" }}
        />
        <span className="text-lg text-white mt-4 font-medium">
          Memuat Data Real-Time...
        </span>
        <span className="text-gray-400 mt-2">
          {loadingProgress || "Connecting to Yahoo Finance..."}
        </span>
        <div className="mt-4 bg-gray-800 rounded-lg p-4 max-w-md">
          <p className="text-sm text-gray-400 text-center">
            📊 Mengambil data real-time untuk semua profil risiko
          </p>
          <p className="text-xs text-gray-500 text-center mt-2">
            Data langsung dari Yahoo Finance
          </p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-950 border border-red-800 rounded-lg p-4">
        <h4 className="font-medium text-red-400 mb-2">❌ Error Loading Data</h4>
        <p className="text-red-300 text-sm">{error}</p>
        <p className="text-red-400 text-sm mt-2">
          Troubleshooting: Try refreshing the page
        </p>
      </div>
    );
  }

  return (
    <div className="motion-stagger space-y-6 mt-8">
      {/* Yahoo Finance - FREE real-time data */}

      <div className="flex items-center gap-2">
        <TrendingUp className="w-6 h-6" style={{ color: "#70e000" }} />
        <h2 className="text-2xl text-white">Investment Opportunities</h2>
      </div>
      <p className="text-gray-400">
        Based on historical market analysis, here are top investment
        recommendations with expected 30-day returns
        <span className="text-green-400">
          {" "}
          (Real-time data from Yahoo Finance ✓)
        </span>
      </p>

      {/* Risk Profile Selector for Investment Cards */}
      <div className="motion-card motion-glow bg-gray-800/90 border border-gray-700 rounded-lg p-4 backdrop-blur">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-white font-medium">Select Risk Profile</h3>
            <p className="text-sm text-gray-400">
              Choose your investment style to see matching stocks
            </p>
          </div>
          <div className="flex gap-2">
            {(["conservative", "balanced", "aggressive"] as const).map(
              (profile) => (
                <button
                  key={profile}
                  onClick={() => setSelectedRiskProfile(profile)}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition duration-300 hover:-translate-y-0.5 ${
                    selectedRiskProfile === profile
                      ? profile === "conservative"
                        ? "bg-blue-600 text-white"
                        : profile === "balanced"
                          ? "bg-green-600 text-white"
                          : "bg-red-600 text-white"
                      : "bg-gray-700 text-gray-300 hover:bg-gray-600"
                  }`}
                >
                  {profile === "conservative"
                    ? "🛡️ Conservative"
                    : profile === "balanced"
                      ? "⚖️ Balanced"
                      : "🚀 Aggressive"}
                </button>
              ),
            )}
          </div>
        </div>
        <div className="mt-3 text-xs text-gray-500">
          {selectedRiskProfile === "conservative" &&
            "Conservative: SPY + JNJ + KO untuk diversifikasi dan defensiveness."}
          {selectedRiskProfile === "balanced" &&
            "Balanced: SPY + MSFT + AAPL untuk indeks luas dan quality growth."}
          {selectedRiskProfile === "aggressive" &&
            "Aggressive: NVDA + TSLA + AAPL untuk growth tinggi dengan volatilitas lebih besar."}
        </div>
      </div>

      <div
        className="motion-card rounded-2xl border bg-gray-900/70 p-5"
        style={{
          borderColor: `${profileNarratives[selectedRiskProfile].accent}55`,
        }}
      >
        <p className="text-xs uppercase tracking-[0.24em] text-gray-500">
          Portfolio thesis
        </p>
        <h3 className="mt-1 text-xl font-semibold text-white">
          {profileNarratives[selectedRiskProfile].label}:{" "}
          {profileNarratives[selectedRiskProfile].title}
        </h3>
        <p className="mt-2 text-sm leading-relaxed text-gray-300">
          {profileNarratives[selectedRiskProfile].reason}
        </p>
      </div>

      {/* Investment Cards */}
      <div className="grid gap-6">
        {investments.map((investment, index) => (
          <Card
            key={index}
            className="motion-card overflow-hidden bg-gray-800/90 border-gray-700"
          >
            <CardHeader className="bg-gradient-to-r from-gray-800 to-gray-750">
              <div className="flex justify-between items-start">
                <div>
                  <CardTitle className="flex items-center gap-2 text-white">
                    {investment.name}
                    <span
                      className={`text-xs px-2 py-1 rounded-full border ${getRiskBadgeColor(
                        investment.riskLevel,
                      )}`}
                    >
                      {investment.riskLevel} Risk
                    </span>
                  </CardTitle>
                  <CardDescription className="mt-2 text-gray-400">
                    {investment.description}
                  </CardDescription>
                </div>
                <div className="text-right">
                  <div
                    className="flex items-center gap-1 justify-end"
                    style={{
                      color:
                        (investment.priceAnalysis?.monthlyReturn ||
                          investment.expectedReturn) >= 0
                          ? "#70e000"
                          : "#ef4444",
                    }}
                  >
                    {(investment.priceAnalysis?.monthlyReturn ||
                      investment.expectedReturn) >= 0 ? (
                      <ArrowUpRight className="w-5 h-5" />
                    ) : (
                      <ArrowDownRight className="w-5 h-5" />
                    )}
                    <span className="text-2xl">
                      {(investment.priceAnalysis?.monthlyReturn ||
                        investment.expectedReturn) >= 0
                        ? "+"
                        : ""}
                      {investment.priceAnalysis?.monthlyReturn.toFixed(1) ||
                        investment.expectedReturn.toFixed(1)}
                      %
                    </span>
                  </div>
                  <div className="text-xs text-gray-400">30-Day Return</div>
                </div>
              </div>
            </CardHeader>
            <CardContent className="pt-6">
              {/* Price Analysis Summary */}
              {investment.priceAnalysis && (
                <div className="motion-card grid grid-cols-3 md:grid-cols-3 gap-4 mb-6 p-3 bg-gray-700 rounded-lg">
                  <div>
                    <div className="text-xs text-gray-400">30-Day Return</div>
                    <div
                      className="text-lg font-semibold"
                      style={{
                        color:
                          investment.priceAnalysis.monthlyReturn >= 0
                            ? "#10b981"
                            : "#ef4444",
                      }}
                    >
                      {investment.priceAnalysis.monthlyReturn.toFixed(1)}%
                    </div>
                  </div>
                  <div>
                    <div className="text-xs text-gray-400">High (30d)</div>
                    <div className="text-lg font-semibold text-white">
                      {formatUSD(investment.priceAnalysis.highPrice)}
                    </div>
                  </div>
                  <div>
                    <div className="text-xs text-gray-400">Low (30d)</div>
                    <div className="text-lg font-semibold text-white">
                      {formatUSD(investment.priceAnalysis.lowPrice)}
                    </div>
                  </div>
                </div>
              )}

              <div className="grid md:grid-cols-2 gap-6">
                {/* Current Price Chart */}
                <div>
                  <div className="mb-3">
                    <div className="flex justify-between items-center mb-2">
                      <h4 className="font-medium text-white">
                        Current Price Trend (Last 30 Days)
                      </h4>
                      <div className="text-right">
                        <div
                          className="text-lg"
                          style={{ color: investment.color }}
                        >
                          {formatUSD(investment.currentPrice)}
                        </div>
                        <div className="text-xs text-gray-400">
                          Current Price
                        </div>
                      </div>
                    </div>
                  </div>
                  <HistoricalChart
                    data={investment.historicalData}
                    color={investment.color}
                  />
                </div>

                {/* Expected Price Chart */}
                <div>
                  <div className="mb-3">
                    <div className="flex justify-between items-center mb-2">
                      <h4 className="font-medium text-white">
                        Expected Price Trend (Next 30 Days)
                      </h4>
                      <div className="text-right">
                        <div
                          className="text-lg"
                          style={{ color: investment.color }}
                        >
                          {formatUSD(investment.expectedPrice)}
                        </div>
                        <div className="text-xs text-gray-400">
                          Forecasted Price
                        </div>
                      </div>
                    </div>
                  </div>
                  <ForecastChart
                    data={investment.forecastData}
                    color={investment.color}
                  />
                </div>
              </div>

              {/* Investment Summary */}
              {remainingMoney > 0 && (
                <div
                  className="motion-card mt-6 p-4 rounded-lg border"
                  style={{
                    background:
                      "linear-gradient(to right, #70e00015, #9ef01a15)",
                    borderColor: "#70e00030",
                  }}
                >
                  <div className="grid grid-cols-4 gap-4 text-center">
                    <div>
                      <div className="text-xs text-gray-400 mb-1">
                        Suggested Investment
                      </div>
                      <div className="font-medium text-white">
                        {formatIDR(remainingMoney * 0.3)}
                      </div>
                    </div>
                    <div>
                      <div className="text-xs text-gray-400 mb-1">
                        Return (%)
                      </div>
                      <div
                        className="font-medium"
                        style={{
                          color:
                            (investment.priceAnalysis?.monthlyReturn ||
                              investment.expectedReturn) >= 0
                              ? "#10b981"
                              : "#ef4444",
                        }}
                      >
                        {(investment.priceAnalysis?.monthlyReturn ||
                          investment.expectedReturn) >= 0
                          ? "+"
                          : ""}
                        {investment.priceAnalysis?.monthlyReturn.toFixed(1) ||
                          investment.expectedReturn.toFixed(1)}
                        %
                      </div>
                    </div>
                    <div>
                      <div className="text-xs text-gray-400 mb-1">
                        Total Gain (30 days)
                      </div>
                      <div
                        className="font-medium"
                        style={{
                          color:
                            calculatePotentialReturn(investment) >= 0
                              ? "#70e000"
                              : "#ef4444",
                        }}
                      >
                        {calculatePotentialReturn(investment) >= 0 ? "" : "-"}
                        {formatIDR(
                          Math.abs(calculatePotentialReturn(investment)),
                        )}
                      </div>
                    </div>
                    <div>
                      <div className="text-xs text-gray-400 mb-1">
                        Total Value
                      </div>
                      <div className="font-medium text-white">
                        {formatIDR(
                          remainingMoney * 0.3 +
                            calculatePotentialReturn(investment),
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Recommendation */}
              <div
                className="motion-card mt-4 p-3 bg-gray-700 border-l-4 rounded"
                style={{ borderLeftColor: investment.color }}
              >
                <p className="text-sm text-gray-300">
                  <span className="font-medium text-white">
                    Recommendation:
                  </span>{" "}
                  Consider investing in {investment.name} with an expected
                  30-day return of{" "}
                  <span
                    className="font-medium"
                    style={{
                      color:
                        (investment.priceAnalysis?.monthlyReturn ||
                          investment.expectedReturn) >= 0
                          ? "#70e000"
                          : "#ef4444",
                    }}
                  >
                    {investment.priceAnalysis?.monthlyReturn.toFixed(1) ||
                      investment.expectedReturn.toFixed(1)}
                    %
                  </span>
                  .{" "}
                  {investment.riskLevel === "High" &&
                    "However, be aware of the high volatility and only invest what you can afford to lose."}
                  {investment.riskLevel === "Low" &&
                    "This is a stable, long-term investment suitable for conservative investors."}
                  {investment.riskLevel === "Medium" &&
                    "This offers a balanced risk-reward ratio for moderate investors."}
                </p>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Portfolio Allocation Section */}
      <Card className="motion-card bg-gray-800/90 border-gray-700">
        <CardHeader>
          <CardTitle className="text-white flex items-center gap-2">
            <TrendingUp className="w-5 h-5" style={{ color: "#70e000" }} />
            Portfolio Allocation
          </CardTitle>
          <CardDescription className="text-gray-400">
            Recommended portfolio allocation based on your risk profile
          </CardDescription>
        </CardHeader>
        <CardContent>
          {/* Risk Profile Selector */}
          <div className="mb-6 flex gap-2">
            {(["conservative", "balanced", "aggressive"] as const).map(
              (profile) => (
                <button
                  key={profile}
                  onClick={() => setSelectedRiskProfile(profile)}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition duration-300 hover:-translate-y-0.5 ${
                    selectedRiskProfile === profile
                      ? "bg-green-600 text-white"
                      : "bg-gray-700 text-gray-300 hover:bg-gray-600"
                  }`}
                >
                  {profile.charAt(0).toUpperCase() + profile.slice(1)}
                </button>
              ),
            )}
          </div>

          {/* Allocation Table */}
          <div className="grid gap-4 mb-6">
            {portfolioAllocations.map((allocation, index) => (
              <div
                key={index}
                className="motion-card flex items-center justify-between p-3 bg-gray-700 rounded-lg"
              >
                <div className="flex-1">
                  <div className="font-medium text-white">
                    {allocation.name}
                  </div>
                  <div className="text-xs text-gray-400">
                    {allocation.description}
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-lg font-semibold text-white">
                    {(allocation.weight * 100).toFixed(0)}%
                  </div>
                  <div
                    className={`text-xs px-2 py-1 rounded border ${getRiskBadgeColor(
                      allocation.riskLevel,
                    )}`}
                  >
                    {allocation.riskLevel}
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Portfolio Summary */}
          <div
            className="motion-card p-4 rounded-lg border"
            style={{
              background: "linear-gradient(to right, #70e00015, #9ef01a15)",
              borderColor: "#70e00030",
            }}
          >
            <div className="grid grid-cols-2 gap-4">
              <div>
                <div className="text-sm text-gray-400 mb-1">
                  Expected Portfolio Return (30 days)
                </div>
                <div
                  className="text-2xl font-bold"
                  style={{
                    color: portfolioReturn / 12 >= 0 ? "#70e000" : "#ef4444",
                  }}
                >
                  {portfolioReturn / 12 >= 0 ? "+" : ""}
                  {(portfolioReturn / 12).toFixed(1)}%
                </div>
              </div>
              <div>
                <div className="text-sm text-gray-400 mb-1">
                  Allocation Profile
                </div>
                <div className="text-xl font-bold text-white">
                  {selectedRiskProfile.charAt(0).toUpperCase() +
                    selectedRiskProfile.slice(1)}
                </div>
              </div>
            </div>
          </div>

          {remainingMoney > 0 && (
            <div
              className="motion-card mt-4 p-4 rounded-lg border"
              style={{
                background: "linear-gradient(to right, #3b82f615, #06b6d415)",
                borderColor: "#3b82f630",
              }}
            >
              <div className="text-sm text-gray-300 mb-2">
                <span className="font-medium text-white">
                  Suggested Investment Amount:
                </span>{" "}
                {formatIDR(remainingMoney)}
              </div>
              <div className="grid grid-cols-3 gap-4 text-sm">
                {portfolioAllocations.slice(0, 3).map((alloc, index) => (
                  <div key={index}>
                    <div className="text-gray-400 text-xs mb-1">
                      {alloc.name}
                    </div>
                    <div className="font-semibold text-white">
                      {formatIDR(remainingMoney * alloc.weight)}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Disclaimer */}
      <div className="motion-card bg-amber-950 border border-amber-800 rounded-lg p-4">
        <h4 className="font-medium text-amber-400 mb-2">
          ⚠️ Investment Disclaimer
        </h4>
        <p className="text-sm text-amber-300">
          These are educational examples only and not financial advice. Past
          performance does not guarantee future results. All investments carry
          risk. Please consult with a qualified financial advisor before making
          investment decisions.
          <br />
          <span className="block mt-2">
            Project ini adalah contoh edukasi saja dan bukan merupakan nasihat
            keuangan. Semua investasi mengandung risiko. Mohon konsultasikan
            dengan penasihat keuangan yang berkualifikasi sebelum membuat
            keputusan untuk ber-investasi.
          </span>
        </p>
      </div>
    </div>
  );
}
