import { formatNominalIDR } from "../format";

interface LiveBudgetCheckerProps {
  allocationRate: number;
  isOverBudget: boolean;
  liveRemaining: number;
  totalAllocated: number;
  savingsRate: number;
}

export function LiveBudgetChecker({
  allocationRate,
  isOverBudget,
  liveRemaining,
  totalAllocated,
  savingsRate,
}: LiveBudgetCheckerProps) {
  return (
    <div
      className={`motion-card sticky top-4 rounded-2xl border p-4 shadow-lg ${
        isOverBudget
          ? "border-red-800 bg-red-950/60"
          : "border-green-800 bg-green-950/40"
      }`}
      aria-live="polite"
    >
      <div className="flex items-center justify-between gap-4 text-sm">
        <span className="text-gray-300">Pengecekan budget langsung</span>
        <span className={isOverBudget ? "text-red-300" : "text-green-300"}>
          {allocationRate.toFixed(1)}% teralokasi
        </span>
      </div>
      <div
        className="mt-2 h-2 overflow-hidden rounded-full bg-gray-700"
        role="progressbar"
        aria-valuenow={Math.min(100, allocationRate)}
        aria-valuemin={0}
        aria-valuemax={100}
      >
        <div
          className={
            isOverBudget
              ? "motion-bar h-full bg-red-500 transition-all duration-700"
              : "motion-bar h-full bg-green-500 transition-all duration-700"
          }
          style={{ width: `${Math.min(100, allocationRate)}%` }}
        />
      </div>
      <p className="mt-2 text-sm text-gray-300">
        Sisa sementara: {formatNominalIDR(Math.abs(liveRemaining)) || "Rp 0"}
        {isOverBudget ? " melebihi budget" : " tersedia"}
      </p>
      <div className="mt-4 grid gap-3 text-xs text-gray-300 sm:grid-cols-3">
        <div className="rounded-lg bg-black/20 p-3">
          <span className="block text-gray-500">Rasio tabungan</span>
          <strong className="text-white">{savingsRate.toFixed(1)}%</strong>
        </div>
        <div className="rounded-lg bg-black/20 p-3">
          <span className="block text-gray-500">Teralokasi</span>
          <strong className="text-white">
            {formatNominalIDR(totalAllocated)}
          </strong>
        </div>
        <div className="rounded-lg bg-black/20 p-3">
          <span className="block text-gray-500">Status</span>
          <strong
            className={isOverBudget ? "text-red-300" : "text-green-300"}
          >
            {isOverBudget ? "Perlu dikurangi" : "Aman"}
          </strong>
        </div>
      </div>
    </div>
  );
}
