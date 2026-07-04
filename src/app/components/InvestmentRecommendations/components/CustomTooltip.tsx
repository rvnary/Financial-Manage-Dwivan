interface CustomTooltipProps {
  active?: boolean;
  payload?: Array<{
    name: string;
    value: number;
    payload: { percentage: number };
  }>;
}

/** Hoisted out of the parent render scope — was re-created every render. */
export function CustomTooltip({ active, payload }: CustomTooltipProps) {
  if (active && payload && payload.length) {
    return (
      <div className="bg-white p-3 rounded-lg shadow-lg border border-gray-200">
        <p className="font-medium">{payload[0].name}</p>
        <p className="text-sm text-gray-600">
          Rp {payload[0].value.toLocaleString("id-ID")} (
          {payload[0].payload.percentage}%)
        </p>
      </div>
    );
  }
  return null;
}
