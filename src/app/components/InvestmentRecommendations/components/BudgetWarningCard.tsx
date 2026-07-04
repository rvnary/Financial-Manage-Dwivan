import { BUDGET_WARNING_TIPS } from "../helpers";

export function BudgetWarningCard() {
  return (
    <div className="bg-amber-950 border border-amber-800 rounded-lg p-4">
      <h4 className="font-medium text-amber-400 mb-2">
        Budget Perlu Disesuaikan
      </h4>
      <ul className="text-sm text-amber-300 space-y-1">
        {BUDGET_WARNING_TIPS.map((tip) => (
          <li key={tip}>• {tip}</li>
        ))}
      </ul>
    </div>
  );
}
