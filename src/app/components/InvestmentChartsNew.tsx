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
import { TrendingUp, ArrowUpRight, Loader2 } from "lucide-react";
import {
  fetchAlphaVantageData,
  isAlphaVantageConfigured,
} from "../utils/alphaVantageApi";
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
} from "../utils/investmentCalculations";

interface InvestmentChartsProps {
  remainingMoney: number;
  onStockReturnsChange?: (
    returns: Array<{ symbol: string; monthlyReturn: number }>
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
}: InvestmentChartsProps) {
  const [investments, setInvestments] = useState<InvestmentOption[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [portfolioAllocations, setPortfolioAllocations] = useState<
    AllocationRecommendation[]
  >([]);
  const [selectedRiskProfile, setSelectedRiskProfile] = useState<
    "conservative" | "balanced" | "aggressive"
  >("balanced");
  const [portfolioReturn, setPortfolioReturn] = useState(0);

  // Investment symbols to fetch from API
  const defaultInvestments = [
    {
      symbol: "SPY",
      name: "S&P 500 Index Fund (SPY)",
      basePrice: 610,
      color: "#007200",
      description:
        "Diversified index fund tracking the 500 largest US companies",
      riskLevel: "Low" as const,
    },
    {
      symbol: "JNJ",
      name: "Johnson & Johnson (JNJ)",
      basePrice: 160,
      color: "#1e40af",
      description: "Diversified healthcare leader with stable dividends",
      riskLevel: "Low" as const,
    },
    {
      symbol: "AAPL",
      name: "Apple (AAPL)",
      basePrice: 250,
      color: "#38b000",
      description: "Technology innovator with high growth potential",
      riskLevel: "High" as const,
    },
  ];

  useEffect(() => {
    const loadInvestmentData = async () => {
      setLoading(true);
      setError(null);

      // Check if API is configured
      if (!isAlphaVantageConfigured()) {
        setError(
          "Alpha Vantage API key is not configured. Please add VITE_ALPHA_VANTAGE_API_KEY to .env file"
        );
        setLoading(false);
        return;
      }

      const loadedInvestments: InvestmentOption[] = [];

      for (const investment of defaultInvestments) {
        try {
          // Fetch ONLY from Alpha Vantage API - NO MOCK DATA
          const historicalData = await fetchAlphaVantageData(investment.symbol);

          // Analyze real data
          const priceAnalysis = analyzePriceMovement(
            historicalData.map((p) => ({ close: p.close }))
          );

          const currentPrice = historicalData[historicalData.length - 1].close;

          // Generate forecast based on CAGR
          const forecast = generateForecastData(
            currentPrice,
            priceAnalysis.annualizedCAGR,
            30
          );

          loadedInvestments.push({
            symbol: investment.symbol,
            name: investment.name,
            currentPrice,
            expectedPrice: priceAnalysis.forecastedPrice30Days,
            expectedReturn: priceAnalysis.annualizedReturn,
            riskLevel: investment.riskLevel,
            historicalData,
            forecastData: forecast,
            color: investment.color,
            description: investment.description,
            priceAnalysis,
          });
        } catch (error) {
          const errorMsg =
            error instanceof Error ? error.message : String(error);
          console.error(
            `Failed to load data for ${investment.symbol}: ${errorMsg}`
          );
          // Show error and stop loading
          setError(
            `Data tidak tersedia untuk ${investment.symbol}: ${errorMsg}`
          );
          setLoading(false);
          return;
        }
      }

      if (loadedInvestments.length === 0) {
        setError("Tidak ada data investasi yang berhasil dimuat");
        setLoading(false);
        return;
      }

      setInvestments(loadedInvestments);
      setLoading(false);

      // Call callback with stock returns
      if (onStockReturnsChange) {
        const stockReturns = loadedInvestments.map((inv) => ({
          symbol: inv.symbol,
          monthlyReturn: inv.priceAnalysis?.monthlyReturn || 0,
        }));
        onStockReturnsChange(stockReturns);
      }
    };

    loadInvestmentData();
  }, []);

  // Update portfolio allocations when risk profile changes
  useEffect(() => {
    const allocations = getPortfolioAllocation(selectedRiskProfile);
    setPortfolioAllocations(allocations);

    // Calculate portfolio return based on risk profile and stock returns
    if (investments.length > 0) {
      const stockReturns = investments.map((inv) => inv.expectedReturn);
      const totalReturn = calculatePortfolioReturnByProfile(
        selectedRiskProfile,
        stockReturns
      );
      setPortfolioReturn(totalReturn);
    }
  }, [selectedRiskProfile, investments]);

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
            domain={["dataMin - 100", "dataMax + 100"]}
          />
          <Tooltip
            contentStyle={{
              backgroundColor: "#1f2937",
              border: "1px solid #374151",
              borderRadius: "8px",
              fontSize: "12px",
              color: "#fff",
            }}
            formatter={(value: any) => `${formatUSD(value as number)}`}
          />
          <Area
            type="monotone"
            dataKey="price"
            stroke={color}
            fill={color}
            fillOpacity={0.1}
            strokeWidth={2}
          />
          <Line
            type="monotone"
            dataKey="price"
            stroke={color}
            strokeWidth={3}
            dot={false}
            strokeDasharray="5 5"
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
            domain={["dataMin - 100", "dataMax + 100"]}
          />
          <Tooltip
            contentStyle={{
              backgroundColor: "#1f2937",
              border: "1px solid #374151",
              borderRadius: "8px",
              fontSize: "12px",
              color: "#fff",
            }}
            formatter={(value: any) => `${formatUSD(value as number)}`}
          />
          <Line
            type="monotone"
            dataKey="close"
            stroke={color}
            strokeWidth={2}
            dot={false}
          />
          <Area
            type="monotone"
            dataKey="close"
            stroke={color}
            fill={color}
            fillOpacity={0.1}
            strokeWidth={1}
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
      <div className="flex items-center justify-center py-12">
        <Loader2
          className="w-8 h-8 animate-spin"
          style={{ color: "#70e000" }}
        />
        <span className="ml-2 text-gray-400">
          Loading investment data from Finnhub API...
        </span>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-950 border border-red-800 rounded-lg p-4">
        <h4 className="font-medium text-red-400 mb-2">❌ Error Loading Data</h4>
        <p className="text-red-300 text-sm">{error}</p>
        <p className="text-red-400 text-sm mt-2">
          Troubleshooting: (1) Check if your Alpha Vantage API key is valid in
          .env file, (2) Wait 1 minute if you see rate limit error, (3) Verify
          symbol format is correct (MSFT for US, TSCO.LON for London)
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-6 mt-8">
      {/* API Configuration Alert */}
      {!isAlphaVantageConfigured() && (
        <div className="bg-orange-950 border border-orange-800 rounded-lg p-4">
          <h4 className="font-medium text-orange-400 mb-2">
            ⚠️ Alpha Vantage API Key Not Configured
          </h4>
          <p className="text-sm text-orange-300 mb-3">
            To use real market data, please configure your Alpha Vantage API
            key:
          </p>
          <ol className="text-sm text-orange-300 list-decimal list-inside space-y-1 mb-3">
            <li>
              Sign up for free at{" "}
              <a
                href="https://www.alphavantage.co"
                target="_blank"
                rel="noopener noreferrer"
                className="text-orange-200 underline"
              >
                https://www.alphavantage.co
              </a>
            </li>
            <li>Get your API key from the dashboard</li>
            <li>
              Create a <code className="bg-orange-900 px-1 rounded">.env</code>{" "}
              file in the project root
            </li>
            <li>
              Add:{" "}
              <code className="bg-orange-900 px-2 py-1 rounded">
                VITE_ALPHA_VANTAGE_API_KEY=your_api_key
              </code>
            </li>
            <li>Restart the development server</li>
          </ol>
          <p className="text-xs text-orange-400">
            Free tier: 5 API calls/minute, 500 per day
          </p>
        </div>
      )}

      <div className="flex items-center gap-2">
        <TrendingUp className="w-6 h-6" style={{ color: "#70e000" }} />
        <h2 className="text-2xl text-white">Investment Opportunities</h2>
      </div>
      <p className="text-gray-400">
        Based on historical market analysis, here are top investment
        recommendations with expected 30-day returns
        {isAlphaVantageConfigured() ? (
          <span className="text-green-400"> (Real-time market data)</span>
        ) : (
          <span className="text-orange-400">
            {" "}
            (API key not configured - configure Alpha Vantage API key)
          </span>
        )}
      </p>

      {/* Investment Cards */}
      <div className="grid gap-6">
        {investments.map((investment, index) => (
          <Card
            key={index}
            className="overflow-hidden bg-gray-800 border-gray-700"
          >
            <CardHeader className="bg-gradient-to-r from-gray-800 to-gray-750">
              <div className="flex justify-between items-start">
                <div>
                  <CardTitle className="flex items-center gap-2 text-white">
                    {investment.name}
                    <span
                      className={`text-xs px-2 py-1 rounded-full border ${getRiskBadgeColor(
                        investment.riskLevel
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
                    className="flex items-center gap-1"
                    style={{ color: "#70e000" }}
                  >
                    <ArrowUpRight className="w-5 h-5" />
                    <span className="text-2xl">
                      +
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
                <div className="grid grid-cols-3 md:grid-cols-3 gap-4 mb-6 p-3 bg-gray-700 rounded-lg">
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
                  className="mt-6 p-4 rounded-lg border"
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
                      <div className="font-medium" style={{ color: "#10b981" }}>
                        +
                        {investment.priceAnalysis?.monthlyReturn.toFixed(1) ||
                          investment.expectedReturn.toFixed(1)}
                        %
                      </div>
                    </div>
                    <div>
                      <div className="text-xs text-gray-400 mb-1">
                        Total Gain (30 days)
                      </div>
                      <div className="font-medium" style={{ color: "#70e000" }}>
                        {formatIDR(calculatePotentialReturn(investment))}
                      </div>
                    </div>
                    <div>
                      <div className="text-xs text-gray-400 mb-1">
                        Total Value
                      </div>
                      <div className="font-medium text-white">
                        {formatIDR(
                          remainingMoney * 0.3 +
                            calculatePotentialReturn(investment)
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Recommendation */}
              <div
                className="mt-4 p-3 bg-gray-700 border-l-4 rounded"
                style={{ borderLeftColor: investment.color }}
              >
                <p className="text-sm text-gray-300">
                  <span className="font-medium text-white">
                    Recommendation:
                  </span>{" "}
                  Consider investing in {investment.name} with an expected
                  30-day return of{" "}
                  <span className="font-medium" style={{ color: "#70e000" }}>
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
      <Card className="bg-gray-800 border-gray-700">
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
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition ${
                    selectedRiskProfile === profile
                      ? "bg-green-600 text-white"
                      : "bg-gray-700 text-gray-300 hover:bg-gray-600"
                  }`}
                >
                  {profile.charAt(0).toUpperCase() + profile.slice(1)}
                </button>
              )
            )}
          </div>

          {/* Allocation Table */}
          <div className="grid gap-4 mb-6">
            {portfolioAllocations.map((allocation, index) => (
              <div
                key={index}
                className="flex items-center justify-between p-3 bg-gray-700 rounded-lg"
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
                      allocation.riskLevel
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
            className="p-4 rounded-lg border"
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
                  style={{ color: "#70e000" }}
                >
                  +{(portfolioReturn / 12).toFixed(1)}%
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
              className="mt-4 p-4 rounded-lg border"
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
      <div className="bg-amber-950 border border-amber-800 rounded-lg p-4">
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
