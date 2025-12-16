import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "./ui/card";
import { ComposedChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Area } from "recharts";
import { TrendingUp, ArrowUpRight } from "lucide-react";

interface InvestmentChartsProps {
  remainingMoney: number;
}

interface InvestmentOption {
  name: string;
  currentPrice: number;
  expectedPrice: number;
  expectedReturn: number;
  riskLevel: "Low" | "Medium" | "High";
  historicalData: Array<{
    date: string;
    open: number;
    high: number;
    low: number;
    close: number;
  }>;
  forecastData: Array<{
    date: string;
    price: number;
  }>;
  color: string;
  description: string;
}

export function InvestmentCharts({ remainingMoney }: InvestmentChartsProps) {
  // Generate mock investment data with candlestick patterns
  const generateHistoricalData = (basePrice: number, volatility: number, days: number = 30) => {
    const data = [];
    let currentPrice = basePrice;
    
    for (let i = 0; i < days; i++) {
      const change = (Math.random() - 0.5) * volatility;
      const open = currentPrice;
      const close = open + change;
      const high = Math.max(open, close) + Math.random() * volatility * 0.5;
      const low = Math.min(open, close) - Math.random() * volatility * 0.5;
      
      data.push({
        date: new Date(Date.now() - (days - i) * 24 * 60 * 60 * 1000).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
        open: Math.round(open),
        high: Math.round(high),
        low: Math.round(low),
        close: Math.round(close)
      });
      
      currentPrice = close;
    }
    
    return data;
  };

  const generateForecastData = (startPrice: number, endPrice: number, days: number = 30) => {
    const data = [];
    const priceIncrease = (endPrice - startPrice) / days;
    
    for (let i = 0; i <= days; i++) {
      const basePrice = startPrice + (priceIncrease * i);
      const variance = (Math.random() - 0.5) * (endPrice - startPrice) * 0.1;
      
      data.push({
        date: new Date(Date.now() + i * 24 * 60 * 60 * 1000).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
        price: Math.round(basePrice + variance)
      });
    }
    
    return data;
  };

  const investments: InvestmentOption[] = [
    {
      name: "Bitcoin (BTC)",
      currentPrice: 43500,
      expectedPrice: 58000,
      expectedReturn: 33.3,
      riskLevel: "High",
      historicalData: generateHistoricalData(43500, 2000),
      forecastData: generateForecastData(43500, 58000),
      color: "#ccff33",
      description: "Cryptocurrency with high volatility and potential for significant returns"
    },
    {
      name: "S&P 500 Index Fund",
      currentPrice: 4750,
      expectedPrice: 5200,
      expectedReturn: 9.5,
      riskLevel: "Low",
      historicalData: generateHistoricalData(4750, 100),
      forecastData: generateForecastData(4750, 5200),
      color: "#007200",
      description: "Diversified index fund tracking the 500 largest US companies"
    },
    {
      name: "Tech Growth ETF",
      currentPrice: 285,
      expectedPrice: 342,
      expectedReturn: 20.0,
      riskLevel: "Medium",
      historicalData: generateHistoricalData(285, 15),
      forecastData: generateForecastData(285, 342),
      color: "#38b000",
      description: "Technology-focused ETF with exposure to high-growth companies"
    }
  ];

  const CustomCandlestick = ({ data, color }: { data: any[]; color: string }) => {
    return (
      <ResponsiveContainer width="100%" height={200}>
        <ComposedChart data={data} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
          <XAxis 
            dataKey="date" 
            tick={{ fontSize: 11, fill: '#9ca3af' }}
            interval="preserveStartEnd"
          />
          <YAxis 
            tick={{ fontSize: 11, fill: '#9ca3af' }}
            domain={['dataMin - 100', 'dataMax + 100']}
          />
          <Tooltip 
            contentStyle={{ 
              backgroundColor: '#1f2937', 
              border: '1px solid #374151',
              borderRadius: '8px',
              fontSize: '12px',
              color: '#fff'
            }}
            formatter={(value: any) => `$${value?.toLocaleString()}`}
          />
          {data.map((entry, index) => {
            const isGreen = entry.close >= entry.open;
            const x = index * (100 / data.length);
            const wickColor = isGreen ? '#10b981' : '#ef4444';
            
            return (
              <g key={index}>
                {/* Candlestick body */}
                <rect
                  x={`${x}%`}
                  y={Math.min(entry.open, entry.close)}
                  width="2%"
                  height={Math.abs(entry.close - entry.open) || 1}
                  fill={isGreen ? '#10b981' : '#ef4444'}
                  opacity={0.8}
                />
              </g>
            );
          })}
          <Line 
            type="monotone" 
            dataKey="close" 
            stroke={color} 
            strokeWidth={2}
            dot={false}
          />
        </ComposedChart>
      </ResponsiveContainer>
    );
  };

  const ForecastChart = ({ data, color }: { data: any[]; color: string }) => {
    return (
      <ResponsiveContainer width="100%" height={200}>
        <ComposedChart data={data} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
          <XAxis 
            dataKey="date" 
            tick={{ fontSize: 11, fill: '#9ca3af' }}
            interval="preserveStartEnd"
          />
          <YAxis 
            tick={{ fontSize: 11, fill: '#9ca3af' }}
            domain={['dataMin - 100', 'dataMax + 100']}
          />
          <Tooltip 
            contentStyle={{ 
              backgroundColor: '#1f2937', 
              border: '1px solid #374151',
              borderRadius: '8px',
              fontSize: '12px',
              color: '#fff'
            }}
            formatter={(value: any) => `$${value?.toLocaleString()}`}
          />
          <Area
            type="monotone"
            dataKey="price"
            stroke={color}
            fill={color}
            fillOpacity={0.1}
            strokeWidth={2}
          />
          <Line 
            type="monotone" 
            dataKey="price" 
            stroke={color} 
            strokeWidth={3}
            dot={false}
            strokeDasharray="5 5"
          />
        </ComposedChart>
      </ResponsiveContainer>
    );
  };

  const calculatePotentialReturn = (investment: InvestmentOption) => {
    if (remainingMoney <= 0) return 0;
    const investmentAmount = remainingMoney * 0.3; // Assume 30% allocation
    const returnAmount = investmentAmount * (investment.expectedReturn / 100);
    return returnAmount;
  };

  const getRiskBadgeColor = (risk: string) => {
    switch (risk) {
      case "Low": return "bg-green-100 text-green-800 border-green-200";
      case "Medium": return "bg-yellow-100 text-yellow-800 border-yellow-200";
      case "High": return "bg-red-100 text-red-800 border-red-200";
      default: return "bg-gray-100 text-gray-800 border-gray-200";
    }
  };

  return (
    <div className="space-y-6 mt-8">
      <div className="flex items-center gap-2">
        <TrendingUp className="w-6 h-6" style={{ color: '#70e000' }} />
        <h2 className="text-2xl text-white">Investment Opportunities</h2>
      </div>
      <p className="text-gray-400">
        Based on market analysis, here are top investment recommendations with expected returns
      </p>

      <div className="grid gap-6">
        {investments.map((investment, index) => (
          <Card key={index} className="overflow-hidden bg-gray-800 border-gray-700">
            <CardHeader className="bg-gradient-to-r from-gray-800 to-gray-750">
              <div className="flex justify-between items-start">
                <div>
                  <CardTitle className="flex items-center gap-2 text-white">
                    {investment.name}
                    <span className={`text-xs px-2 py-1 rounded-full border ${getRiskBadgeColor(investment.riskLevel)}`}>
                      {investment.riskLevel} Risk
                    </span>
                  </CardTitle>
                  <CardDescription className="mt-2 text-gray-400">{investment.description}</CardDescription>
                </div>
                <div className="text-right">
                  <div className="flex items-center gap-1" style={{ color: '#70e000' }}>
                    <ArrowUpRight className="w-5 h-5" />
                    <span className="text-2xl">+{investment.expectedReturn}%</span>
                  </div>
                  <div className="text-xs text-gray-400">Expected Return</div>
                </div>
              </div>
            </CardHeader>
            <CardContent className="pt-6">
              <div className="grid md:grid-cols-2 gap-6">
                {/* Current Price Chart */}
                <div>
                  <div className="mb-3">
                    <div className="flex justify-between items-center mb-2">
                      <h4 className="font-medium text-white">Current Price Trend</h4>
                      <div className="text-right">
                        <div className="text-lg" style={{ color: investment.color }}>
                          ${investment.currentPrice.toLocaleString()}
                        </div>
                        <div className="text-xs text-gray-400">Current Price</div>
                      </div>
                    </div>
                  </div>
                  <CustomCandlestick data={investment.historicalData} color={investment.color} />
                  <p className="text-xs text-gray-500 mt-2">Last 30 days historical data</p>
                </div>

                {/* Expected Price Chart */}
                <div>
                  <div className="mb-3">
                    <div className="flex justify-between items-center mb-2">
                      <h4 className="font-medium text-white">Expected Price Trend</h4>
                      <div className="text-right">
                        <div className="text-lg" style={{ color: investment.color }}>
                          ${investment.expectedPrice.toLocaleString()}
                        </div>
                        <div className="text-xs text-gray-400">Expected Price</div>
                      </div>
                    </div>
                  </div>
                  <ForecastChart data={investment.forecastData} color={investment.color} />
                  <p className="text-xs text-gray-500 mt-2">30-day forecast projection</p>
                </div>
              </div>

              {/* Investment Summary */}
              {remainingMoney > 0 && (
                <div className="mt-6 p-4 rounded-lg border" style={{ 
                  background: 'linear-gradient(to right, #70e00015, #9ef01a15)',
                  borderColor: '#70e00030'
                }}>
                  <div className="grid grid-cols-3 gap-4 text-center">
                    <div>
                      <div className="text-xs text-gray-400 mb-1">Suggested Investment</div>
                      <div className="font-medium text-white">
                        ${(remainingMoney * 0.3).toLocaleString(undefined, { maximumFractionDigits: 0 })}
                      </div>
                    </div>
                    <div>
                      <div className="text-xs text-gray-400 mb-1">Potential Return</div>
                      <div className="font-medium" style={{ color: '#70e000' }}>
                        ${calculatePotentialReturn(investment).toLocaleString(undefined, { maximumFractionDigits: 0 })}
                      </div>
                    </div>
                    <div>
                      <div className="text-xs text-gray-400 mb-1">Time Horizon</div>
                      <div className="font-medium text-white">30 days</div>
                    </div>
                  </div>
                </div>
              )}

              {/* Recommendation */}
              <div className="mt-4 p-3 bg-gray-700 border-l-4 rounded" style={{ borderLeftColor: investment.color }}>
                <p className="text-sm text-gray-300">
                  <span className="font-medium text-white">Recommendation:</span> You should invest in {investment.name}, 
                  because the expected return is <span className="font-medium" style={{ color: '#70e000' }}>{investment.expectedReturn}%</span> over 
                  the next 30 days. {investment.riskLevel === "High" && "However, be aware of the high volatility and only invest what you can afford to lose."} 
                  {investment.riskLevel === "Low" && "This is a stable, long-term investment suitable for conservative investors."} 
                  {investment.riskLevel === "Medium" && "This offers a balanced risk-reward ratio for moderate investors."}
                </p>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Disclaimer */}
      <div className="bg-amber-950 border border-amber-800 rounded-lg p-4">
        <h4 className="font-medium text-amber-400 mb-2">⚠️ Investment Disclaimer</h4>
        <p className="text-sm text-amber-300">
          These are educational examples only and not financial advice. Past performance does not guarantee 
          future results. All investments carry risk. Please consult with a qualified financial advisor 
          before making investment decisions.

          Project Tugas ini adalah contoh edukasi saja dan bukan merupakan nasihat keuangan.
          Semua investasi mengandung risiko.
          Mohon konsultasikan dengan penasihat keuangan yang berkualifikasi sebelum membuat
          keputusan untuk ber-investasi.
        </p>
      </div>
    </div>
  );
}
