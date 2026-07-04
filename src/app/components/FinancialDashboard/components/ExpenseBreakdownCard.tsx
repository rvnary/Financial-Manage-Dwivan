import { Card, CardContent, CardHeader, CardTitle } from "../../ui/card";
import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  Tooltip,
} from "recharts";
import { ShoppingBag } from "lucide-react";
import { formatIDR } from "../../../utils/investmentCalculations";

interface ExpenseBreakdownCardProps {
  expenseData: Array<{ name: string; value: number; color: string }>;
  monthlySalary: number;
}

export function ExpenseBreakdownCard({
  expenseData,
  monthlySalary,
}: ExpenseBreakdownCardProps) {
  return (
    <Card className="motion-card bg-gray-800/90 border-gray-700">
      <CardHeader>
        <CardTitle className="text-white flex items-center gap-2">
          <ShoppingBag className="w-5 h-5" />
          Rincian Anggaran
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex flex-col lg:flex-row items-center gap-6">
          <div className="w-full lg:w-1/2 h-64">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={expenseData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={100}
                  paddingAngle={2}
                  dataKey="value"
                >
                  {expenseData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip
                  content={({ active, payload }) => {
                    if (active && payload && payload.length) {
                      const data = payload[0].payload;
                      const percentage = (
                        (data.value / monthlySalary) *
                        100
                      ).toFixed(1);
                      return (
                        <div className="bg-gray-900 border border-gray-700 rounded-lg p-3">
                          <p className="text-white font-medium">
                            {data.name}
                          </p>
                          <p className="text-gray-300">
                            {formatIDR(data.value)}
                          </p>
                          <p className="text-gray-400 text-sm">
                            {percentage}% dari pemasukan
                          </p>
                        </div>
                      );
                    }
                    return null;
                  }}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div className="w-full lg:w-1/2 space-y-3">
            {expenseData.map((item, index) => {
              const percentage = ((item.value / monthlySalary) * 100).toFixed(
                1,
              );
              return (
                <div
                  key={index}
                  className="flex items-center gap-3 transition duration-300 hover:translate-x-1"
                >
                  <div
                    className="w-4 h-4 rounded-full"
                    style={{ backgroundColor: item.color }}
                  />
                  <div className="flex-1">
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-300">{item.name}</span>
                      <span className="text-white font-medium">
                        {percentage}%
                      </span>
                    </div>
                    <div className="h-2 bg-gray-700 rounded-full mt-1">
                      <div
                        className="motion-bar h-full rounded-full transition-all duration-500"
                        style={{
                          width: `${Math.min(100, parseFloat(percentage))}%`,
                          backgroundColor: item.color,
                        }}
                      />
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
