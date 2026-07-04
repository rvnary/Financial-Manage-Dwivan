import { formatIDR } from "../../utils/investmentCalculations";
import type {
  ActionItem,
  BudgetMetrics,
  InsightItem,
} from "./types";

export type InsightTone = InsightItem["tone"];
export type ActionPriority = ActionItem["priority"];

/**
 * Derive all budget rates/progress from the raw dashboard props.
 * Pure function — no React, no closures over component state.
 */
export function deriveBudgetMetrics(args: {
  monthlySalary: number;
  primaryExpenses: number;
  secondaryExpenses: number;
  savings: number;
  pocketMoney: number;
  remainingMoney: number;
  financialGoal: number;
  emergencyFund: number;
}): BudgetMetrics {
  const {
    monthlySalary,
    primaryExpenses,
    secondaryExpenses,
    savings,
    pocketMoney,
    remainingMoney,
    financialGoal,
    emergencyFund,
  } = args;

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

  return {
    totalExpenses,
    savingsRate,
    expenseRate,
    remainingRate,
    monthlyNeeds,
    emergencyTarget,
    emergencyProgress,
    goalProgress,
  };
}

/** Financial Health Score (0-100) based on savings/expense/remaining rates. */
export function calculateHealthScore(metrics: BudgetMetrics): number {
  const { savingsRate, expenseRate, remainingRate } = metrics;
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
}

export function getHealthStatus(
  healthScore: number,
): { label: string; color: string } {
  if (healthScore >= 80) return { label: "Sangat Baik", color: "#22c55e" };
  if (healthScore >= 60) return { label: "Baik", color: "#70e000" };
  if (healthScore >= 40) return { label: "Cukup", color: "#eab308" };
  if (healthScore >= 20) return { label: "Perlu Perbaikan", color: "#f97316" };
  return { label: "Kritis", color: "#ef4444" };
}

export function getInsightStyles(tone: InsightTone): string {
  const styles = {
    success: "border-green-700/70 bg-green-950/30 text-green-300",
    warning: "border-amber-700/70 bg-amber-950/30 text-amber-300",
    danger: "border-red-700/70 bg-red-950/30 text-red-300",
    info: "border-sky-700/70 bg-sky-950/30 text-sky-300",
  };
  return styles[tone];
}

/**
 * Build the expense-breakdown dataset (donut + per-row bars).
 * Zero/negative-value rows are filtered out.
 */
export function getExpenseData(args: {
  primaryExpenses: number;
  secondaryExpenses: number;
  savings: number;
  pocketMoney: number;
  remainingMoney: number;
}): Array<{ name: string; value: number; color: string }> {
  const { primaryExpenses, secondaryExpenses, savings, pocketMoney, remainingMoney } =
    args;
  return [
    { name: "Pengeluaran Utama", value: primaryExpenses, color: "#ef4444" },
    { name: "Pengeluaran Sekunder", value: secondaryExpenses, color: "#f97316" },
    { name: "Tabungan", value: savings, color: "#22c55e" },
    { name: "Uang Saku", value: pocketMoney, color: "#3b82f6" },
    {
      name: "Tersedia untuk Investasi",
      value: Math.max(0, remainingMoney),
      color: "#70e000",
    },
  ].filter((item) => item.value > 0);
}

export interface MetricCard {
  label: string;
  value: string;
  color: string;
  /** Icon name resolved by the barrel from lucide-react. Kept as a key to avoid
   *  coupling this pure module to React component types. */
  iconKey: "Wallet" | "CreditCard" | "PiggyBank" | "TrendingUp";
}

/** Build the 4 key-metric cards. */
export function getMetrics(args: {
  monthlySalary: number;
  totalExpenses: number;
  savings: number;
  remainingMoney: number;
}): MetricCard[] {
  const { monthlySalary, totalExpenses, savings, remainingMoney } = args;
  return [
    {
      label: "Pendapatan Bulanan",
      value: formatIDR(monthlySalary),
      iconKey: "Wallet",
      color: "#70e000",
    },
    {
      label: "Total Pengeluaran",
      value: formatIDR(totalExpenses),
      iconKey: "CreditCard",
      color: "#ef4444",
    },
    {
      label: "Tabungan",
      value: formatIDR(savings),
      iconKey: "PiggyBank",
      color: "#22c55e",
    },
    {
      label: "Tersedia untuk Investasi",
      value: formatIDR(remainingMoney),
      iconKey: "TrendingUp",
      color: remainingMoney >= 0 ? "#70e000" : "#ef4444",
    },
  ];
}

