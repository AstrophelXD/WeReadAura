import { Card } from "@/components/ui/Card";
import type { StatsInsightMetric } from "@/lib/types";

export function StatsInsightMetrics({ metrics }: { metrics: StatsInsightMetric[] }) {
  if (metrics.length === 0) {
    return null;
  }

  return (
    <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
      {metrics.map((metric) => (
        <Card key={metric.label} className="neo-white">
          <p className="type-field-label">{metric.label}</p>
          <p className="type-metric-sm mt-2">{metric.value}</p>
          {metric.hint ? <p className="type-caption-muted mt-1">{metric.hint}</p> : null}
        </Card>
      ))}
    </div>
  );
}
