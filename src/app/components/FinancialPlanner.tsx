import { useState } from "react";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "./ui/card";
import { InvestmentRecommendations } from "./InvestmentRecommendations";
import { InvestmentCharts } from "./InvestmentCharts";
import { ArrowLeft } from "lucide-react";

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

  const handleInputChange = (field: keyof FormData, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const salary = parseFloat(formData.monthlySalary) || 0;
    const primary = parseFloat(formData.primaryExpenses) || 0;
    const secondary = parseFloat(formData.secondaryExpenses) || 0;
    const savings = parseFloat(formData.savings) || 0;
    const pocket = parseFloat(formData.pocketMoney) || 0;
    
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
          style={{ color: '#70e000' }}
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Home
        </Button>

        <div className="max-w-6xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-8">
            {/* Form Section */}
            <Card className="bg-gray-800 border-gray-700">
              <CardHeader>
                <CardTitle className="text-white">Financial Details</CardTitle>
                <CardDescription className="text-gray-400">
                  Enter your monthly financial information to get personalized recommendations
                </CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="space-y-2">
                    <Label htmlFor="salary" className="text-gray-300">Monthly Salary</Label>
                    <Input
                      id="salary"
                      type="number"
                      placeholder="Enter your monthly salary"
                      value={formData.monthlySalary}
                      onChange={(e) => handleInputChange("monthlySalary", e.target.value)}
                      required
                      min="0"
                      step="0.01"
                      className="bg-gray-700 border-gray-600 text-white placeholder:text-gray-500"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="primary" className="text-gray-300">Primary Expenses</Label>
                    <Input
                      id="primary"
                      type="number"
                      placeholder="Rent, utilities, food, etc."
                      value={formData.primaryExpenses}
                      onChange={(e) => handleInputChange("primaryExpenses", e.target.value)}
                      required
                      min="0"
                      step="0.01"
                      className="bg-gray-700 border-gray-600 text-white placeholder:text-gray-500"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="secondary" className="text-gray-300">Secondary Expenses</Label>
                    <Input
                      id="secondary"
                      type="number"
                      placeholder="Entertainment, subscriptions, etc."
                      value={formData.secondaryExpenses}
                      onChange={(e) => handleInputChange("secondaryExpenses", e.target.value)}
                      required
                      min="0"
                      step="0.01"
                      className="bg-gray-700 border-gray-600 text-white placeholder:text-gray-500"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="savings" className="text-gray-300">Savings</Label>
                    <Input
                      id="savings"
                      type="number"
                      placeholder="Monthly savings amount"
                      value={formData.savings}
                      onChange={(e) => handleInputChange("savings", e.target.value)}
                      required
                      min="0"
                      step="0.01"
                      className="bg-gray-700 border-gray-600 text-white placeholder:text-gray-500"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="pocket" className="text-gray-300">Pocket Money / Spending Money</Label>
                    <Input
                      id="pocket"
                      type="number"
                      placeholder="Personal spending money"
                      value={formData.pocketMoney}
                      onChange={(e) => handleInputChange("pocketMoney", e.target.value)}
                      required
                      min="0"
                      step="0.01"
                      className="bg-gray-700 border-gray-600 text-white placeholder:text-gray-500"
                    />
                  </div>

                  <div className="flex gap-4">
                    <Button 
                      type="submit" 
                      className="flex-1 text-white hover:opacity-90"
                      style={{ backgroundColor: '#007200' }}
                    >
                      Calculate
                    </Button>
                    <Button type="button" variant="outline" onClick={handleReset} className="bg-gray-700 border-gray-600 text-gray-300 hover:bg-gray-600">
                      Reset
                    </Button>
                  </div>
                </form>
              </CardContent>
            </Card>

            {/* Results Section */}
            <div>
              {showResults && (
                <InvestmentRecommendations 
                  remainingMoney={remainingMoney}
                  monthlySalary={parseFloat(formData.monthlySalary) || 0}
                />
              )}
            </div>
          </div>

          {/* Investment Charts Section */}
          {showResults && remainingMoney > 0 && (
            <div className="mt-8">
              <InvestmentCharts remainingMoney={remainingMoney} />
            </div>
          )}
        </div>
      </div>
    </div>
  );
}