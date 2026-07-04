export interface FinancialPlannerProps {
  onBack: () => void;
}

export interface FormData {
  monthlySalary: string;
  primaryExpenses: string;
  secondaryExpenses: string;
  savings: string;
  pocketMoney: string;
  financialGoal: string;
  emergencyFund: string;
}
