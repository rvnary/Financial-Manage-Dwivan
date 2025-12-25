// Investment calculation utilities

export interface PriceAnalysis {
  startPrice: number;
  endPrice: number;
  monthlyReturn: number; // Persentase return dalam 1 bulan
  monthlyCAGR: number; // Return 1 bulan dalam desimal
  annualizedCAGR: number; // Annualized Return (Simple: Monthly * 12)
  annualizedReturn: number; // Persentase return tahunan
  forecastedPrice30Days: number; // Harga yang diproyeksikan dalam 30 hari ke depan
  highPrice: number;
  lowPrice: number;
}

/**
 * Calculate simple monthly return percentage
 */
export function calculateMonthlyReturn(
  startPrice: number,
  endPrice: number
): number {
  if (startPrice <= 0) return 0;
  return (endPrice - startPrice) / startPrice;
}

/**
 * Calculate Simple Annualized Return (Previously CAGR)
 * Uses arithmetic projection: (Total Return / Days) * 365
 * This avoids inflated numbers compared to geometric compounding.
 */
export function calculateCAGR(
  startPrice: number,
  endPrice: number,
  daysElapsed: number = 30
): number {
  if (startPrice <= 0 || endPrice <= 0) return 0;

  // Calculate absolute return for the period
  const totalReturn = (endPrice - startPrice) / startPrice;

  // Annualize linearly:
  // (Return / Days) * 365
  const annualizedReturn = (totalReturn / daysElapsed) * 365;

  return annualizedReturn;
}

/**
 * Annualize a 30-day return to annual return using Simple Interest
 * Formula: 30-day Return * 12 (approx)
 */
export function annualizeReturn(thirtyDayReturn: number): number {
  // Number of 30-day periods in a year
  // Using 12 directly as requested for consistency and cleaner numbers
  const periodsPerYear = 12;

  // Simple Annualization: Return * 12
  return thirtyDayReturn * periodsPerYear;
}

/**
 * Analyze price movement and calculate investment metrics
 */
export function analyzePriceMovement(
  historicalPrices: Array<{ close: number }>
): PriceAnalysis {
  if (historicalPrices.length === 0) {
    return {
      startPrice: 0,
      endPrice: 0,
      monthlyReturn: 0,
      monthlyCAGR: 0,
      annualizedCAGR: 0,
      annualizedReturn: 0,
      forecastedPrice30Days: 0,
      highPrice: 0,
      lowPrice: 0,
    };
  }

  const startPrice = historicalPrices[0].close;
  const endPrice = historicalPrices[historicalPrices.length - 1].close;

  // Find high and low prices
  const prices = historicalPrices.map((p) => p.close);
  const highPrice = Math.max(...prices);
  const lowPrice = Math.min(...prices);

  // Calculate monthly return as decimal (not percentage)
  const monthlyReturnDecimal = calculateMonthlyReturn(startPrice, endPrice);
  const monthlyReturn = monthlyReturnDecimal * 100; // Convert to percentage for display

  // Calculate Annualized Return based on 30 days history
  // Using simple multiplication logic
  const annualizedCAGR = annualizeReturn(monthlyReturnDecimal);
  const annualizedReturn = annualizedCAGR * 100; // Convert to percentage for display

  // Forecast price for next 30 days
  // Using simple monthly rate (annual / 12)
  const monthlyForecastRate = annualizedCAGR / 12;
  const forecastedPrice30Days = endPrice * (1 + monthlyForecastRate);

  return {
    startPrice,
    endPrice,
    monthlyReturn,
    monthlyCAGR: monthlyReturnDecimal,
    annualizedCAGR,
    annualizedReturn,
    forecastedPrice30Days,
    highPrice,
    lowPrice,
  };
}

/**
 * Generate forecast data points for the next 30 days
 * Updated to use Linear Interpolation to match the Simple Interest logic
 */
