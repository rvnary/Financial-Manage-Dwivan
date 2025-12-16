// Finnhub API utility for fetching financial data
// You need to set your Finnhub API key in environment variables: VITE_FINNHUB_API_KEY

const API_KEY = import.meta.env.VITE_FINNHUB_API_KEY || "demo";
const BASE_URL = "https://finnhub.io/api/v1";

export interface HistoricalPrice {
  date: string;
  open: number;
  high: number;
  low: number;
  close: number;
  volume: number;
}

export interface InvestmentData {
  symbol: string;
  name: string;
  currentPrice: number;
  currentDate: string;
  historicalData: HistoricalPrice[];
}

/**
 * Fetch historical daily prices for a symbol (last 30 days)
 * Using candle endpoint from Finnhub
 */
export async function fetchHistoricalPrices(
  symbol: string
): Promise<HistoricalPrice[]> {
  try {
    // Check if API key is configured
    if (!import.meta.env.VITE_FINNHUB_API_KEY) {
      console.error(
        "Finnhub API key not configured. Please set VITE_FINNHUB_API_KEY in .env file"
      );
      return [];
    }

    // Calculate date range (last 30 days)
    const endDate = new Date();
    const startDate = new Date(endDate);
    startDate.setDate(startDate.getDate() - 30);

    const startTimestamp = Math.floor(startDate.getTime() / 1000);
    const endTimestamp = Math.floor(endDate.getTime() / 1000);

    // Use candle endpoint for daily data
    const url = `${BASE_URL}/stock/candle?symbol=${symbol}&resolution=D&from=${startTimestamp}&to=${endTimestamp}&token=${API_KEY}`;

    console.log(`Fetching historical data for ${symbol} from Finnhub...`);
    const response = await fetch(url);

    if (!response.ok) {
      throw new Error(`Finnhub API error: ${response.statusText}`);
    }

    const data = await response.json();

    // Handle API errors
    if (data.s === "no_data") {
      console.warn(
        `No data available for symbol ${symbol}. Check symbol spelling.`
      );
      return [];
    }

    // Handle rate limit or error
    if (!data.c || data.c.length === 0) {
      console.warn(`No closing prices found for symbol ${symbol}`);
      return [];
    }

    // Transform Finnhub response to our format
    const prices: HistoricalPrice[] = data.t.map(
      (timestamp: number, index: number) => ({
        date: new Date(timestamp * 1000).toLocaleDateString("id-ID", {
          month: "short",
          day: "numeric",
        }),
        open: data.o[index] || data.c[index],
        high: data.h[index] || data.c[index],
        low: data.l[index] || data.c[index],
        close: data.c[index],
        volume: data.v[index] || 0,
      })
    );

    console.log(
      `Successfully fetched ${prices.length} days of data for ${symbol}`
    );
    return prices;
  } catch (error) {
    console.error(`Error fetching historical prices for ${symbol}:`, error);
    return [];
  }
}

/**
 * Get current stock quote
 */
export async function fetchCurrentPrice(symbol: string): Promise<number> {
  try {
    const url = `${BASE_URL}/quote?symbol=${symbol}&token=${API_KEY}`;
    const response = await fetch(url);

    if (!response.ok) {
      throw new Error(`Finnhub API error: ${response.statusText}`);
    }

    const data = await response.json();
    return data.c || 0; // Current price
  } catch (error) {
    console.error(`Error fetching current price for ${symbol}:`, error);
    return 0;
  }
}

/**
 * Get company profile information
 */
export async function fetchCompanyProfile(symbol: string): Promise<any> {
  try {
    const url = `${BASE_URL}/stock/profile2?symbol=${symbol}&token=${API_KEY}`;
    const response = await fetch(url);

    if (!response.ok) {
      throw new Error(`Finnhub API error: ${response.statusText}`);
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error(`Error fetching company profile for ${symbol}:`, error);
    return null;
  }
}

/**
 * Get analyst recommendations
 */
export async function fetchRecommendations(symbol: string): Promise<any> {
  try {
    const url = `${BASE_URL}/stock/recommendation?symbol=${symbol}&token=${API_KEY}`;
    const response = await fetch(url);

    if (!response.ok) {
      throw new Error(`Finnhub API error: ${response.statusText}`);
    }

    const data = await response.json();
    return data[0] || null;
  } catch (error) {
    console.error(`Error fetching recommendations for ${symbol}:`, error);
    return null;
  }
}
