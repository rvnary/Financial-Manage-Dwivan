import type { VercelRequest, VercelResponse } from "@vercel/node";

export default async function handler(req: VercelRequest, res: VercelResponse) {
  // Handle CORS preflight
  if (req.method === "OPTIONS") {
    res.setHeader("Access-Control-Allow-Origin", "*");
    res.setHeader("Access-Control-Allow-Methods", "GET, OPTIONS");
    res.setHeader("Access-Control-Allow-Headers", "Content-Type");
    return res.status(200).end();
  }

  // Get the path after /api/yahoo/
  const { path, ...queryParams } = req.query;
  const pathString = Array.isArray(path) ? path.join("/") : path || "";

  // Build query string from remaining params
  const queryString = Object.entries(queryParams)
    .map(([key, value]) => `${key}=${encodeURIComponent(String(value))}`)
    .join("&");

  // Build Yahoo Finance URL with query params
  const yahooUrl = `https://query1.finance.yahoo.com/${pathString}${queryString ? `?${queryString}` : ""}`;

  console.log("Proxying to Yahoo Finance:", yahooUrl);

  try {
    const response = await fetch(yahooUrl, {
      headers: {
        "User-Agent":
          "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
        "Accept": "application/json",
      },
    });

    const data = await response.json();

    // Set CORS headers
    res.setHeader("Access-Control-Allow-Origin", "*");
    res.setHeader("Access-Control-Allow-Methods", "GET, OPTIONS");
    res.setHeader("Content-Type", "application/json");
    res.setHeader("Cache-Control", "s-maxage=60, stale-while-revalidate");

    res.status(response.status).json(data);
  } catch (error) {
    console.error("Yahoo Finance proxy error:", error);
    res.status(500).json({ error: "Failed to fetch from Yahoo Finance", details: String(error) });
  }
}
