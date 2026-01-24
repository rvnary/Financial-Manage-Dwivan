import type { VercelRequest, VercelResponse } from "@vercel/node";

export default async function handler(req: VercelRequest, res: VercelResponse) {
  // Get the path after /api/yahoo/
  const { path } = req.query;
  const pathString = Array.isArray(path) ? path.join("/") : path || "";

  // Build Yahoo Finance URL
  const yahooUrl = `https://query1.finance.yahoo.com/${pathString}`;

  try {
    const response = await fetch(yahooUrl, {
      headers: {
        "User-Agent":
          "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36",
      },
    });

    const data = await response.json();

    // Set CORS headers
    res.setHeader("Access-Control-Allow-Origin", "*");
    res.setHeader("Access-Control-Allow-Methods", "GET, OPTIONS");
    res.setHeader("Content-Type", "application/json");

    res.status(response.status).json(data);
  } catch (error) {
    console.error("Yahoo Finance proxy error:", error);
    res.status(500).json({ error: "Failed to fetch from Yahoo Finance" });
  }
}
