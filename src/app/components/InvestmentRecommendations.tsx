import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "./ui/card";
import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  Legend,
  Tooltip,
} from "recharts";
import { TrendingUp, AlertCircle } from "lucide-react";
import { useState } from "react";

interface InvestmentRecommendationsProps {
  remainingMoney: number;
  monthlySalary: number;
}

type RiskProfile = "low" | "medium" | "high";

interface AllocationOption {
  profile: RiskProfile;
  label: string;
  description: string;
  allocations: Array<{
    name: string;
    symbol: string;
    percentage: number;
    color: string;
  }>;
  expectedReturn: string;
}

export function InvestmentRecommendations({
  remainingMoney,
  monthlySalary,
}: InvestmentRecommendationsProps) {
  const [selectedProfile, setSelectedProfile] = useState<RiskProfile>("medium");

  // Risk profile allocations for SPY, JNJ, AAPL
  const allocationOptions: AllocationOption[] = [
    {
      profile: "low",
      label: "Low Risk",
      description: "Conservative approach with stability focus",
      allocations: [
        {
          name: "S&P 500 Index (SPY)",
          symbol: "SPY",
          percentage: 50,
          color: "#007200",
        },
        {
          name: "Johnson & Johnson (JNJ)",
          symbol: "JNJ",
          percentage: 30,
          color: "#1e40af",
        },
        {
          name: "Apple (AAPL)",
          symbol: "AAPL",
          percentage: 20,
          color: "#38b000",
        },
      ],
      expectedReturn: "-14.5%",
    },
    {
      profile: "medium",
      label: "Medium Risk",
      description: "Balanced mix of stability and growth",
      allocations: [
        {
          name: "S&P 500 Index (SPY)",
          symbol: "SPY",
          percentage: 40,
          color: "#007200",
        },
        {
          name: "Johnson & Johnson (JNJ)",
          symbol: "JNJ",
          percentage: 35,
          color: "#1e40af",
        },
        {
          name: "Apple (AAPL)",
          symbol: "AAPL",
          percentage: 25,
          color: "#38b000",
        },
      ],
      expectedReturn: "-14.5%",
    },
    {
      profile: "high",
      label: "High Risk",
      description: "Growth-focused with higher volatility",
      allocations: [
        {
          name: "S&P 500 Index (SPY)",
          symbol: "SPY",
          percentage: 30,
          color: "#007200",
        },
        {
          name: "Johnson & Johnson (JNJ)",
          symbol: "JNJ",
          percentage: 40,
          color: "#1e40af",
        },
        {
          name: "Apple (AAPL)",
          symbol: "AAPL",
          percentage: 30,
          color: "#38b000",
        },
      ],
      expectedReturn: "-14.5%",
    },
  ];

  const selectedAllocation = allocationOptions.find(
    (opt) => opt.profile === selectedProfile
  )!;

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
    <Card className="bg-gray-800 border-gray-700">
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
            className={`p-4 rounded-lg border ${
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
                <div className="grid grid-cols-3 gap-2">
                  {allocationOptions.map((option) => (
                    <button
                      key={option.profile}
                      onClick={() => setSelectedProfile(option.profile)}
                      className={`p-3 rounded-lg transition border ${
                        selectedProfile === option.profile
                          ? "bg-green-600 border-green-500 text-white"
                          : "bg-gray-700 border-gray-600 text-gray-300 hover:bg-gray-600"
                      }`}
                    >
                      <div className="font-medium">{option.label}</div>
                      <div className="text-xs mt-1">{option.description}</div>
                    </button>
                  ))}
                </div>
              </div>

              {/* Pie Chart */}
              <div className="bg-gray-700 rounded-lg p-4">
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
                        label={({ symbol, percentage }) =>
                          `${symbol} ${percentage}%`
                        }
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
                  <div className="text-right"></div>
                </div>

                {allocationData.map((item, index) => (
                  <div
                    key={index}
                    className="flex items-center justify-between p-4 bg-gray-700 rounded-lg border border-gray-600 hover:border-gray-500 transition"
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
                      <div className="text-sm text-gray-400">
                        {item.percentage}%
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Additional Tips */}
              <div
                className="rounded-lg p-4 border"
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
                    • <strong>Low Risk:</strong> Best for conservative investors
                    prioritizing stability
                  </li>
                  <li>
                    • <strong>Medium Risk:</strong> Balanced approach for most
                    investors
                  </li>
                  <li>
                    • <strong>High Risk:</strong> For investors with long-term
                    horizons seeking growth
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
