import { Card, CardContent, CardHeader, CardTitle } from "../../ui/card";
import { Target } from "lucide-react";
import { formatIDR } from "../../../utils/investmentCalculations";

interface GoalProgressCardProps {
  financialGoal: number;
  goalProgress: number;
  savings: number;
  remainingMoney: number;
}

export function GoalProgressCard({
  financialGoal,
  goalProgress,
  savings,
  remainingMoney,
}: GoalProgressCardProps) {
  return (
    <Card className="motion-card bg-gray-800/90 border-gray-700">
      <CardHeader className="pb-2">
        <CardTitle className="text-white flex items-center gap-2 text-base">
          <Target className="w-5 h-5" style={{ color: "#70e000" }} />
          Progres Target Bulanan
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex justify-between text-sm text-gray-300">
          <span>{goalProgress.toFixed(1)}% dari target</span>
          <span>
            {financialGoal > 0
              ? formatIDR(financialGoal)
              : "Belum ada target"}
          </span>
        </div>
        <div className="mt-3 h-3 overflow-hidden rounded-full bg-gray-700">
          <div
            className="motion-bar h-full rounded-full transition-all duration-700"
            style={{
              width: `${goalProgress}%`,
              backgroundColor: "#70e000",
            }}
          />
        </div>
        <p className="mt-3 text-sm text-gray-400">
          {financialGoal > 0
            ? `Kontribusi bulan ini ${formatIDR(savings + Math.max(0, remainingMoney))}.`
            : "Tambahkan target di form untuk memantau progres keuangan bulanan."}
        </p>
      </CardContent>
    </Card>
  );
}
