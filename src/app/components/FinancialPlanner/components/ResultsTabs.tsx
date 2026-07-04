import { Suspense, lazy } from "react";
import {
  LayoutDashboard,
  PieChart,
  TrendingUp,
  Calculator,
} from "lucide-react";
import { Button } from "../../ui/button";
import { Card, CardContent } from "../../ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../../ui/tabs";
import type { FormData } from "../types";
import { parseIDR } from "../format";
import { TabLoadingState } from "./TabLoadingState";

type RiskProfile = "conservative" | "balanced" | "aggressive";

interface StockReturn {
  symbol: string;
  monthlyReturn: number;
}

const FinancialDashboard = lazy(() =>
  import("../../FinancialDashboard").then((module) => ({
    default: module.FinancialDashboard,
  })),
);

const InvestmentCharts = lazy(() =>
  import("../../InvestmentChartsNew").then((module) => ({
    default: module.InvestmentCharts,
  })),
);

const InvestmentSimulator = lazy(() =>
  import("../../InvestmentSimulator").then((module) => ({
    default: module.InvestmentSimulator,
  })),
);

const InvestmentRecommendations = lazy(() =>
  import("../../InvestmentRecommendations").then((module) => ({
    default: module.InvestmentRecommendations,
  })),
);

interface ResultsTabsProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  formData: FormData;
  remainingMoney: number;
  selectedRiskProfile: RiskProfile;
  onSelectRiskProfile: (profile: RiskProfile) => void;
  stockReturns: StockReturn[];
  onStockReturnsChange: (returns: StockReturn[]) => void;
  onBackToForm: () => void;
}

export function ResultsTabs({
  activeTab,
  setActiveTab,
  formData,
  remainingMoney,
  selectedRiskProfile,
  onSelectRiskProfile,
  stockReturns,
  onStockReturnsChange,
  onBackToForm,
}: ResultsTabsProps) {
  return (
    <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
      <TabsList className="motion-glow grid h-auto w-full grid-cols-2 gap-1 bg-gray-800/90 border border-gray-700 backdrop-blur sm:grid-cols-4">
        <TabsTrigger
          value="dashboard"
          className="min-h-10 transition duration-300 data-[state=active]:bg-gray-700 data-[state=active]:shadow-inner text-gray-400 data-[state=active]:text-white"
          aria-label="Tab Dashboard"
        >
          <LayoutDashboard className="w-4 h-4 sm:mr-2" />
          Dashboard
        </TabsTrigger>
        <TabsTrigger
          value="investments"
          className="min-h-10 transition duration-300 data-[state=active]:bg-gray-700 data-[state=active]:shadow-inner text-gray-400 data-[state=active]:text-white"
          aria-label="Tab Investasi"
        >
          <TrendingUp className="w-4 h-4 sm:mr-2" />
          Investasi
        </TabsTrigger>
        <TabsTrigger
          value="simulator"
          className="min-h-10 transition duration-300 data-[state=active]:bg-gray-700 data-[state=active]:shadow-inner text-gray-400 data-[state=active]:text-white"
          aria-label="Tab Simulator"
        >
          <Calculator className="w-4 h-4 sm:mr-2" />
          Simulator
        </TabsTrigger>
        <TabsTrigger
          value="portfolio"
          className="min-h-10 transition duration-300 data-[state=active]:bg-gray-700 data-[state=active]:shadow-inner text-gray-400 data-[state=active]:text-white"
          aria-label="Tab Portofolio"
        >
          <PieChart className="w-4 h-4 sm:mr-2" />
          Portofolio
        </TabsTrigger>
      </TabsList>

      {/* Dashboard Tab */}
      <TabsContent value="dashboard" className="mt-6">
        <Suspense fallback={<TabLoadingState label="dashboard" />}>
          <FinancialDashboard
            monthlySalary={parseIDR(formData.monthlySalary)}
            primaryExpenses={parseIDR(formData.primaryExpenses)}
            secondaryExpenses={parseIDR(formData.secondaryExpenses)}
            savings={parseIDR(formData.savings)}
            pocketMoney={parseIDR(formData.pocketMoney)}
            remainingMoney={remainingMoney}
            financialGoal={parseIDR(formData.financialGoal)}
            emergencyFund={parseIDR(formData.emergencyFund)}
          />
        </Suspense>
      </TabsContent>

      {/* Investment Charts Tab - Always render but show/hide with CSS for caching */}
      <TabsContent value="investments" className="mt-6" forceMount>
        <div className={activeTab === "investments" ? "block" : "hidden"}>
          {remainingMoney > 0 ? (
            <Suspense
              fallback={<TabLoadingState label="data investasi" />}
            >
              <InvestmentCharts
                remainingMoney={remainingMoney}
                onStockReturnsChange={onStockReturnsChange}
                selectedRiskProfile={selectedRiskProfile}
                onRiskProfileChange={onSelectRiskProfile}
              />
            </Suspense>
          ) : (
            <Card className="bg-gray-800 border-gray-700">
              <CardContent className="py-12 text-center">
                <TrendingUp className="w-12 h-12 mx-auto mb-4 text-gray-600" />
                <p className="text-gray-200">
                  Belum ada uang yang tersisa untuk investasi
                </p>
                <p className="mt-2 text-sm text-gray-400">
                  Saat ini total alokasi pengeluaran sama atau melebihi gaji
                  bulanan Anda.
                </p>
                <ul className="mx-auto mt-4 max-w-md space-y-2 text-left text-sm text-gray-300">
                  <li className="flex items-start gap-2">
                    <span className="mt-1 h-1.5 w-1.5 flex-shrink-0 rounded-full bg-green-400" />
                    <span>
                      Tinjau ulang pengeluaran sekunder seperti hiburan dan
                      langganan.
                    </span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="mt-1 h-1.5 w-1.5 flex-shrink-0 rounded-full bg-green-400" />
                    <span>
                      Coba turunkan target tabungan atau uang saku sementara
                      waktu.
                    </span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="mt-1 h-1.5 w-1.5 flex-shrink-0 rounded-full bg-green-400" />
                    <span>
                      Sisihkan minimal Rp 100.000 agar bisa mulai investasi
                      reksa dana.
                    </span>
                  </li>
                </ul>
                <Button
                  className="mt-6 text-white"
                  style={{ backgroundColor: "#007200" }}
                  onClick={onBackToForm}
                >
                  Kembali Edit Budget
                </Button>
              </CardContent>
            </Card>
          )}
        </div>
      </TabsContent>

      {/* Investment Simulator Tab */}
      <TabsContent value="simulator" className="mt-6">
        <Suspense fallback={<TabLoadingState label="simulator" />}>
          <InvestmentSimulator
            initialInvestment={Math.max(0, remainingMoney)}
            monthlyContribution={Math.max(0, remainingMoney)}
          />
        </Suspense>
      </TabsContent>

      {/* Portfolio Analysis Tab */}
      <TabsContent value="portfolio" className="mt-6">
        <Suspense fallback={<TabLoadingState label="portofolio" />}>
          <InvestmentRecommendations
            remainingMoney={remainingMoney}
            monthlySalary={parseIDR(formData.monthlySalary)}
            stockReturns={stockReturns}
            selectedRiskProfile={selectedRiskProfile}
            onRiskProfileChange={onSelectRiskProfile}
          />
        </Suspense>
      </TabsContent>
    </Tabs>
  );
}
