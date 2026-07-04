import type { ReactNode, RefObject } from "react";
import { AlertTriangle } from "lucide-react";
import { Button } from "../../ui/button";
import { Input } from "../../ui/input";
import { Label } from "../../ui/label";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../../ui/card";
import type { FormData } from "../types";
import { formatNominalIDR } from "../format";
import { handleInvalid, clearCustomValidity } from "../validation";

interface FinancialFormProps {
  formData: FormData;
  onInputChange: (field: keyof FormData, value: string) => void;
  onSubmit: (e: React.FormEvent) => void;
  onReset: () => void;
  submitError: string | null;
  mobileChecker: ReactNode;
  formRef: RefObject<HTMLFormElement | null>;
}

export function FinancialForm({
  formData,
  onInputChange,
  onSubmit,
  onReset,
  submitError,
  mobileChecker,
  formRef,
}: FinancialFormProps) {
  return (
    <Card className="motion-card motion-glow bg-gray-800/90 border-gray-700 shadow-2xl shadow-black/20 backdrop-blur">
      <CardHeader>
        <CardTitle className="text-white">Detail Keuangan</CardTitle>
        <CardDescription className="text-gray-400">
          Masukkan informasi keuangan bulanan Anda untuk mendapatkan rekomendasi
          yang dipersonalisasi
        </CardDescription>
      </CardHeader>
      <CardContent className="relative">
        <form
          ref={formRef}
          onSubmit={onSubmit}
          className="motion-stagger space-y-6"
          noValidate={false}
        >
          <section className="rounded-2xl border border-gray-700/80 bg-gray-900/40 p-4">
            <div className="mb-4">
              <h3 className="text-base text-white">Pemasukan</h3>
              <p className="text-sm text-gray-500">
                Mulai dari nominal pemasukan bulanan utama.
              </p>
            </div>
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
                    ? formatNominalIDR(formData.monthlySalary)
                    : ""
                }
                onChange={(e) =>
                  onInputChange("monthlySalary", e.target.value)
                }
                onInvalid={handleInvalid("monthlySalary")}
                onInput={clearCustomValidity}
                required
                aria-required="true"
                className="bg-gray-700/80 border-gray-600 text-white placeholder:text-gray-500 transition focus:border-green-400 focus:ring-green-400/30"
              />
            </div>
          </section>

          <section className="rounded-2xl border border-gray-700/80 bg-gray-900/40 p-4">
            <div className="mb-4">
              <h3 className="text-base text-white">Alokasi bulanan wajib</h3>
              <p className="text-sm text-gray-500">
                Isi pengeluaran dan tabungan yang rutin terjadi.
              </p>
            </div>
            <div className="grid gap-4 md:grid-cols-2">
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
                      ? formatNominalIDR(formData.primaryExpenses)
                      : ""
                  }
                  onChange={(e) =>
                    onInputChange("primaryExpenses", e.target.value)
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
                      ? formatNominalIDR(formData.secondaryExpenses)
                      : ""
                  }
                  onChange={(e) =>
                    onInputChange("secondaryExpenses", e.target.value)
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
                    formData.savings ? formatNominalIDR(formData.savings) : ""
                  }
                  onChange={(e) => onInputChange("savings", e.target.value)}
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
                      ? formatNominalIDR(formData.pocketMoney)
                      : ""
                  }
                  onChange={(e) =>
                    onInputChange("pocketMoney", e.target.value)
                  }
                  onInvalid={handleInvalid("pocketMoney")}
                  onInput={clearCustomValidity}
                  required
                  aria-required="true"
                  className="bg-gray-700/80 border-gray-600 text-white placeholder:text-gray-500 transition focus:border-green-400 focus:ring-green-400/30"
                />
              </div>
            </div>
          </section>

          <div className="lg:hidden">{mobileChecker}</div>

          <section className="rounded-2xl border border-gray-700/80 bg-gray-900/40 p-4">
            <div className="mb-4">
              <h3 className="text-base text-white">Target tambahan</h3>
              <p className="text-sm text-gray-500">
                Opsional, tapi membantu dashboard memberi konteks.
              </p>
            </div>
            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="goal" className="text-gray-300">
                  Target Finansial{" "}
                  <span className="dwivan-badge">Opsional</span>
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
                      ? formatNominalIDR(formData.financialGoal)
                      : ""
                  }
                  onChange={(e) =>
                    onInputChange("financialGoal", e.target.value)
                  }
                  className="bg-gray-700/80 border-gray-600 text-white placeholder:text-gray-500 transition focus:border-green-400 focus:ring-green-400/30"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="emergency" className="text-gray-300">
                  Dana Darurat{" "}
                  <span className="dwivan-badge">Opsional</span>
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
                      ? formatNominalIDR(formData.emergencyFund)
                      : ""
                  }
                  onChange={(e) =>
                    onInputChange("emergencyFund", e.target.value)
                  }
                  className="bg-gray-700/80 border-gray-600 text-white placeholder:text-gray-500 transition focus:border-green-400 focus:ring-green-400/30"
                />
              </div>
            </div>
          </section>

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
              onClick={onReset}
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
  );
}
