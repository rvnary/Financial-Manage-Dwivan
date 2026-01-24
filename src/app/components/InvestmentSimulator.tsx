import { useState, useMemo } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Slider } from "./ui/slider";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Area,
  ComposedChart,
  Legend,
} from "recharts";
import {
  Calculator,
  TrendingUp,
  Calendar,
  Percent,
  DollarSign,
} from "lucide-react";

interface InvestmentSimulatorProps {
  initialInvestment: number;
  monthlyContribution: number;
}

export function InvestmentSimulator({
  initialInvestment,
  monthlyContribution,
}: InvestmentSimulatorProps) {
  const [years, setYears] = useState(10);
  const [annualReturn, setAnnualReturn] = useState(12);
  const [inflationRate, setInflationRate] = useState(5);

  const formatIDR = (value: number) => {
    if (value >= 1000000000) {
      return `Rp ${(value / 1000000000).toFixed(2)} Miliar`;
    }
    if (value >= 1000000) {
      return `Rp ${(value / 1000000).toFixed(1)} Juta`;
    }
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(value);
  };

  const formatFullIDR = (value: number) => {
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(value);
  };

  // Calculate investment growth
  const projectionData = useMemo(() => {
    const data = [];
    const monthlyRate = annualReturn / 100 / 12;
    const realRate = (annualReturn - inflationRate) / 100 / 12;

    let nominalValue = initialInvestment;
    let realValue = initialInvestment;
    let totalContributed = initialInvestment;

    data.push({
      year: 0,
      nominal: nominalValue,
      real: realValue,
      contributed: totalContributed,
    });

    for (let month = 1; month <= years * 12; month++) {
      // Compound growth
      nominalValue = nominalValue * (1 + monthlyRate) + monthlyContribution;
      realValue = realValue * (1 + realRate) + monthlyContribution;
      totalContributed += monthlyContribution;

      // Only add data points for each year
      if (month % 12 === 0) {
        data.push({
          year: month / 12,
          nominal: Math.round(nominalValue),
          real: Math.round(realValue),
          contributed: Math.round(totalContributed),
        });
      }
    }

    return data;
  }, [
    initialInvestment,
    monthlyContribution,
    years,
    annualReturn,
    inflationRate,
  ]);

  const finalData = projectionData[projectionData.length - 1];
  const totalContributed = finalData?.contributed || 0;
  const nominalFinalValue = finalData?.nominal || 0;
  const realFinalValue = finalData?.real || 0;
  const totalGain = nominalFinalValue - totalContributed;
  const gainPercentage =
    totalContributed > 0
      ? ((totalGain / totalContributed) * 100).toFixed(0)
      : 0;

  // Retirement projection
  const retirementAge = 55;
  const currentAge = 25;
  const yearsToRetirement = retirementAge - currentAge;
  const monthlyPassiveIncome = (nominalFinalValue * (annualReturn / 100)) / 12;

  return (
    <Card className="bg-gray-800 border-gray-700">
      <CardHeader>
        <CardTitle className="text-white flex items-center gap-2">
          <Calculator className="w-5 h-5" style={{ color: "#70e000" }} />
          Investment Simulator
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Controls */}
        <div className="grid md:grid-cols-3 gap-6">
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <Label className="text-gray-300 flex items-center gap-2">
                <Calendar className="w-4 h-4" />
                Investment Period
              </Label>
              <span className="text-white font-medium">{years} years</span>
            </div>
            <Slider
              value={[years]}
              onValueChange={([v]) => setYears(v)}
              min={1}
              max={30}
              step={1}
              className="cursor-pointer"
            />
          </div>

          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <Label className="text-gray-300 flex items-center gap-2">
                <Percent className="w-4 h-4" />
                Annual Return
              </Label>
              <span className="text-white font-medium">{annualReturn}%</span>
            </div>
            <Slider
              value={[annualReturn]}
              onValueChange={([v]) => setAnnualReturn(v)}
              min={1}
              max={30}
              step={1}
              className="cursor-pointer"
            />
          </div>

          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <Label className="text-gray-300 flex items-center gap-2">
                <TrendingUp className="w-4 h-4" />
                Inflation Rate
              </Label>
              <span className="text-white font-medium">{inflationRate}%</span>
            </div>
            <Slider
              value={[inflationRate]}
              onValueChange={([v]) => setInflationRate(v)}
              min={0}
              max={15}
              step={0.5}
              className="cursor-pointer"
            />
          </div>
        </div>

        {/* Results Summary */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="bg-gray-900 rounded-lg p-4">
            <p className="text-xs text-gray-400">Total Contributed</p>
            <p className="text-lg font-bold text-white">
              {formatIDR(totalContributed)}
            </p>
          </div>
          <div className="bg-gray-900 rounded-lg p-4">
            <p className="text-xs text-gray-400">Final Value (Nominal)</p>
            <p className="text-lg font-bold" style={{ color: "#70e000" }}>
              {formatIDR(nominalFinalValue)}
            </p>
          </div>
          <div className="bg-gray-900 rounded-lg p-4">
            <p className="text-xs text-gray-400">Final Value (Real)</p>
            <p className="text-lg font-bold text-blue-400">
              {formatIDR(realFinalValue)}
            </p>
          </div>
          <div className="bg-gray-900 rounded-lg p-4">
            <p className="text-xs text-gray-400">Total Gain</p>
            <p className="text-lg font-bold text-green-400">
              +{formatIDR(totalGain)} ({gainPercentage}%)
            </p>
          </div>
        </div>

        {/* Growth Chart */}
        <div className="bg-gray-900 rounded-lg p-4">
          <h4 className="text-white font-medium mb-4">Projected Growth</h4>
          <div className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <ComposedChart
                data={projectionData}
                margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
              >
                <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                <XAxis
                  dataKey="year"
                  tick={{ fontSize: 12, fill: "#9ca3af" }}
                  tickFormatter={(v) => `Year ${v}`}
                />
                <YAxis
                  tick={{ fontSize: 12, fill: "#9ca3af" }}
                  tickFormatter={(v) => formatIDR(v)}
                />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "#1f2937",
                    border: "1px solid #374151",
                    borderRadius: "8px",
                    color: "#fff",
                  }}
                  formatter={(value: number, name: string) => {
                    const labels: Record<string, string> = {
                      nominal: "Nominal Value",
                      real: "Real Value (Inflation Adjusted)",
                      contributed: "Total Contributed",
                    };
                    return [formatFullIDR(value), labels[name] || name];
                  }}
                  labelFormatter={(label) => `Year ${label}`}
                />
                <Legend
                  wrapperStyle={{ color: "#9ca3af" }}
                  formatter={(value) => {
                    const labels: Record<string, string> = {
                      nominal: "Nominal Value",
                      real: "Real Value",
                      contributed: "Contributed",
                    };
                    return labels[value] || value;
                  }}
                />
                <Area
                  type="monotone"
                  dataKey="contributed"
                  stroke="#6b7280"
                  fill="#6b7280"
                  fillOpacity={0.2}
                  strokeWidth={2}
                />
                <Line
                  type="monotone"
                  dataKey="real"
                  stroke="#3b82f6"
                  strokeWidth={2}
                  dot={false}
                />
                <Line
                  type="monotone"
                  dataKey="nominal"
                  stroke="#70e000"
                  strokeWidth={3}
                  dot={false}
                />
              </ComposedChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Passive Income Projection */}
        <div className="bg-gradient-to-r from-green-900/30 to-emerald-900/30 border border-green-800 rounded-lg p-4">
          <h4 className="text-white font-medium mb-2 flex items-center gap-2">
            <DollarSign className="w-5 h-5" style={{ color: "#70e000" }} />
            Passive Income Potential
          </h4>
          <p className="text-gray-400 text-sm mb-3">
            If you invest your final portfolio at {annualReturn}% annual return:
          </p>
          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-bold" style={{ color: "#70e000" }}>
              {formatFullIDR(Math.round(monthlyPassiveIncome))}
            </span>
            <span className="text-gray-400">/ month</span>
          </div>
          <p className="text-gray-500 text-xs mt-2">
            This is the potential passive income without touching your principal
          </p>
        </div>

        {/* Investment Info */}
        <div className="text-xs text-gray-500 space-y-1">
          <p>💡 Initial Investment: {formatFullIDR(initialInvestment)}</p>
          <p>💡 Monthly Contribution: {formatFullIDR(monthlyContribution)}</p>
          <p>⚠️ This is a simulation only. Actual returns may vary.</p>
        </div>
      </CardContent>
    </Card>
  );
}
