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
  CheckCircle2,
  AlertTriangle,
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

// Maximum digits allowed for any nominal input (12 digits = up to ~999 triliun)
const MAX_DIGITS = 12;
// Maximum reasonable nominal value (1 triliun rupiah)
const MAX_AMOUNT = 1_000_000_000_000;

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

// Sanitize and limit input digits
const sanitizeNominal = (value: string): string => {
  const digits = value.replace(/\D/g, "").slice(0, MAX_DIGITS);
  // Hard cap to MAX_AMOUNT
  if (digits && parseInt(digits) > MAX_AMOUNT) {
    return MAX_AMOUNT.toString();
  }
  return digits;
};

// Custom validation messages in Indonesian
const validationMessages: Record<keyof FormData, string> = {
  monthlySalary: "Gaji bulanan wajib diisi",
  primaryExpenses: "Pengeluaran utama wajib diisi",
  secondaryExpenses: "Pengeluaran sekunder wajib diisi",
  savings: "Nominal tabungan wajib diisi",
  pocketMoney: "Uang saku/jajan wajib diisi",
  financialGoal: "",
  emergencyFund: "",
};

const handleInvalid =
  (field: keyof FormData) => (e: React.FormEvent<HTMLInputElement>) => {
    const target = e.currentTarget;
    target.setCustomValidity(validationMessages[field] || "Wajib diisi");
  };

const clearCustomValidity = (e: React.FormEvent<HTMLInputElement>) => {
  e.currentTarget.setCustomValidity("");
};

