import { Card, CardContent, CardHeader, CardTitle } from "../../ui/card";
import { Target, CheckCircle, AlertTriangle } from "lucide-react";

interface HealthScoreCardProps {
  healthScore: number;
  healthStatus: { label: string; color: string };
  savingsRate: number;
  expenseRate: number;
}

export function HealthScoreCard({
  healthScore,
  healthStatus,
  savingsRate,
  expenseRate,
}: HealthScoreCardProps) {
  return (
    <Card className="motion-card motion-glow bg-gray-800/90 border-gray-700 backdrop-blur">
      <CardHeader className="pb-2">
        <CardTitle className="text-white flex items-center gap-2">
          <Target className="w-5 h-5" />
          Skor Kesehatan Keuangan
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex items-center gap-6">
          {/* Score Circle */}
          <div className="relative w-32 h-32">
            <svg
              className="w-32 h-32 transform -rotate-90"
              viewBox="0 0 100 100"
            >
              <circle
                cx="50"
                cy="50"
                r="40"
                stroke="#374151"
                strokeWidth="8"
                fill="none"
              />
              <circle
                cx="50"
                cy="50"
                r="40"
                stroke={healthStatus.color}
                strokeWidth="8"
                fill="none"
                strokeDasharray={`${healthScore * 2.51} 251`}
                strokeLinecap="round"
                className="motion-pulse-soft transition-all duration-1000"
              />
            </svg>
            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <span className="text-3xl font-bold text-white">
                {healthScore}
              </span>
              <span className="text-xs text-gray-400">/ 100</span>
            </div>
          </div>

          {/* Score Details */}
          <div className="flex-1 space-y-2">
            <div className="flex items-center gap-2">
              {healthScore >= 60 ? (
                <CheckCircle
                  className="w-5 h-5"
                  style={{ color: healthStatus.color }}
                />
              ) : (
                <AlertTriangle
                  className="w-5 h-5"
                  style={{ color: healthStatus.color }}
                />
              )}
              <span
                className="text-lg font-semibold"
                style={{ color: healthStatus.color }}
              >
                {healthStatus.label}
              </span>
            </div>
            <div className="grid grid-cols-2 gap-2 text-sm">
              <div className="text-gray-400">
                Rasio Tabungan:{" "}
                <span className="text-white">{savingsRate.toFixed(1)}%</span>
              </div>
              <div className="text-gray-400">
                Rasio Pengeluaran:{" "}
                <span className="text-white">{expenseRate.toFixed(1)}%</span>
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
