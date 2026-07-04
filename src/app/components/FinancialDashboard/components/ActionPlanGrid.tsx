import { Card, CardContent, CardHeader, CardTitle } from "../../ui/card";
import { ListChecks } from "lucide-react";
import { priorityLabels } from "../calculations";
import type { ActionItem } from "../types";

interface ActionPlanGridProps {
  actionPlan: ActionItem[];
}

export function ActionPlanGrid({ actionPlan }: ActionPlanGridProps) {
  return (
    <Card className="motion-card bg-gray-800/90 border-gray-700">
      <CardHeader className="pb-2">
        <CardTitle className="text-white flex items-center gap-2 text-base">
          <ListChecks className="w-5 h-5" />
          Rencana Aksi Cerdas
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid gap-4 md:grid-cols-3">
          {actionPlan.map((item, index) => (
            <div
              key={item.title}
              className="motion-card relative overflow-hidden rounded-2xl border border-gray-700 bg-gray-900/70 p-4"
            >
              <div
                className="absolute inset-x-0 top-0 h-1"
                style={{ backgroundColor: item.color }}
              />
              <div className="mb-3 flex items-center justify-between gap-3">
                <span className="text-xs font-semibold text-green-400">
                  Langkah {index + 1}
                </span>
                <span
                  className="rounded-full px-2 py-1 text-xs font-semibold text-white"
                  style={{ backgroundColor: `${item.color}55` }}
                >
                  {priorityLabels[item.priority]}
                </span>
              </div>
              <h4 className="mb-2 text-base font-semibold text-white">
                {item.title}
              </h4>
              <p className="text-sm leading-relaxed text-gray-300">
                {item.description}
              </p>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
