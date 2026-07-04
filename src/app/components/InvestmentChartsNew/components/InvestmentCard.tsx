import { ArrowUpRight, ArrowDownRight } from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../../ui/card";
import { formatUSD, formatIDR } from "../../../utils/investmentCalculations";
import type { InvestmentOption } from "../types";
import { riskLabels } from "../constants";
import { getRiskBadgeColor, calculatePotentialReturn } from "../helpers";
import { HistoricalChart } from "../charts/HistoricalChart";
import { ForecastChart } from "../charts/ForecastChart";

interface InvestmentCardProps {
  investment: InvestmentOption;
  remainingMoney: number;
}

export function InvestmentCard({
  investment,
  remainingMoney,
}: InvestmentCardProps) {
  return (
    <Card className="motion-card overflow-hidden bg-gray-800/90 border-gray-700">
      <CardHeader className="bg-gradient-to-r from-gray-800 to-gray-750">
        <div className="flex justify-between items-start">
          <div>
            <CardTitle className="flex items-center gap-2 text-white">
              {investment.name}
              <span
                className={`text-xs px-2 py-1 rounded-full border ${getRiskBadgeColor(
                  investment.riskLevel,
                )}`}
              >
                {riskLabels[investment.riskLevel]}
              </span>
            </CardTitle>
            <CardDescription className="mt-2 text-gray-400">
              {investment.description}
            </CardDescription>
          </div>
          <div className="text-right">
            <div
              className="flex items-center gap-1 justify-end"
              style={{
                color:
                  (investment.priceAnalysis?.monthlyReturn ||
                    investment.expectedReturn) >= 0
                    ? "#70e000"
                    : "#ef4444",
              }}
            >
              {(investment.priceAnalysis?.monthlyReturn ||
                investment.expectedReturn) >= 0 ? (
                <ArrowUpRight className="w-5 h-5" />
              ) : (
                <ArrowDownRight className="w-5 h-5" />
              )}
              <span className="text-2xl">
                {(investment.priceAnalysis?.monthlyReturn ||
                  investment.expectedReturn) >= 0
                  ? "+"
                  : ""}
                {investment.priceAnalysis?.monthlyReturn.toFixed(1) ||
                  investment.expectedReturn.toFixed(1)}
                %
              </span>
            </div>
            <div className="text-xs text-gray-400">Return 30 hari</div>
          </div>
        </div>
      </CardHeader>
      <CardContent className="pt-6">
        {/* Price Analysis Summary */}
        {investment.priceAnalysis && (
          <div className="motion-card grid grid-cols-3 md:grid-cols-3 gap-4 mb-6 p-3 bg-gray-700 rounded-lg">
            <div>
              <div className="text-xs text-gray-400">Return 30 hari</div>
              <div
                className="text-lg font-semibold"
                style={{
                  color:
                    investment.priceAnalysis.monthlyReturn >= 0
                      ? "#10b981"
                      : "#ef4444",
                }}
              >
                {investment.priceAnalysis.monthlyReturn.toFixed(1)}%
              </div>
            </div>
            <div>
              <div className="text-xs text-gray-400">Tertinggi (30h)</div>
              <div className="text-lg font-semibold text-white">
                {formatUSD(investment.priceAnalysis.highPrice)}
              </div>
            </div>
            <div>
              <div className="text-xs text-gray-400">Terendah (30h)</div>
              <div className="text-lg font-semibold text-white">
                {formatUSD(investment.priceAnalysis.lowPrice)}
              </div>
            </div>
          </div>
        )}

        <div className="grid md:grid-cols-2 gap-6">
          {/* Current Price Chart */}
          <div>
            <div className="mb-3">
              <div className="flex justify-between items-center mb-2">
                <h4 className="font-medium text-white">
                  Tren Harga Saat Ini (30 Hari Terakhir)
                </h4>
                <div className="text-right">
                  <div
                    className="text-lg"
                    style={{ color: investment.color }}
                  >
                    {formatUSD(investment.currentPrice)}
                  </div>
                  <div className="text-xs text-gray-400">Harga saat ini</div>
                </div>
              </div>
            </div>
            <HistoricalChart
              data={investment.historicalData}
              color={investment.color}
            />
          </div>

          {/* Expected Price Chart */}
          <div>
            <div className="mb-3">
              <div className="flex justify-between items-center mb-2">
                <h4 className="font-medium text-white">
                  Proyeksi Tren Harga (30 Hari Berikutnya)
                </h4>
                <div className="text-right">
                  <div
                    className="text-lg"
                    style={{ color: investment.color }}
                  >
                    {formatUSD(investment.expectedPrice)}
                  </div>
                  <div className="text-xs text-gray-400">Harga proyeksi</div>
                </div>
              </div>
            </div>
            <ForecastChart
              data={investment.forecastData}
              color={investment.color}
            />
          </div>
        </div>

        {/* Investment Summary */}
        {remainingMoney > 0 && (
          <div
            className="motion-card mt-6 p-4 rounded-lg border"
            style={{
              background:
                "linear-gradient(to right, #70e00015, #9ef01a15)",
              borderColor: "#70e00030",
            }}
          >
            <div className="grid grid-cols-4 gap-4 text-center">
              <div>
                <div className="text-xs text-gray-400 mb-1">
                  Investasi disarankan
                </div>
                <div className="font-medium text-white">
                  {formatIDR(remainingMoney * 0.3)}
                </div>
              </div>
              <div>
                <div className="text-xs text-gray-400 mb-1">Return (%)</div>
                <div
                  className="font-medium"
                  style={{
                    color:
                      (investment.priceAnalysis?.monthlyReturn ||
                        investment.expectedReturn) >= 0
                        ? "#10b981"
                        : "#ef4444",
                  }}
                >
                  {(investment.priceAnalysis?.monthlyReturn ||
                    investment.expectedReturn) >= 0
                    ? "+"
                    : ""}
                  {investment.priceAnalysis?.monthlyReturn.toFixed(1) ||
                    investment.expectedReturn.toFixed(1)}
                  %
                </div>
              </div>
              <div>
                <div className="text-xs text-gray-400 mb-1">
                  Estimasi gain (30 hari)
                </div>
                <div
                  className="font-medium"
                  style={{
                    color:
                      calculatePotentialReturn(investment, remainingMoney) >= 0
                        ? "#70e000"
                        : "#ef4444",
                  }}
                >
                  {calculatePotentialReturn(investment, remainingMoney) >= 0
                    ? ""
                    : "-"}
                  {formatIDR(
                    Math.abs(
                      calculatePotentialReturn(investment, remainingMoney),
                    ),
                  )}
                </div>
              </div>
              <div>
                <div className="text-xs text-gray-400 mb-1">
                  Estimasi nilai akhir
                </div>
                <div className="font-medium text-white">
                  {formatIDR(
                    remainingMoney * 0.3 +
                      calculatePotentialReturn(investment, remainingMoney),
                  )}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Recommendation */}
        <div
          className="motion-card mt-4 p-3 bg-gray-700 border-l-4 rounded"
          style={{ borderLeftColor: investment.color }}
        >
          <p className="text-sm text-gray-300">
            <span className="font-medium text-white">Rekomendasi:</span>{" "}
            Pertimbangkan alokasi edukatif ke {investment.name} dengan estimasi
            return 30 hari sebesar{" "}
            <span
              className="font-medium"
              style={{
                color:
                  (investment.priceAnalysis?.monthlyReturn ||
                    investment.expectedReturn) >= 0
                    ? "#70e000"
                    : "#ef4444",
              }}
            >
              {investment.priceAnalysis?.monthlyReturn.toFixed(1) ||
                investment.expectedReturn.toFixed(1)}
              %
            </span>
            .{" "}
            {investment.riskLevel === "High" &&
              "Perhatikan volatilitas tinggi dan gunakan hanya dana yang siap menerima risiko."}
            {investment.riskLevel === "Low" &&
              "Instrumen ini relatif stabil untuk orientasi jangka panjang dan profil konservatif."}
            {investment.riskLevel === "Medium" &&
              "Instrumen ini menawarkan keseimbangan risiko dan potensi return untuk profil moderat."}
          </p>
        </div>
      </CardContent>
    </Card>
  );
}
