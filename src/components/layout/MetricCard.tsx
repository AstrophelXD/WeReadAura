import { Card } from "@/components/ui/Card";
import type { Metric } from "@/lib/types";

export function MetricCard({ metric }: { metric: Metric }) {
  const accent = metric.tone === "yellow";

  return (
    <Card className={`metric-card neo-white ${accent ? "metric-card-accent" : ""}`}>
      <p className="type-label">{metric.label}</p>
      <p className="type-metric mt-4">{metric.value}</p>
      <p className="type-caption-muted mt-2">{metric.hint}</p>
    </Card>
  );
}
