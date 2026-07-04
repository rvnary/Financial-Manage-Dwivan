import { useState, useRef, useEffect } from "react";
import { Button } from "./ui/button";
import { ArrowLeft } from "lucide-react";
import type { FinancialPlannerProps, FormData } from "./FinancialPlanner/types";
import { STORAGE_KEY, defaultFormData } from "./FinancialPlanner/constants";
import {
  parseIDR,
  sanitizeNominal,
  formatNominalIDR,
} from "./FinancialPlanner/format";
import { FinancialForm } from "./FinancialPlanner/components/FinancialForm";
import { LiveBudgetChecker } from "./FinancialPlanner/components/LiveBudgetChecker";
import { ResultsSummary } from "./FinancialPlanner/components/ResultsSummary";
import { ResultsTabs } from "./FinancialPlanner/components/ResultsTabs";

type RiskProfile = "conservative" | "balanced" | "aggressive";

interface StockReturn {
  symbol: string;
  monthlyReturn: number;
}

export function FinancialPlanner({ onBack }: FinancialPlannerProps) {
  const [formData, setFormData] = useState<FormData>(() => {
    try {
      const savedData = window.localStorage.getItem(STORAGE_KEY);
      return savedData
        ? { ...defaultFormData, ...JSON.parse(savedData) }
        : defaultFormData;
    } catch {
      return defaultFormData;
    }
  });

  const [showResults, setShowResults] = useState(false);
  const [remainingMoney, setRemainingMoney] = useState(0);
  const [stockReturns, setStockReturns] = useState<StockReturn[]>([]);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const resultsRef = useRef<HTMLDivElement>(null);
  const formRef = useRef<HTMLFormElement>(null);

  // Shared risk profile state - synced between InvestmentRecommendations and InvestmentCharts
  const [selectedRiskProfile, setSelectedRiskProfile] =
    useState<RiskProfile>("balanced");

  // Track active tab to control InvestmentCharts visibility
  const [activeTab, setActiveTab] = useState("dashboard");

  useEffect(() => {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(formData));
  }, [formData]);

  const handleInputChange = (field: keyof FormData, value: string) => {
    const cleanValue = sanitizeNominal(value);
    setFormData((prev) => ({ ...prev, [field]: cleanValue }));
    // Clear any custom validity on change
    if (formRef.current) {
      const input = formRef.current.querySelector<HTMLInputElement>(
        `[name="${field}"]`,
      );
      input?.setCustomValidity("");
    }
    setSubmitError(null);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const salary = parseIDR(formData.monthlySalary);
    const primary = parseIDR(formData.primaryExpenses);
    const secondary = parseIDR(formData.secondaryExpenses);
    const savings = parseIDR(formData.savings);
    const pocket = parseIDR(formData.pocketMoney);

    // Validate: total allocations should not exceed salary by extreme amount
    const totalAllocation = primary + secondary + savings + pocket;
    if (salary > 0 && totalAllocation > salary) {
      setSubmitError(
        `Total alokasi (${formatNominalIDR(totalAllocation)}) melebihi gaji bulanan (${formatNominalIDR(salary)}). Silakan sesuaikan.`,
      );
      return;
    }

    const remaining = salary - primary - secondary - savings - pocket;
    setRemainingMoney(remaining);
    setShowResults(true);
    setSubmitError(null);
    window.setTimeout(() => {
      resultsRef.current?.scrollIntoView({
        behavior: "smooth",
        block: "start",
      });
    }, 100);
  };

  const totalAllocated =
    parseIDR(formData.primaryExpenses) +
    parseIDR(formData.secondaryExpenses) +
    parseIDR(formData.savings) +
    parseIDR(formData.pocketMoney);
  const salary = parseIDR(formData.monthlySalary);
  const liveRemaining = salary - totalAllocated;
  const allocationRate = salary > 0 ? (totalAllocated / salary) * 100 : 0;
  const isOverBudget = salary > 0 && liveRemaining < 0;
  const savingsRate =
    salary > 0 ? (parseIDR(formData.savings) / salary) * 100 : 0;

  const hasFormData = Object.values(formData).some((v) => v !== "");

  const handleReset = () => {
    if (
      hasFormData &&
      !window.confirm(
        "Yakin ingin mereset semua data? Data yang sudah diisi akan hilang.",
      )
    ) {
      return;
    }
    setFormData(defaultFormData);
    setShowResults(false);
    setRemainingMoney(0);
    setSubmitError(null);
    window.localStorage.removeItem(STORAGE_KEY);
  };

  const liveBudgetChecker =
    salary > 0 ? (
      <LiveBudgetChecker
        allocationRate={allocationRate}
        isOverBudget={isOverBudget}
        liveRemaining={liveRemaining}
        totalAllocated={totalAllocated}
        savingsRate={savingsRate}
      />
    ) : null;

  return (
    <div className="motion-page min-h-screen bg-[radial-gradient(circle_at_top_left,rgba(112,224,0,0.12),transparent_32%),linear-gradient(135deg,#030712,#111827_48%,#020617)] py-8">
      <div className="motion-layer container mx-auto px-4">
        <Button
          variant="ghost"
          onClick={onBack}
          className="mb-6 hover:bg-gray-800 text-gray-300"
          style={{ color: "#70e000" }}
          aria-label="Kembali ke beranda"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Kembali ke Beranda
        </Button>

        <div className="max-w-6xl mx-auto">
          <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_22rem] lg:items-start">
            {/* Form Section */}
            <FinancialForm
              formData={formData}
              onInputChange={handleInputChange}
              onSubmit={handleSubmit}
              onReset={handleReset}
              submitError={submitError}
              mobileChecker={liveBudgetChecker}
              formRef={formRef}
            />

            <aside className="hidden lg:block">
              {liveBudgetChecker || (
                <div className="sticky top-4 rounded-2xl border border-gray-700 bg-gray-900/60 p-4 text-sm text-gray-400 shadow-lg backdrop-blur">
                  <h3 className="mb-2 text-base text-white">
                    Pengecekan budget langsung
                  </h3>
                  <p>
                    Isi gaji bulanan untuk melihat sisa dana, rasio tabungan,
                    dan status budget secara langsung.
                  </p>
                </div>
              )}
            </aside>
          </div>

          {/* Tabbed Sections - Only show after calculation */}
          {showResults && (
            <div ref={resultsRef} className="motion-card mt-8 scroll-mt-6">
              <ResultsSummary
                remainingMoney={remainingMoney}
                isOverBudget={isOverBudget}
                savingsRate={savingsRate}
              />

              <ResultsTabs
                activeTab={activeTab}
                setActiveTab={setActiveTab}
                formData={formData}
                remainingMoney={remainingMoney}
                selectedRiskProfile={selectedRiskProfile}
                onSelectRiskProfile={setSelectedRiskProfile}
                stockReturns={stockReturns}
                onStockReturnsChange={setStockReturns}
                onBackToForm={() =>
                  formRef.current?.scrollIntoView({
                    behavior: "smooth",
                    block: "start",
                  })
                }
              />
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
