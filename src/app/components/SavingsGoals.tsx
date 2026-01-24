import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Progress } from "./ui/progress";
import {
  Target,
  Plus,
  Trash2,
  Home,
  Car,
  Plane,
  GraduationCap,
  Heart,
  Shield,
  Briefcase,
  Gift,
} from "lucide-react";

interface SavingsGoal {
  id: string;
  name: string;
  targetAmount: number;
  currentAmount: number;
  icon: string;
  deadline?: string;
}

interface SavingsGoalsProps {
  monthlySavings: number;
  remainingMoney: number;
}

const GOAL_ICONS: Record<string, typeof Home> = {
  home: Home,
  car: Car,
  travel: Plane,
  education: GraduationCap,
  health: Heart,
  emergency: Shield,
  business: Briefcase,
  other: Gift,
};

const GOAL_COLORS: Record<string, string> = {
  home: "#3b82f6",
  car: "#8b5cf6",
  travel: "#f97316",
  education: "#22c55e",
  health: "#ef4444",
  emergency: "#eab308",
  business: "#06b6d4",
  other: "#70e000",
};

export function SavingsGoals({
  monthlySavings,
  remainingMoney,
}: SavingsGoalsProps) {
  const [goals, setGoals] = useState<SavingsGoal[]>([
    {
      id: "1",
      name: "Emergency Fund",
      targetAmount: 50000000,
      currentAmount: 15000000,
      icon: "emergency",
      deadline: "2026-12",
    },
    {
      id: "2",
      name: "Dream House",
      targetAmount: 500000000,
      currentAmount: 75000000,
      icon: "home",
      deadline: "2030-01",
    },
    {
      id: "3",
      name: "Vacation Fund",
      targetAmount: 20000000,
      currentAmount: 8000000,
      icon: "travel",
      deadline: "2026-06",
    },
  ]);

  const [showAddForm, setShowAddForm] = useState(false);
  const [newGoal, setNewGoal] = useState({
    name: "",
    targetAmount: "",
    icon: "other",
    deadline: "",
  });

  const formatIDR = (value: number) => {
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(value);
  };

  const parseIDR = (value: string): number => {
    return parseInt(value.replace(/\D/g, "")) || 0;
  };

  const formatInputIDR = (value: string): string => {
    const numValue = value.replace(/\D/g, "");
    if (!numValue) return "";
    return "Rp " + new Intl.NumberFormat("id-ID").format(parseInt(numValue));
  };

  const calculateMonthsToGoal = (goal: SavingsGoal): number => {
    const remaining = goal.targetAmount - goal.currentAmount;
    const monthlyContribution =
      monthlySavings + Math.max(0, remainingMoney * 0.5);
    if (monthlyContribution <= 0) return Infinity;
    return Math.ceil(remaining / monthlyContribution);
  };

  const handleAddGoal = () => {
    if (!newGoal.name || !newGoal.targetAmount) return;

    const goal: SavingsGoal = {
      id: Date.now().toString(),
      name: newGoal.name,
      targetAmount: parseIDR(newGoal.targetAmount),
      currentAmount: 0,
      icon: newGoal.icon,
      deadline: newGoal.deadline || undefined,
    };

    setGoals([...goals, goal]);
    setNewGoal({ name: "", targetAmount: "", icon: "other", deadline: "" });
    setShowAddForm(false);
  };

  const handleDeleteGoal = (id: string) => {
    setGoals(goals.filter((g) => g.id !== id));
  };

  const handleUpdateProgress = (id: string, additionalAmount: number) => {
    setGoals(
      goals.map((g) =>
        g.id === id
          ? {
              ...g,
              currentAmount: Math.min(
                g.targetAmount,
                g.currentAmount + additionalAmount,
              ),
            }
          : g,
      ),
    );
  };

  const totalGoalsAmount = goals.reduce((sum, g) => sum + g.targetAmount, 0);
  const totalSavedAmount = goals.reduce((sum, g) => sum + g.currentAmount, 0);
  const overallProgress =
    totalGoalsAmount > 0 ? (totalSavedAmount / totalGoalsAmount) * 100 : 0;

  return (
    <Card className="bg-gray-800 border-gray-700">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="text-white flex items-center gap-2">
            <Target className="w-5 h-5" style={{ color: "#70e000" }} />
            Savings Goals Tracker
          </CardTitle>
          <Button
            size="sm"
            onClick={() => setShowAddForm(!showAddForm)}
            className="text-white"
            style={{ backgroundColor: "#007200" }}
          >
            <Plus className="w-4 h-4 mr-1" />
            Add Goal
          </Button>
        </div>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Overall Progress */}
        <div className="bg-gray-900 rounded-lg p-4">
          <div className="flex justify-between text-sm mb-2">
            <span className="text-gray-400">Overall Progress</span>
            <span className="text-white font-medium">
              {overallProgress.toFixed(1)}%
            </span>
          </div>
          <Progress value={overallProgress} className="h-3" />
          <div className="flex justify-between text-xs text-gray-500 mt-2">
            <span>Saved: {formatIDR(totalSavedAmount)}</span>
            <span>Target: {formatIDR(totalGoalsAmount)}</span>
          </div>
        </div>

        {/* Add Goal Form */}
        {showAddForm && (
          <div className="bg-gray-900 rounded-lg p-4 space-y-4">
            <h4 className="text-white font-medium">New Savings Goal</h4>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-xs text-gray-400">Goal Name</label>
                <Input
                  placeholder="e.g., New Car"
                  value={newGoal.name}
                  onChange={(e) =>
                    setNewGoal({ ...newGoal, name: e.target.value })
                  }
                  className="bg-gray-700 border-gray-600 text-white mt-1"
                />
              </div>
              <div>
                <label className="text-xs text-gray-400">Target Amount</label>
                <Input
                  placeholder="Rp 0"
                  value={
                    newGoal.targetAmount
                      ? formatInputIDR(newGoal.targetAmount)
                      : ""
                  }
                  onChange={(e) =>
                    setNewGoal({
                      ...newGoal,
                      targetAmount: e.target.value.replace(/\D/g, ""),
                    })
                  }
                  className="bg-gray-700 border-gray-600 text-white mt-1"
                />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-xs text-gray-400">Category</label>
                <select
                  value={newGoal.icon}
                  onChange={(e) =>
                    setNewGoal({ ...newGoal, icon: e.target.value })
                  }
                  className="w-full bg-gray-700 border-gray-600 text-white rounded-md p-2 mt-1"
                >
                  <option value="home">🏠 Home</option>
                  <option value="car">🚗 Car</option>
                  <option value="travel">✈️ Travel</option>
                  <option value="education">🎓 Education</option>
                  <option value="health">❤️ Health</option>
                  <option value="emergency">🛡️ Emergency</option>
                  <option value="business">💼 Business</option>
                  <option value="other">🎁 Other</option>
                </select>
              </div>
              <div>
                <label className="text-xs text-gray-400">
                  Target Date (Optional)
                </label>
                <Input
                  type="month"
                  value={newGoal.deadline}
                  onChange={(e) =>
                    setNewGoal({ ...newGoal, deadline: e.target.value })
                  }
                  className="bg-gray-700 border-gray-600 text-white mt-1"
                />
              </div>
            </div>
            <div className="flex gap-2">
              <Button
                onClick={handleAddGoal}
                className="text-white"
                style={{ backgroundColor: "#007200" }}
              >
                Save Goal
              </Button>
              <Button
                variant="outline"
                onClick={() => setShowAddForm(false)}
                className="border-gray-600 text-gray-300"
              >
                Cancel
              </Button>
            </div>
          </div>
        )}

        {/* Goals List */}
        <div className="space-y-4">
          {goals.map((goal) => {
            const Icon = GOAL_ICONS[goal.icon] || Gift;
            const color = GOAL_COLORS[goal.icon] || "#70e000";
            const progress = (goal.currentAmount / goal.targetAmount) * 100;
            const monthsToGoal = calculateMonthsToGoal(goal);

            return (
              <div
                key={goal.id}
                className="bg-gray-900 rounded-lg p-4 hover:bg-gray-850 transition-colors"
              >
                <div className="flex items-start gap-4">
                  <div
                    className="p-3 rounded-lg"
                    style={{ backgroundColor: `${color}20` }}
                  >
                    <Icon className="w-6 h-6" style={{ color }} />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center justify-between">
                      <h4 className="text-white font-medium">{goal.name}</h4>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleDeleteGoal(goal.id)}
                        className="text-gray-500 hover:text-red-400 h-8 w-8 p-0"
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                    <div className="flex justify-between text-sm text-gray-400 mt-1">
                      <span>{formatIDR(goal.currentAmount)}</span>
                      <span>{formatIDR(goal.targetAmount)}</span>
                    </div>
                    <div className="h-2 bg-gray-700 rounded-full mt-2">
                      <div
                        className="h-full rounded-full transition-all duration-500"
                        style={{
                          width: `${Math.min(100, progress)}%`,
                          backgroundColor: color,
                        }}
                      />
                    </div>
                    <div className="flex justify-between items-center mt-2">
                      <span className="text-xs text-gray-500">
                        {progress >= 100
                          ? "🎉 Goal Reached!"
                          : monthsToGoal === Infinity
                            ? "Set savings to estimate"
                            : `~${monthsToGoal} months to go`}
                      </span>
                      {goal.deadline && (
                        <span className="text-xs text-gray-500">
                          Target:{" "}
                          {new Date(goal.deadline + "-01").toLocaleDateString(
                            "id-ID",
                            {
                              month: "short",
                              year: "numeric",
                            },
                          )}
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {goals.length === 0 && (
          <div className="text-center py-8 text-gray-500">
            <Target className="w-12 h-12 mx-auto mb-3 opacity-50" />
            <p>No savings goals yet</p>
            <p className="text-sm">
              Click "Add Goal" to create your first goal
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
