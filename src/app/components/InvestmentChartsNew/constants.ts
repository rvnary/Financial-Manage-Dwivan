import type { RiskLevel } from "../../utils/stockDefinitions";
import type { ExternalRiskProfile } from "./types";

interface ProfileNarrative {
  label: string;
  accent: string;
  title: string;
  reason: string;
}

export const profileNarratives: Record<ExternalRiskProfile, ProfileNarrative> = {
  conservative: {
    label: "Konservatif",
    accent: "#38bdf8",
    title: "Stabil dulu, pertumbuhan belakangan",
    reason:
      "SPY dipakai sebagai core diversifikasi, lalu JNJ dan KO disertakan karena karakter bisnisnya defensif sehingga cocok saat prioritasnya menjaga modal.",
  },
  balanced: {
    label: "Seimbang",
    accent: "#70e000",
    title: "Seimbang antara keamanan dan pertumbuhan",
    reason:
      "SPY menjadi jangkar pasar luas, sementara MSFT dan AAPL disertakan karena kualitas laba dan ekosistemnya memberi potensi pertumbuhan yang lebih konsisten.",
  },
  aggressive: {
    label: "Agresif",
    accent: "#ef4444",
    title: "Kejar potensi naik, siap volatilitas",
    reason:
      "NVDA dan TSLA disertakan untuk eksposur inovasi berisiko tinggi, sedangkan AAPL membantu memberi fondasi kualitas di portofolio pertumbuhan.",
  },
};

export const profileLabels: Record<ExternalRiskProfile, string> = {
  conservative: "Konservatif",
  balanced: "Seimbang",
  aggressive: "Agresif",
};

export const riskLabels: Record<RiskLevel, string> = {
  Low: "Risiko rendah",
  Medium: "Risiko sedang",
  High: "Risiko tinggi",
};

/** Short per-profile hint shown under the main risk-profile selector. */
export const profileHints: Record<ExternalRiskProfile, string> = {
  conservative: "Konservatif: SPY + JNJ + KO untuk diversifikasi dan karakter defensif.",
  balanced: "Seimbang: SPY + MSFT + AAPL untuk indeks luas dan pertumbuhan berkualitas.",
  aggressive: "Agresif: NVDA + TSLA + AAPL untuk pertumbuhan tinggi dengan volatilitas lebih besar.",
};

/** Emoji + accent-color descriptor for the main selector buttons. */
export const profileButtonStyles: Record<
  ExternalRiskProfile,
  { label: string; activeBg: string }
> = {
  conservative: { label: "🛡️ Konservatif", activeBg: "bg-blue-600 text-white" },
  balanced: { label: "⚖️ Seimbang", activeBg: "bg-green-600 text-white" },
  aggressive: { label: "🚀 Agresif", activeBg: "bg-red-600 text-white" },
};