function TabLoadingState({ label }: { label: string }) {
  return (
    <Card className="bg-gray-800 border-gray-700">
      <CardContent className="py-12 text-center">
        <div className="mx-auto mb-4 h-10 w-10 animate-spin rounded-full border-2 border-gray-700 border-t-green-400" />
        <p className="text-gray-300">Memuat {label}...</p>
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
  const [submitError, setSubmitError] = useState<string | null>(null);
  const resultsRef = useRef<HTMLDivElement>(null);
  const formRef = useRef<HTMLFormElement>(null);

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
        `Total alokasi (${formatToIDR(totalAllocation)}) melebihi gaji bulanan (${formatToIDR(salary)}). Silakan sesuaikan.`,
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
          <div className="max-w-2xl mx-auto">
            {/* Form Section */}
            <Card className="motion-card motion-glow bg-gray-800/90 border-gray-700 shadow-2xl shadow-black/20 backdrop-blur">
              <CardHeader>
                <CardTitle className="text-white">Detail Keuangan</CardTitle>
                <CardDescription className="text-gray-400">
                  Masukkan informasi keuangan bulanan Anda untuk mendapatkan
                  rekomendasi yang dipersonalisasi
                </CardDescription>
              </CardHeader>
              <CardContent className="relative">
                <form
                  ref={formRef}
                  onSubmit={handleSubmit}
                  className="motion-stagger space-y-6"
                  noValidate={false}
                >
                  <div className="space-y-2">
                    <Label htmlFor="salary" className="text-gray-300">
                      Gaji Bulanan
                    </Label>
                    <Input
                      id="salary"
                      name="monthlySalary"
                      type="text"
                      inputMode="numeric"
                      autoComplete="off"
                      maxLength={20}
                      placeholder="Contoh: 10.000.000"
                      value={
                        formData.monthlySalary
                          ? formatToIDR(formData.monthlySalary)
                          : ""
                      }
                      onChange={(e) =>
                        handleInputChange("monthlySalary", e.target.value)
                      }
                      onInvalid={handleInvalid("monthlySalary")}
                      onInput={clearCustomValidity}
                      required
                      aria-required="true"
                      className="bg-gray-700/80 border-gray-600 text-white placeholder:text-gray-500 transition focus:border-green-400 focus:ring-green-400/30"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="primary" className="text-gray-300">
                      Pengeluaran Utama
                    </Label>
                    <Input
                      id="primary"
                      name="primaryExpenses"
                      type="text"
                      inputMode="numeric"
                      autoComplete="off"
                      maxLength={20}
                      placeholder="Sewa, listrik, makan, dll."
                      value={
                        formData.primaryExpenses
                          ? formatToIDR(formData.primaryExpenses)
                          : ""
                      }
                      onChange={(e) =>
                        handleInputChange("primaryExpenses", e.target.value)
                      }
                      onInvalid={handleInvalid("primaryExpenses")}
                      onInput={clearCustomValidity}
                      required
                      aria-required="true"
                      className="bg-gray-700/80 border-gray-600 text-white placeholder:text-gray-500 transition focus:border-green-400 focus:ring-green-400/30"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="secondary" className="text-gray-300">
                      Pengeluaran Sekunder
                    </Label>
                    <Input
                      id="secondary"
                      name="secondaryExpenses"
                      type="text"
                      inputMode="numeric"
                      autoComplete="off"
                      maxLength={20}
                      placeholder="Hiburan, langganan, dll."
                      value={
                        formData.secondaryExpenses
                          ? formatToIDR(formData.secondaryExpenses)
                          : ""
                      }
                      onChange={(e) =>
                        handleInputChange("secondaryExpenses", e.target.value)
                      }
                      onInvalid={handleInvalid("secondaryExpenses")}
                      onInput={clearCustomValidity}
                      required
                      aria-required="true"
                      className="bg-gray-700/80 border-gray-600 text-white placeholder:text-gray-500 transition focus:border-green-400 focus:ring-green-400/30"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="savings" className="text-gray-300">
                      Tabungan
                    </Label>
                    <Input
                      id="savings"
                      name="savings"
                      type="text"
                      inputMode="numeric"
                      autoComplete="off"
                      maxLength={20}
                      placeholder="Nominal tabungan bulanan"
                      value={
                        formData.savings ? formatToIDR(formData.savings) : ""
                      }
                      onChange={(e) =>
                        handleInputChange("savings", e.target.value)
                      }
                      onInvalid={handleInvalid("savings")}
                      onInput={clearCustomValidity}
                      required
                      aria-required="true"
                      className="bg-gray-700/80 border-gray-600 text-white placeholder:text-gray-500 transition focus:border-green-400 focus:ring-green-400/30"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="pocket" className="text-gray-300">
                      Uang Saku / Jajan
                    </Label>
                    <Input
                      id="pocket"
                      name="pocketMoney"
                      type="text"
                      inputMode="numeric"
                      autoComplete="off"
                      maxLength={20}
                      placeholder="Pengeluaran pribadi"
                      value={
                        formData.pocketMoney
                          ? formatToIDR(formData.pocketMoney)
                          : ""
                      }
                      onChange={(e) =>
                        handleInputChange("pocketMoney", e.target.value)
                      }
                      onInvalid={handleInvalid("pocketMoney")}
                      onInput={clearCustomValidity}
                      required
                      aria-required="true"
                      className="bg-gray-700/80 border-gray-600 text-white placeholder:text-gray-500 transition focus:border-green-400 focus:ring-green-400/30"
                    />
                  </div>

                  <div className="grid gap-4 md:grid-cols-2">
                    <div className="space-y-2">
                      <Label htmlFor="goal" className="text-gray-300">
                        Target Finansial{" "}
                        <span className="text-gray-500 text-xs">
                          (opsional)
                        </span>
                      </Label>
                      <Input
                        id="goal"
                        name="financialGoal"
                        type="text"
                        inputMode="numeric"
                        autoComplete="off"
                        maxLength={20}
                        placeholder="Target tabungan/investasi"
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
                        Dana Darurat{" "}
                        <span className="text-gray-500 text-xs">
                          (opsional)
                        </span>
                      </Label>
                      <Input
                        id="emergency"
                        name="emergencyFund"
                        type="text"
                        inputMode="numeric"
                        autoComplete="off"
                        maxLength={20}
                        placeholder="Dana darurat saat ini"
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
                      aria-live="polite"
                    >
                      <div className="flex items-center justify-between gap-4 text-sm">
                        <span className="text-gray-300">
                          Pengecekan budget langsung
                        </span>
                        <span
                          className={
                            isOverBudget ? "text-red-300" : "text-green-300"
                          }
                        >
                          {allocationRate.toFixed(1)}% teralokasi
                        </span>
                      </div>
                      <div
                        className="mt-2 h-2 overflow-hidden rounded-full bg-gray-700"
                        role="progressbar"
                        aria-valuenow={Math.min(100, allocationRate)}
                        aria-valuemin={0}
                        aria-valuemax={100}
                      >
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
                        {isOverBudget ? " melebihi budget" : " tersedia"}
                      </p>
                      <div className="mt-4 grid gap-3 text-xs text-gray-300 sm:grid-cols-3">
                        <div className="rounded-lg bg-black/20 p-3">
                          <span className="block text-gray-500">
                            Rasio tabungan
                          </span>
                          <strong className="text-white">
                            {savingsRate.toFixed(1)}%
                          </strong>
                        </div>
                        <div className="rounded-lg bg-black/20 p-3">
                          <span className="block text-gray-500">
                            Teralokasi
                          </span>
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

                  {submitError && (
                    <div
                      role="alert"
                      className="flex items-start gap-2 rounded-lg border border-red-800 bg-red-950/60 p-3 text-sm text-red-200"
                    >
                      <AlertTriangle className="mt-0.5 h-4 w-4 flex-shrink-0" />
                      <span>{submitError}</span>
                    </div>
                  )}

                  <div className="flex flex-col-reverse gap-3 sm:flex-row sm:gap-4">
                    <Button
                      type="button"
                      variant="outline"
                      onClick={handleReset}
                      className="bg-gray-700 border-gray-600 text-gray-300 transition duration-300 hover:-translate-y-0.5 hover:bg-gray-600 sm:w-auto"
                      aria-label="Reset semua data formulir"
                    >
                      Reset
                    </Button>
                    <Button
                      type="submit"
                      className="flex-1 text-white transition duration-300 hover:-translate-y-0.5 hover:opacity-95 hover:shadow-lg hover:shadow-green-900/30"
                      style={{ backgroundColor: "#007200" }}
                      aria-label="Hitung dan tampilkan hasil perencanaan"
                    >
                      Hitung Sekarang
                    </Button>
                  </div>
                </form>
              </CardContent>
            </Card>
          </div>

          {/* Tabbed Sections - Only show after calculation */}
          {showResults && (
            <div ref={resultsRef} className="motion-card mt-8 scroll-mt-6">
              {/* Result heading and summary */}
              <div className="mb-6 rounded-2xl border border-green-800/60 bg-green-950/30 p-5 shadow-lg backdrop-blur">
                <div className="flex items-start gap-3">
                  <CheckCircle2 className="mt-1 h-6 w-6 flex-shrink-0 text-green-400" />
                  <div className="flex-1">
                    <h2 className="text-xl text-white">Hasil Perencanaan</h2>
                    <p className="mt-1 text-sm text-gray-300">
                      Berikut ringkasan keuangan Anda. Telusuri tab di bawah
                      untuk melihat dashboard, simulasi, dan rekomendasi
                      investasi.
                    </p>
                    <div className="mt-4 grid gap-3 sm:grid-cols-3">
                      <div className="rounded-lg bg-black/30 p-3">
                        <span className="block text-xs text-gray-500">
                          Sisa uang
                        </span>
                        <strong
                          className={`text-base ${
                            remainingMoney < 0
                              ? "text-red-300"
                              : "text-green-300"
                          }`}
                        >
                          {formatToIDR(Math.abs(remainingMoney)) || "Rp 0"}
                          {remainingMoney < 0 ? " (defisit)" : ""}
                        </strong>
                      </div>
                      <div className="rounded-lg bg-black/30 p-3">
                        <span className="block text-xs text-gray-500">
                          Status budget
                        </span>
                        <strong
                          className={`text-base ${
                            isOverBudget ? "text-red-300" : "text-green-300"
                          }`}
                        >
                          {isOverBudget ? "Perlu dikurangi" : "Aman"}
                        </strong>
                      </div>
                      <div className="rounded-lg bg-black/30 p-3">
                        <span className="block text-xs text-gray-500">
                          Rasio tabungan
                        </span>
                        <strong className="text-base text-white">
                          {savingsRate.toFixed(1)}%
                        </strong>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <Tabs
                value={activeTab}
                onValueChange={setActiveTab}
                className="w-full"
              >
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
                  <div
                    className={activeTab === "investments" ? "block" : "hidden"}
                  >
                    {remainingMoney > 0 ? (
                      <Suspense
                        fallback={<TabLoadingState label="data investasi" />}
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
                          <p className="text-gray-200">
                            Belum ada uang yang tersisa untuk investasi
                          </p>
                          <p className="mt-2 text-sm text-gray-400">
                            Saat ini total alokasi pengeluaran sama atau
                            melebihi gaji bulanan Anda.
                          </p>
                          <ul className="mx-auto mt-4 max-w-md space-y-2 text-left text-sm text-gray-300">
                            <li className="flex items-start gap-2">
                              <span className="mt-1 h-1.5 w-1.5 flex-shrink-0 rounded-full bg-green-400" />
                              <span>
                                Tinjau ulang pengeluaran sekunder seperti
                                hiburan dan langganan.
                              </span>
                            </li>
                            <li className="flex items-start gap-2">
                              <span className="mt-1 h-1.5 w-1.5 flex-shrink-0 rounded-full bg-green-400" />
                              <span>
                                Coba turunkan target tabungan atau uang saku
                                sementara waktu.
                              </span>
                            </li>
                            <li className="flex items-start gap-2">
                              <span className="mt-1 h-1.5 w-1.5 flex-shrink-0 rounded-full bg-green-400" />
                              <span>
                                Sisihkan minimal Rp 100.000 agar bisa mulai
                                investasi reksa dana.
                              </span>
                            </li>
                          </ul>
                          <Button
                            className="mt-6 text-white"
                            style={{ backgroundColor: "#007200" }}
                            onClick={() =>
                              formRef.current?.scrollIntoView({
                                behavior: "smooth",
                                block: "start",
                              })
                            }
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
