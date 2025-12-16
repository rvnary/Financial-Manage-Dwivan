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

interface InvestmentRecommendationsProps {
  remainingMoney: number;
  monthlySalary: number;
}

export function InvestmentRecommendations({
  remainingMoney,
  monthlySalary,
}: InvestmentRecommendationsProps) {
  // Calculate investment recommendations based on remaining money
  const getInvestmentAllocation = () => {
    if (remainingMoney <= 0) {
      return [];
    }

    // Investment allocation strategy based on common financial advice
    return [
      {
        name: "Emergency Fund",
        value: Math.round(remainingMoney * 0.3),
        percentage: 30,
        color: "#007200", // green
        description: "High-liquidity savings for unexpected expenses",
      },
      {
        name: "Index Funds / ETFs",
        value: Math.round(remainingMoney * 0.35),
        percentage: 35,
        color: "#008000", // medium green
        description: "Long-term diversified investment",
      },
      {
        name: "Retirement Account",
        value: Math.round(remainingMoney * 0.2),
        percentage: 20,
        color: "#38b000", // bright green
        description: "401(k), IRA, or similar retirement savings",
      },
      {
        name: "Growth Stocks",
        value: Math.round(remainingMoney * 0.1),
        percentage: 10,
        color: "#70e000", // lime green
        description: "Higher risk, higher potential return",
      },
      {
        name: "Personal Development",
        value: Math.round(remainingMoney * 0.05),
        percentage: 5,
        color: "#9ef01a", // yellow-green
        description: "Courses, books, skills training",
      },
    ];
  };

  const investmentData = getInvestmentAllocation();
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
          <p className="text-xs text-gray-500 mt-1 max-w-xs">
            {payload[0].payload.description}
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
          Based on your remaining budget
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
              className={`text-3xl ${
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
              {/* Pie Chart */}
              <div className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={investmentData}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      label={({ name, percentage }) => `${name} ${percentage}%`}
                      outerRadius={80}
                      fill="#8884d8"
                      dataKey="value"
                    >
                      {investmentData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip content={<CustomTooltip />} />
                  </PieChart>
                </ResponsiveContainer>
              </div>

              {/* Investment Breakdown */}
              <div className="space-y-3">
                <h4 className="font-medium text-white">
                  Recommended Allocation
                </h4>
                {investmentData.map((item, index) => (
                  <div
                    key={index}
                    className="flex items-center justify-between p-3 bg-gray-700 rounded-lg border border-gray-600"
                  >
                    <div className="flex items-center gap-3">
                      <div
                        className="w-4 h-4 rounded-full"
                        style={{ backgroundColor: item.color }}
                      />
                      <div>
                        <div className="font-medium text-white">
                          {item.name}
                        </div>
                        <div className="text-sm text-gray-400">
                          {item.description}
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
                <h4 className="mb-2 text-white">💡 Financial Tips</h4>
                <ul className="text-sm space-y-1 text-gray-300">
                  <li>• Build an emergency fund of 3-6 months of expenses</li>
                  <li>• Diversify your investments to manage risk</li>
                  <li>
                    • Consider consulting a financial advisor for personalized
                    advice
                  </li>
                  <li>• Review and adjust your budget regularly</li>
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
