import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "./ui/card";
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from "recharts";
import {
  TrendingUp,
  AlertCircle,
  ShieldCheck,
  Scale,
  Rocket,
} from "lucide-react";
import { useState, useEffect } from "react";

interface InvestmentRecommendationsProps {
  remainingMoney: number;
  monthlySalary: number;
  stockReturns?: Array<{
    symbol: string;
    monthlyReturn: number;
  }>;
  selectedRiskProfile?: "conservative" | "balanced" | "aggressive";
  onRiskProfileChange?: (
    profile: "conservative" | "balanced" | "aggressive",
  ) => void;
}

type RiskProfile = "low" | "medium" | "high";

// Mapping between internal and external risk profile types
const toExternal = (
  profile: RiskProfile,
): "conservative" | "balanced" | "aggressive" => {
  switch (profile) {
    case "low":
      return "conservative";
    case "medium":
      return "balanced";
    case "high":
      return "aggressive";
  }
};

const toInternal = (
  profile: "conservative" | "balanced" | "aggressive",
): RiskProfile => {
  switch (profile) {
    case "conservative":
      return "low";
    case "balanced":
      return "medium";
    case "aggressive":
      return "high";
  }
};

interface AllocationOption {
  profile: RiskProfile;
  label: string;
  description: string;
  thesis: string;
  bestFor: string;
  reason: string;
  behavior: string;
  allocations: Array<{
    name: string;
    symbol: string;
    percentage: number;
    color: string;
  }>;
  expectedReturn: string;
}

interface StockReturn {
  symbol: string;
  monthlyReturn: number; // percentage
}

