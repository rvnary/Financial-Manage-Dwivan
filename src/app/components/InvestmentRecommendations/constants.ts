import { ShieldCheck, Scale, Rocket, type LucideIcon } from "lucide-react";
import type {
  AllocationOption,
  ExternalRiskProfile,
  RiskProfile,
} from "./types";

/** Mapping between internal (`low|medium|high`) and external (`conservative|balanced|aggressive`) risk profiles. */
export const toExternal = (
  profile: RiskProfile,
): ExternalRiskProfile => {
  switch (profile) {
    case "low":
      return "conservative";
    case "medium":
      return "balanced";
    case "high":
      return "aggressive";
  }
};

export const toInternal = (
  profile: ExternalRiskProfile,
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

/** Risk profile allocations - matching InvestmentChartsNew stocks.
 *  Using 3 stocks per profile to minimize API calls. */
export const allocationOptions: AllocationOption[] = [
  {
    profile: "low",
    label: "Konservatif",
    description: "Indeks inti + saham dividen defensif",
    thesis:
      "Prioritasnya menjaga modal tetap stabil sebelum mengejar return besar.",
    bestFor:
      "Cocok untuk dana awal, horizon pendek-menengah, atau investor yang tidak nyaman dengan volatilitas tinggi.",
    reason:
      "SPY memberi diversifikasi luas, sedangkan JNJ dan KO dipilih karena bisnisnya defensif, arus kas kuat, dan historis lebih tahan saat pasar melemah.",
    behavior:
      "Return cenderung lebih lambat, tetapi penurunan portofolio biasanya lebih terkendali.",
    allocations: [
      { name: "S&P 500 ETF (SPY)", symbol: "SPY", percentage: 50, color: "#007200" },
      { name: "Johnson & Johnson (JNJ)", symbol: "JNJ", percentage: 30, color: "#dc2626" },
      { name: "Coca-Cola (KO)", symbol: "KO", percentage: 20, color: "#1e40af" },
    ],
    expectedReturn: "~5-8%",
  },
  {
    profile: "medium",
    label: "Seimbang",
    description: "Indeks inti + teknologi mapan profitabel",
    thesis:
      "Profil ini menyeimbangkan stabilitas indeks dengan mesin pertumbuhan dari perusahaan teknologi besar.",
    bestFor:
      "Cocok untuk investor yang ingin pertumbuhan, tetapi tetap punya jangkar diversifikasi.",
    reason:
      "SPY menjaga eksposur pasar luas, MSFT memberi kualitas pendapatan enterprise/cloud, dan AAPL memberi kekuatan ekosistem serta brand yang konsisten.",
    behavior:
      "Fluktuasi lebih terasa dari profil Konservatif, namun potensi return lebih menarik untuk akumulasi rutin.",
    allocations: [
      { name: "S&P 500 ETF (SPY)", symbol: "SPY", percentage: 40, color: "#007200" },
      { name: "Microsoft (MSFT)", symbol: "MSFT", percentage: 35, color: "#0078d4" },
      { name: "Apple (AAPL)", symbol: "AAPL", percentage: 25, color: "#a3a3a3" },
    ],
    expectedReturn: "~10-15%",
  },
  {
    profile: "high",
    label: "Agresif",
    description: "Saham pertumbuhan dan inovasi berkeyakinan tinggi",
    thesis:
      "Profil ini mengejar pertumbuhan tinggi dengan menerima risiko drawdown yang lebih besar.",
    bestFor:
      "Cocok untuk horizon panjang, surplus yang tidak dipakai kebutuhan wajib, dan investor yang siap melihat harga naik-turun tajam.",
    reason:
      "NVDA dipilih untuk eksposur AI/GPU, TSLA untuk inovasi EV/energi dengan volatilitas tinggi, dan AAPL sebagai penyeimbang kualitas dalam basket pertumbuhan.",
    behavior:
      "Potensi naiknya paling besar, tetapi koreksi jangka pendek juga bisa paling agresif.",
    allocations: [
      { name: "NVIDIA (NVDA)", symbol: "NVDA", percentage: 40, color: "#76b900" },
      { name: "Tesla (TSLA)", symbol: "TSLA", percentage: 35, color: "#dc2626" },
      { name: "Apple (AAPL)", symbol: "AAPL", percentage: 25, color: "#a3a3a3" },
    ],
    expectedReturn: "~15-30%",
  },
];

export interface ProfileVisual {
  icon: LucideIcon;
  accent: string;
  label: string;
  active: string;
}

export const profileVisuals: Record<RiskProfile, ProfileVisual> = {
  low: {
    icon: ShieldCheck,
    accent: "#38bdf8",
    label: "Proteksi modal",
    active: "bg-sky-600 border-sky-400 text-white shadow-lg shadow-sky-900/30",
  },
  medium: {
    icon: Scale,
    accent: "#70e000",
    label: "Seimbang risiko-return",
    active:
      "bg-green-600 border-green-500 text-white shadow-lg shadow-green-900/30",
  },
  high: {
    icon: Rocket,
    accent: "#ef4444",
    label: "Akselerasi pertumbuhan",
    active: "bg-red-600 border-red-500 text-white shadow-lg shadow-red-900/30",
  },
};
