import { useState } from "react";
import { TrendingUp } from "lucide-react";
import type { InvestmentChartsProps, ExternalRiskProfile } from "./InvestmentChartsNew/types";
import { useInvestmentData } from "./InvestmentChartsNew/useInvestmentData";
import { ChartsLoadingState } from "./InvestmentChartsNew/components/ChartsLoadingState";
import { ChartsErrorState } from "./InvestmentChartsNew/components/ChartsErrorState";
import { RiskProfileSelector } from "./InvestmentChartsNew/components/RiskProfileSelector";
import { ThesisCard } from "./InvestmentChartsNew/components/ThesisCard";
import { InvestmentCard } from "./InvestmentChartsNew/components/InvestmentCard";
import { PortfolioAllocationCard } from "./InvestmentChartsNew/components/PortfolioAllocationCard";
import { Disclaimer } from "./InvestmentChartsNew/components/Disclaimer";

export function InvestmentCharts({
  remainingMoney,
  onStockReturnsChange,
  selectedRiskProfile: externalRiskProfile,
  onRiskProfileChange,
}: InvestmentChartsProps) {
  const [internalRiskProfile, setInternalRiskProfile] =
    useState<ExternalRiskProfile>("balanced");

  const selectedRiskProfile = externalRiskProfile ?? internalRiskProfile;
  const setSelectedRiskProfile = onRiskProfileChange ?? setInternalRiskProfile;

  const {
    investments,
    loading,
    error,
    portfolioAllocations,
    portfolioReturn,
    loadingProgress,
  } = useInvestmentData({
    selectedRiskProfile,
    onStockReturnsChange,
  });

  if (loading) {
    return <ChartsLoadingState loadingProgress={loadingProgress} />;
  }

  if (error) {
    return <ChartsErrorState error={error} />;
  }

  return (
    <div className="motion-stagger space-y-6 mt-8">
      {/* Yahoo Finance - FREE real-time data */}

      <div className="flex items-center gap-2">
        <TrendingUp className="w-6 h-6" style={{ color: "#70e000" }} />
        <h2 className="text-2xl text-white">Peluang Investasi</h2>
      </div>
      <p className="text-gray-400">
        Berdasarkan analisis data historis, berikut contoh instrumen yang cocok
        dengan profil risiko dan estimasi return 30 hari.
        <span className="text-green-400">
          {" "}
          (Data real-time dari Yahoo Finance ✓)
        </span>
      </p>

      <RiskProfileSelector
        selectedProfile={selectedRiskProfile}
        onSelect={setSelectedRiskProfile}
        variant="full"
      />

      <ThesisCard selectedProfile={selectedRiskProfile} />

      {/* Investment Cards */}
      <div className="grid gap-6">
        {investments.map((investment, index) => (
          <InvestmentCard
            key={index}
            investment={investment}
            remainingMoney={remainingMoney}
          />
        ))}
      </div>

      <PortfolioAllocationCard
        portfolioAllocations={portfolioAllocations}
        portfolioReturn={portfolioReturn}
        selectedProfile={selectedRiskProfile}
        onSelectProfile={setSelectedRiskProfile}
        remainingMoney={remainingMoney}
      />

      <Disclaimer />
    </div>
  );
}
