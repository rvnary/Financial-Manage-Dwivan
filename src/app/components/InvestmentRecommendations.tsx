import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "./ui/card";
import { TrendingUp } from "lucide-react";

import { allocationOptions, profileVisuals } from "./InvestmentRecommendations/constants";
import type { InvestmentRecommendationsProps } from "./InvestmentRecommendations/types";
import { useRiskProfile } from "./InvestmentRecommendations/useRiskProfile";
import {
  buildReturnMap,
  usePortfolioReturn,
} from "./InvestmentRecommendations/usePortfolioReturn";
import { RemainingMoneyDisplay } from "./InvestmentRecommendations/components/RemainingMoneyDisplay";
import { RiskProfileSelector } from "./InvestmentRecommendations/components/RiskProfileSelector";
import { ProfileRationaleCard } from "./InvestmentRecommendations/components/ProfileRationaleCard";
import { AllocationPieChart } from "./InvestmentRecommendations/components/AllocationPieChart";
import { InvestmentBreakdownList } from "./InvestmentRecommendations/components/InvestmentBreakdownList";
import { TotalReturnSummary } from "./InvestmentRecommendations/components/TotalReturnSummary";
import { TipsCard } from "./InvestmentRecommendations/components/TipsCard";
import { BudgetWarningCard } from "./InvestmentRecommendations/components/BudgetWarningCard";

export function InvestmentRecommendations({
  remainingMoney,
  monthlySalary,
  stockReturns = [],
  selectedRiskProfile: externalRiskProfile,
  onRiskProfileChange,
}: InvestmentRecommendationsProps) {
  const { selectedProfile, setSelectedProfile } = useRiskProfile({
    externalRiskProfile,
    onRiskProfileChange,
  });

  const returnMap = buildReturnMap(stockReturns);

  const selectedAllocation = allocationOptions.find(
    (opt) => opt.profile === selectedProfile,
  )!;

  const SelectedProfileIcon = profileVisuals[selectedProfile].icon;

  // Calculate amounts for each allocation
  const allocationData = selectedAllocation.allocations.map((alloc) => ({
    ...alloc,
    value: Math.round(remainingMoney * (alloc.percentage / 100)),
  }));

  const portfolioSummary = usePortfolioReturn(
    remainingMoney,
    selectedAllocation,
    returnMap,
  );

  const hasRemainingMoney = remainingMoney > 0;

  return (
    <Card className="motion-card motion-glow bg-gray-800/90 border-gray-700 backdrop-blur">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-white">
          <TrendingUp className="w-5 h-5" />
          Rekomendasi Portofolio
        </CardTitle>
        <CardDescription className="text-gray-400">
          Pilih profil risiko dan lihat alokasi dari sisa dana yang tersedia.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          <RemainingMoneyDisplay
            remainingMoney={remainingMoney}
            hasRemainingMoney={hasRemainingMoney}
          />

          {hasRemainingMoney && (
            <>
              <RiskProfileSelector
                selectedProfile={selectedProfile}
                onSelect={setSelectedProfile}
              />

              <ProfileRationaleCard
                selectedProfile={selectedProfile}
                selectedAllocation={selectedAllocation}
                icon={SelectedProfileIcon}
              />

              <AllocationPieChart allocationData={allocationData} />

              <InvestmentBreakdownList
                allocationData={allocationData}
                returnMap={returnMap}
                stockReturns={stockReturns}
                selectedAllocations={allocationData}
              />

              {remainingMoney > 0 && (
                <TotalReturnSummary
                  remainingMoney={remainingMoney}
                  summary={portfolioSummary}
                />
              )}

              <TipsCard />
            </>
          )}

          {!hasRemainingMoney && remainingMoney < 0 && <BudgetWarningCard />}
        </div>
      </CardContent>
    </Card>
  );
}