export function generateForecastData(
  currentPrice: number,
  annualizedCAGR: number,
  days: number = 30
): Array<{ date: string; price: number }> {
  const data = [];
  // Get monthly rate back from annualized
  const monthlyRate = annualizedCAGR / 12;

  for (let i = 0; i <= days; i++) {
    // Linear growth calculation:
    // Price * (1 + (MonthlyRate * (Day / 30)))
    const growthFactor = (monthlyRate * i) / days;
    const projectedPrice = currentPrice * (1 + growthFactor);

    const futureDate = new Date();
    futureDate.setDate(futureDate.getDate() + i);

    data.push({
      date: futureDate.toLocaleDateString("id-ID", {
        month: "short",
        day: "numeric",
      }),
      price: Math.round(projectedPrice),
    });
  }

  return data;
}

/**
 * Interpolate historical data to fill exactly 30 calendar days
 * This ensures X-axis shows full 30 days even if API only returns trading days
 */
export function interpolateHistoricalData(
  historicalData: Array<{
    date: string;
    open: number;
    high: number;
    low: number;
    close: number;
  }>
): Array<{
  date: string;
  open: number;
  high: number;
  low: number;
  close: number;
}> {
  if (historicalData.length === 0) return historicalData;

  const result = [];
  const startDate = new Date();
  // Hitung mundur 30 hari dari hari ini
  startDate.setDate(startDate.getDate() - 30);

  // Map data berdasarkan tanggal untuk lookup cepat
  const dataMap = new Map(
    historicalData.map((d) => {
      const dateStr = d.date; // format: "1 Jan", "2 Jan", etc
      return [dateStr, d];
    })
  );

  // Buat array 30 hari penuh
  for (let i = 0; i <= 30; i++) {
    const currentDate = new Date(startDate);
    currentDate.setDate(currentDate.getDate() + i);
    const dateKey = currentDate.toLocaleDateString("id-ID", {
      month: "short",
      day: "numeric",
    });

    let dataPoint = dataMap.get(dateKey);

    if (!dataPoint && result.length > 0) {
      // Jika tidak ada data untuk hari ini, interpolasi antara data sebelumnya dan sesudahnya
      const prevData = result[result.length - 1];

      // Cari data berikutnya
      let nextData = null;
      for (let j = i + 1; j <= 30; j++) {
        const futureDate = new Date(startDate);
        futureDate.setDate(futureDate.getDate() + j);
        const futureKey = futureDate.toLocaleDateString("id-ID", {
          month: "short",
          day: "numeric",
        });
        if (dataMap.has(futureKey)) {
          nextData = dataMap.get(futureKey);
          break;
        }
      }

      if (nextData) {
        // Linear interpolation antara prevData dan nextData
        const prevClose = prevData.close;
        const nextClose = nextData.close;
        const interpolatedClose = (prevClose + nextClose) / 2;

        dataPoint = {
          date: dateKey,
          open: (prevData.open + nextData.open) / 2,
          high: Math.max(prevData.high, nextData.high),
          low: Math.min(prevData.low, nextData.low),
          close: interpolatedClose,
        };
      } else {
        // Jika tidak ada data berikutnya, gunakan data terakhir
        dataPoint = { ...prevData, date: dateKey };
      }
    }

    if (dataPoint) {
      result.push(dataPoint);
    }
  }

  return result;
}

/**
 * Calculate portfolio weighted expected return
 * @param investments Array of investments with their weights and expected returns
 * @returns Total weighted expected return
 */
export interface InvestmentWeight {
  name: string;
  weight: number; // 0 to 1 (e.g., 0.3 for 30%)
  expectedReturn: number; // percentage (e.g., 33.3 for 33.3%)
}

export function calculatePortfolioReturn(
  investments: InvestmentWeight[]
): number {
  let totalReturn = 0;

  for (const investment of investments) {
    totalReturn += investment.weight * (investment.expectedReturn / 100);
  }

  return totalReturn * 100; // Return as percentage
}

