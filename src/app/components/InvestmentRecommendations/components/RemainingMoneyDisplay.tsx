import { AlertCircle } from "lucide-react";

interface RemainingMoneyDisplayProps {
  remainingMoney: number;
  hasRemainingMoney: boolean;
}

export function RemainingMoneyDisplay({
  remainingMoney,
  hasRemainingMoney,
}: RemainingMoneyDisplayProps) {
  return (
    <div
      className={`motion-card p-4 rounded-lg border ${
        hasRemainingMoney
          ? "bg-green-950 border-green-800"
          : "bg-red-950 border-red-800"
      }`}
    >
      <div className="text-sm text-gray-400 mb-1">Sisa Dana</div>
      <div
        className={`text-3xl font-bold ${
          hasRemainingMoney ? "text-green-400" : "text-red-400"
        }`}
      >
        Rp {remainingMoney.toLocaleString("id-ID")}
      </div>
      {!hasRemainingMoney && (
        <div className="flex items-center gap-2 mt-2 text-red-400">
          <AlertCircle className="w-4 h-4" />
          <span className="text-sm">
            {remainingMoney < 0
              ? "Pengeluaran melebihi pemasukan."
              : "Belum ada dana tersedia untuk investasi."}
          </span>
        </div>
      )}
    </div>
  );
}
