import { hasReturnData } from "../helpers";
import type { AllocationDataItem, StockReturn } from "../types";

interface InvestmentBreakdownListProps {
  allocationData: AllocationDataItem[];
  returnMap: Map<string, number>;
  stockReturns: StockReturn[];
  selectedAllocations: AllocationDataItem[];
}

export function InvestmentBreakdownList({
  allocationData,
  returnMap,
  stockReturns,
  selectedAllocations,
}: InvestmentBreakdownListProps) {
  const showMissingWarning =
    !hasReturnData(selectedAllocations, returnMap) && stockReturns.length > 0;

  return (
    <div className="space-y-3">
      <div className="flex justify-between items-center">
        <h4 className="font-medium text-white">Detail Investasi</h4>
      </div>

      {/* Note if returns data not available for this profile */}
      {showMissingWarning && (
        <div className="p-3 bg-amber-950 border border-amber-800 rounded-lg text-sm text-amber-300">
          Data return untuk profil ini belum dimuat. Pilih profil yang sama di
          bagian "Peluang Investasi" untuk melihat data return langsung.
        </div>
      )}

      {allocationData.map((item, index) => {
        const monthlyReturn = returnMap.get(item.symbol) || 0;
        const hasData = returnMap.has(item.symbol);
        const gain = Math.round(item.value * (monthlyReturn / 100));
        const totalValue = item.value + gain;
        const isPositive = gain >= 0;

        return (
          <div
            key={index}
            className="motion-card flex items-center justify-between p-4 bg-gray-700 rounded-lg border border-gray-600 hover:border-gray-500 transition"
          >
            <div className="flex items-center gap-3 flex-1">
              <div
                className="w-4 h-4 rounded-full"
                style={{ backgroundColor: item.color }}
              />
              <div>
                <div className="font-medium text-white">{item.name}</div>
                <div className="text-xs text-gray-400">
                  Ticker: {item.symbol}
                </div>
              </div>
            </div>
            <div className="text-right">
              <div className="font-medium text-white">
                Rp {item.value.toLocaleString("id-ID")}
              </div>
              <div className="text-xs text-gray-400 mb-1">{item.percentage}%</div>
              {hasData ? (
                <>
                  <div
                    className="text-xs"
                    style={{ color: isPositive ? "#70e000" : "#ef4444" }}
                  >
                    {isPositive ? "+" : ""}
                    {gain < 0 ? "-" : ""}Rp{" "}
                    {Math.abs(gain).toLocaleString("id-ID")} (
                    {monthlyReturn >= 0 ? "+" : ""}
                    {monthlyReturn.toFixed(1)}%)
                  </div>
                  <div className="text-xs text-gray-300">
                    Total: Rp {totalValue.toLocaleString("id-ID")}
                  </div>
                </>
              ) : (
                <div className="text-xs text-gray-500 italic">
                  Data belum dimuat
                </div>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
}
