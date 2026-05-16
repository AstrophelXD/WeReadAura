import { Card } from "@/components/ui/Card";
import type { Metric } from "@/lib/types";

export function MetricCard({ metric }: { metric: Metric }) {
  return (
    <Card className={`metric-card ${metric.tone ? `neo-${metric.tone}` : ""}`}>
      <p className="text-sm font-black uppercase tracking-[0.08em]">{metric.label}</p>
      <p className="mt-4 text-4xl font-black tracking-[-0.06em]">{metric.value}</p>
      <p className="mt-2 text-sm font-semibold">{metric.hint}</p>
    </Card>
  );
}