/**
 * Calculate portfolio return based on risk profile and stock returns
 * This properly weights the stock returns by their allocation
 * With 3 stocks: SPY (low risk), JNJ (low risk), and AAPL (high risk)
 */
export function calculatePortfolioReturnByProfile(
  riskProfile: "conservative" | "balanced" | "aggressive",
  stockReturns: number[] // Array of individual stock returns (percentages)
): number {
  if (stockReturns.length < 3) return 0;

  const allocations = getPortfolioAllocation(riskProfile);

  // stockReturns[0] = SPY (Low risk index)
  // stockReturns[1] = JNJ (Low risk dividend stock)
  // stockReturns[2] = AAPL (High risk growth)
  const spyReturn = stockReturns[0];
  const jnjReturn = stockReturns[1];
  const aaplReturn = stockReturns[2];

  // Get weights from allocations by name
  const spyAlloc = allocations.find((a) => a.name.includes("SPY"));
  const jnjAlloc = allocations.find((a) => a.name.includes("JNJ"));
  const aaplAlloc = allocations.find((a) => a.name.includes("AAPL"));

  const spyWeight = spyAlloc?.weight || 0;
  const jnjWeight = jnjAlloc?.weight || 0;
  const aaplWeight = aaplAlloc?.weight || 0;

  // Calculate weighted portfolio return
  const portfolioReturn =
    (spyReturn / 100) * spyWeight +
    (jnjReturn / 100) * jnjWeight +
    (aaplReturn / 100) * aaplWeight;

  return portfolioReturn * 100; // Return as percentage
}

/**
 * Calculate recommended portfolio allocation based on risk tolerance
 */
export interface AllocationRecommendation {
  name: string;
  weight: number;
  riskLevel: "Low" | "Medium" | "High";
  description: string;
}

export function getPortfolioAllocation(
  riskProfile: "conservative" | "balanced" | "aggressive"
): AllocationRecommendation[] {
  switch (riskProfile) {
    case "conservative":
      return [
        {
          name: "S&P 500 Index (SPY)",
          weight: 0.5,
          riskLevel: "Low",
          description:
            "50% - Core stable foundation with broad diversification",
        },
        {
          name: "Johnson & Johnson (JNJ)",
          weight: 0.3,
          riskLevel: "Low",
          description: "30% - Healthcare dividend stock with strong stability",
        },
        {
          name: "Apple (AAPL)",
          weight: 0.2,
          riskLevel: "High",
          description: "20% - Individual growth stock for capital appreciation",
        },
      ];

    case "balanced":
      return [
        {
          name: "S&P 500 Index (SPY)",
          weight: 0.4,
          riskLevel: "Low",
          description: "40% - Diversified market base",
        },
        {
          name: "Johnson & Johnson (JNJ)",
          weight: 0.35,
          riskLevel: "Low",
          description: "35% - Quality dividend-paying healthcare stock",
        },
        {
          name: "Apple (AAPL)",
          weight: 0.25,
          riskLevel: "High",
          description: "25% - Growth and potential upside",
        },
      ];

    case "aggressive":
      return [
        {
          name: "S&P 500 Index (SPY)",
          weight: 0.3,
          riskLevel: "Low",
          description: "30% - Market participation",
        },
        {
          name: "Johnson & Johnson (JNJ)",
          weight: 0.4,
          riskLevel: "Low",
          description: "40% - Defensive dividend stock with growth",
        },
        {
          name: "Apple (AAPL)",
          weight: 0.3,
          riskLevel: "High",
          description: "30% - Maximum growth potential",
        },
      ];

    default:
      return [];
  }
}

/**
 * Format number to USD currency
 */
export function formatUSD(value: number): string {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(value);
}

/**
 * Format number to IDR currency (Indonesian Rupiah)
 * Used for investment amounts
 */
export function formatIDR(value: number): string {
  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(value);
}

/**
 * Format percentage
 */
export function formatPercentage(value: number, decimals: number = 1): string {
  return `${(value * 100).toFixed(decimals)}%`;
}
