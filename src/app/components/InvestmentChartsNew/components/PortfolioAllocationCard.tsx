import { TrendingUp } from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../../ui/card";
import { formatIDR } from "../../../utils/investmentCalculations";
import type { AllocationRecommendation } from "../../../utils/investmentCalculations";
import type { ExternalRiskProfile } from "../types";
import { profileLabels, riskLabels } from "../constants";
import { getRiskBadgeColor } from "../helpers";
import { RiskProfileSelector } from "./RiskProfileSelector";

interface PortfolioAllocationCardProps {
  portfolioAllocations: AllocationRecommendation[];
  portfolioReturn: number;
  selectedProfile: ExternalRiskProfile;
  onSelectProfile: (profile: ExternalRiskProfile) => void;
  remainingMoney: number;
}

export function PortfolioAllocationCard({
  portfolioAllocations,
  portfolioReturn,
  selectedProfile,
  onSelectProfile,
  remainingMoney,
}: PortfolioAllocationCardProps) {
  return (
    <Card className="motion-card bg-gray-800/90 border-gray-700">
      <CardHeader>
        <CardTitle className="text-white flex items-center gap-2">
          <TrendingUp className="w-5 h-5" style={{ color: "#70e000" }} />
          Alokasi Portofolio
        </CardTitle>
        <CardDescription className="text-gray-400">
          Rekomendasi alokasi berdasarkan profil risiko yang dipilih.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <RiskProfileSelector
          selectedProfile={selectedProfile}
          onSelect={onSelectProfile}
          variant="compact"
        />

        {/* Allocation Table */}
        <div className="grid gap-4 mb-6">
          {portfolioAllocations.map((allocation, index) => (
            <div
              key={index}
              className="motion-card flex items-center justify-between p-3 bg-gray-700 rounded-lg"
            >
              <div className="flex-1">
                <div className="font-medium text-white">
                  {allocation.name}
                </div>
                <div className="text-xs text-gray-400">
                  {allocation.description}
                </div>
              </div>
              <div className="text-right">
                <div className="text-lg font-semibold text-white">
                  {(allocation.weight * 100).toFixed(0)}%
                </div>
                <div
                  className={`text-xs px-2 py-1 rounded border ${getRiskBadgeColor(
                    allocation.riskLevel,
                  )}`}
                >
                  {riskLabels[allocation.riskLevel]}
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Portfolio Summary */}
        <div
          className="motion-card p-4 rounded-lg border"
          style={{
            background: "linear-gradient(to right, #70e00015, #9ef01a15)",
            borderColor: "#70e00030",
          }}
        >
          <div className="grid grid-cols-2 gap-4">
            <div>
              <div className="text-sm text-gray-400 mb-1">
                Estimasi Return Portofolio (30 hari)
              </div>
              <div
                className="text-2xl font-bold"
                style={{
                  color: portfolioReturn / 12 >= 0 ? "#70e000" : "#ef4444",
                }}
              >
                {portfolioReturn / 12 >= 0 ? "+" : ""}
                {(portfolioReturn / 12).toFixed(1)}%
              </div>
            </div>
            <div>
              <div className="text-sm text-gray-400 mb-1">Profil Alokasi</div>
              <div className="text-xl font-bold text-white">
                {profileLabels[selectedProfile]}
              </div>
            </div>
          </div>
        </div>

        {remainingMoney > 0 && (
          <div
            className="motion-card mt-4 p-4 rounded-lg border"
            style={{
              background: "linear-gradient(to right, #3b82f615, #06b6d415)",
              borderColor: "#3b82f630",
            }}
          >
            <div className="text-sm text-gray-300 mb-2">
              <span className="font-medium text-white">
                Nominal investasi yang disarankan:
              </span>{" "}
              {formatIDR(remainingMoney)}
            </div>
            <div className="grid grid-cols-3 gap-4 text-sm">
              {portfolioAllocations.slice(0, 3).map((alloc, index) => (
                <div key={index}>
                  <div className="text-gray-400 text-xs mb-1">{alloc.name}</div>
                  <div className="font-semibold text-white">
                    {formatIDR(remainingMoney * alloc.weight)}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
