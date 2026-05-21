import { lazy, Suspense, useState, useRef, useEffect } from "react";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "./ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./ui/tabs";
import {
  ArrowLeft,
  LayoutDashboard,
  PieChart,
  TrendingUp,
  Calculator,
} from "lucide-react";

const FinancialDashboard = lazy(() =>
  import("./FinancialDashboard").then((module) => ({
    default: module.FinancialDashboard,
  })),
);

const InvestmentCharts = lazy(() =>
  import("./InvestmentChartsNew").then((module) => ({
    default: module.InvestmentCharts,
  })),
);

const InvestmentSimulator = lazy(() =>
  import("./InvestmentSimulator").then((module) => ({
    default: module.InvestmentSimulator,
  })),
);

const InvestmentRecommendations = lazy(() =>
  import("./InvestmentRecommendations").then((module) => ({
    default: module.InvestmentRecommendations,
  })),
);

interface FinancialPlannerProps {
  onBack: () => void;
}

interface FormData {
  monthlySalary: string;
  primaryExpenses: string;
  secondaryExpenses: string;
  savings: string;
  pocketMoney: string;
  financialGoal: string;
  emergencyFund: string;
}

const STORAGE_KEY = "dwivan-financial-planner";

const defaultFormData: FormData = {
  monthlySalary: "",
  primaryExpenses: "",
  secondaryExpenses: "",
  savings: "",
  pocketMoney: "",
  financialGoal: "",
  emergencyFund: "",
};

// Format number to IDR currency display
const formatToIDR = (value: string | number): string => {
  const numValue =
    typeof value === "string" ? value.replace(/\D/g, "") : value.toString();
  if (!numValue) return "";

  // Format number with thousands separator and Rp prefix
  return "Rp " + new Intl.NumberFormat("id-ID").format(parseInt(numValue));
};

// Parse IDR string to number
const parseIDR = (value: string): number => {
  return parseInt(value.replace(/\D/g, "")) || 0;
};

