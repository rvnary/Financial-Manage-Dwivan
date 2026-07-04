import { Card, CardContent, CardHeader, CardTitle } from "../../ui/card";
import { Lightbulb } from "lucide-react";
import { getInsightStyles } from "../calculations";
import type { InsightItem } from "../types";

interface InsightsGridProps {
  insights: InsightItem[];
}

export function InsightsGrid({ insights }: InsightsGridProps) {
  return (
    <Card className="motion-card overflow-hidden border-gray-700 bg-gradient-to-br from-gray-800/95 via-gray-800/90 to-gray-900">
      <CardHeader className="pb-2">
        <CardTitle className="text-white flex items-center gap-2 text-base">
          <Lightbulb className="w-5 h-5" style={{ color: "#70e000" }} />
          Insight Keuangan
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-3">
          {insights.map((insight) => (
            <div
              key={`${insight.title}-${insight.metric}`}
              className={`motion-card rounded-2xl border p-4 ${getInsightStyles(insight.tone)}`}
            >
              <div className="mb-3 flex items-start justify-between gap-3">
                <h4 className="text-sm font-semibold text-white">
                  {insight.title}
                </h4>
                <span className="rounded-full bg-black/20 px-2 py-1 text-xs font-semibold">
                  {insight.metric}
                </span>
              </div>
              <p className="text-sm leading-relaxed text-gray-200">
                {insight.description}
              </p>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
