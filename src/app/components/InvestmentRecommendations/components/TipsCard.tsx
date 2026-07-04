import { Lightbulb } from "lucide-react";
import { INVESTMENT_TIPS } from "../helpers";

export function TipsCard() {
  return (
    <div
      className="motion-card rounded-lg p-4 border"
      style={{
        backgroundColor: "#70e00010",
        borderColor: "#70e00030",
      }}
    >
      <h4 className="mb-2 flex items-center gap-2 text-white font-medium">
        <Lightbulb className="h-4 w-4 text-green-300" />
        Tips Investasi
      </h4>
      <ul className="text-sm space-y-1 text-gray-300">
        {INVESTMENT_TIPS.map((tip) => (
          <li key={tip.label}>
            • <strong>{tip.label}:</strong> {tip.text}
          </li>
        ))}
        <li>
          • Setiap profil punya komposisi saham yang menyesuaikan tingkat
          risikonya.
        </li>
        <li>• Tinjau dan rebalance portofolio secara berkala.</li>
      </ul>
    </div>
  );
}
