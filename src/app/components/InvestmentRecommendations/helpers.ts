import type { AllocationEntry } from "./types";

/** Whether any allocation in the selected option has return data loaded.
 *  Caller should show the "data belum dimuat" warning when this is false AND
 *  stockReturns.length > 0 (mirrors the original inline condition). */
export function hasReturnData(
  allocations: AllocationEntry[],
  returnMap: Map<string, number>,
): boolean {
  return allocations.some((alloc) => returnMap.has(alloc.symbol));
}

/** Rupiah-formatted value (no currency symbol, matches original `Rp …` style). */
export function formatRp(value: number): string {
  return `Rp ${value.toLocaleString("id-ID")}`;
}

export const INVESTMENT_TIPS: Array<{ label: string; text: string }> = [
  {
    label: "Konservatif",
    text: "SPY, JNJ, KO - disertakan untuk menjaga diversifikasi, stabilitas bisnis defensif, dan potensi dividen.",
  },
  {
    label: "Seimbang",
    text: "SPY, MSFT, AAPL - disertakan agar portofolio punya indeks luas sekaligus pertumbuhan dari saham teknologi mapan.",
  },
  {
    label: "Agresif",
    text: "NVDA, TSLA, AAPL - disertakan untuk mengejar inovasi/pertumbuhan tinggi dengan risiko volatilitas lebih besar.",
  },
];

export const BUDGET_WARNING_TIPS: string[] = [
  "Tinjau pengeluaran dan cari pos yang bisa dikurangi.",
  "Prioritaskan kebutuhan wajib sebelum pengeluaran hiburan.",
  "Cari peluang menambah pemasukan.",
  "Buat rencana pelunasan utang jika ada cicilan aktif.",
];
