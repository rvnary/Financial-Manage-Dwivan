import { useState, useRef, useEffect } from "react";
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
import { InvestmentRecommendations } from "./InvestmentRecommendations";
import { InvestmentCharts } from "./InvestmentChartsNew";
import { FinancialDashboard } from "./FinancialDashboard";
import { SavingsGoals } from "./SavingsGoals";
import { InvestmentSimulator } from "./InvestmentSimulator";
import {
  ArrowLeft,
  ChevronDown,
  LayoutDashboard,
  PieChart,
  TrendingUp,
  Target,
  Calculator,
} from "lucide-react";

interface FinancialPlannerProps {
  onBack: () => void;
}

interface FormData {
  monthlySalary: string;
  primaryExpenses: string;
  secondaryExpenses: string;
  savings: string;
  pocketMoney: string;
}

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

export function FinancialPlanner({ onBack }: FinancialPlannerProps) {
  const [formData, setFormData] = useState<FormData>({
    monthlySalary: "",
    primaryExpenses: "",
    secondaryExpenses: "",
    savings: "",
    pocketMoney: "",
  });

  const [showResults, setShowResults] = useState(false);
  const [remainingMoney, setRemainingMoney] = useState(0);
  const [stockReturns, setStockReturns] = useState<
    Array<{ symbol: string; monthlyReturn: number }>
  >([]);
  const [showScrollIndicator, setShowScrollIndicator] = useState(false);
  const formContentRef = useRef<HTMLDivElement>(null);

  // Shared risk profile state - synced between InvestmentRecommendations and InvestmentCharts
  const [selectedRiskProfile, setSelectedRiskProfile] = useState<
    "conservative" | "balanced" | "aggressive"
  >("balanced");

  // Handle scroll indicator visibility
  useEffect(() => {
    const handleScroll = () => {
      if (formContentRef.current) {
        const element = formContentRef.current;
        const isScrollable = element.scrollHeight > element.clientHeight;
        const isAtBottom =
          element.scrollTop + element.clientHeight >= element.scrollHeight - 10;

        setShowScrollIndicator(isScrollable && !isAtBottom);
      }
    };

    const element = formContentRef.current;
    if (element) {
      element.addEventListener("scroll", handleScroll);
      // Check initial state
      handleScroll();
    }

    return () => {
      if (element) {
        element.removeEventListener("scroll", handleScroll);
      }
    };
  }, [showResults]);

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
  };

  const handleReset = () => {
    setFormData({
      monthlySalary: "",
      primaryExpenses: "",
      secondaryExpenses: "",
      savings: "",
      pocketMoney: "",
    });
    setShowResults(false);
    setRemainingMoney(0);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-950 via-gray-900 to-gray-950 py-8">
      <div className="container mx-auto px-4">
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
            <Card className="bg-gray-800 border-gray-700">
              <CardHeader>
                <CardTitle className="text-white">Financial Details</CardTitle>
                <CardDescription className="text-gray-400">
                  Enter your monthly financial information to get personalized
                  recommendations
                </CardDescription>
              </CardHeader>
              <CardContent
                ref={formContentRef}
                className="relative max-h-[calc(100vh-200px)] overflow-y-auto"
              >
                <form onSubmit={handleSubmit} className="space-y-6">
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
                      className="bg-gray-700 border-gray-600 text-white placeholder:text-gray-500"
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
                      className="bg-gray-700 border-gray-600 text-white placeholder:text-gray-500"
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
                      className="bg-gray-700 border-gray-600 text-white placeholder:text-gray-500"
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
                      className="bg-gray-700 border-gray-600 text-white placeholder:text-gray-500"
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
                      className="bg-gray-700 border-gray-600 text-white placeholder:text-gray-500"
                    />
                  </div>

                  <div className="flex gap-4">
                    <Button
                      type="submit"
                      className="flex-1 text-white hover:opacity-90"
                      style={{ backgroundColor: "#007200" }}
                    >
                      Calculate
                    </Button>
                    <Button
                      type="button"
                      variant="outline"
                      onClick={handleReset}
                      className="bg-gray-700 border-gray-600 text-gray-300 hover:bg-gray-600"
                    >
                      Reset
                    </Button>
                  </div>
                </form>

                {/* Scroll Indicator */}
                {showScrollIndicator && (
                  <div className="sticky bottom-0 left-0 right-0 flex justify-center pt-4 pb-2 bg-gradient-to-t from-gray-800 to-transparent">
                    <div
                      className="flex flex-col items-center gap-1 animate-bounce"
                      style={{ color: "#70e000" }}
                    >
                      <span className="text-xs font-medium">
                        Scroll untuk lebih
                      </span>
                      <ChevronDown className="w-5 h-5" />
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Tabbed Sections - Only show after calculation */}
          {showResults && (
            <div className="mt-8">
              <Tabs defaultValue="dashboard" className="w-full">
                <TabsList className="grid w-full grid-cols-5 bg-gray-800 border border-gray-700">
                  <TabsTrigger
                    value="dashboard"
                    className="data-[state=active]:bg-gray-700 text-gray-400 data-[state=active]:text-white"
                  >
                    <LayoutDashboard className="w-4 h-4 mr-2" />
                    Dashboard
                  </TabsTrigger>
                  <TabsTrigger
                    value="investments"
                    className="data-[state=active]:bg-gray-700 text-gray-400 data-[state=active]:text-white"
                  >
                    <TrendingUp className="w-4 h-4 mr-2" />
                    Investments
                  </TabsTrigger>
                  <TabsTrigger
                    value="goals"
                    className="data-[state=active]:bg-gray-700 text-gray-400 data-[state=active]:text-white"
                  >
                    <Target className="w-4 h-4 mr-2" />
                    Goals
                  </TabsTrigger>
                  <TabsTrigger
                    value="simulator"
                    className="data-[state=active]:bg-gray-700 text-gray-400 data-[state=active]:text-white"
                  >
                    <Calculator className="w-4 h-4 mr-2" />
                    Simulator
                  </TabsTrigger>
                  <TabsTrigger
                    value="portfolio"
                    className="data-[state=active]:bg-gray-700 text-gray-400 data-[state=active]:text-white"
                  >
                    <PieChart className="w-4 h-4 mr-2" />
                    Portfolio
                  </TabsTrigger>
                </TabsList>

                {/* Dashboard Tab */}
                <TabsContent value="dashboard" className="mt-6">
                  <FinancialDashboard
                    monthlySalary={parseIDR(formData.monthlySalary)}
                    primaryExpenses={parseIDR(formData.primaryExpenses)}
                    secondaryExpenses={parseIDR(formData.secondaryExpenses)}
                    savings={parseIDR(formData.savings)}
                    pocketMoney={parseIDR(formData.pocketMoney)}
                    remainingMoney={remainingMoney}
                  />
                </TabsContent>

                {/* Investment Charts Tab */}
                <TabsContent value="investments" className="mt-6">
                  {remainingMoney > 0 ? (
                    <InvestmentCharts
                      remainingMoney={remainingMoney}
                      onStockReturnsChange={setStockReturns}
                      selectedRiskProfile={selectedRiskProfile}
                      onRiskProfileChange={setSelectedRiskProfile}
                    />
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
                </TabsContent>

                {/* Savings Goals Tab */}
                <TabsContent value="goals" className="mt-6">
                  <SavingsGoals
                    monthlySavings={parseIDR(formData.savings)}
                    remainingMoney={remainingMoney}
                  />
                </TabsContent>

                {/* Investment Simulator Tab */}
                <TabsContent value="simulator" className="mt-6">
                  <InvestmentSimulator
                    initialInvestment={Math.max(0, remainingMoney)}
                    monthlyContribution={Math.max(0, remainingMoney)}
                  />
                </TabsContent>

                {/* Portfolio Analysis Tab */}
                <TabsContent value="portfolio" className="mt-6">
                  <InvestmentRecommendations
                    remainingMoney={remainingMoney}
                    monthlySalary={parseIDR(formData.monthlySalary)}
                    stockReturns={stockReturns}
                    selectedRiskProfile={selectedRiskProfile}
                    onRiskProfileChange={setSelectedRiskProfile}
                  />
                </TabsContent>
              </Tabs>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
