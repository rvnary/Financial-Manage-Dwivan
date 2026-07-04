import {
  deriveBudgetMetrics,
  calculateHealthScore,
  getHealthStatus,
  getExpenseData,
  getMetrics,
  getInsights,
  buildActionPlan,
} from "./FinancialDashboard/calculations";
import type { FinancialDashboardProps } from "./FinancialDashboard/types";
import { HealthScoreCard } from "./FinancialDashboard/components/HealthScoreCard";
import { KeyMetricsGrid } from "./FinancialDashboard/components/KeyMetricsGrid";
import { EmergencyFundCard } from "./FinancialDashboard/components/EmergencyFundCard";
import { GoalProgressCard } from "./FinancialDashboard/components/GoalProgressCard";
import { ExpenseBreakdownCard } from "./FinancialDashboard/components/ExpenseBreakdownCard";
import { InsightsGrid } from "./FinancialDashboard/components/InsightsGrid";
import { ActionPlanGrid } from "./FinancialDashboard/components/ActionPlanGrid";

export function FinancialDashboard({
  monthlySalary,
  primaryExpenses,
  secondaryExpenses,
  savings,
  pocketMoney,
  remainingMoney,
  financialGoal = 0,
  emergencyFund = 0,
}: FinancialDashboardProps) {
  const metrics = deriveBudgetMetrics({
    monthlySalary,
    primaryExpenses,
    secondaryExpenses,
    savings,
    pocketMoney,
    remainingMoney,
    financialGoal,
    emergencyFund,
  });

  const healthScore = calculateHealthScore(metrics);
  const healthStatus = getHealthStatus(healthScore);
  const expenseData = getExpenseData({
    primaryExpenses,
    secondaryExpenses,
    savings,
    pocketMoney,
    remainingMoney,
  });
  const metricCards = getMetrics({
    monthlySalary,
    totalExpenses: metrics.totalExpenses,
    savings,
    remainingMoney,
  });
  const insights = getInsights({
    monthlySalary,
    primaryExpenses,
    savings,
    pocketMoney,
    remainingMoney,
    financialGoal,
    metrics,
  });
  const actionPlan = buildActionPlan({
    remainingMoney,
    emergencyTarget: metrics.emergencyTarget,
    emergencyFund,
    emergencyProgress: metrics.emergencyProgress,
    savingsRate: metrics.savingsRate,
  });

  return (
    <div className="motion-stagger space-y-6">
      <HealthScoreCard
        healthScore={healthScore}
        healthStatus={healthStatus}
        savingsRate={metrics.savingsRate}
        expenseRate={metrics.expenseRate}
      />

      <KeyMetricsGrid metrics={metricCards} />

      <div className="grid gap-4 lg:grid-cols-2">
        <EmergencyFundCard
          emergencyFund={emergencyFund}
          emergencyTarget={metrics.emergencyTarget}
          emergencyProgress={metrics.emergencyProgress}
        />
        <GoalProgressCard
          financialGoal={financialGoal}
          goalProgress={metrics.goalProgress}
          savings={savings}
          remainingMoney={remainingMoney}
        />
      </div>

      <ExpenseBreakdownCard
        expenseData={expenseData}
        monthlySalary={monthlySalary}
      />

      <InsightsGrid insights={insights} />

      <ActionPlanGrid actionPlan={actionPlan} />
    </div>
  );
}