export function InvestmentRecommendations({
  remainingMoney,
  monthlySalary,
  stockReturns = [],
  selectedRiskProfile: externalRiskProfile,
  onRiskProfileChange,
}: InvestmentRecommendationsProps) {
  // Use external state if provided, otherwise use internal state
  const [internalProfile, setInternalProfile] = useState<RiskProfile>("medium");

  // Sync internal state when external changes
  useEffect(() => {
    if (externalRiskProfile) {
      setInternalProfile(toInternal(externalRiskProfile));
    }
  }, [externalRiskProfile]);

  const selectedProfile = externalRiskProfile
    ? toInternal(externalRiskProfile)
    : internalProfile;

  const setSelectedProfile = (profile: RiskProfile) => {
    setInternalProfile(profile);
    if (onRiskProfileChange) {
      onRiskProfileChange(toExternal(profile));
    }
  };

  // Create a map of stock returns by symbol
  const returnMap = new Map(
    stockReturns.map((sr) => [sr.symbol, sr.monthlyReturn]),
  );

  // Risk profile allocations - matching InvestmentChartsNew stocks
  // Using 3 stocks per profile to minimize API calls
  const allocationOptions: AllocationOption[] = [
    {
      profile: "low",
      label: "Conservative",
      description: "Index core + defensive dividend stocks",
      thesis:
        "Prioritasnya menjaga modal tetap stabil sebelum mengejar return besar.",
      bestFor:
        "Cocok untuk dana awal, horizon pendek-menengah, atau investor yang tidak nyaman dengan volatilitas tinggi.",
      reason:
        "SPY memberi diversifikasi luas, sedangkan JNJ dan KO dipilih karena bisnisnya defensif, arus kas kuat, dan historis lebih tahan saat pasar melemah.",
      behavior:
        "Return cenderung lebih lambat, tetapi penurunan portofolio biasanya lebih terkendali.",
      allocations: [
        {
          name: "S&P 500 ETF (SPY)",
          symbol: "SPY",
          percentage: 50,
          color: "#007200",
        },
        {
          name: "Johnson & Johnson (JNJ)",
          symbol: "JNJ",
          percentage: 30,
          color: "#dc2626",
        },
        {
          name: "Coca-Cola (KO)",
          symbol: "KO",
          percentage: 20,
          color: "#1e40af",
        },
      ],
      expectedReturn: "~5-8%",
    },
    {
      profile: "medium",
      label: "Balanced",
      description: "Index core + profitable blue-chip tech",
      thesis:
        "Profil ini menyeimbangkan stabilitas indeks dengan mesin pertumbuhan dari perusahaan teknologi besar.",
      bestFor:
        "Cocok untuk investor yang ingin growth, tetapi tetap punya jangkar diversifikasi.",
      reason:
        "SPY menjaga eksposur pasar luas, MSFT memberi kualitas pendapatan enterprise/cloud, dan AAPL memberi kekuatan ekosistem serta brand yang konsisten.",
      behavior:
        "Fluktuasi lebih terasa dari Conservative, namun potensi return lebih menarik untuk akumulasi rutin.",
      allocations: [
        {
          name: "S&P 500 ETF (SPY)",
          symbol: "SPY",
          percentage: 40,
          color: "#007200",
        },
        {
          name: "Microsoft (MSFT)",
          symbol: "MSFT",
          percentage: 35,
          color: "#0078d4",
        },
        {
          name: "Apple (AAPL)",
          symbol: "AAPL",
          percentage: 25,
          color: "#a3a3a3",
        },
      ],
      expectedReturn: "~10-15%",
    },
    {
      profile: "high",
      label: "Aggressive",
      description: "High-conviction growth and innovation stocks",
      thesis:
        "Profil ini mengejar pertumbuhan tinggi dengan menerima risiko drawdown yang lebih besar.",
      bestFor:
        "Cocok untuk horizon panjang, surplus yang tidak dipakai kebutuhan wajib, dan investor yang siap melihat harga naik-turun tajam.",
      reason:
        "NVDA dipilih untuk eksposur AI/GPU, TSLA untuk inovasi EV/energi dengan volatilitas tinggi, dan AAPL sebagai penyeimbang kualitas dalam basket growth.",
      behavior:
        "Potensi naiknya paling besar, tetapi koreksi jangka pendek juga bisa paling agresif.",
      allocations: [
        {
          name: "NVIDIA (NVDA)",
          symbol: "NVDA",
          percentage: 40,
          color: "#76b900",
        },
        {
          name: "Tesla (TSLA)",
          symbol: "TSLA",
          percentage: 35,
          color: "#dc2626",
        },
        {
          name: "Apple (AAPL)",
          symbol: "AAPL",
          percentage: 25,
          color: "#a3a3a3",
        },
      ],
      expectedReturn: "~15-30%",
    },
  ];

  const selectedAllocation = allocationOptions.find(
    (opt) => opt.profile === selectedProfile,
  )!;

  const profileVisuals: Record<
    RiskProfile,
    { icon: typeof ShieldCheck; accent: string; label: string; active: string }
  > = {
    low: {
      icon: ShieldCheck,
      accent: "#38bdf8",
      label: "Capital protection",
      active:
        "bg-sky-600 border-sky-400 text-white shadow-lg shadow-sky-900/30",
    },
    medium: {
      icon: Scale,
      accent: "#70e000",
      label: "Risk-return balance",
      active:
        "bg-green-600 border-green-500 text-white shadow-lg shadow-green-900/30",
    },
    high: {
      icon: Rocket,
      accent: "#ef4444",
      label: "Growth acceleration",
      active:
        "bg-red-600 border-red-500 text-white shadow-lg shadow-red-900/30",
    },
  };
  const SelectedProfileIcon = profileVisuals[selectedProfile].icon;

  // Calculate amounts for each allocation
  const allocationData = selectedAllocation.allocations.map((alloc) => ({
    ...alloc,
    value: Math.round(remainingMoney * (alloc.percentage / 100)),
  }));

  const hasRemainingMoney = remainingMoney > 0;

  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white p-3 rounded-lg shadow-lg border border-gray-200">
          <p className="font-medium">{payload[0].name}</p>
          <p className="text-sm text-gray-600">
            Rp {payload[0].value.toLocaleString("id-ID")} (
            {payload[0].payload.percentage}%)
          </p>
        </div>
      );
    }
    return null;
  };

  return (
    <Card className="motion-card motion-glow bg-gray-800/90 border-gray-700 backdrop-blur">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-white">
          <TrendingUp className="w-5 h-5" />
          Investment Recommendations
        </CardTitle>
        <CardDescription className="text-gray-400">
          Choose your risk profile and allocate your remaining budget
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          {/* Remaining Money Display */}
          <div
            className={`motion-card p-4 rounded-lg border ${
              hasRemainingMoney
                ? "bg-green-950 border-green-800"
                : "bg-red-950 border-red-800"
            }`}
          >
            <div className="text-sm text-gray-400 mb-1">Remaining Money</div>
            <div
              className={`text-3xl font-bold ${
                hasRemainingMoney ? "text-green-400" : "text-red-400"
              }`}
            >
              Rp {remainingMoney.toLocaleString("id-ID")}
            </div>
            {!hasRemainingMoney && (
              <div className="flex items-center gap-2 mt-2 text-red-400">
                <AlertCircle className="w-4 h-4" />
                <span className="text-sm">
                  {remainingMoney < 0
                    ? "Your expenses exceed your income!"
                    : "No money available for investment"}
                </span>
              </div>
            )}
          </div>

          {hasRemainingMoney && (
            <>
              {/* Risk Profile Selection */}
              <div>
                <h4 className="font-medium text-white mb-3">
                  Select Risk Profile
                </h4>
                <div className="grid grid-cols-1 gap-3 md:grid-cols-3">
                  {allocationOptions.map((option) => (
                    <button
                      key={option.profile}
                      onClick={() => setSelectedProfile(option.profile)}
                      className={`motion-card p-3 rounded-lg transition border text-left ${
                        selectedProfile === option.profile
                          ? profileVisuals[option.profile].active
                          : "bg-gray-700 border-gray-600 text-gray-300 hover:bg-gray-600"
                      }`}
                    >
                      <div className="font-medium">{option.label}</div>
                      <div className="text-xs mt-1">{option.description}</div>
                    </button>
                  ))}
                </div>
              </div>

              <div
                className="motion-card rounded-2xl border bg-gray-900/70 p-5"
                style={{
                  borderColor: `${profileVisuals[selectedProfile].accent}55`,
                }}
              >
                <div className="mb-4 flex items-center gap-3">
                  <div
                    className="motion-pulse-soft rounded-2xl p-3"
                    style={{
                      backgroundColor: `${profileVisuals[selectedProfile].accent}20`,
                    }}
                  >
                    <SelectedProfileIcon
                      className="h-5 w-5"
                      style={{ color: profileVisuals[selectedProfile].accent }}
                    />
                  </div>
                  <div>
                    <p className="text-xs uppercase tracking-[0.25em] text-gray-500">
                      {profileVisuals[selectedProfile].label}
                    </p>
                    <h4 className="text-lg font-semibold text-white">
                      Why {selectedAllocation.label} is included
                    </h4>
                  </div>
                </div>
                <div className="grid gap-3 md:grid-cols-2">
                  {[
                    selectedAllocation.thesis,
                    selectedAllocation.reason,
                    selectedAllocation.bestFor,
                    selectedAllocation.behavior,
                  ].map((text, index) => (
                    <div
                      key={text}
                      className="rounded-xl border bg-black/20 p-3 text-sm leading-relaxed text-gray-300"
                      style={{
                        borderColor: `${profileVisuals[selectedProfile].accent}33`,
                      }}
                    >
                      <span
                        className="mb-1 block text-xs font-semibold"
                        style={{
                          color: profileVisuals[selectedProfile].accent,
                        }}
                      >
                        {index === 0
                          ? "Thesis"
                          : index === 1
                            ? "Reason"
                            : index === 2
                              ? "Suitable for"
                              : "Expected behavior"}
                      </span>
                      {text}
                    </div>
                  ))}
                </div>
              </div>

              {/* Pie Chart */}
              <div className="motion-card bg-gray-700/80 rounded-lg p-4">
                <h4 className="font-medium text-white mb-4">
                  Allocation Breakdown
                </h4>
                <div className="h-64">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={allocationData}
                        cx="50%"
                        cy="50%"
                        labelLine={false}
                        label={({ symbol, percentage, cx, cy, midAngle }) => {
                          const radius = 100;
                          const RADIAN = Math.PI / 180;
                          const x = cx + radius * Math.cos(-midAngle * RADIAN);
                          const y = cy + radius * Math.sin(-midAngle * RADIAN);
                          return (
                            <text
                              x={x}
                              y={y}
                              textAnchor={x > cx ? "start" : "end"}
                              dominantBaseline="central"
                              className="font-bold"
                              style={{
                                fill: "white",
                                fontSize: "14px",
                                stroke: "rgba(0,0,0,0.7)",
                                strokeWidth: "0.5px",
                              }}
                            >
                              {`${symbol} ${percentage}%`}
                            </text>
                          );
                        }}
                        outerRadius={70}
                        fill="#8884d8"
                        dataKey="value"
                      >
                        {allocationData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                      </Pie>
                      <Tooltip content={<CustomTooltip />} />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
              </div>

              {/* Investment Breakdown Details */}
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <h4 className="font-medium text-white">Investment Details</h4>
                </div>

                {/* Note if returns data not available for this profile */}
                {(() => {
                  const hasReturnData = selectedAllocation.allocations.some(
                    (alloc) => returnMap.has(alloc.symbol),
                  );
                  if (!hasReturnData && stockReturns.length > 0) {
                    return (
                      <div className="p-3 bg-amber-950 border border-amber-800 rounded-lg text-sm text-amber-300">
                        ⚠️ Return data untuk profil ini belum dimuat. Pilih
                        profil yang sama di bagian "Investment Opportunities" di
                        bawah untuk melihat data return real-time.
                      </div>
                    );
                  }
                  return null;
                })()}

                {allocationData.map((item, index) => {
                  const monthlyReturn = returnMap.get(item.symbol) || 0;
                  const hasData = returnMap.has(item.symbol);
                  const gain = Math.round(item.value * (monthlyReturn / 100));
                  const totalValue = item.value + gain;
                  const isPositive = gain >= 0;

                  return (
                    <div
                      key={index}
                      className="motion-card flex items-center justify-between p-4 bg-gray-700 rounded-lg border border-gray-600 hover:border-gray-500 transition"
                    >
                      <div className="flex items-center gap-3 flex-1">
                        <div
                          className="w-4 h-4 rounded-full"
                          style={{ backgroundColor: item.color }}
                        />
                        <div>
                          <div className="font-medium text-white">
                            {item.name}
                          </div>
                          <div className="text-xs text-gray-400">
                            Ticker: {item.symbol}
                          </div>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="font-medium text-white">
                          Rp {item.value.toLocaleString("id-ID")}
                        </div>
                        <div className="text-xs text-gray-400 mb-1">
                          {item.percentage}%
                        </div>
                        {hasData ? (
                          <>
                            <div
                              className="text-xs"
                              style={{
                                color: isPositive ? "#70e000" : "#ef4444",
                              }}
                            >
                              {isPositive ? "+" : ""}
                              {gain < 0 ? "-" : ""}Rp{" "}
                              {Math.abs(gain).toLocaleString("id-ID")} (
                              {monthlyReturn >= 0 ? "+" : ""}
                              {monthlyReturn.toFixed(1)}%)
                            </div>
                            <div className="text-xs text-gray-300">
                              Total: Rp {totalValue.toLocaleString("id-ID")}
                            </div>
                          </>
                        ) : (
                          <div className="text-xs text-gray-500 italic">
                            Data belum dimuat
                          </div>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Total Portfolio Return Summary */}
              {remainingMoney > 0 && (
                <div
                  className="rounded-lg p-4 border mt-4"
                  style={{
                    backgroundColor: (() => {
                      // Calculate total gain to determine background color
                      let totalGain = 0;
                      for (const alloc of selectedAllocation.allocations) {
                        const returnRate = returnMap.get(alloc.symbol) || 0;
                        const invested =
                          remainingMoney * (alloc.percentage / 100);
                        totalGain += invested * (returnRate / 100);
                      }
                      return totalGain >= 0 ? "#70e00015" : "#ef444415";
                    })(),
                    borderColor: (() => {
                      let totalGain = 0;
                      for (const alloc of selectedAllocation.allocations) {
                        const returnRate = returnMap.get(alloc.symbol) || 0;
                        const invested =
                          remainingMoney * (alloc.percentage / 100);
                        totalGain += invested * (returnRate / 100);
                      }
                      return totalGain >= 0 ? "#70e00030" : "#ef444430";
                    })(),
                  }}
                >
                  <div className="space-y-3">
                    <h4 className="font-medium text-white flex items-center gap-2">
                      <TrendingUp
                        className="w-4 h-4"
                        style={{
                          color: (() => {
                            let totalGain = 0;
                            for (const alloc of selectedAllocation.allocations) {
                              const returnRate =
                                returnMap.get(alloc.symbol) || 0;
                              const invested =
                                remainingMoney * (alloc.percentage / 100);
                              totalGain += invested * (returnRate / 100);
                            }
                            return totalGain >= 0 ? "#70e000" : "#ef4444";
                          })(),
                        }}
                      />
                      Total Expected Return (30 days)
                    </h4>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <div className="text-xs text-gray-400 mb-1">
                          Weighted Average Return
                        </div>
                        <div
                          className="text-2xl font-bold"
                          style={{
                            color: (() => {
                              let weightedReturn = 0;
                              for (const alloc of selectedAllocation.allocations) {
                                const returnRate =
                                  returnMap.get(alloc.symbol) || 0;
                                weightedReturn +=
                                  returnRate * (alloc.percentage / 100);
                              }
                              return weightedReturn >= 0
                                ? "#70e000"
                                : "#ef4444";
                            })(),
                          }}
                        >
                          {(() => {
                            let weightedReturn = 0;
                            for (const alloc of selectedAllocation.allocations) {
                              const returnRate =
                                returnMap.get(alloc.symbol) || 0;
                              weightedReturn +=
                                returnRate * (alloc.percentage / 100);
                            }
                            return `${weightedReturn >= 0 ? "+" : ""}${weightedReturn.toFixed(1)}%`;
                          })()}
                        </div>
                      </div>
                      <div>
                        <div className="text-xs text-gray-400 mb-1">
                          Total Gain in Rupiah
                        </div>
                        <div
                          className="text-2xl font-bold"
                          style={{
                            color: (() => {
                              let totalGain = 0;
                              for (const alloc of selectedAllocation.allocations) {
                                const returnRate =
                                  returnMap.get(alloc.symbol) || 0;
                                const invested =
                                  remainingMoney * (alloc.percentage / 100);
                                totalGain += invested * (returnRate / 100);
                              }
                              return totalGain >= 0 ? "#10b981" : "#ef4444";
                            })(),
                          }}
                        >
                          {(() => {
                            let totalGain = 0;
                            for (const alloc of selectedAllocation.allocations) {
                              const returnRate =
                                returnMap.get(alloc.symbol) || 0;
                              const invested =
                                remainingMoney * (alloc.percentage / 100);
                              totalGain += invested * (returnRate / 100);
                            }
                            const absGain = Math.abs(Math.round(totalGain));
                            return `${totalGain >= 0 ? "+" : "-"}Rp ${absGain.toLocaleString("id-ID")}`;
                          })()}
                        </div>
                      </div>
                    </div>
                    <div
                      className="pt-3 border-t"
                      style={{ borderColor: "#70e00030" }}
                    >
                      <div className="text-xs text-gray-400 mb-1">
                        Total Portfolio Value After 30 Days
                      </div>
                      <div className="text-2xl font-bold text-white">
                        {(() => {
                          let totalGain = 0;
                          for (const alloc of selectedAllocation.allocations) {
                            const returnRate = returnMap.get(alloc.symbol) || 0;
                            const invested =
                              remainingMoney * (alloc.percentage / 100);
                            totalGain += invested * (returnRate / 100);
                          }
                          return `Rp ${(remainingMoney + Math.round(totalGain)).toLocaleString("id-ID")}`;
                        })()}
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Additional Tips */}
              <div
                className="motion-card rounded-lg p-4 border"
                style={{
                  backgroundColor: "#70e00010",
                  borderColor: "#70e00030",
                }}
              >
                <h4 className="mb-2 text-white font-medium">
                  💡 Investment Tips
                </h4>
                <ul className="text-sm space-y-1 text-gray-300">
                  <li>
                    • <strong>Conservative:</strong> SPY, JNJ, KO - disertakan
                    untuk menjaga diversifikasi, stabilitas bisnis defensif, dan
                    potensi dividen.
                  </li>
                  <li>
                    • <strong>Balanced:</strong> SPY, MSFT, AAPL - disertakan
                    agar portofolio punya indeks luas sekaligus growth dari
                    blue-chip tech.
                  </li>
                  <li>
                    • <strong>Aggressive:</strong> NVDA, TSLA, AAPL - disertakan
                    untuk mengejar inovasi/pertumbuhan tinggi dengan risiko
                    volatilitas lebih besar.
                  </li>
                  <li>
                    • Each risk profile has different stocks suited to that risk
                    level
                  </li>
                  <li>• Review and rebalance your portfolio regularly</li>
                </ul>
              </div>
            </>
          )}

          {!hasRemainingMoney && remainingMoney < 0 && (
            <div className="bg-amber-950 border border-amber-800 rounded-lg p-4">
              <h4 className="font-medium text-amber-400 mb-2">
                ⚠️ Budget Adjustment Needed
              </h4>
              <ul className="text-sm text-amber-300 space-y-1">
                <li>• Review your expenses and identify areas to cut back</li>
                <li>• Prioritize essential expenses over non-essential ones</li>
                <li>• Look for opportunities to increase your income</li>
                <li>• Consider creating a debt repayment plan</li>
              </ul>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
