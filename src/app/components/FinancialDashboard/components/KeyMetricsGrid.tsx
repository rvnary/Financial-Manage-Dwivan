import { Card, CardContent } from "../../ui/card";
import {
  Wallet,
  CreditCard,
  PiggyBank,
  TrendingUp,
  type LucideIcon,
} from "lucide-react";
import type { MetricCard } from "../calculations";

const ICONS: Record<MetricCard["iconKey"], LucideIcon> = {
  Wallet,
  CreditCard,
  PiggyBank,
  TrendingUp,
};

interface KeyMetricsGridProps {
  metrics: MetricCard[];
}

export function KeyMetricsGrid({ metrics }: KeyMetricsGridProps) {
  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
      {metrics.map((metric, index) => {
        const Icon = ICONS[metric.iconKey];
        return (
          <Card
            key={index}
            className="motion-card bg-gray-800/90 border-gray-700"
          >
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div
                  className="motion-pulse-soft p-2 rounded-lg"
                  style={{ backgroundColor: `${metric.color}20` }}
                >
                  <Icon className="w-5 h-5" style={{ color: metric.color }} />
                </div>
                <div>
                  <p className="text-xs text-gray-400">{metric.label}</p>
                  <p className="text-sm font-semibold text-white">
                    {metric.value}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
}
