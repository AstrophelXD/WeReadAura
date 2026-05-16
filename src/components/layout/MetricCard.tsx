import { Card } from "@/components/ui/Card";
import type { Metric } from "@/lib/types";

export function MetricCard({ metric }: { metric: Metric }) {
  const accent = metric.tone === "yellow";

  return (
    <Card className={`metric-card neo-white ${accent ? "metric-card-accent" : ""}`}>
      <p className="text-sm font-semibold uppercase tracking-[0.06em]">{metric.label}</p>
      <p className="mt-4 text-4xl font-bold tracking-[-0.04em]">{metric.value}</p>
      <p className="mt-2 text-sm font-medium text-[color-mix(in_srgb,var(--ink)_72%,transparent)]">
        {metric.hint}
      </p>
    </Card>
  );
}
