import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  Tooltip,
  Legend,
} from "recharts";
import {
  Wallet,
  Home,
  ShoppingBag,
  PiggyBank,
  CreditCard,
  TrendingUp,
  AlertTriangle,
  CheckCircle,
  Target,
} from "lucide-react";

interface FinancialDashboardProps {
  monthlySalary: number;
  primaryExpenses: number;
  secondaryExpenses: number;
  savings: number;
  pocketMoney: number;
  remainingMoney: number;
}

export function FinancialDashboard({
  monthlySalary,
  primaryExpenses,
  secondaryExpenses,
  savings,
  pocketMoney,
  remainingMoney,
}: FinancialDashboardProps) {
  // Calculate percentages
  const totalExpenses = primaryExpenses + secondaryExpenses + pocketMoney;
  const savingsRate = monthlySalary > 0 ? (savings / monthlySalary) * 100 : 0;
  const expenseRate =
    monthlySalary > 0 ? (totalExpenses / monthlySalary) * 100 : 0;
  const remainingRate =
    monthlySalary > 0 ? (remainingMoney / monthlySalary) * 100 : 0;

  // Financial Health Score (0-100)
  const calculateHealthScore = (): number => {
    let score = 50; // Base score

    // Savings rate contribution (ideal: 20%+)
    if (savingsRate >= 30) score += 25;
    else if (savingsRate >= 20) score += 20;
    else if (savingsRate >= 10) score += 10;
    else if (savingsRate >= 5) score += 5;

    // Expense ratio contribution (ideal: <70%)
    if (expenseRate < 50) score += 15;
    else if (expenseRate < 60) score += 10;
    else if (expenseRate < 70) score += 5;
    else if (expenseRate > 90) score -= 10;

    // Remaining money for investment
    if (remainingRate >= 20) score += 10;
    else if (remainingRate >= 10) score += 5;
    else if (remainingRate < 0) score -= 15;

    return Math.max(0, Math.min(100, score));
  };

  const healthScore = calculateHealthScore();

  const getHealthStatus = () => {
    if (healthScore >= 80) return { label: "Excellent", color: "#22c55e" };
    if (healthScore >= 60) return { label: "Good", color: "#70e000" };
    if (healthScore >= 40) return { label: "Fair", color: "#eab308" };
    if (healthScore >= 20)
      return { label: "Needs Improvement", color: "#f97316" };
    return { label: "Critical", color: "#ef4444" };
  };

  const healthStatus = getHealthStatus();

  // Expense breakdown data
  const expenseData = [
    { name: "Primary Expenses", value: primaryExpenses, color: "#ef4444" },
    { name: "Secondary Expenses", value: secondaryExpenses, color: "#f97316" },
    { name: "Savings", value: savings, color: "#22c55e" },
    { name: "Pocket Money", value: pocketMoney, color: "#3b82f6" },
    {
      name: "Available to Invest",
      value: Math.max(0, remainingMoney),
      color: "#70e000",
    },
  ].filter((item) => item.value > 0);

  // Format currency
  const formatIDR = (value: number) => {
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(value);
  };

  // Key metrics
  const metrics = [
    {
      label: "Monthly Income",
      value: formatIDR(monthlySalary),
      icon: Wallet,
      color: "#70e000",
    },
    {
      label: "Total Expenses",
      value: formatIDR(totalExpenses),
      icon: CreditCard,
      color: "#ef4444",
    },
    {
      label: "Savings",
      value: formatIDR(savings),
      icon: PiggyBank,
      color: "#22c55e",
    },
    {
      label: "Available to Invest",
      value: formatIDR(remainingMoney),
      icon: TrendingUp,
      color: remainingMoney >= 0 ? "#70e000" : "#ef4444",
    },
  ];

  // Financial tips based on analysis
  const getTips = (): string[] => {
    const tips: string[] = [];

    if (savingsRate < 20) {
      tips.push(
        "💡 Try to increase your savings rate to at least 20% of income",
      );
    }
    if (expenseRate > 70) {
      tips.push(
        "⚠️ Your expenses exceed 70% of income. Consider reducing secondary expenses",
      );
    }
    if (remainingMoney < 0) {
      tips.push(
        "🚨 Your expenses exceed your income! Review your budget immediately",
      );
    }
    if (pocketMoney > savings) {
      tips.push("💰 Consider saving more than your pocket money allocation");
    }
    if (savingsRate >= 20 && remainingMoney > 0) {
      tips.push(
        "✅ Great job! You're on track with savings and have money to invest",
      );
    }
    if (primaryExpenses > monthlySalary * 0.5) {
      tips.push(
        "🏠 Primary expenses are over 50% of income. Look for ways to reduce fixed costs",
      );
    }

    return tips.slice(0, 3);
  };

  const tips = getTips();

  return (
    <div className="space-y-6">
      {/* Financial Health Score */}
      <Card className="bg-gray-800 border-gray-700">
        <CardHeader className="pb-2">
          <CardTitle className="text-white flex items-center gap-2">
            <Target className="w-5 h-5" />
            Financial Health Score
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center gap-6">
            {/* Score Circle */}
            <div className="relative w-32 h-32">
              <svg
                className="w-32 h-32 transform -rotate-90"
                viewBox="0 0 100 100"
              >
                <circle
                  cx="50"
                  cy="50"
                  r="40"
                  stroke="#374151"
                  strokeWidth="8"
                  fill="none"
                />
                <circle
                  cx="50"
                  cy="50"
                  r="40"
                  stroke={healthStatus.color}
                  strokeWidth="8"
                  fill="none"
                  strokeDasharray={`${healthScore * 2.51} 251`}
                  strokeLinecap="round"
                  className="transition-all duration-1000"
                />
              </svg>
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <span className="text-3xl font-bold text-white">
                  {healthScore}
                </span>
                <span className="text-xs text-gray-400">/ 100</span>
              </div>
            </div>

            {/* Score Details */}
            <div className="flex-1 space-y-2">
              <div className="flex items-center gap-2">
                {healthScore >= 60 ? (
                  <CheckCircle
                    className="w-5 h-5"
                    style={{ color: healthStatus.color }}
                  />
                ) : (
                  <AlertTriangle
                    className="w-5 h-5"
                    style={{ color: healthStatus.color }}
                  />
                )}
                <span
                  className="text-lg font-semibold"
                  style={{ color: healthStatus.color }}
                >
                  {healthStatus.label}
                </span>
              </div>
              <div className="grid grid-cols-2 gap-2 text-sm">
                <div className="text-gray-400">
                  Savings Rate:{" "}
                  <span className="text-white">{savingsRate.toFixed(1)}%</span>
                </div>
                <div className="text-gray-400">
                  Expense Rate:{" "}
                  <span className="text-white">{expenseRate.toFixed(1)}%</span>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Key Metrics Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {metrics.map((metric, index) => (
          <Card key={index} className="bg-gray-800 border-gray-700">
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div
                  className="p-2 rounded-lg"
                  style={{ backgroundColor: `${metric.color}20` }}
                >
                  <metric.icon
                    className="w-5 h-5"
                    style={{ color: metric.color }}
                  />
                </div>
                <div>
                  <p className="text-xs text-gray-400">{metric.label}</p>
                  <p className="text-sm font-semibold text-white">
                    {metric.value}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Expense Breakdown Chart */}
      <Card className="bg-gray-800 border-gray-700">
        <CardHeader>
          <CardTitle className="text-white flex items-center gap-2">
            <ShoppingBag className="w-5 h-5" />
            Budget Breakdown
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col lg:flex-row items-center gap-6">
            <div className="w-full lg:w-1/2 h-64">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={expenseData}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={100}
                    paddingAngle={2}
                    dataKey="value"
                  >
                    {expenseData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip
                    content={({ active, payload }) => {
                      if (active && payload && payload.length) {
                        const data = payload[0].payload;
                        const percentage = (
                          (data.value / monthlySalary) *
                          100
                        ).toFixed(1);
                        return (
                          <div className="bg-gray-900 border border-gray-700 rounded-lg p-3">
                            <p className="text-white font-medium">
                              {data.name}
                            </p>
                            <p className="text-gray-300">
                              {formatIDR(data.value)}
                            </p>
                            <p className="text-gray-400 text-sm">
                              {percentage}% of income
                            </p>
                          </div>
                        );
                      }
                      return null;
                    }}
                  />
                </PieChart>
              </ResponsiveContainer>
            </div>
            <div className="w-full lg:w-1/2 space-y-3">
              {expenseData.map((item, index) => {
                const percentage = ((item.value / monthlySalary) * 100).toFixed(
                  1,
                );
                return (
                  <div key={index} className="flex items-center gap-3">
                    <div
                      className="w-4 h-4 rounded-full"
                      style={{ backgroundColor: item.color }}
                    />
                    <div className="flex-1">
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-300">{item.name}</span>
                        <span className="text-white font-medium">
                          {percentage}%
                        </span>
                      </div>
                      <div className="h-2 bg-gray-700 rounded-full mt-1">
                        <div
                          className="h-full rounded-full transition-all duration-500"
                          style={{
                            width: `${Math.min(100, parseFloat(percentage))}%`,
                            backgroundColor: item.color,
                          }}
                        />
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Financial Tips */}
      {tips.length > 0 && (
        <Card className="bg-gray-800 border-gray-700">
          <CardHeader className="pb-2">
            <CardTitle className="text-white text-base">
              💡 Financial Insights
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="space-y-2">
              {tips.map((tip, index) => (
                <li key={index} className="text-gray-300 text-sm">
                  {tip}
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
