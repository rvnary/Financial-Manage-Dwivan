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
  ShieldCheck,
  ListChecks,
} from "lucide-react";

interface FinancialDashboardProps {
  monthlySalary: number;
  primaryExpenses: number;
  secondaryExpenses: number;
  savings: number;
  pocketMoney: number;
  remainingMoney: number;
  financialGoal?: number;
  emergencyFund?: number;
}

interface InsightItem {
  title: string;
  description: string;
  tone: "success" | "warning" | "danger" | "info";
  metric: string;
}

interface ActionItem {
  title: string;
  description: string;
  priority: "High" | "Medium" | "Low";
  color: string;
}

export function FinancialDashboard({
  monthlySalary,
  primaryExpenses,
  secondaryExpenses,
  savings,
  pocketMoney,
  remainingMoney,
  financialGoal = 0,
  emergencyFund = 0,
}: FinancialDashboardProps) {
  // Calculate percentages
  const totalExpenses = primaryExpenses + secondaryExpenses + pocketMoney;
  const savingsRate = monthlySalary > 0 ? (savings / monthlySalary) * 100 : 0;
  const expenseRate =
    monthlySalary > 0 ? (totalExpenses / monthlySalary) * 100 : 0;
  const remainingRate =
    monthlySalary > 0 ? (remainingMoney / monthlySalary) * 100 : 0;
  const monthlyNeeds = primaryExpenses + secondaryExpenses + pocketMoney;
  const emergencyTarget = monthlyNeeds * 3;
  const emergencyProgress =
    emergencyTarget > 0
      ? Math.min(100, (emergencyFund / emergencyTarget) * 100)
      : 0;
  const goalProgress =
    financialGoal > 0
      ? Math.min(
          100,
          ((savings + Math.max(0, remainingMoney)) / financialGoal) * 100,
        )
      : 0;

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

  const getInsightStyles = (tone: InsightItem["tone"]) => {
    const styles = {
      success: "border-green-700/70 bg-green-950/30 text-green-300",
      warning: "border-amber-700/70 bg-amber-950/30 text-amber-300",
      danger: "border-red-700/70 bg-red-950/30 text-red-300",
      info: "border-sky-700/70 bg-sky-950/30 text-sky-300",
    };

    return styles[tone];
  };

  // Financial insights are generated from the user's current budget condition.
  const getInsights = (): InsightItem[] => {
    const insights: InsightItem[] = [];

    if (remainingMoney < 0) {
      insights.push({
        title: "Cashflow negatif",
        description:
          "Pengeluaran sudah melewati income. Fokus pertama adalah menutup defisit sebelum menambah investasi.",
        tone: "danger",
        metric: formatIDR(Math.abs(remainingMoney)),
      });
    } else if (remainingRate >= 20) {
      insights.push({
        title: "Ruang investasi kuat",
        description:
          "Sisa dana bulanan cukup sehat. Kamu bisa membagi dana ke investasi dan buffer kas.",
        tone: "success",
        metric: `${remainingRate.toFixed(1)}% sisa`,
      });
    } else if (remainingMoney > 0) {
      insights.push({
        title: "Cashflow positif tipis",
        description:
          "Masih ada sisa dana, tapi ruangnya belum besar. Hindari komitmen cicilan atau subscription baru.",
        tone: "warning",
        metric: formatIDR(remainingMoney),
      });
    }

    if (savingsRate < 20) {
      insights.push({
        title: "Savings rate belum ideal",
        description:
          "Target aman minimal 20% income. Naikkan tabungan bertahap agar tidak terasa berat.",
        tone: savingsRate < 10 ? "warning" : "info",
        metric: `${savingsRate.toFixed(1)}% saved`,
      });
    } else {
      insights.push({
        title: "Kebiasaan menabung solid",
        description:
          "Savings rate sudah melewati standar dasar. Pertahankan konsistensi dengan autodebit setelah gajian.",
        tone: "success",
        metric: `${savingsRate.toFixed(1)}% saved`,
      });
    }

    if (expenseRate > 70) {
      insights.push({
        title: "Expense ratio tinggi",
        description:
          "Pengeluaran mengambil porsi besar dari income. Audit kebutuhan sekunder dan biaya tetap bulanan.",
        tone: expenseRate > 90 ? "danger" : "warning",
        metric: `${expenseRate.toFixed(1)}% expense`,
      });
    }

    if (emergencyTarget > 0 && emergencyProgress < 100) {
      insights.push({
        title: "Dana darurat belum penuh",
        description:
          "Sebelum agresif investasi, bangun dana darurat minimal 3x kebutuhan bulanan.",
        tone: emergencyProgress < 33 ? "warning" : "info",
        metric: `${emergencyProgress.toFixed(0)}% siap`,
      });
    }

    if (expenseRate >= 60 && expenseRate <= 70) {
      insights.push({
        title: "Expense ratio mendekati batas",
        description:
          "Pengeluaran masih aman, tapi sudah dekat batas 70%. Monitor belanja kecil yang sering tidak terasa.",
        tone: "info",
        metric: `${expenseRate.toFixed(1)}% expense`,
      });
    }

    if (remainingMoney > 0 && savingsRate < 20) {
      insights.push({
        title: "Sisa dana bisa dorong tabungan",
        description:
          "Jika tidak ada kebutuhan mendesak, sebagian sisa dana bisa dialihkan ke tabungan agar mendekati 20% income.",
        tone: "success",
        metric: formatIDR(
          Math.min(remainingMoney, monthlySalary * 0.2 - savings),
        ),
      });
    }

    if (pocketMoney > savings) {
      insights.push({
        title: "Pocket money lebih besar dari tabungan",
        description:
          "Coba tukar sebagian budget lifestyle menjadi tabungan agar progres goal lebih cepat.",
        tone: "warning",
        metric: `${formatIDR(pocketMoney - savings)} gap`,
      });
    }

    if (primaryExpenses > monthlySalary * 0.5) {
      insights.push({
        title: "Biaya pokok dominan",
        description:
          "Kebutuhan utama melewati 50% income. Cari opsi hemat untuk kos, makan, transport, atau utilitas.",
        tone: "warning",
        metric: `${((primaryExpenses / monthlySalary) * 100).toFixed(1)}% pokok`,
      });
    }

    if (financialGoal > 0) {
      insights.push({
        title:
          goalProgress >= 100
            ? "Target bulanan tercapai"
            : "Target masih perlu dorongan",
        description:
          goalProgress >= 100
            ? "Kontribusi bulan ini sudah memenuhi target. Pertahankan ritme ini bulan depan."
            : "Gunakan sisa dana positif untuk mempercepat target, tapi jangan mengorbankan dana darurat.",
        tone: goalProgress >= 100 ? "success" : "info",
        metric: `${goalProgress.toFixed(0)}% target`,
      });
    }

    return insights.slice(0, 6);
  };

  const insights = getInsights();

  const actionPlan: ActionItem[] = [
    remainingMoney < 0
      ? {
          title: "Stop defisit bulan ini",
          description: `Pangkas minimal ${formatIDR(Math.abs(remainingMoney))} dari expense sekunder/pocket money agar cashflow kembali aman.`,
          priority: "High",
          color: "#ef4444",
        }
      : {
          title: "Pisahkan sisa dana",
          description:
            "Pindahkan sisa dana ke rekening berbeda setelah gajian supaya tidak tercampur uang harian.",
          priority: "Medium",
          color: "#70e000",
        },
    emergencyProgress < 100
      ? {
          title: "Bangun dana darurat",
          description: `Tambahkan ${formatIDR(Math.max(0, emergencyTarget - emergencyFund))} secara bertahap sampai mencapai 3x kebutuhan bulanan.`,
          priority: emergencyProgress < 50 ? "High" : "Medium",
          color: "#f59e0b",
        }
      : {
          title: "Dana darurat aman",
          description:
            "Pertahankan dana darurat tetap likuid dan mulai arahkan surplus ke investasi sesuai profil risiko.",
          priority: "Low",
          color: "#22c55e",
        },
    savingsRate < 20
      ? {
          title: "Naikkan savings rate",
          description:
            "Tambah tabungan 2-5% dari income tiap bulan sampai minimal mencapai 20% income.",
          priority: "Medium",
          color: "#38bdf8",
        }
      : {
          title: "Otomatisasi investasi",
          description:
            "Savings rate sudah solid. Buat jadwal investasi rutin agar keputusan tidak bergantung mood pasar.",
          priority: "Low",
          color: "#70e000",
        },
  ];

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

      {/* Goal and Emergency Fund Planner */}
      <div className="grid gap-4 lg:grid-cols-2">
        <Card className="bg-gray-800 border-gray-700">
          <CardHeader className="pb-2">
            <CardTitle className="text-white flex items-center gap-2 text-base">
              <ShieldCheck className="w-5 h-5" style={{ color: "#70e000" }} />
              Emergency Fund Readiness
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex justify-between text-sm text-gray-300">
              <span>{formatIDR(emergencyFund)}</span>
              <span>Target {formatIDR(emergencyTarget)}</span>
            </div>
            <div className="mt-3 h-3 overflow-hidden rounded-full bg-gray-700">
              <div
                className="h-full rounded-full bg-green-500 transition-all duration-700"
                style={{ width: `${emergencyProgress}%` }}
              />
            </div>
            <p className="mt-3 text-sm text-gray-400">
              {emergencyProgress >= 100
                ? "Dana darurat sudah mencapai standar aman 3 bulan kebutuhan."
                : `Butuh ${formatIDR(Math.max(0, emergencyTarget - emergencyFund))} lagi untuk mencapai standar aman.`}
            </p>
          </CardContent>
        </Card>

        <Card className="bg-gray-800 border-gray-700">
          <CardHeader className="pb-2">
            <CardTitle className="text-white flex items-center gap-2 text-base">
              <Target className="w-5 h-5" style={{ color: "#70e000" }} />
              Monthly Goal Progress
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex justify-between text-sm text-gray-300">
              <span>{goalProgress.toFixed(1)}% dari target</span>
              <span>
                {financialGoal > 0
                  ? formatIDR(financialGoal)
                  : "Belum ada target"}
              </span>
            </div>
            <div className="mt-3 h-3 overflow-hidden rounded-full bg-gray-700">
              <div
                className="h-full rounded-full transition-all duration-700"
                style={{
                  width: `${goalProgress}%`,
                  backgroundColor: "#70e000",
                }}
              />
            </div>
            <p className="mt-3 text-sm text-gray-400">
              {financialGoal > 0
                ? `Kontribusi bulan ini ${formatIDR(savings + Math.max(0, remainingMoney))}.`
                : "Tambahkan target di form untuk memantau progres keuangan bulanan."}
            </p>
          </CardContent>
        </Card>
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

      {/* Financial Insights */}
      <Card className="overflow-hidden border-gray-700 bg-gradient-to-br from-gray-800 via-gray-800 to-gray-900">
        <CardHeader className="pb-2">
          <CardTitle className="text-white flex items-center gap-2 text-base">
            <span className="text-xl">💡</span>
            Financial Insights
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-3">
            {insights.map((insight) => (
              <div
                key={`${insight.title}-${insight.metric}`}
                className={`rounded-2xl border p-4 ${getInsightStyles(insight.tone)}`}
              >
                <div className="mb-3 flex items-start justify-between gap-3">
                  <h4 className="text-sm font-semibold text-white">
                    {insight.title}
                  </h4>
                  <span className="rounded-full bg-black/20 px-2 py-1 text-xs font-semibold">
                    {insight.metric}
                  </span>
                </div>
                <p className="text-sm leading-relaxed text-gray-200">
                  {insight.description}
                </p>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      <Card className="bg-gray-800 border-gray-700">
        <CardHeader className="pb-2">
          <CardTitle className="text-white flex items-center gap-2 text-base">
            <ListChecks className="w-5 h-5" />
            Smart Action Plan
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-3">
            {actionPlan.map((item, index) => (
              <div
                key={item.title}
                className="relative overflow-hidden rounded-2xl border border-gray-700 bg-gray-900/70 p-4"
              >
                <div
                  className="absolute inset-x-0 top-0 h-1"
                  style={{ backgroundColor: item.color }}
                />
                <div className="mb-3 flex items-center justify-between gap-3">
                  <span className="text-xs font-semibold text-green-400">
                    Step {index + 1}
                  </span>
                  <span
                    className="rounded-full px-2 py-1 text-xs font-semibold text-white"
                    style={{ backgroundColor: `${item.color}55` }}
                  >
                    {item.priority}
                  </span>
                </div>
                <h4 className="mb-2 text-base font-semibold text-white">
                  {item.title}
                </h4>
                <p className="text-sm leading-relaxed text-gray-300">
                  {item.description}
                </p>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
