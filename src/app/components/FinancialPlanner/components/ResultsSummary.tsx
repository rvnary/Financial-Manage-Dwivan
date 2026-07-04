import { CheckCircle2 } from "lucide-react";
import { formatNominalIDR } from "../format";

interface ResultsSummaryProps {
  remainingMoney: number;
  isOverBudget: boolean;
  savingsRate: number;
}

export function ResultsSummary({
  remainingMoney,
  isOverBudget,
  savingsRate,
}: ResultsSummaryProps) {
  return (
    <div className="mb-6 rounded-2xl border border-green-800/60 bg-green-950/30 p-5 shadow-lg backdrop-blur">
      <div className="flex items-start gap-3">
        <CheckCircle2 className="mt-1 h-6 w-6 flex-shrink-0 text-green-400" />
        <div className="flex-1">
          <h2 className="text-xl text-white">Hasil Perencanaan</h2>
          <p className="mt-1 text-sm text-gray-300">
            Berikut ringkasan keuangan Anda. Telusuri tab di bawah untuk melihat
            dashboard, simulasi, dan rekomendasi investasi.
          </p>
          <div className="mt-4 grid gap-3 sm:grid-cols-3">
            <div className="rounded-lg bg-black/30 p-3">
              <span className="block text-xs text-gray-500">Sisa uang</span>
              <strong
                className={`text-base ${
                  remainingMoney < 0 ? "text-red-300" : "text-green-300"
                }`}
              >
                {formatNominalIDR(Math.abs(remainingMoney)) || "Rp 0"}
                {remainingMoney < 0 ? " (defisit)" : ""}
              </strong>
            </div>
            <div className="rounded-lg bg-black/30 p-3">
              <span className="block text-xs text-gray-500">Status budget</span>
              <strong
                className={`text-base ${
                  isOverBudget ? "text-red-300" : "text-green-300"
                }`}
              >
                {isOverBudget ? "Perlu dikurangi" : "Aman"}
              </strong>
            </div>
            <div className="rounded-lg bg-black/30 p-3">
              <span className="block text-xs text-gray-500">
                Rasio tabungan
              </span>
              <strong className="text-base text-white">
                {savingsRate.toFixed(1)}%
              </strong>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
