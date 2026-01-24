/// <reference types="vite/client" />
// Yahoo Finance API - FREE real-time stock data
// Uses Vite proxy in development to bypass CORS

export interface HistoricalPrice {
  date: string;
  open: number;
  high: number;
  low: number;
  close: number;
  volume: number;
}

/**
 * Yahoo Finance is always available - no API key needed
 */
export function isYahooFinanceConfigured(): boolean {
  return true;
}

/**
 * Fetch real-time historical data from Yahoo Finance
 * Uses Vite proxy to bypass CORS in development
 */
export async function fetchYahooFinanceData(
  symbol: string,
): Promise<HistoricalPrice[]> {
  // Use Vite proxy - requests to /api/yahoo are proxied to Yahoo Finance
  const url = `/api/yahoo/v8/finance/chart/${symbol}?interval=1d&range=1mo`;

  console.log(`Fetching real-time data for ${symbol} from Yahoo Finance...`);

  const response = await fetch(url);

  if (!response.ok) {
    throw new Error(
      `Yahoo Finance error: ${response.status} ${response.statusText}`,
    );
  }

  const data = await response.json();

  // Check for errors
  if (data.chart?.error) {
    throw new Error(data.chart.error.description || `Error fetching ${symbol}`);
  }

  const result = data.chart?.result?.[0];
  if (!result) {
    throw new Error(`No data found for ${symbol}`);
  }

  const timestamps = result.timestamp || [];
  const quotes = result.indicators?.quote?.[0] || {};

  if (timestamps.length === 0) {
    throw new Error(`No historical data for ${symbol}`);
  }

  // Transform to our format
  const prices: HistoricalPrice[] = [];
  for (let i = 0; i < timestamps.length; i++) {
    const close = quotes.close?.[i];
    if (close === null || close === undefined) continue;

    prices.push({
      date: new Date(timestamps[i] * 1000).toLocaleDateString("id-ID", {
        month: "short",
        day: "numeric",
      }),
      open: quotes.open?.[i] || close,
      high: quotes.high?.[i] || close,
      low: quotes.low?.[i] || close,
      close: close,
      volume: quotes.volume?.[i] || 0,
    });
  }

  console.log(
    `✅ Successfully fetched ${prices.length} days of REAL data for ${symbol}`,
  );
  return prices;
}

/**
 * Get current real-time price from Yahoo Finance
 */
export async function fetchYahooCurrentPrice(symbol: string): Promise<number> {
  const url = `/api/yahoo/v8/finance/chart/${symbol}?interval=1d&range=1d`;
  const response = await fetch(url);

  if (!response.ok) {
    throw new Error(`Yahoo Finance error: ${response.statusText}`);
  }

  const data = await response.json();
  const result = data.chart?.result?.[0];

  return result?.meta?.regularMarketPrice || 0;
}