function TabLoadingState({ label }: { label: string }) {
  return (
    <Card className="bg-gray-800 border-gray-700">
      <CardContent className="py-12 text-center">
        <div className="mx-auto mb-4 h-10 w-10 animate-spin rounded-full border-2 border-gray-700 border-t-green-400" />
        <p className="text-gray-300">Loading {label}...</p>
      </CardContent>
    </Card>
  );
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
  const [stockReturns, setStockReturns] = useState<
    Array<{ symbol: string; monthlyReturn: number }>
  >([]);
  const resultsRef = useRef<HTMLDivElement>(null);

  // Shared risk profile state - synced between InvestmentRecommendations and InvestmentCharts
  const [selectedRiskProfile, setSelectedRiskProfile] = useState<
    "conservative" | "balanced" | "aggressive"
  >("balanced");

  // Track active tab to control InvestmentCharts visibility
  const [activeTab, setActiveTab] = useState("dashboard");

  useEffect(() => {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(formData));
  }, [formData]);

  const handleInputChange = (field: keyof FormData, value: string) => {
    // Only keep digits
    const cleanValue = value.replace(/\D/g, "");
    setFormData((prev) => ({ ...prev, [field]: cleanValue }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const salary = parseIDR(formData.monthlySalary);
    const primary = parseIDR(formData.primaryExpenses);
    const secondary = parseIDR(formData.secondaryExpenses);
    const savings = parseIDR(formData.savings);
    const pocket = parseIDR(formData.pocketMoney);

    const remaining = salary - primary - secondary - savings - pocket;
    setRemainingMoney(remaining);
    setShowResults(true);
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

  const handleReset = () => {
    setFormData(defaultFormData);
    setShowResults(false);
    setRemainingMoney(0);
    window.localStorage.removeItem(STORAGE_KEY);
  };

  return (
    <div className="motion-page min-h-screen bg-[radial-gradient(circle_at_top_left,rgba(112,224,0,0.12),transparent_32%),linear-gradient(135deg,#030712,#111827_48%,#020617)] py-8">
      <div className="motion-layer container mx-auto px-4">
        <Button
          variant="ghost"
          onClick={onBack}
          className="mb-6 hover:bg-gray-800 text-gray-300"
          style={{ color: "#70e000" }}
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Home
        </Button>

        <div className="max-w-6xl mx-auto">
          <div className="max-w-2xl mx-auto">
            {/* Form Section */}
            <Card className="motion-card motion-glow bg-gray-800/90 border-gray-700 shadow-2xl shadow-black/20 backdrop-blur">
              <CardHeader>
                <CardTitle className="text-white">Financial Details</CardTitle>
                <CardDescription className="text-gray-400">
                  Enter your monthly financial information to get personalized
                  recommendations
                </CardDescription>
              </CardHeader>
              <CardContent className="relative">
                <form
                  onSubmit={handleSubmit}
                  className="motion-stagger space-y-6"
                >
                  <div className="space-y-2">
                    <Label htmlFor="salary" className="text-gray-300">
                      Monthly Salary
                    </Label>
                    <Input
                      id="salary"
                      type="text"
                      placeholder="0"
                      value={
                        formData.monthlySalary
                          ? formatToIDR(formData.monthlySalary)
                          : ""
                      }
                      onChange={(e) =>
                        handleInputChange("monthlySalary", e.target.value)
                      }
                      required
                      className="bg-gray-700/80 border-gray-600 text-white placeholder:text-gray-500 transition focus:border-green-400 focus:ring-green-400/30"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="primary" className="text-gray-300">
                      Primary Expenses
                    </Label>
                    <Input
                      id="primary"
                      type="text"
                      placeholder="0 - Rent, utilities, food, etc."
                      value={
                        formData.primaryExpenses
                          ? formatToIDR(formData.primaryExpenses)
                          : ""
                      }
                      onChange={(e) =>
                        handleInputChange("primaryExpenses", e.target.value)
                      }
                      required
                      className="bg-gray-700/80 border-gray-600 text-white placeholder:text-gray-500 transition focus:border-green-400 focus:ring-green-400/30"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="secondary" className="text-gray-300">
                      Secondary Expenses
                    </Label>
                    <Input
                      id="secondary"
                      type="text"
                      placeholder="0 - Entertainment, subscriptions, etc."
                      value={
                        formData.secondaryExpenses
                          ? formatToIDR(formData.secondaryExpenses)
                          : ""
                      }
                      onChange={(e) =>
                        handleInputChange("secondaryExpenses", e.target.value)
                      }
                      required
                      className="bg-gray-700/80 border-gray-600 text-white placeholder:text-gray-500 transition focus:border-green-400 focus:ring-green-400/30"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="savings" className="text-gray-300">
                      Savings
                    </Label>
                    <Input
                      id="savings"
                      type="text"
                      placeholder="0 - Monthly savings amount"
                      value={
                        formData.savings ? formatToIDR(formData.savings) : ""
                      }
                      onChange={(e) =>
                        handleInputChange("savings", e.target.value)
                      }
                      required
                      className="bg-gray-700/80 border-gray-600 text-white placeholder:text-gray-500 transition focus:border-green-400 focus:ring-green-400/30"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="pocket" className="text-gray-300">
                      Pocket Money / Spending Money
                    </Label>
                    <Input
                      id="pocket"
                      type="text"
                      placeholder="0 - Personal spending money"
                      value={
                        formData.pocketMoney
                          ? formatToIDR(formData.pocketMoney)
                          : ""
                      }
                      onChange={(e) =>
                        handleInputChange("pocketMoney", e.target.value)
                      }
                      required
                      className="bg-gray-700/80 border-gray-600 text-white placeholder:text-gray-500 transition focus:border-green-400 focus:ring-green-400/30"
                    />
                  </div>

                  <div className="grid gap-4 md:grid-cols-2">
                    <div className="space-y-2">
                      <Label htmlFor="goal" className="text-gray-300">
                        Financial Goal Target
                      </Label>
                      <Input
                        id="goal"
                        type="text"
                        placeholder="0 - Target tabungan/investasi"
                        value={
                          formData.financialGoal
                            ? formatToIDR(formData.financialGoal)
                            : ""
                        }
                        onChange={(e) =>
                          handleInputChange("financialGoal", e.target.value)
                        }
                        className="bg-gray-700/80 border-gray-600 text-white placeholder:text-gray-500 transition focus:border-green-400 focus:ring-green-400/30"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="emergency" className="text-gray-300">
                        Current Emergency Fund
                      </Label>
                      <Input
                        id="emergency"
                        type="text"
                        placeholder="0 - Dana darurat saat ini"
                        value={
                          formData.emergencyFund
                            ? formatToIDR(formData.emergencyFund)
                            : ""
                        }
                        onChange={(e) =>
                          handleInputChange("emergencyFund", e.target.value)
                        }
                        className="bg-gray-700/80 border-gray-600 text-white placeholder:text-gray-500 transition focus:border-green-400 focus:ring-green-400/30"
                      />
                    </div>
                  </div>

                  {salary > 0 && (
                    <div
                      className={`motion-card rounded-2xl border p-4 shadow-lg ${
                        isOverBudget
                          ? "border-red-800 bg-red-950/60"
                          : "border-green-800 bg-green-950/40"
                      }`}
                    >
                      <div className="flex items-center justify-between gap-4 text-sm">
                        <span className="text-gray-300">Live budget check</span>
                        <span
                          className={
                            isOverBudget ? "text-red-300" : "text-green-300"
                          }
                        >
                          {allocationRate.toFixed(1)}% allocated
                        </span>
                      </div>
                      <div className="mt-2 h-2 overflow-hidden rounded-full bg-gray-700">
                        <div
                          className={
                            isOverBudget
                              ? "motion-bar h-full bg-red-500 transition-all duration-700"
                              : "motion-bar h-full bg-green-500 transition-all duration-700"
                          }
                          style={{ width: `${Math.min(100, allocationRate)}%` }}
                        />
                      </div>
                      <p className="mt-2 text-sm text-gray-300">
                        Sisa sementara:{" "}
                        {formatToIDR(Math.abs(liveRemaining)) || "Rp 0"}
                        {isOverBudget ? " over budget" : " tersedia"}
                      </p>
                      <div className="mt-4 grid gap-3 text-xs text-gray-300 sm:grid-cols-3">
                        <div className="rounded-lg bg-black/20 p-3">
                          <span className="block text-gray-500">
                            Savings rate
                          </span>
                          <strong className="text-white">
                            {savingsRate.toFixed(1)}%
                          </strong>
                        </div>
                        <div className="rounded-lg bg-black/20 p-3">
                          <span className="block text-gray-500">Allocated</span>
                          <strong className="text-white">
                            {formatToIDR(totalAllocated)}
                          </strong>
                        </div>
                        <div className="rounded-lg bg-black/20 p-3">
                          <span className="block text-gray-500">Status</span>
                          <strong
                            className={
                              isOverBudget ? "text-red-300" : "text-green-300"
                            }
                          >
                            {isOverBudget ? "Perlu dikurangi" : "Aman"}
                          </strong>
                        </div>
                      </div>
                    </div>
                  )}

                  <div className="flex gap-4">
                    <Button
                      type="submit"
                      className="flex-1 text-white transition duration-300 hover:-translate-y-0.5 hover:opacity-95 hover:shadow-lg hover:shadow-green-900/30"
                      style={{ backgroundColor: "#007200" }}
                    >
                      Calculate
                    </Button>
                    <Button
                      type="button"
                      variant="outline"
                      onClick={handleReset}
                      className="bg-gray-700 border-gray-600 text-gray-300 transition duration-300 hover:-translate-y-0.5 hover:bg-gray-600"
                    >
                      Reset
                    </Button>
                  </div>
                </form>
              </CardContent>
            </Card>
          </div>

          {/* Tabbed Sections - Only show after calculation */}
          {showResults && (
            <div ref={resultsRef} className="motion-card mt-8 scroll-mt-6">
              <Tabs
                value={activeTab}
                onValueChange={setActiveTab}
                className="w-full"
              >
                <TabsList className="motion-glow grid h-auto w-full grid-cols-2 gap-1 bg-gray-800/90 border border-gray-700 backdrop-blur sm:grid-cols-4">
                  <TabsTrigger
                    value="dashboard"
                    className="min-h-10 transition duration-300 data-[state=active]:bg-gray-700 data-[state=active]:shadow-inner text-gray-400 data-[state=active]:text-white"
                  >
                    <LayoutDashboard className="w-4 h-4 sm:mr-2" />
                    Dashboard
                  </TabsTrigger>
                  <TabsTrigger
                    value="investments"
                    className="min-h-10 transition duration-300 data-[state=active]:bg-gray-700 data-[state=active]:shadow-inner text-gray-400 data-[state=active]:text-white"
                  >
                    <TrendingUp className="w-4 h-4 sm:mr-2" />
                    Investments
                  </TabsTrigger>
                  <TabsTrigger
                    value="simulator"
                    className="min-h-10 transition duration-300 data-[state=active]:bg-gray-700 data-[state=active]:shadow-inner text-gray-400 data-[state=active]:text-white"
                  >
                    <Calculator className="w-4 h-4 sm:mr-2" />
                    Simulator
                  </TabsTrigger>
                  <TabsTrigger
                    value="portfolio"
                    className="min-h-10 transition duration-300 data-[state=active]:bg-gray-700 data-[state=active]:shadow-inner text-gray-400 data-[state=active]:text-white"
                  >
                    <PieChart className="w-4 h-4 sm:mr-2" />
                    Portfolio
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
                  <div
                    className={activeTab === "investments" ? "block" : "hidden"}
                  >
                    {remainingMoney > 0 ? (
                      <Suspense
                        fallback={<TabLoadingState label="investment data" />}
                      >
                        <InvestmentCharts
                          remainingMoney={remainingMoney}
                          onStockReturnsChange={setStockReturns}
                          selectedRiskProfile={selectedRiskProfile}
                          onRiskProfileChange={setSelectedRiskProfile}
                        />
                      </Suspense>
                    ) : (
                      <Card className="bg-gray-800 border-gray-700">
                        <CardContent className="py-12 text-center">
                          <TrendingUp className="w-12 h-12 mx-auto mb-4 text-gray-600" />
                          <p className="text-gray-400">
                            No money available for investment
                          </p>
                          <p className="text-gray-500 text-sm mt-2">
                            Adjust your budget to have remaining money for
                            investments
                          </p>
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
                  <Suspense fallback={<TabLoadingState label="portfolio" />}>
                    <InvestmentRecommendations
                      remainingMoney={remainingMoney}
                      monthlySalary={parseIDR(formData.monthlySalary)}
                      stockReturns={stockReturns}
                      selectedRiskProfile={selectedRiskProfile}
                      onRiskProfileChange={setSelectedRiskProfile}
                    />
                  </Suspense>
                </TabsContent>
              </Tabs>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
