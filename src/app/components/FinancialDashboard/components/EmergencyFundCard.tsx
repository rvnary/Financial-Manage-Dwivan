import { Card, CardContent, CardHeader, CardTitle } from "../../ui/card";
import { ShieldCheck } from "lucide-react";
import { formatIDR } from "../../../utils/investmentCalculations";

interface EmergencyFundCardProps {
  emergencyFund: number;
  emergencyTarget: number;
  emergencyProgress: number;
}

export function EmergencyFundCard({
  emergencyFund,
  emergencyTarget,
  emergencyProgress,
}: EmergencyFundCardProps) {
  return (
    <Card className="motion-card bg-gray-800/90 border-gray-700">
      <CardHeader className="pb-2">
        <CardTitle className="text-white flex items-center gap-2 text-base">
          <ShieldCheck className="w-5 h-5" style={{ color: "#70e000" }} />
          Kesiapan Dana Darurat
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex justify-between text-sm text-gray-300">
          <span>{formatIDR(emergencyFund)}</span>
          <span>Target {formatIDR(emergencyTarget)}</span>
        </div>
        <div className="mt-3 h-3 overflow-hidden rounded-full bg-gray-700">
          <div
            className="motion-bar h-full rounded-full bg-green-500 transition-all duration-700"
            style={{ width: `${emergencyProgress}%` }}
          />
        </div>
        <p className="mt-3 text-sm text-gray-400">
          {emergencyProgress >= 100
            ? "Dana darurat sudah mencapai standar aman 3 bulan kebutuhan."
            : `Butuh ${formatIDR(Math.max(0, emergencyTarget - emergencyFund))} lagi untuk mencapai standar aman.`}
        </p>
      </CardContent>
    </Card>
  );
}