/** Generate up to 6 financial insight cards from the current budget condition. */
export function getInsights(args: {
  monthlySalary: number;
  primaryExpenses: number;
  savings: number;
  pocketMoney: number;
  remainingMoney: number;
  financialGoal: number;
  metrics: BudgetMetrics;
}): InsightItem[] {
  const {
    monthlySalary,
    primaryExpenses,
    savings,
    pocketMoney,
    remainingMoney,
    financialGoal,
    metrics,
  } = args;
  const { savingsRate, expenseRate, remainingRate, emergencyTarget, emergencyProgress, goalProgress } =
    metrics;
  const insights: InsightItem[] = [];

  if (remainingMoney < 0) {
    insights.push({
      title: "Arus kas negatif",
      description:
        "Pengeluaran sudah melewati pemasukan. Fokus pertama adalah menutup defisit sebelum menambah investasi.",
      tone: "danger",
      metric: formatIDR(Math.abs(remainingMoney)),
    });
  } else if (remainingRate >= 20) {
    insights.push({
      title: "Ruang investasi kuat",
      description:
        "Sisa dana bulanan cukup sehat. Kamu bisa membagi dana ke investasi dan cadangan kas.",
      tone: "success",
      metric: `${remainingRate.toFixed(1)}% sisa`,
    });
  } else if (remainingMoney > 0) {
    insights.push({
      title: "Arus kas positif tipis",
      description:
        "Masih ada sisa dana, tapi ruangnya belum besar. Hindari komitmen cicilan atau langganan baru.",
      tone: "warning",
      metric: formatIDR(remainingMoney),
    });
  }

  if (savingsRate < 20) {
    insights.push({
      title: "Rasio tabungan belum ideal",
      description:
        "Target aman minimal 20% pemasukan. Naikkan tabungan bertahap agar tidak terasa berat.",
      tone: savingsRate < 10 ? "warning" : "info",
      metric: `${savingsRate.toFixed(1)}% tersimpan`,
    });
  } else {
    insights.push({
      title: "Kebiasaan menabung solid",
      description:
        "Rasio tabungan sudah melewati standar dasar. Pertahankan konsistensi dengan autodebit setelah gajian.",
      tone: "success",
      metric: `${savingsRate.toFixed(1)}% tersimpan`,
    });
  }

  if (expenseRate > 70) {
    insights.push({
      title: "Rasio pengeluaran tinggi",
      description:
        "Pengeluaran mengambil porsi besar dari pemasukan. Audit kebutuhan sekunder dan biaya tetap bulanan.",
      tone: expenseRate > 90 ? "danger" : "warning",
      metric: `${expenseRate.toFixed(1)}% pengeluaran`,
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
      title: "Rasio pengeluaran mendekati batas",
      description:
        "Pengeluaran masih aman, tapi sudah dekat batas 70%. Monitor belanja kecil yang sering tidak terasa.",
      tone: "info",
      metric: `${expenseRate.toFixed(1)}% pengeluaran`,
    });
  }

  if (remainingMoney > 0 && savingsRate < 20) {
    insights.push({
      title: "Sisa dana bisa dorong tabungan",
      description:
        "Jika tidak ada kebutuhan mendesak, sebagian sisa dana bisa dialihkan ke tabungan agar mendekati 20% pemasukan.",
      tone: "success",
      metric: formatIDR(
        Math.min(remainingMoney, monthlySalary * 0.2 - savings),
      ),
    });
  }

  if (pocketMoney > savings) {
    insights.push({
      title: "Uang saku lebih besar dari tabungan",
      description:
        "Coba tukar sebagian anggaran gaya hidup menjadi tabungan agar progres target lebih cepat.",
      tone: "warning",
      metric: `${formatIDR(pocketMoney - savings)} selisih`,
    });
  }

  if (primaryExpenses > monthlySalary * 0.5) {
    insights.push({
      title: "Biaya pokok dominan",
      description:
        "Kebutuhan utama melewati 50% pemasukan. Cari opsi hemat untuk kos, makan, transport, atau utilitas.",
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
}

/** Build the 3-step smart action plan. */
export function buildActionPlan(args: {
  remainingMoney: number;
  emergencyTarget: number;
  emergencyFund: number;
  emergencyProgress: number;
  savingsRate: number;
}): ActionItem[] {
  const {
    remainingMoney,
    emergencyTarget,
    emergencyFund,
    emergencyProgress,
    savingsRate,
  } = args;
  return [
    remainingMoney < 0
      ? {
          title: "Stop defisit bulan ini",
          description: `Pangkas minimal ${formatIDR(Math.abs(remainingMoney))} dari pengeluaran sekunder atau uang saku agar arus kas kembali aman.`,
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
            "Tambah tabungan 2-5% dari pemasukan tiap bulan sampai minimal mencapai 20% pemasukan.",
          priority: "Medium",
          color: "#38bdf8",
        }
      : {
          title: "Otomatisasi investasi",
          description:
            "Rasio tabungan sudah solid. Buat jadwal investasi rutin agar keputusan tidak bergantung mood pasar.",
          priority: "Low",
          color: "#70e000",
        },
  ];
}

export const priorityLabels: Record<ActionPriority, string> = {
  High: "Tinggi",
  Medium: "Sedang",
  Low: "Rendah",
};
