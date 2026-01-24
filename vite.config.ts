import { defineConfig } from "vite";
import path from "path";
import tailwindcss from "@tailwindcss/vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [
    // The React and Tailwind plugins are both required for Make, even if
    // Tailwind is not being actively used – do not remove them
    react(),
    tailwindcss(),
  ],
  resolve: {
    alias: {
      // Alias @ to the src directory
      "@": path.resolve(__dirname, "./src"),
    },
  },
  server: {
    proxy: {
      // Proxy Yahoo Finance API to bypass CORS in development
      "/api/yahoo": {
        target: "https://query1.finance.yahoo.com",
        changeOrigin: true,
        rewrite: (path) => {
          // Parse query params from /api/yahoo?symbol=SPY&interval=1d&range=1mo
          const url = new URL(path, "http://localhost");
          const symbol = url.searchParams.get("symbol") || "";
          const interval = url.searchParams.get("interval") || "1d";
          const range = url.searchParams.get("range") || "1mo";
          return `/v8/finance/chart/${symbol}?interval=${interval}&range=${range}`;
        },
        headers: {
          "User-Agent": "Mozilla/5.0",
        },
      },
    },
  },
});
