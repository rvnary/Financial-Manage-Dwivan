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
import type { ForecastPricePoint } from "../types";
import { calculateDynamicDomain } from "./dynamicDomain";

interface ForecastChartProps {
  data: ForecastPricePoint[];
  color: string;
}

export function ForecastChart({ data, color }: ForecastChartProps) {
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
          domain={calculateDynamicDomain(data, "price")}
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
              const forecastData = payload.find(
                (p: any) => p.name === "forecast",
              );
              if (forecastData) {
                return (
                  <div className="bg-gray-800 border border-gray-600 rounded-lg p-2">
                    <p className="text-white font-medium">{label}</p>
                    <p className="text-green-400">
                      Proyeksi: {formatUSD(forecastData.value as number)}
                    </p>
                  </div>
                );
              }
            }
            return null;
          }}
        />
        <Area
          type="natural"
          dataKey="price"
          name="area"
          stroke={color}
          fill={color}
          fillOpacity={0.1}
          strokeWidth={2}
          legendType="none"
        />
        <Line
          type="natural"
          dataKey="price"
          name="forecast"
          stroke={color}
          strokeWidth={3}
          dot={false}
          strokeDasharray="5 5"
          legendType="none"
        />
      </ComposedChart>
    </ResponsiveContainer>
  );
}
