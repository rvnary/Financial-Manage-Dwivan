import { TrendingUp } from "lucide-react";
import type { PortfolioReturnSummary } from "../usePortfolioReturn";

interface TotalReturnSummaryProps {
  remainingMoney: number;
  summary: PortfolioReturnSummary;
}

export function TotalReturnSummary({
  remainingMoney,
  summary,
}: TotalReturnSummaryProps) {
  const { totalGain, weightedReturn, projectedValue, isPositive } = summary;
  const positiveColor = "#70e000";
  const negativeColor = "#ef4444";
  const gainColor = isPositive ? positiveColor : negativeColor;

  return (
    <div
      className="rounded-lg p-4 border mt-4"
      style={{
        backgroundColor: isPositive ? "#70e00015" : "#ef444415",
        borderColor: isPositive ? "#70e00030" : "#ef444430",
      }}
    >
      <div className="space-y-3">
        <h4 className="font-medium text-white flex items-center gap-2">
          <TrendingUp className="w-4 h-4" style={{ color: gainColor }} />
          Estimasi Return Total (30 hari)
        </h4>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <div className="text-xs text-gray-400 mb-1">
              Return rata-rata tertimbang
            </div>
            <div
              className="text-2xl font-bold"
              style={{
                color: weightedReturn >= 0 ? positiveColor : negativeColor,
              }}
            >
              {weightedReturn >= 0 ? "+" : ""}
              {weightedReturn.toFixed(1)}%
            </div>
          </div>
          <div>
            <div className="text-xs text-gray-400 mb-1">
              Estimasi gain rupiah
            </div>
            <div
              className="text-2xl font-bold"
              style={{ color: isPositive ? "#10b981" : negativeColor }}
            >
              {isPositive ? "+" : "-"}Rp {Math.abs(Math.round(totalGain)).toLocaleString("id-ID")}
            </div>
          </div>
        </div>
        <div className="pt-3 border-t" style={{ borderColor: "#70e00030" }}>
          <div className="text-xs text-gray-400 mb-1">
            Estimasi nilai portofolio setelah 30 hari
          </div>
          <div className="text-2xl font-bold text-white">
            Rp {projectedValue.toLocaleString("id-ID")}
          </div>
        </div>
      </div>
    </div>
  );
}
