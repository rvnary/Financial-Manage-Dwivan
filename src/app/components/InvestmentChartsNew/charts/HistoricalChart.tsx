import {
  ComposedChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Area,
} from "recharts";
import { formatUSD } from "../../../utils/investmentCalculations";
import type { HistoricalPricePoint } from "../types";
import { calculateDynamicDomain } from "./dynamicDomain";

interface HistoricalChartProps {
  data: HistoricalPricePoint[];
  color: string;
}

export function HistoricalChart({ data, color }: HistoricalChartProps) {
  return (
    <ResponsiveContainer width="100%" height={200}>
      <ComposedChart data={data} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
        <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
        <XAxis
          dataKey="date"
          tick={{ fontSize: 11, fill: "#d1d5db" }}
          interval="preserveStartEnd"
        />
        <YAxis
          tick={{ fontSize: 11, fill: "#d1d5db" }}
          domain={calculateDynamicDomain(data, "close")}
        />
        <Tooltip
          contentStyle={{
            backgroundColor: "#1f2937",
            border: "1px solid #374151",
            borderRadius: "8px",
            fontSize: "12px",
            color: "#fff",
          }}
          content={({ active, payload, label }) => {
            if (active && payload && payload.length) {
              const priceData = payload.find(
                (p: any) => p.name === "priceline",
              );
              if (priceData) {
                return (
                  <div className="bg-gray-800 border border-gray-600 rounded-lg p-2">
                    <p className="text-white font-medium">{label}</p>
                    <p className="text-green-400">
                      Harga: {formatUSD(priceData.value as number)}
                    </p>
                  </div>
                );
              }
            }
            return null;
          }}
        />
        <Area
          type="monotone"
          dataKey="close"
          name="area"
          stroke={color}
          fill={color}
          fillOpacity={0.1}
          strokeWidth={1}
          legendType="none"
        />
        <Line
          type="monotone"
          dataKey="close"
          name="priceline"
          stroke={color}
          strokeWidth={2}
          dot={false}
          legendType="none"
        />
      </ComposedChart>
    </ResponsiveContainer>
  );
}
