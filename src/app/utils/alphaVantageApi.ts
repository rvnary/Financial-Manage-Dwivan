// Alpha Vantage API utility for fetching financial data
// Free tier: 5 requests per minute, 500 per day

const API_KEY = import.meta.env.VITE_ALPHA_VANTAGE_API_KEY || "";
const BASE_URL = "https://www.alphavantage.co/query";

// Rate limiting: 5 calls per minute = 1 call every 12 seconds
const RATE_LIMIT_MS = 12000;
let lastCallTime = 0;

async function waitForRateLimit(): Promise<void> {
  const now = Date.now();
  const timeSinceLastCall = now - lastCallTime;
  if (timeSinceLastCall < RATE_LIMIT_MS) {
    const waitTime = RATE_LIMIT_MS - timeSinceLastCall;
    console.log(`Rate limiting: waiting ${waitTime}ms before next API call`);
    await new Promise((resolve) => setTimeout(resolve, waitTime));
  }
  lastCallTime = Date.now();
}

export interface AlphaVantagePrice {
  date: string;
  open: number;
  high: number;
  low: number;
  close: number;
  volume: number;
}

/**
 * Fetch historical daily prices from Alpha Vantage API
 * Returns last 30 days of data
 */
export async function fetchAlphaVantageData(
  symbol: string
): Promise<AlphaVantagePrice[]> {
  try {
    if (!API_KEY) {
      throw new Error(
        "Alpha Vantage API key not configured. Set VITE_ALPHA_VANTAGE_API_KEY in .env file"
      );
    }

    // Apply rate limiting
    await waitForRateLimit();

    const url = `${BASE_URL}?function=TIME_SERIES_DAILY&symbol=${symbol}&outputsize=compact&apikey=${API_KEY}`;

    console.log(`Fetching Alpha Vantage data for ${symbol}...`);
    const response = await fetch(url);

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();

    console.log(`API Response for ${symbol}:`, {
      hasError: !!data["Error Message"],
      hasNote: !!data.Note,
      hasTimeSeries: !!data["Time Series (Daily)"],
      keys: Object.keys(data).slice(0, 5),
    });

    // Check for API errors
    if (data["Error Message"]) {
      throw new Error(`Alpha Vantage Error: ${data["Error Message"]}`);
    }

    if (data.Note) {
      throw new Error(
        `API Rate Limit: ${data.Note} - Please wait a minute before retrying`
      );
    }

    if (!data["Time Series (Daily)"]) {
      console.error(
        `No time series data found. Response keys:`,
        Object.keys(data)
      );
      throw new Error(
        `No data found for symbol ${symbol}. This could be: (1) Invalid symbol - check Alpha Vantage documentation for format (e.g., MSFT for US, TSCO.LON for London), (2) Rate limit reached - wait 1 minute and retry, or (3) API key invalid`
      );
    }

    // Get time series data
    const timeSeries = data["Time Series (Daily)"];
    const dates = Object.keys(timeSeries).sort().reverse(); // Most recent first

    if (dates.length === 0) {
      throw new Error(`No historical data available for symbol ${symbol}`);
    }

    // Get last 30 days
    const last30Days = dates.slice(0, 30).reverse(); // Reverse to get oldest first

    const prices: AlphaVantagePrice[] = last30Days.map((date) => {
      const dayData = timeSeries[date];
      return {
        date: new Date(date).toLocaleDateString("id-ID", {
          month: "short",
          day: "numeric",
        }),
        open: Math.round(parseFloat(dayData["1. open"]) * 100) / 100,
        high: Math.round(parseFloat(dayData["2. high"]) * 100) / 100,
        low: Math.round(parseFloat(dayData["3. low"]) * 100) / 100,
        close: Math.round(parseFloat(dayData["4. close"]) * 100) / 100,
        volume: parseInt(dayData["5. volume"]),
      };
    });

    console.log(
      `Successfully fetched ${prices.length} days of data for ${symbol}`
    );
    return prices;
  } catch (error) {
    const errorMsg = error instanceof Error ? error.message : String(error);
    console.error(`Error fetching Alpha Vantage data for ${symbol}:`, errorMsg);
    throw error;
  }
}

/**
 * Validate API key is set
 */
export function isAlphaVantageConfigured(): boolean {
  return !!API_KEY;
}
