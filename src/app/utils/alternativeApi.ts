// Alternative API using Yahoo Finance (free, no API key required)
// This is a fallback option when Finnhub is not available

export interface HistoricalPrice {
  date: string;
  open: number;
  high: number;
  low: number;
  close: number;
  volume: number;
}

/**
 * Fetch historical data using Yahoo Finance alternative API
 * Free to use, no API key required
 */
export async function fetchHistoricalPricesAlternative(
  symbol: string
): Promise<HistoricalPrice[]> {
  try {
    // Using yfinance-like endpoint (free alternative)
    // Calculate date range (last 30 days + buffer)
    const today = new Date();
    const thirtyDaysAgo = new Date(today);
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 35);

    const startDate = Math.floor(thirtyDaysAgo.getTime() / 1000);
    const endDate = Math.floor(today.getTime() / 1000);

    // Try using Rapid API endpoint (has free tier)
    const url = `https://yh-finance.p.rapidapi.com/stock/v2/get-chart?interval=1d&symbol=${symbol}&range=1mo`;

    const response = await fetch(url, {
      method: "GET",
      headers: {
        "x-rapidapi-key": import.meta.env.VITE_RAPIDAPI_KEY || "",
        "x-rapidapi-host": "yh-finance.p.rapidapi.com",
      },
    });

    if (!response.ok) {
      throw new Error(`API error: ${response.statusText}`);
    }

    const data = await response.json();

    if (!data.chart?.result?.[0]?.timestamp) {
      return [];
    }

    const quotes = data.chart.result[0].indicators.quote[0];
    const timestamps = data.chart.result[0].timestamp;

    const prices: HistoricalPrice[] = timestamps
      .map((timestamp: number, index: number) => {
        const date = new Date(timestamp * 1000);
        return {
          date: date.toLocaleDateString("id-ID", {
            month: "short",
            day: "numeric",
          }),
          open: Math.round(quotes.open[index] * 100) / 100,
          high: Math.round(quotes.high[index] * 100) / 100,
          low: Math.round(quotes.low[index] * 100) / 100,
          close: Math.round(quotes.close[index] * 100) / 100,
          volume: quotes.volume[index] || 0,
        };
      })
      .filter((p) => p.close > 0);

    return prices;
  } catch (error) {
    console.error(
      `Error fetching data from Yahoo Finance for ${symbol}:`,
      error
    );
    return [];
  }
}

/**
 * Generate mock historical data for testing/fallback
 * Creates realistic price movements
 */
export function generateMockHistoricalData(
  basePrice: number,
  symbol: string,
  days: number = 30
): HistoricalPrice[] {
  const data: HistoricalPrice[] = [];
  let price = basePrice;

  // Add some realistic variance based on symbol
  const volatility = symbol.includes("SPY")
    ? 0.01
    : symbol.includes("QQQ")
    ? 0.015
    : 0.02;

  for (let i = 0; i < days; i++) {
    // Random walk with slight upward bias
    const change = (Math.random() - 0.48) * volatility * price;
    price = Math.max(price + change, basePrice * 0.85);

    const date = new Date();
    date.setDate(date.getDate() - (days - i));

    const open = price - Math.random() * (volatility * price);
    const close = price + Math.random() * (volatility * price);
    const high =
      Math.max(open, close) + Math.random() * (volatility * price * 0.5);
    const low =
      Math.min(open, close) - Math.random() * (volatility * price * 0.5);

    data.push({
      date: date.toLocaleDateString("id-ID", {
        month: "short",
        day: "numeric",
      }),
      open: Math.round(open * 100) / 100,
      high: Math.round(high * 100) / 100,
      low: Math.round(low * 100) / 100,
      close: Math.round(close * 100) / 100,
      volume: Math.floor(Math.random() * 1000000000),
    });

    price = close;
  }

  return data;
}
