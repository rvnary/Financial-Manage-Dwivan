/** Compute a 15%-padded Y-axis domain `[min, max]` for a chart series. */
export function calculateDynamicDomain(
  data: Array<Record<string, number | string>>,
  priceKey: string,
): [number, number] | ["dataMin", "dataMax"] {
  if (data.length === 0) return ["dataMin", "dataMax"];

  const prices = data.map((d) => Number(d[priceKey]));
  const min = Math.min(...prices);
  const max = Math.max(...prices);
  const range = max - min;

  // Gunakan 15% padding dari range untuk lebih stretch
  const padding = range * 0.15;

  return [
    Math.floor((min - padding) * 100) / 100,
    Math.ceil((max + padding) * 100) / 100,
  ];
}
