import type { FormData } from "./types";

export const STORAGE_KEY = "dwivan-financial-planner";

// Maximum digits allowed for any nominal input (12 digits = up to ~999 triliun)
export const MAX_DIGITS = 12;
// Maximum reasonable nominal value (1 triliun rupiah)
export const MAX_AMOUNT = 1_000_000_000_000;

export const defaultFormData: FormData = {
  monthlySalary: "",
  primaryExpenses: "",
  secondaryExpenses: "",
  savings: "",
  pocketMoney: "",
  financialGoal: "",
  emergencyFund: "",
};

// Custom validation messages in Indonesian
export const validationMessages: Record<keyof FormData, string> = {
  monthlySalary: "Gaji bulanan wajib diisi",
  primaryExpenses: "Pengeluaran utama wajib diisi",
  secondaryExpenses: "Pengeluaran sekunder wajib diisi",
  savings: "Nominal tabungan wajib diisi",
  pocketMoney: "Uang saku/jajan wajib diisi",
  financialGoal: "",
  emergencyFund: "",
};
