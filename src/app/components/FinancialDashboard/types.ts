export interface FinancialDashboardProps {
  monthlySalary: number;
  primaryExpenses: number;
  secondaryExpenses: number;
  savings: number;
  pocketMoney: number;
  remainingMoney: number;
  financialGoal?: number;
  emergencyFund?: number;
}

export interface InsightItem {
  title: string;
  description: string;
  tone: "success" | "warning" | "danger" | "info";
  metric: string;
}

export interface ActionItem {
  title: string;
  description: string;
  priority: "High" | "Medium" | "Low";
  color: string;
}

/** Derived budget metrics passed from the barrel into calculations + sections. */
export interface BudgetMetrics {
  totalExpenses: number;
  savingsRate: number;
  expenseRate: number;
  remainingRate: number;
  monthlyNeeds: number;
  emergencyTarget: number;
  emergencyProgress: number;
  goalProgress: number;
}
