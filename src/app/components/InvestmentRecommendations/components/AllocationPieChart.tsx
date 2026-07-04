import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from "recharts";
import type { AllocationDataItem } from "../types";
import { CustomTooltip } from "./CustomTooltip";

interface AllocationPieChartProps {
  allocationData: AllocationDataItem[];
}

export function AllocationPieChart({ allocationData }: AllocationPieChartProps) {
  return (
    <div className="motion-card bg-gray-700/80 rounded-lg p-4">
      <h4 className="font-medium text-white mb-4">Rincian Alokasi</h4>
      <div className="h-64">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={allocationData}
              cx="50%"
              cy="50%"
              labelLine={false}
              label={({ symbol, percentage, cx, cy, midAngle }) => {
                const radius = 100;
                const RADIAN = Math.PI / 180;
                const x = cx + radius * Math.cos(-midAngle * RADIAN);
                const y = cy + radius * Math.sin(-midAngle * RADIAN);
                return (
                  <text
                    x={x}
                    y={y}
                    textAnchor={x > cx ? "start" : "end"}
                    dominantBaseline="central"
                    className="font-bold"
                    style={{
                      fill: "white",
                      fontSize: "14px",
                      stroke: "rgba(0,0,0,0.7)",
                      strokeWidth: "0.5px",
                    }}
                  >
                    {`${symbol} ${percentage}%`}
                  </text>
                );
              }}
              outerRadius={70}
              fill="#8884d8"
              dataKey="value"
            >
              {allocationData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.color} />
              ))}
            </Pie>
            <Tooltip content={<CustomTooltip />} />
          </PieChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
